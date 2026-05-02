package entities

import "time"

type Wishlist struct {
	ID     uint   `gorm:"primaryKey"`
	UserID string `gorm:"uniqueIndex"`

	Items []WishlistItem `gorm:"foreignKey:WishlistID"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

type WishlistItem struct {
	ID         uint `gorm:"primaryKey"`
	WishlistID uint `gorm:"uniqueIndex:idx_wishlist_product"`
	ProductID  uint `gorm:"uniqueIndex:idx_wishlist_product"`

	Product Product `gorm:"foreignKey:ProductID"`

	CreatedAt time.Time
}