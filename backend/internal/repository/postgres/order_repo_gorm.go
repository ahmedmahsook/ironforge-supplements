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

//
// ======================
// CREATE
// ======================
//

func (r *orderRepository) Create(order *entities.Order) error {
	return r.DB.Create(order).Error
}

func (r *orderRepository) CreateWithTx(tx *gorm.DB, order *entities.Order) error {
	return tx.Create(order).Error
}

//
// ======================
// GET BY ID
// ======================
//

func (r *orderRepository) GetByID(id uint) (*entities.Order, error) {

	var order entities.Order

	err := r.DB.
		Preload("Items").
		Preload("User").
		Where("id = ?", id).
		First(&order).Error

	if err != nil {
		return nil, err
	}

	return &order, nil
}

//
// ======================
// GET BY PAYMENT ID
// ======================
//

func (r *orderRepository) GetByPaymentID(paymentID string) (*entities.Order, error) {

	var order entities.Order

	err := r.DB.
		Preload("Items").
		Preload("User").
		Where("payment_id = ?", paymentID).
		First(&order).Error

	if err != nil {
		return nil, err
	}

	return &order, nil
}

//
// ======================
// GET USER ORDERS
// ======================
//

func (r *orderRepository) GetByUserID(userID string) ([]entities.Order, error) {

	var orders []entities.Order

	err := r.DB.
		Preload("Items").
		Preload("User").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&orders).Error

	return orders, err
}

//
// ======================
// GET ALL ORDERS (ADMIN)
// ======================
//

func (r *orderRepository) GetAllOrders() ([]entities.Order, error) {

	var orders []entities.Order

	err := r.DB.
		Preload("Items").
		Preload("User").
		Order("created_at DESC").
		Find(&orders).Error

	return orders, err
}

//
// ======================
// GET FILTERED ORDERS (ADMIN)
// ======================
//

func (r *orderRepository) GetFilteredOrders(
	page int,
	limit int,
	status string,
	paymentStatus string,
	paymentMethod string,
) ([]entities.Order, int64, error) {

	var orders []entities.Order

	var total int64

	offset := (page - 1) * limit

	query := r.DB.Model(&entities.Order{}).
		Preload("Items").
		Preload("User")

	if status != "" {
		query = query.Where(
			"status = ?",
			status,
		)
	}

	if paymentStatus != "" {
		query = query.Where(
			"payment_status = ?",
			paymentStatus,
		)
	}

	if paymentMethod != "" {
		query = query.Where(
			"payment_method = ?",
			paymentMethod,
		)
	}

	// TOTAL COUNT

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// FETCH

	err := query.
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&orders).Error

	if err != nil {
		return nil, 0, err
	}

	return orders, total, nil
}
//
// ======================
// GET PENDING ORDER
// ======================
//

func (r *orderRepository) GetPendingByUser(userID string) (*entities.Order, error) {

	var order entities.Order

	err := r.DB.
		Preload("User").
		Where(
			"user_id = ? AND payment_status = ? AND (expires_at IS NULL OR expires_at > NOW())",
			userID,
			"pending",
		).
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

//
// ======================
// UPDATE (GENERAL)
// ======================
//

func (r *orderRepository) Update(order *entities.Order) error {

	return r.DB.
		Model(&entities.Order{}).
		Where("id = ?", order.ID).
		Updates(map[string]interface{}{
			"status":         order.Status,
			"payment_status": order.PaymentStatus,
		}).Error
}

//
// ======================
// UPDATE STATUS (ADMIN)
// ======================
//

func (r *orderRepository) UpdateStatus(orderID uint, status string) error {

	return r.DB.
		Model(&entities.Order{}).
		Where("id = ?", orderID).
		Update("status", status).Error
}

//
// ======================
// DASHBOARD
// ======================
//

// TOTAL ORDERS

func (r *orderRepository) CountOrders() (int64, error) {

	var count int64

	err := r.DB.
		Model(&entities.Order{}).
		Count(&count).Error

	return count, err
}

// TOTAL REVENUE

func (r *orderRepository) GetTotalRevenue() (int64, error) {

	var total int64

	err := r.DB.Model(&entities.Order{}).
	Where("payment_status = ?", "paid").
	Where("status != ?", "cancelled").
	Select("COALESCE(SUM(total_amount), 0)").
	Scan(&total).Error
	return total, err
}

// PENDING ORDERS

func (r *orderRepository) CountPendingOrders() (int64, error) {

	var count int64

	err := r.DB.
		Model(&entities.Order{}).
		Where("status = ?", "pending").
		Count(&count).Error

	return count, err
}

// RECENT ORDERS

func (r *orderRepository) GetRecentOrders(limit int) ([]entities.Order, error) {

	var orders []entities.Order

	err := r.DB.
		Preload("Items").
		Preload("User").
		Order("created_at DESC"). 
		Limit(limit).
		Find(&orders).Error

	return orders, err
}