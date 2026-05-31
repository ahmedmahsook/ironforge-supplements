package routes

import (
	"gym-backend/internal/controllers/handlers"
	"gym-backend/internal/middleware"
	"gym-backend/internal/models/contracts"
	"gym-backend/pkg/jwt"

	"github.com/gin-gonic/gin"
)

func RegisterOrderRoutes(
	r *gin.Engine,
	orderController *handlers.OrderController,
	jwtManager *jwt.JWTManager,
	userRepo contracts.UserRepository,
) {

	auth := middleware.AuthMiddleware(jwtManager, userRepo)

	orders := r.Group("/orders")
	orders.Use(auth)
	{
		orders.POST("", orderController.CreateOrder)
		orders.GET("", orderController.GetUserOrders)
		orders.GET("/:id", orderController.GetOrderByID)
		orders.PATCH("/:id/cancel", orderController.CancelOrder)
	}

	payments := r.Group("/payments")
	payments.Use(auth)
	{
		payments.POST("/verify", orderController.VerifyPayment)
	}
}