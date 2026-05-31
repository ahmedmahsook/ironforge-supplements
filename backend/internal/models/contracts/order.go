package contracts

import (
	"gym-backend/internal/models/entities"
	"gorm.io/gorm"
)

type OrderRepository interface {

	// ======================
	// CREATE
	// ======================
	Create(order *entities.Order) error
	CreateWithTx(tx *gorm.DB, order *entities.Order) error

	// ======================
	// GET
	// ======================
	GetByID(id uint) (*entities.Order, error)
	GetByUserID(userID string) ([]entities.Order, error)
	GetByPaymentID(paymentID string) (*entities.Order, error)
	GetPendingByUser(userID string) (*entities.Order, error)

	// ======================
	// ADMIN GET
	// ======================
	GetAllOrders() ([]entities.Order, error)
	GetFilteredOrders(
	page int,
	limit int,
	status string,
	paymentStatus string,
	paymentMethod string,
) ([]entities.Order, int64, error)

	// ======================
	// UPDATE
	// ======================
	Update(order *entities.Order) error
	UpdateStatus(orderID uint, status string) error

	// ======================
	// DASHBOARD (ORDER ONLY)
	// ======================
	CountOrders() (int64, error)
	GetTotalRevenue() (int64, error)
	CountPendingOrders() (int64, error)
	GetRecentOrders(limit int) ([]entities.Order, error)
}