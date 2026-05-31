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
	*handlers.AdminController,
	contracts.UserRepository,
	*jwt.JWTManager,
) {

	cfg := bootstrap.Init()

	// Cloudinary
	if cfg.Cloudinary.CloudURL == "" {
		log.Fatal("CLOUDINARY_URL not set")
	}

	if err := cloudinary.Init(cfg.Cloudinary.CloudURL); err != nil {
		log.Fatal("Cloudinary init failed:", err)
	}

	// Redis
	redisClient := redis.NewRedis(cfg.Redis)

	// JWT Durations
	accessTTL, err := time.ParseDuration(cfg.JWT.Expiry)
	if err != nil {
		log.Fatal("invalid JWT expiry")
	}

	refreshTTL, err := time.ParseDuration(cfg.JWT.RefreshExpiry)
	if err != nil {
		log.Fatal("invalid refresh expiry")
	}

	// JWT
	jwtManager := jwt.NewJWTManager(
		cfg.JWT.Secret,
		cfg.JWT.RefreshSecret,
		accessTTL,
		refreshTTL,
	)

	// Razorpay
	if cfg.Razorpay.KeyID == "" || cfg.Razorpay.KeySecret == "" {
		log.Fatal("Razorpay keys not set")
	}

	razorpayClient := razorpay.NewRazorpayClient(
		cfg.Razorpay.KeyID,
		cfg.Razorpay.KeySecret,
	)

	// Database
	db := database.DB

	// Repositories
	userRepo := postgres.NewUserRepository(db)
	productRepo := postgres.NewProductRepository(db)
	cartRepo := postgres.NewCartRepository(db)
	wishlistRepo := postgres.NewWishlistRepository(db)
	orderRepo := postgres.NewOrderRepository(db)

	// Services
	authService := services.NewAuthService(userRepo, redisClient, jwtManager)
	productService := services.NewProductService(productRepo)
	cartService := services.NewCartService(cartRepo, productRepo)
	wishlistService := services.NewWishlistService(wishlistRepo, productRepo)

	orderService := services.NewOrderService(
		orderRepo,
		cartRepo,
		db,
		razorpayClient,
	)

	adminService := services.NewAdminService(
		userRepo,
		productRepo,
		orderRepo,
	)

	// Controllers
	authController := handlers.NewAuthController(authService)
	productController := handlers.NewProductController(productService)
	cartController := handlers.NewCartController(cartService)

	wishlistController := handlers.NewWishlistController(
		wishlistService,
		cartService,
	)

	orderController := handlers.NewOrderController(orderService)
	adminController := handlers.NewAdminController(adminService)

	return authController,
		productController,
		cartController,
		wishlistController,
		orderController,
		adminController,
		userRepo,
		jwtManager
}

func RegisterRoutes(
	r *gin.Engine,
	authController *handlers.AuthController,
	productController *handlers.ProductController,
	cartController *handlers.CartController,
	wishlistController *handlers.WishlistController,
	orderController *handlers.OrderController,
	adminController *handlers.AdminController,
	userRepo contracts.UserRepository,
	jwtManager *jwt.JWTManager,
) {

	routes.RegisterAuthRoutes(r, authController, jwtManager, userRepo)

	routes.RegisterProductRoutes(
		r,
		productController,
		jwtManager,
		userRepo,
	)

	routes.RegisterCartRoutes(
		r,
		cartController,
		jwtManager,
		userRepo,
	)

	routes.RegisterWishlistRoutes(
		r,
		wishlistController,
		jwtManager,
		userRepo,
	)

	routes.RegisterOrderRoutes(
		r,
		orderController,
		jwtManager,
		userRepo,
	)

	routes.RegisterAdminRoutes(
		r,
		adminController,
		jwtManager,
		userRepo,
	)
}