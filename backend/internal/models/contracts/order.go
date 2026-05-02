package contracts

import (
	"gym-backend/internal/models/entities"

	"gorm.io/gorm"
)

type OrderRepository interface {

	
	// CREATE
	Create(order *entities.Order) error
	CreateWithTx(tx *gorm.DB, order *entities.Order) error

	// GET
	GetByID(id uint) (*entities.Order, error)
	GetByUserID(userID string) ([]entities.Order, error)
	GetByPaymentID(paymentID string) (*entities.Order, error)

	GetPendingByUser(userID string) (*entities.Order, error)
	// UPDATE
	
	Update(order *entities.Order) error
}