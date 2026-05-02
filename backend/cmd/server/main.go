package main

import (
	"os"

	"gym-backend/internal/common/logger"
	"gym-backend/internal/middleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	logger.Init()

	if err := godotenv.Load(); err != nil {
		logger.Log.Warn("No .env file found")
	}

	authController,
		productController,
		cartController,
		wishlistController,
		orderController,
		userRepo,
		jwtManager := Setup()

	r := gin.New()

	r.Use(gin.Recovery())
	r.Use(middleware.ErrorHandler())

	RegisterRoutes(
		r,
		authController,
		productController,
		cartController,
		wishlistController,
		orderController,
		userRepo,
		jwtManager,
	)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	logger.Log.WithField("port", port).Info("server started")

	if err := r.Run(":" + port); err != nil {
		logger.Log.Fatal("Failed to start server:", err)
	}
}