package entities

import "time"

// ======================
// ORDER
// ======================
type Order struct {
	ID uint `gorm:"primaryKey"`

	// Keep string to avoid breaking your project
	UserID string `gorm:"not null;index"`

	//  Pricing
	TotalAmount int    `gorm:"not null"`
	Status      string `gorm:"default:pending"` // pending, placed, shipped, delivered, cancelled

	//  Payment
	PaymentMethod string `gorm:"not null"`        // COD, Razorpay
	PaymentStatus string `gorm:"default:pending"` // pending, paid, failed
	PaymentID     string                          // razorpay_order_id

	ExpiresAt *time.Time


	// ADDRESS (FROM REQUEST)
	
	Name      string `gorm:"not null"`
	Phone     string `gorm:"not null"`
	HouseName string `gorm:"not null"`
	Street    string `gorm:"not null"`
	City      string `gorm:"not null"`
	State     string `gorm:"not null"`
	Pincode   string `gorm:"not null"`

	// ======================
	//  RELATIONS
	// ======================
	Items []OrderItem `gorm:"foreignKey:OrderID;constraint:OnDelete:CASCADE"`

	// ======================
	// TIMESTAMPS
	// ======================
	CreatedAt time.Time
	UpdatedAt time.Time
}

// ======================
// ORDER ITEM
// ======================
type OrderItem struct {
	ID uint `gorm:"primaryKey"`

	OrderID   uint `gorm:"not null;index"`
	ProductID uint `gorm:"not null;index"`

	//  Snapshot of product at time of order
	Name     string `gorm:"not null"`
	Price    int    `gorm:"not null"`
	Quantity int    `gorm:"not null"`
	Total    int    `gorm:"not null"`

	CreatedAt time.Time
}