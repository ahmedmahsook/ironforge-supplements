package jwt

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type JWTManager struct {
	AccessSecret  string
	RefreshSecret string
	AccessTTL     time.Duration
	RefreshTTL    time.Duration
}

//Constructor
func NewJWTManager(access, refresh string, accessTTL, refreshTTL time.Duration) *JWTManager {
	return &JWTManager{
		AccessSecret:  access,
		RefreshSecret: refresh,
		AccessTTL:     accessTTL,
		RefreshTTL:    refreshTTL,
	}
}
//  GENERATE ACCESS TOKEN
func (j *JWTManager) GenerateAccessToken(userID, role string) (string, error) {

	claims := jwt.MapClaims{
		"user_id": userID,
		"role":    role,
		"type":    "access", 
		"iat":     time.Now().Unix(),
		"exp":     time.Now().Add(j.AccessTTL).Unix(),
		"iss":     "gym-backend",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(j.AccessSecret))
}
//  GENERATE REFRESH TOKEN
func (j *JWTManager) GenerateRefreshToken(userID, role, sessionID string) (string, error) {

	claims := jwt.MapClaims{
		"user_id":    userID,
		"role":       role,
		"session_id": sessionID,
		"type":       "refresh", 
		"iat":        time.Now().Unix(),
		"exp":        time.Now().Add(j.RefreshTTL).Unix(),
		"iss":        "gym-backend",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(j.RefreshSecret))
}

//  VALIDATE ACCESS TOKEN
func (j *JWTManager) ValidateAccess(tokenStr string) (jwt.MapClaims, error) {

	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (any, error) {

		
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}

		return []byte(j.AccessSecret), nil
	})

	if err != nil || !token.Valid {
		return nil, errors.New("invalid access token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("invalid claims")
	}

	
	if claims["type"] != "access" {
		return nil, errors.New("invalid token type")
	}

	return claims, nil
}

//VALIDATE REFRESH TOKEN
func (j *JWTManager) ValidateRefresh(tokenStr string) (jwt.MapClaims, error) {

	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (any, error) {

		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}

		return []byte(j.RefreshSecret), nil
	})

	if err != nil || !token.Valid {
		return nil, errors.New("invalid refresh token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("invalid claims")
	}

	if claims["type"] != "refresh" {
		return nil, errors.New("invalid token type")
	}

	return claims, nil
}
