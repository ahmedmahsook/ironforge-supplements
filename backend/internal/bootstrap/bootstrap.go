package bootstrap

import (
	"gym-backend/internal/infrastructure/config"
	"gym-backend/internal/infrastructure/database"
	"gym-backend/internal/models/entities"
)

// 🔹 Load config + DB + migrate
func Init() *config.Config {

	cfg := config.Load()

	// connect DB using config
	database.ConnectDB(cfg.Database)

	// run migration
	err := database.DB.AutoMigrate(
		&entities.User{},
		&entities.RefreshToken{},
		&entities.Product{},
		&entities.Cart{},
		&entities.CartItem{},
		&entities.Wishlist{},
		&entities.WishlistItem{},
		&entities.Order{},
		&entities.OrderItem{},
	)

	if err != nil {
		panic("Migration failed")
	}

	return cfg
}