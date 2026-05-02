package services

import (
	"net/http"
	"time"

	"gym-backend/internal/common/apperror"
	"gym-backend/internal/models/contracts"
	"gym-backend/internal/models/dto"
	"gym-backend/internal/models/entities"

	"gym-backend/pkg/email"
	"gym-backend/pkg/hash"
	"gym-backend/pkg/jwt"
	"gym-backend/pkg/otp"
	"gym-backend/pkg/redis"
	"gym-backend/pkg/validator"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AuthService struct {
	Repo  contracts.UserRepository
	Redis *redis.Redis
	JWT   *jwt.JWTManager
}

func NewAuthService(
	repo contracts.UserRepository,
	redisClient *redis.Redis,
	jwtManager *jwt.JWTManager,
) *AuthService {
	return &AuthService{
		Repo:  repo,
		Redis: redisClient,
		JWT:   jwtManager,
	}
}


// SIGNUP
func (s *AuthService) Signup(req dto.SignupRequest) error {

	//  Validate password
	if err := validator.ValidatePassword(req.Password); err != nil {
		return apperror.New("INVALID_PASSWORD", err.Error(), http.StatusBadRequest)
	}

	//  Check existing user
	existingUser, err := s.Repo.FindByEmail(req.Email)
	if err == nil && existingUser != nil {
		return apperror.New("USER_EXISTS", "user already exists", http.StatusBadRequest)
	}

	if err != nil && err != gorm.ErrRecordNotFound {
		return apperror.New("DB_ERROR", "failed to check user", http.StatusInternalServerError)
	}

	// Hash password
	hashedPassword, err := hash.HashPassword(req.Password)
	if err != nil {
		return apperror.New("HASH_ERROR", "failed to hash password", http.StatusInternalServerError)
	}

	//  Create user
	user := entities.User{
		ID:         uuid.New(),
		Name:       req.Name,
		Email:      req.Email,
		Password:   hashedPassword,
		Role:       "user",
		IsVerified: false,
	}

	if err := s.Repo.Create(&user); err != nil {
		return apperror.New("DB_ERROR", "failed to create user", http.StatusInternalServerError)
	}

	return nil
}


// SEND OTP

func (s *AuthService) SendOTP(emailAddr string) error {

	otpValue := otp.GenerateOTP()

	hashedOTP, err := hash.HashPassword(otpValue)
	if err != nil {
		return apperror.New("HASH_ERROR", "failed to hash otp", http.StatusInternalServerError)
	}

	// 📧 Send email
	if err := email.SendOTP(emailAddr, otpValue); err != nil {
		return apperror.New("EMAIL_FAILED", "failed to send otp", http.StatusInternalServerError)
	}

	//  Store in Redis
	key := "otp:" + emailAddr
	err = s.Redis.Client.Set(redis.Ctx, key, hashedOTP, 5*time.Minute).Err()
	if err != nil {
		return apperror.New("REDIS_ERROR", "failed to store otp", http.StatusInternalServerError)
	}

	return nil
}


// VERIFY OTP

func (s *AuthService) VerifyOTP(emailAddr, inputOTP string) error {

	key := "otp:" + emailAddr

	storedOTP, err := s.Redis.Client.Get(redis.Ctx, key).Result()
	if err != nil {
		return apperror.New("OTP_EXPIRED", "otp expired or not found", http.StatusBadRequest)
	}

	if !hash.CheckPassword(inputOTP, storedOTP) {
		return apperror.New("INVALID_OTP", "invalid otp", http.StatusBadRequest)
	}

	user, err := s.Repo.FindByEmail(emailAddr)
	if err != nil {
		return apperror.New("USER_NOT_FOUND", "user not found", http.StatusNotFound)
	}

	user.IsVerified = true

	if err := s.Repo.Update(user); err != nil {
		return apperror.New("DB_ERROR", "failed to update user", http.StatusInternalServerError)
	}

	s.Redis.Client.Del(redis.Ctx, key)

	return nil
}


// LOGIN

func (s *AuthService) Login(emailAddr, passwordInput string) (string, string, error) {

	user, err := s.Repo.FindByEmail(emailAddr)
	if err != nil {
		return "", "", apperror.New("INVALID_CREDENTIALS", "invalid credentials", http.StatusUnauthorized)
	}

	if !hash.CheckPassword(passwordInput, user.Password) {
		return "", "", apperror.New("INVALID_CREDENTIALS", "invalid credentials", http.StatusUnauthorized)
	}

	if !user.IsVerified {
		return "", "", apperror.New("NOT_VERIFIED", "user not verified", http.StatusForbidden)
	}

	sessionID := uuid.New()

	accessToken, err := s.JWT.GenerateAccessToken(user.ID.String(), user.Role)
	if err != nil {
		return "", "", apperror.New("TOKEN_ERROR", "failed to generate access token", http.StatusInternalServerError)
	}

	refreshToken, err := s.JWT.GenerateRefreshToken(
		user.ID.String(),
		user.Role,
		sessionID.String(),
	)
	if err != nil {
		return "", "", apperror.New("TOKEN_ERROR", "failed to generate refresh token", http.StatusInternalServerError)
	}

	hashedToken := hash.HashToken(refreshToken)

	rt := &entities.RefreshToken{
		ID:        sessionID,
		UserID:    user.ID,
		Token:     hashedToken,
		ExpiresAt: time.Now().Add(s.JWT.RefreshTTL),
	}

	if err := s.Repo.CreateRefreshToken(rt); err != nil {
		return "", "", apperror.New("DB_ERROR", "failed to store refresh token", http.StatusInternalServerError)
	}

	return accessToken, refreshToken, nil
}


// REFRESH TOKEN


func (s *AuthService) Refresh(refreshToken string) (string, error) {

	//  validate token
	claims, err := s.JWT.ValidateRefresh(refreshToken)
	if err != nil {
		return "", apperror.New("INVALID_REFRESH", "invalid refresh token", 401)
	}

	// extract session_id (string)
	sessionIDStr, ok := claims["session_id"].(string)
	if !ok {
		return "", apperror.New("INVALID_SESSION", "invalid session id", 401)
	}

	// convert to UUID
	sessionUUID, err := uuid.Parse(sessionIDStr)
	if err != nil {
		return "", apperror.New("INVALID_SESSION", "invalid session id", 401)
	}

	// get user_id
	userID, ok := claims["user_id"].(string)
	if !ok {
		return "", apperror.New("INVALID_USER", "invalid user id", 401)
	}

	role, _ := claims["role"].(string)

	// DB lookup
	stored, err := s.Repo.FindRefreshTokenByID(sessionUUID)
	if err != nil {
		return "", apperror.New("SESSION_NOT_FOUND", "session not found", 401)
	}

	// expiry check
	if time.Now().After(stored.ExpiresAt) {
		return "", apperror.New("TOKEN_EXPIRED", "refresh token expired", 401)
	}

	// token match
	if hash.HashToken(refreshToken) != stored.Token {
		return "", apperror.New("INVALID_REFRESH", "invalid refresh token", 401)
	}

	// generate new access token
	return s.JWT.GenerateAccessToken(userID, role)
}


// LOGOUT

func (s *AuthService) Logout(refreshToken string) error {

	claims, err := s.JWT.ValidateRefresh(refreshToken)
	if err != nil {
		return apperror.New("INVALID_TOKEN", "invalid token", 401)
	}

	sessionIDStr, ok := claims["session_id"].(string)
	if !ok {
		return apperror.New("INVALID_SESSION", "invalid session id", 401)
	}

	sessionUUID, err := uuid.Parse(sessionIDStr)
	if err != nil {
		return apperror.New("INVALID_SESSION", "invalid session id", 401)
	}

	if err := s.Repo.DeleteRefreshToken(sessionUUID); err != nil {
		return apperror.New("DB_ERROR", "failed to logout", 500)
	}

	return nil
}