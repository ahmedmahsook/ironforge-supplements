package services

import (
	"errors"
	"strings"
	"time"

	"gym-backend/internal/models/contracts"
	"gym-backend/internal/models/dto"
	"gym-backend/internal/models/entities"
	"gym-backend/pkg/razorpay"

	"gorm.io/gorm"
)

type OrderService struct {
	orderRepo contracts.OrderRepository
	cartRepo  contracts.CartRepository
	db        *gorm.DB
	razorpay  *razorpay.RazorpayClient
}

func NewOrderService(
	orderRepo contracts.OrderRepository,
	cartRepo contracts.CartRepository,
	db *gorm.DB,
	rzp *razorpay.RazorpayClient,
) *OrderService {

	return &OrderService{
		orderRepo: orderRepo,
		cartRepo:  cartRepo,
		db:        db,
		razorpay:  rzp,
	}
}

//
// ======================
// CREATE ORDER
// ======================
//

func (s *OrderService) CreateOrder(
	userID string,
	req dto.CreateOrderRequest,
) (*entities.Order, error) {

	// Existing pending order

	existing, err := s.orderRepo.GetPendingByUser(userID)

	if err != nil {
		return nil, err
	}

	// Reuse ONLY COD pending orders

	if existing != nil {

	// Reuse ONLY COD pending orders

	if strings.ToLower(req.PaymentMethod) == "cod" &&
		strings.ToLower(existing.PaymentMethod) == "cod" &&
		existing.ExpiresAt != nil &&
		time.Now().Before(*existing.ExpiresAt) {

		return existing, nil
	}
}

	// Get cart

	cart, err := s.cartRepo.GetByUserID(userID)

	if err != nil {
		return nil, err
	}

	if cart == nil || len(cart.Items) == 0 {
		return nil, errors.New("cart is empty")
	}

	// Order expiry

	expiry := time.Now().Add(20 * time.Minute)

	order := &entities.Order{
		UserID:        userID,
		Status:        "pending",
		PaymentMethod: req.PaymentMethod,
		PaymentStatus: "pending",
		ExpiresAt:     &expiry,

		// Address snapshot

		Name:      req.Name,
		Phone:     req.Phone,
		HouseName: req.HouseName,
		Street:    req.Street,
		City:      req.City,
		State:     req.State,
		Pincode:   req.Pincode,
	}

	total := 0

	// Cart -> OrderItems

	for _, item := range cart.Items {

		price := item.Product.Price

		qty := item.Quantity

		orderItem := entities.OrderItem{
			ProductID: item.ProductID,
			Name:      item.Product.Name,
			Price:     price,
			Quantity:  qty,
			Total:     price * qty,
		}

		total += orderItem.Total

		order.Items = append(
			order.Items,
			orderItem,
		)
	}

	order.TotalAmount = total

	// Razorpay order creation

	if strings.ToLower(req.PaymentMethod) == "razorpay" {

		paymentOrder, err := s.razorpay.CreateOrder(
			order.TotalAmount,
		)

		if err != nil {
			return nil, err
		}

		id, ok := paymentOrder["id"].(string)

		if !ok {
			return nil, errors.New(
				"failed to parse razorpay order id",
			)
		}

		order.PaymentID = id
	}

	// Save order

	if err := s.orderRepo.Create(order); err != nil {
		return nil, err
	}

	return order, nil
}

//
// ======================
// VERIFY PAYMENT
// ======================
//

func (s *OrderService) VerifyPayment(
	userID string,
	razorpayOrderID string,
	razorpayPaymentID string,
	razorpaySignature string,
) error {

	order, err := s.orderRepo.GetByPaymentID(
		razorpayOrderID,
	)
	if err != nil {
		return err
	}

	if order == nil {
		return errors.New("order not found")
	}

	// Expiry check
	if order.ExpiresAt != nil &&
		time.Now().After(*order.ExpiresAt) {

		return errors.New("order expired")
	}

	// Prevent duplicate verification
	if order.PaymentStatus == "paid" {
		return errors.New(
			"payment already verified",
		)
	}

	// Verify Razorpay signature
	if err := s.razorpay.VerifySignature(
		razorpayOrderID,
		razorpayPaymentID,
		razorpaySignature,
	); err != nil {
		return err
	}

	// Transaction
	return s.db.Transaction(
		func(tx *gorm.DB) error {

			err := tx.Model(&entities.Order{}).
				Where("id = ?", order.ID).
				Updates(map[string]interface{}{
					"status":         "confirmed",
					"payment_status": "paid",
				}).Error

			if err != nil {
				return err
			}

			// Clear cart
			if err := s.cartRepo.ClearCartWithTx(
				tx,
				userID,
			); err != nil {
				return err
			}

			return nil
		},
	)
}

//
// ======================
// CANCEL ORDER
// ======================
//

func (s *OrderService) CancelOrder(
	userID string,
	orderID uint,
) error {

	order, err := s.orderRepo.GetByID(orderID)
	if err != nil {
		return err
	}

	if order == nil {
		return errors.New("order not found")
	}

	if order.UserID != userID {
		return errors.New("unauthorized")
	}

	if order.Status == "cancelled" {
		return errors.New(
			"order already cancelled",
		)
	}

	if order.Status == "shipped" ||
		order.Status == "delivered" {

		return errors.New(
			"cannot cancel after shipping",
		)
	}

	order.Status = "cancelled"

	return s.orderRepo.Update(order)
}

//
// ======================
// USER ORDERS
// ======================
//

func (s *OrderService) GetUserOrders(
	userID string,
) ([]entities.Order, error) {

	return s.orderRepo.GetByUserID(userID)
}

func (s *OrderService) GetOrderByID(
	id uint,
) (*entities.Order, error) {

	return s.orderRepo.GetByID(id)
}