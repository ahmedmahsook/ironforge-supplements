package postgres

import (
	"errors"

	"gym-backend/internal/models/contracts"
	"gym-backend/internal/models/entities"

	"gorm.io/gorm"
)

type orderRepository struct {
	DB *gorm.DB
}

func NewOrderRepository(db *gorm.DB) contracts.OrderRepository {
	return &orderRepository{DB: db}
}


// CREATE

func (r *orderRepository) Create(order *entities.Order) error {
	return r.DB.Create(order).Error
}

func (r *orderRepository) CreateWithTx(tx *gorm.DB, order *entities.Order) error {
	return tx.Create(order).Error
}


// GET BY ID

func (r *orderRepository) GetByID(id uint) (*entities.Order, error) {
	var order entities.Order

	err := r.DB.
		Preload("Items").
		Where("id = ?", id).
		First(&order).Error

	if err != nil {
		return nil, err
	}

	return &order, nil
}


// GET BY PAYMENT ID
func (r *orderRepository) GetByPaymentID(paymentID string) (*entities.Order, error) {
	var order entities.Order

	err := r.DB.
		Preload("Items").
		Where("payment_id = ?", paymentID).
		First(&order).Error

	if err != nil {
		return nil, err
	}

	return &order, nil
}


// GET USER ORDERS

func (r *orderRepository) GetByUserID(userID string) ([]entities.Order, error) {
	var orders []entities.Order

	err := r.DB.
		Preload("Items").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&orders).Error

	return orders, err
}


// GET PENDING ORDER (retry)

func (r *orderRepository) GetPendingByUser(userID string) (*entities.Order, error) {
	var order entities.Order

	err := r.DB.
		Where("user_id = ? AND payment_status = ? AND (expires_at IS NULL OR expires_at > NOW())",
			userID, "pending").
		Order("created_at DESC").
		First(&order).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &order, nil
}


// UPDATE

func (r *orderRepository) Update(order *entities.Order) error {
	return r.DB.Model(&entities.Order{}).
		Where("id = ?", order.ID).
		Updates(map[string]interface{}{
			"status":         order.Status,
			"payment_status": order.PaymentStatus,
		}).Error
}