package routes

import (
	"gym-backend/internal/controllers/handlers"
	"gym-backend/internal/middleware"
	"gym-backend/internal/models/contracts"
	"gym-backend/pkg/jwt"

	"github.com/gin-gonic/gin"
)

func RegisterCartRoutes(
	r *gin.Engine,
	cc *handlers.CartController,
	jwtManager *jwt.JWTManager,
	userRepo contracts.UserRepository, 
) {

	
	// PROTECTED ROUTES

	cart := r.Group("/api/cart")

	
	cart.Use(middleware.AuthMiddleware(jwtManager, userRepo))
	cart.Use(middleware.RequireRole("user", "admin"))

	{
		cart.POST("", cc.AddToCart)
		cart.GET("", cc.GetCart)
		cart.PUT("/:product_id", cc.UpdateItem)
		cart.DELETE("/:product_id", cc.RemoveItem)
		cart.DELETE("", cc.ClearCart)
	}
}