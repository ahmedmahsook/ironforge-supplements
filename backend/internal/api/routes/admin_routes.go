package routes

import (
	"gym-backend/internal/controllers/handlers"
	"gym-backend/internal/middleware"
	"gym-backend/internal/models/contracts"
	"gym-backend/pkg/jwt"

	"github.com/gin-gonic/gin"
)

func RegisterAdminRoutes(
	r *gin.Engine,
	adminController *handlers.AdminController,
	jwtManager *jwt.JWTManager,
	userRepo contracts.UserRepository,
) {

	auth := middleware.AuthMiddleware(jwtManager, userRepo)

	admin := r.Group("/admin")
	admin.Use(auth, middleware.RequireRole("admin"))

	{
		admin.GET("/dashboard", adminController.GetDashboard)
		admin.GET("/orders", adminController.GetAllOrders)
		admin.PATCH("/orders/:id/status", adminController.UpdateOrderStatus)
		admin.GET("/users", adminController.GetAllUsers)
        admin.PATCH("/users/:id/block", adminController.BlockUser)
        admin.PATCH("/users/:id/unblock", adminController.UnblockUser) 
	}
}