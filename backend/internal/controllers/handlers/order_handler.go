package handlers

import (
	"net/http"
	"strconv"

	"gym-backend/internal/models/dto"
	"gym-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type OrderController struct {
	service *services.OrderService
}

func NewOrderController(service *services.OrderService) *OrderController {
	return &OrderController{service: service}
}

//
// ======================
// CREATE ORDER
// ======================
//

func (oc *OrderController) CreateOrder(c *gin.Context) {

	var req dto.CreateOrderRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	order, err := oc.service.CreateOrder(userID.(string), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, dto.ToOrderResponse(*order))
}

//
// ======================
// VERIFY PAYMENT
// ======================
//

func (oc *OrderController) VerifyPayment(c *gin.Context) {

	var body struct {
		PaymentID string `json:"razorpay_payment_id" binding:"required"`
		OrderID   string `json:"razorpay_order_id" binding:"required"`
		Signature string `json:"razorpay_signature" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	err := oc.service.VerifyPayment(
		userID.(string),
		body.OrderID,
		body.PaymentID,
		body.Signature,
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "payment verified successfully",
	})
}

//
// ======================
// GET USER ORDERS
// ======================
//

func (oc *OrderController) GetUserOrders(c *gin.Context) {

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	orders, err := oc.service.GetUserOrders(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, dto.ToOrderList(orders))
}

//
// ======================
// GET ORDER BY ID
// ======================
//

func (oc *OrderController) GetOrderByID(c *gin.Context) {

	idParam := c.Param("id")

	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	order, err := oc.service.GetOrderByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "order not found"})
		return
	}

	c.JSON(http.StatusOK, dto.ToOrderResponse(*order))
}

//
// ======================
// CANCEL ORDER
// ======================
//

func (oc *OrderController) CancelOrder(c *gin.Context) {

	idParam := c.Param("id")

	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid order id"})
		return
	}

	userIDVal, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID := userIDVal.(string)

	err = oc.service.CancelOrder(userID, uint(id))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "order cancelled successfully",
	})
}