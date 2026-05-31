package dto

import (
	"time"

	"gym-backend/internal/models/entities"
)

// ======================
// REQUEST DTO
// ======================

type CreateOrderRequest struct {

	PaymentMethod string `json:"payment_method" binding:"required,oneof=cod razorpay"`

	Name string `json:"name" binding:"required,min=3,max=50"`

	Phone string `json:"phone" binding:"required,len=10,numeric"`

	HouseName string `json:"house_name" binding:"required,min=3,max=100"`

	Street string `json:"street" binding:"required,min=3,max=100"`

	City string `json:"city" binding:"required,min=2,max=50"`

	State string `json:"state" binding:"required,min=2,max=50"`

	Pincode string `json:"pincode" binding:"required,len=6,numeric"`
}
// ======================
// RESPONSE DTOS
// ======================

type OrderItemResponse struct {
	ProductID uint   `json:"product_id"`
	Name      string `json:"name"`
	Price     int    `json:"price"`
	Quantity  int    `json:"quantity"`
	Total     int    `json:"total"`
}

type OrderResponse struct {
	ID            uint                `json:"id"`

	TotalAmount   int                 `json:"total_amount"`

	Status        string              `json:"status"`

	PaymentMethod string              `json:"payment_method"`

	PaymentStatus string              `json:"payment_status"`

	PaymentID     string              `json:"payment_id"`

	CreatedAt     string              `json:"createdAt"`

	UserName      string              `json:"user_name"`

	UserEmail     string              `json:"user_email"`

	Name          string              `json:"name"`

	Phone         string              `json:"phone"`

	HouseName     string              `json:"house_name"`

	Street        string              `json:"street"`

	City          string              `json:"city"`

	State         string              `json:"state"`

	Pincode       string              `json:"pincode"`

	Items         []OrderItemResponse `json:"items"`
}

// ======================
// MAPPERS
// ======================

func ToOrderItemResponse(
	item entities.OrderItem,
) OrderItemResponse {

	return OrderItemResponse{

		ProductID: item.ProductID,

		Name: item.Name,

		Price: item.Price,

		Quantity: item.Quantity,

		Total: item.Total,
	}
}

func ToOrderResponse(
	order entities.Order,
) OrderResponse {

	items := make(
		[]OrderItemResponse,
		0,
		len(order.Items),
	)

	for _, item := range order.Items {

		items = append(
			items,
			ToOrderItemResponse(item),
		)
	}

	return OrderResponse{

		ID: order.ID,

		TotalAmount: order.TotalAmount,

		Status: order.Status,

		PaymentMethod: order.PaymentMethod,

		PaymentStatus: order.PaymentStatus,

		PaymentID: order.PaymentID,

		CreatedAt: order.CreatedAt.Format(
			time.RFC3339,
		),

		UserName: order.User.Name,

		UserEmail: order.User.Email,

		Name: order.Name,

		Phone: order.Phone,

		HouseName: order.HouseName,

		Street: order.Street,

		City: order.City,

		State: order.State,

		Pincode: order.Pincode,

		Items: items,
	}
}

func ToOrderList(
	orders []entities.Order,
) []OrderResponse {

	res := make(
		[]OrderResponse,
		0,
		len(orders),
	)

	for _, order := range orders {

		res = append(
			res,
			ToOrderResponse(order),
		)
	}

	return res
}