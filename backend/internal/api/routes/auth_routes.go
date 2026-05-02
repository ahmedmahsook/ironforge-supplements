package routes

import (
	"net/http"

	"gym-backend/internal/controllers/handlers"
	"gym-backend/internal/middleware"
	"gym-backend/internal/models/contracts"
	"gym-backend/pkg/jwt"

	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(
	r *gin.Engine,
	authController *handlers.AuthController,
	jwtManager *jwt.JWTManager,
	userRepo contracts.UserRepository, 
) {


	// PUBLIC ROUTES
	
	auth := r.Group("/auth")
	{
		auth.POST("/signup", authController.Signup)
		auth.POST("/send-otp", authController.SendOTP)
		auth.POST("/verify-otp", authController.VerifyOTP)
		auth.POST("/login", authController.Login)
		auth.POST("/refresh", authController.Refresh)
	}

	
	// PROTECTED BASE

	protected := r.Group("/api")

	
	protected.Use(middleware.AuthMiddleware(jwtManager, userRepo))


	// USER ROUTES

	user := protected.Group("/user")
	user.Use(middleware.RequireRole("user", "admin"))
	{
		user.GET("/profile", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "User profile access",
			})
		})
	}

	
	// ADMIN ROUTES
	
	admin := protected.Group("/admin")
	admin.Use(middleware.RequireRole("admin"))
	{
		admin.GET("/dashboard", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "Welcome Admin",
			})
		})
	}

	
	// PROTECTED ACTIONS

	protected.POST("/logout", authController.Logout)
}