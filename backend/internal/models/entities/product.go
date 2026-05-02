package entities

import "time"

type Product struct {
	ID          uint   `gorm:"primaryKey"`
	Name        string `gorm:"not null;index"`
	Price       int    `gorm:"not null;index"`
	Category    string `gorm:"not null;index"`
	Description string
	Image       string
	Stock       int 

	CreatedAt time.Time
	UpdatedAt time.Time
}