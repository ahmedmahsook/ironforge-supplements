package handlers

import (
	"net/http"
	"strconv"

	"gym-backend/internal/common/apperror"
	"gym-backend/internal/models/dto"
	"gym-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type CartController struct {
	service *services.CartService
}


func NewCartController(service *services.CartService) *CartController {
	return &CartController{service: service}
}


// ADD TO CART

func (cc *CartController) AddToCart(c *gin.Context) {

	userID, exists := c.Get("user_id")
	if !exists {
		c.Error(apperror.New("UNAUTHORIZED", "user not found", http.StatusUnauthorized))
		return
	}

	var req dto.AddToCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(apperror.New("INVALID_INPUT", err.Error(), http.StatusBadRequest))
		return
	}

	if err := cc.service.AddToCart(userID.(string), req); err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "item added to cart",
	})
}


// GET CART

func (cc *CartController) GetCart(c *gin.Context) {

	userID, exists := c.Get("user_id")
	if !exists {
		c.Error(apperror.New("UNAUTHORIZED", "user not found", http.StatusUnauthorized))
		return
	}

	cart, err := cc.service.GetCart(userID.(string))
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, cart)
}


// UPDATE ITEM

func (cc *CartController) UpdateItem(c *gin.Context) {

	userID, exists := c.Get("user_id")
	if !exists {
		c.Error(apperror.New("UNAUTHORIZED", "user not found", http.StatusUnauthorized))
		return
	}

	productIDParam := c.Param("product_id")
	productID, err := strconv.Atoi(productIDParam)
	if err != nil {
		c.Error(apperror.New("INVALID_ID", "invalid product id", http.StatusBadRequest))
		return
	}

	var req dto.UpdateCartItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(apperror.New("INVALID_INPUT", err.Error(), http.StatusBadRequest))
		return
	}

	if err := cc.service.UpdateItem(userID.(string), uint(productID), req); err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "cart updated",
	})
}


// REMOVE ITEM

func (cc *CartController) RemoveItem(c *gin.Context) {

	userID, exists := c.Get("user_id")
	if !exists {
		c.Error(apperror.New("UNAUTHORIZED", "user not found", http.StatusUnauthorized))
		return
	}

	productIDParam := c.Param("product_id")
	productID, err := strconv.Atoi(productIDParam)
	if err != nil {
		c.Error(apperror.New("INVALID_ID", "invalid product id", http.StatusBadRequest))
		return
	}

	if err := cc.service.RemoveItem(userID.(string), uint(productID)); err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "item removed",
	})
}


// CLEAR CART

func (cc *CartController) ClearCart(c *gin.Context) {

	userID, exists := c.Get("user_id")
	if !exists {
		c.Error(apperror.New("UNAUTHORIZED", "user not found", http.StatusUnauthorized))
		return
	}

	if err := cc.service.ClearCart(userID.(string)); err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "cart cleared",
	})
}