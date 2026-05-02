package contracts

import (
	"gym-backend/internal/models/entities"

	"gorm.io/gorm"
)

type CartRepository interface {
	GetByUserID(userID string) (*entities.Cart, error)

	CreateCart(cart *entities.Cart) error

	GetItem(cartID uint, productID uint) (*entities.CartItem, error)
	AddItem(item *entities.CartItem) error
	UpdateItem(item *entities.CartItem) error
	DeleteItem(cartID uint, productID uint) error

	ClearCart(cartID uint) error
	ClearCartWithTx(tx *gorm.DB, userID string) error
}