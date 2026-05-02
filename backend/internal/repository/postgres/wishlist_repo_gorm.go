package postgres

import (
	"gym-backend/internal/models/contracts"
	"gym-backend/internal/models/entities"

	"gorm.io/gorm"
)

type wishlistRepository struct {
	DB *gorm.DB
}

func NewWishlistRepository(db *gorm.DB) contracts.WishlistRepository {
	return &wishlistRepository{DB: db}
}

func (r *wishlistRepository) GetByUser(userID string) (*entities.Wishlist, error) {
	var wishlist entities.Wishlist

	err := r.DB.
		Preload("Items").
		Preload("Items.Product").
		Where("user_id = ?", userID).
		First(&wishlist).Error

	if err != nil {
		return nil, err
	}

	return &wishlist, nil
}

func (r *wishlistRepository) Create(w *entities.Wishlist) error {
	return r.DB.Create(w).Error
}

func (r *wishlistRepository) GetItem(wishlistID uint, productID uint) (*entities.WishlistItem, error) {
	var item entities.WishlistItem

	err := r.DB.
		Where("wishlist_id = ? AND product_id = ?", wishlistID, productID).
		First(&item).Error

	if err != nil {
		return nil, err
	}

	return &item, nil
}

func (r *wishlistRepository) AddItem(item *entities.WishlistItem) error {
	return r.DB.Create(item).Error
}

func (r *wishlistRepository) DeleteItem(wishlistID uint, productID uint) error {
	return r.DB.
		Where("wishlist_id = ? AND product_id = ?", wishlistID, productID).
		Delete(&entities.WishlistItem{}).Error
}