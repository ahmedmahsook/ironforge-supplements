package dto

import "gym-backend/internal/models/entities"

// ======================
// REQUEST DTO
// ======================
type CreateOrderRequest struct {
	PaymentMethod string `json:"payment_method" binding:"required"`

	Name      string `json:"name" binding:"required"`
	Phone     string `json:"phone" binding:"required"`
	HouseName string `json:"house_name" binding:"required"`
	Street    string `json:"street" binding:"required"`
	City      string `json:"city" binding:"required"`
	State     string `json:"state" binding:"required"`
	Pincode   string `json:"pincode" binding:"required"`
}

// ======================
// RESPONSE DTOs
// ======================
type OrderItemResponse struct {
	ProductID uint   `json:"product_id"`
	Name      string `json:"name"`
	Price     int    `json:"price"`
	Quantity  int    `json:"quantity"`
	Total     int    `json:"total"`
}

type OrderResponse struct {
	ID            uint   `json:"id"`
	TotalAmount   int    `json:"total_amount"`
	Status        string `json:"status"`
	PaymentMethod string `json:"payment_method"`
	PaymentStatus string `json:"payment_status"`
	PaymentID     string `json:"payment_id"`

	//  Address (snapshot)
	Name      string `json:"name"`
	Phone     string `json:"phone"`
	HouseName string `json:"house_name"`
	Street    string `json:"street"`
	City      string `json:"city"`
	State     string `json:"state"`
	Pincode   string `json:"pincode"`

	Items []OrderItemResponse `json:"items"`
}

// ======================
// MAPPER FUNCTIONS
// ======================

// Convert OrderItem → Response
func ToOrderItemResponse(item entities.OrderItem) OrderItemResponse {
	return OrderItemResponse{
		ProductID: item.ProductID,
		Name:      item.Name,
		Price:     item.Price,
		Quantity:  item.Quantity,
		Total:     item.Total,
	}
}

// Convert Order → Response
func ToOrderResponse(order entities.Order) OrderResponse {

	items := make([]OrderItemResponse, 0, len(order.Items))

	for _, item := range order.Items {
		items = append(items, ToOrderItemResponse(item))
	}

	return OrderResponse{
		ID:            order.ID,
		TotalAmount:   order.TotalAmount,
		Status:        order.Status,
		PaymentMethod: order.PaymentMethod,
		PaymentStatus: order.PaymentStatus,
		PaymentID:     order.PaymentID,

		// Address mapping
		Name:      order.Name,
		Phone:     order.Phone,
		HouseName: order.HouseName,
		Street:    order.Street,
		City:      order.City,
		State:     order.State,
		Pincode:   order.Pincode,

		Items: items,
	}
}

// Convert list of orders → response
func ToOrderList(orders []entities.Order) []OrderResponse {

	res := make([]OrderResponse, 0, len(orders))

	for _, order := range orders {
		res = append(res, ToOrderResponse(order))
	}

	return res
}