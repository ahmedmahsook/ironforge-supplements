package routes

import (
	"gym-backend/internal/controllers/handlers"
	"gym-backend/internal/middleware"
	"gym-backend/internal/models/contracts" // 🔥 add
	"gym-backend/pkg/jwt"

	"github.com/gin-gonic/gin"
)

func RegisterProductRoutes(
	r *gin.Engine,
	pc *handlers.ProductController,
	jwtManager *jwt.JWTManager,
	userRepo contracts.UserRepository, 
) {

	
	// PUBLIC ROUTES

	public := r.Group("/products")
	{
		public.GET("", pc.GetProducts)
		public.GET("/:id", pc.GetProductByID)
	}

	
	// PROTECTED ROUTES 

	protected := r.Group("/products")


	protected.Use(middleware.AuthMiddleware(jwtManager, userRepo))


	// ADMIN ROUTES
	
	admin := protected.Group("")
	admin.Use(middleware.RequireRole("admin"))
	{
		admin.POST("", pc.CreateProduct)
		admin.POST("/bulk", pc.BulkCreate)
		admin.PUT("/:id", pc.UpdateProduct)
		admin.DELETE("/:id", pc.DeleteProduct)
	}
}