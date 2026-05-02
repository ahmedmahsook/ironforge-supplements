package main

import (
	"log"
	"time"

	"gym-backend/internal/api/routes"
	"gym-backend/internal/bootstrap"
	"gym-backend/internal/controllers/handlers"
	"gym-backend/internal/infrastructure/database"
	"gym-backend/internal/models/contracts"
	"gym-backend/internal/repository/postgres"
	"gym-backend/internal/services"
	"gym-backend/pkg/cloudinary"
	"gym-backend/pkg/jwt"
	"gym-backend/pkg/razorpay"
	"gym-backend/pkg/redis"

	"github.com/gin-gonic/gin"
)

func Setup() (
	*handlers.AuthController,
	*handlers.ProductController,
	*handlers.CartController,
	*handlers.WishlistController,
	*handlers.OrderController,
	contracts.UserRepository,
	*jwt.JWTManager,
) {


	// SINGLE SOURCE OF TRUTH
	cfg := bootstrap.Init() 


	// CLOUDINARY

	if cfg.Cloudinary.CloudURL == "" {
		log.Fatal("CLOUDINARY_URL not set")
	}

	if err := cloudinary.Init(cfg.Cloudinary.CloudURL); err != nil {
		log.Fatal("Cloudinary init failed:", err)
	}


	// REDIS

	redisClient := redis.NewRedis(cfg.Redis)


	// JWT

	jwtManager := jwt.NewJWTManager(
		cfg.JWT.Secret,
		cfg.JWT.RefreshSecret,
		time.Duration(cfg.JWT.AccessTTLMin)*time.Minute,
		time.Duration(cfg.JWT.RefreshTTLHr)*time.Hour,
	)


	// RAZORPAY

	if cfg.Razorpay.KeyID == "" || cfg.Razorpay.KeySecret == "" {
		log.Fatal("Razorpay keys not set")
	}

	razorpayClient := razorpay.NewRazorpayClient(
		cfg.Razorpay.KeyID,
		cfg.Razorpay.KeySecret,
	)


	// REPOSITORIES (use global DB)

	userRepo := postgres.NewUserRepository(database.DB)
	productRepo := postgres.NewProductRepository(database.DB)
	cartRepo := postgres.NewCartRepository(database.DB)
	wishlistRepo := postgres.NewWishlistRepository(database.DB)
	orderRepo := postgres.NewOrderRepository(database.DB)


	// SERVICES

	authService := services.NewAuthService(userRepo, redisClient, jwtManager)
	productService := services.NewProductService(productRepo)
	cartService := services.NewCartService(cartRepo, productRepo)                                                                                                                                                                                       
	wishlistService := services.NewWishlistService(wishlistRepo, productRepo)

	orderService := services.NewOrderService(
		orderRepo,
		cartRepo,
		database.DB,
		razorpayClient,
	)

	// CONTROLLERS
	
	authController := handlers.NewAuthController(authService)
	productController := handlers.NewProductController(productService)
	cartController := handlers.NewCartController(cartService)
	wishlistController := handlers.NewWishlistController(wishlistService, cartService)
	orderController := handlers.NewOrderController(orderService)

	return authController,
		productController,
		cartController,
		wishlistController,
		orderController,
		userRepo,
		jwtManager
}


// ROUTES REGISTRATION

func RegisterRoutes(
	r *gin.Engine,
	authController *handlers.AuthController,
	productController *handlers.ProductController,
	cartController *handlers.CartController,
	wishlistController *handlers.WishlistController,
	orderController *handlers.OrderController,
	userRepo contracts.UserRepository,
	jwtManager *jwt.JWTManager,
) {

	routes.RegisterAuthRoutes(r, authController, jwtManager, userRepo)
	routes.RegisterProductRoutes(r, productController, jwtManager, userRepo)
	routes.RegisterCartRoutes(r, cartController, jwtManager, userRepo)
	routes.RegisterWishlistRoutes(r, wishlistController, jwtManager, userRepo)
	routes.RegisterOrderRoutes(r, orderController, jwtManager, userRepo)
}