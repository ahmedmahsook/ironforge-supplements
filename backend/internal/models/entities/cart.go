package entities

import "time"

type Cart struct {
	ID     uint   `gorm:"primaryKey"`
	UserID string `gorm:"uniqueIndex"`

	Items []CartItem `gorm:"foreignKey:CartID"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

type CartItem struct {
	ID        uint `gorm:"primaryKey"`
	CartID    uint
	ProductID uint
	Quantity  int

	Product Product `gorm:"foreignKey:ProductID"`

	CreatedAt time.Time
	UpdatedAt time.Time
}