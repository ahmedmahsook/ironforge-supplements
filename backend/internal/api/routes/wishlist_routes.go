package routes

import (
	"gym-backend/internal/controllers/handlers"
	"gym-backend/internal/middleware"
	"gym-backend/internal/models/contracts" 
	"gym-backend/pkg/jwt"

	"github.com/gin-gonic/gin"
)

func RegisterWishlistRoutes(
	r *gin.Engine,
	wishlistController *handlers.WishlistController,
	jwtManager *jwt.JWTManager,
	userRepo contracts.UserRepository, 
) {

	
	w := r.Group("/api/wishlist")


	w.Use(middleware.AuthMiddleware(jwtManager, userRepo))

	{
		// Add to wishlist
		w.POST("", wishlistController.Add)

		// Get wishlist
		w.GET("", wishlistController.Get)

		// Remove item
		w.DELETE("/:product_id", wishlistController.Remove)

		//  Move item from wishlist → cart
		w.POST("/move-to-cart/:product_id", wishlistController.MoveToCart)
	}
}