package handlers

import (
	"net/http"

	"gym-backend/internal/models/dto"
	"gym-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type AuthController struct {
	service *services.AuthService
}

func NewAuthController(
	service *services.AuthService,
) *AuthController {

	return &AuthController{
		service: service,
	}
}

// =====================
// SIGNUP
// =====================

func (ac *AuthController) Signup(
	c *gin.Context,
) {

	var req dto.SignupRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(err)
		return
	}

	if err := ac.service.Signup(req); err != nil {
		c.Error(err)
		return
	}

	if err := ac.service.SendOTP(
		req.Email,
	); err != nil {

		c.Error(err)
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "user created, OTP sent",
	})
}

// =====================
// SEND OTP
// =====================

func (ac *AuthController) SendOTP(
	c *gin.Context,
) {

	var req dto.SendOTPRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(err)
		return
	}

	if err := ac.service.SendOTP(
		req.Email,
	); err != nil {

		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "OTP sent successfully",
	})
}

// =====================
// VERIFY OTP
// =====================

func (ac *AuthController) VerifyOTP(
	c *gin.Context,
) {

	var req dto.VerifyOTPRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(err)
		return
	}

	if err := ac.service.VerifyOTP(
		req.Email,
		req.OTP,
	); err != nil {

		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "OTP verified successfully",
	})
}

// =====================
// LOGIN
// =====================

func (ac *AuthController) Login(
	c *gin.Context,
) {

	var req dto.LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(err)
		return
	}

	accessToken,
		refreshToken,
		err := ac.service.Login(
		req.Email,
		req.Password,
	)

	if err != nil {
		c.Error(err)
		return
	}

	user, err :=
		ac.service.Repo.FindByEmail(
			req.Email,
		)

	if err != nil {
		c.Error(err)
		return
	}

	// =====================
	// SET REFRESH TOKEN COOKIE
	// =====================

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Path:     "/",
		MaxAge:   7 * 24 * 60 * 60,
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	})

	// =====================
	// RESPONSE
	// =====================

	c.JSON(http.StatusOK, gin.H{
		"access_token": accessToken,
		"user": gin.H{
			"id":          user.ID,
			"name":        user.Name,
			"email":       user.Email,
			"role":        user.Role,
			"is_verified": user.IsVerified,
		},
	})
}

// =====================
// REFRESH TOKEN
// =====================

func (ac *AuthController) Refresh(
	c *gin.Context,
) {

	refreshToken, err := c.Cookie(
		"refresh_token",
	)

	if err != nil {

		c.JSON(
			http.StatusUnauthorized,
			gin.H{
				"error": "refresh token missing",
			},
		)

		return
	}

	accessToken, err :=
		ac.service.Refresh(
			refreshToken,
		)

	if err != nil {

		c.JSON(
			http.StatusUnauthorized,
			gin.H{
				"error": "invalid refresh token",
			},
		)

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token": accessToken,
	})
}

// =====================
// LOGOUT
// =====================

func (ac *AuthController) Logout(
	c *gin.Context,
) {

	refreshToken, err := c.Cookie(
		"refresh_token",
	)

	if err == nil {

		_ = ac.service.Logout(
			refreshToken,
		)
	}

	// =====================
	// CLEAR COOKIE
	// =====================

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	})

	c.JSON(http.StatusOK, gin.H{
		"message": "logged out successfully",
	})
}