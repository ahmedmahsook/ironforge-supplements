package entities

import "time"

// ======================
// ORDER
// ======================

type Order struct {
	ID uint `gorm:"primaryKey" json:"id"`

	UserID string `gorm:"not null;index" json:"userId"`

	User User `gorm:"foreignKey:UserID;references:ID" json:"user"`

	// PRICING

	TotalAmount int `gorm:"not null" json:"totalAmount"`

	Status string `gorm:"default:pending" json:"status"`

	// PAYMENT

	PaymentMethod string `gorm:"not null" json:"paymentMethod"`

	PaymentStatus string `gorm:"default:pending" json:"paymentStatus"`

	PaymentID string `json:"paymentId"`

	ExpiresAt *time.Time `json:"expiresAt"`

	// ADDRESS

	Name string `gorm:"not null" json:"name"`

	Phone string `gorm:"not null" json:"phone"`

	HouseName string `gorm:"not null" json:"houseName"`

	Street string `gorm:"not null" json:"street"`

	City string `gorm:"not null" json:"city"`

	State string `gorm:"not null" json:"state"`

	Pincode string `gorm:"not null" json:"pincode"`

	// RELATIONS

	Items []OrderItem `gorm:"foreignKey:OrderID;constraint:OnDelete:CASCADE" json:"items"`

	// TIMESTAMPS

	CreatedAt time.Time `json:"createdAt"`

	UpdatedAt time.Time `json:"updatedAt"`
}

// ======================
// ORDER ITEM
// ======================

type OrderItem struct {
	ID uint `gorm:"primaryKey" json:"id"`

	OrderID uint `gorm:"not null;index" json:"orderId"`

	ProductID uint `gorm:"not null;index" json:"productId"`

	// SNAPSHOT

	Name string `gorm:"not null" json:"name"`

	Price int `gorm:"not null" json:"price"`

	Quantity int `gorm:"not null" json:"quantity"`

	Total int `gorm:"not null" json:"total"`

	CreatedAt time.Time `json:"createdAt"`
}