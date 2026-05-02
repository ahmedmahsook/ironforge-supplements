package contracts

import "gym-backend/internal/models/entities"

type WishlistRepository interface {
	GetByUser(userID string) (*entities.Wishlist, error)
	Create(wishlist *entities.Wishlist) error

	GetItem(wishlistID uint, productID uint) (*entities.WishlistItem, error)
	AddItem(item *entities.WishlistItem) error
	DeleteItem(wishlistID uint, productID uint) error
}