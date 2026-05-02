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


// CREATE ORDER

func (s *OrderService) CreateOrder(
	userID string,
	req dto.CreateOrderRequest,
) (*entities.Order, error) {

	//  Check existing pending order
	existing, err := s.orderRepo.GetPendingByUser(userID)
	if err != nil {
		return nil, err
	}

	if existing != nil {
		if existing.ExpiresAt != nil && time.Now().Before(*existing.ExpiresAt) {
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

	//  Expiry (20 mins)
	expiry := time.Now().Add(20 * time.Minute)

	// Create order (INCLUDING ADDRESS SNAPSHOT)
	order := &entities.Order{
		UserID:        userID,
		Status:        "pending",
		PaymentMethod: req.PaymentMethod,
		PaymentStatus: "pending",
		ExpiresAt:     &expiry,

		//  Address mapping (CRITICAL)
		Name:      req.Name,
		Phone:     req.Phone,
		HouseName: req.HouseName,
		Street:    req.Street,
		City:      req.City,
		State:     req.State,
		Pincode:   req.Pincode,
	}

	total := 0

	// Cart → OrderItems
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
		order.Items = append(order.Items, orderItem)
	}

	order.TotalAmount = total

	//  Razorpay (optional)
	if strings.ToLower(req.PaymentMethod) == "razorpay" {
		paymentOrder, err := s.razorpay.CreateOrder(order.TotalAmount)
		if err != nil {
			return nil, err
		}

		id, ok := paymentOrder["id"].(string)
		if !ok {
			return nil, errors.New("failed to parse razorpay order id")
		}

		order.PaymentID = id
	}

	// save order
	if err := s.orderRepo.Create(order); err != nil {
		return nil, err
	}

	return order, nil
}


// VERIFY PAYMENT

func (s *OrderService) VerifyPayment(
	userID string,
	razorpayOrderID string,
	razorpayPaymentID string,
	razorpaySignature string,
) error {

	
	/*
	err := s.razorpay.VerifySignature(
		razorpayOrderID,
		razorpayPaymentID,
		razorpaySignature,
	)
	if err != nil {
		return err
	}
	*/

	// 🔍 Get order
	order, err := s.orderRepo.GetByPaymentID(razorpayOrderID)
	if err != nil {
		return err
	}

	// Expiry check
	if order.ExpiresAt != nil && time.Now().After(*order.ExpiresAt) {
		return errors.New("order expired")
	}

	// Prevent duplicate
	if order.PaymentStatus == "paid" {
		return errors.New("payment already verified")
	}

	//  Transaction
	return s.db.Transaction(func(tx *gorm.DB) error {

		order.PaymentStatus = "paid"
		order.Status = "confirmed"

		if err := s.orderRepo.Update(order); err != nil {
			return err
		}

		//  Clear cart
		if err := s.cartRepo.ClearCartWithTx(tx, userID); err != nil {
			return err
		}

		return nil
	})
}

// ======================
// GET USER ORDERS
// ======================
func (s *OrderService) GetUserOrders(userID string) ([]entities.Order, error) {
	return s.orderRepo.GetByUserID(userID)
}

// ======================
// GET ORDER BY ID
// ======================
func (s *OrderService) GetOrderByID(id uint) (*entities.Order, error) {
	return s.orderRepo.GetByID(id)
}

func (s *OrderService) CancelOrder(userID string, orderID uint) error {

	order, err := s.orderRepo.GetByID(orderID)
	if err != nil {
		return err
	}

	// 🔐 Ownership check
	if order.UserID != userID {
		return errors.New("unauthorized")
	}

	// ❌ Already cancelled
	if order.Status == "cancelled" {
		return errors.New("order already cancelled")
	}

	// ❌ Block after shipped/delivered
	if order.Status == "shipped" || order.Status == "delivered" {
		return errors.New("cannot cancel after shipping")
	}

	// ✅ Allowed (pending / confirmed)
	order.Status = "cancelled"

	// (optional) if you want to reflect payment state for COD:
	// if order.PaymentMethod == "COD" {
	// 	order.PaymentStatus = "failed"
	// }

	return s.orderRepo.Update(order)
}