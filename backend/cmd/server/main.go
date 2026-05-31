package main

import (
	"os"

	"gym-backend/internal/common/logger"
	"gym-backend/internal/middleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	// ======================
	// LOGGER INIT
	// ======================
	logger.Init()

	// ======================
	// LOAD ENV
	// ======================
	if err := godotenv.Load(); err != nil {
		logger.Log.Warn("No .env file found")
	}

	// ======================
	// DEPENDENCY SETUP
	// ======================
	authController,
		productController,
		cartController,
		wishlistController,
		orderController,
		adminController,
		userRepo,
		jwtManager := Setup()

	// ======================
	// GIN ROUTER
	// ======================
	r := gin.New()

	// ======================
	// MIDDLEWARES
	// ======================
	r.Use(gin.Recovery())

	r.Use(middleware.ErrorHandler())

	r.Use(middleware.CORSMiddleware())

	// ======================
	// REGISTER ROUTES
	// ======================
	RegisterRoutes(
		r,
		authController,
		productController,
		cartController,
		wishlistController,
		orderController,
		adminController,
		userRepo,
		jwtManager,
	)

	// ======================
	// PORT
	// ======================
	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	// ======================
	// START SERVER
	// ======================
	logger.Log.WithField("port", port).Info("server started")

	if err := r.Run(":" + port); err != nil {
		logger.Log.Fatal("Failed to start server:", err)
	}
}