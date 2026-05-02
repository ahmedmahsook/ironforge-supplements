package routes

import (
	"gym-backend/internal/controllers/handlers"
	"gym-backend/internal/middleware"
	"gym-backend/internal/models/contracts"

	"github.com/gin-gonic/gin"
	"gym-backend/pkg/jwt"
)

func RegisterOrderRoutes(
	r *gin.Engine,
	orderController *handlers.OrderController,
	jwtManager *jwt.JWTManager,
	userRepo contracts.UserRepository,
) {

	auth := middleware.AuthMiddleware(jwtManager, userRepo)

	// =====================
	// ORDER ROUTES
	// =====================
	orderGroup := r.Group("/orders")
	orderGroup.Use(auth)
	{
		orderGroup.POST("", orderController.CreateOrder)
		orderGroup.GET("", orderController.GetUserOrders)
		orderGroup.GET("/:id", orderController.GetOrderByID)
	}

	// =====================
	// PAYMENT ROUTES
	// =====================
	paymentGroup := r.Group("/payments")
	paymentGroup.Use(auth)
	{
		paymentGroup.POST("/verify", orderController.VerifyPayment)
	}
}