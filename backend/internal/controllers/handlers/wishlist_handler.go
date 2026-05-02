package handlers

import (
	"net/http"
	"strconv"

	"gym-backend/internal/models/dto"
	"gym-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type WishlistController struct {
	service     *services.WishlistService
	cartService *services.CartService
}

func NewWishlistController(
	s *services.WishlistService,
	cart *services.CartService,
) *WishlistController {
	return &WishlistController{
		service:     s,
		cartService: cart,
	}
}


// ADD TO WISHLIST

func (c *WishlistController) Add(ctx *gin.Context) {
	var req dto.AddToWishlistRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	userID := ctx.GetString("user_id")

	added, err := c.service.Add(userID, req)
	if err != nil {
		ctx.Error(err)
		return
	}

	if !added {
		ctx.JSON(200, gin.H{
			"message": "already in wishlist",
		})
		return
	}

	ctx.JSON(200, gin.H{
		"message": "added to wishlist",
	})
}


// GET WISHLIST

func (c *WishlistController) Get(ctx *gin.Context) {
	userID := ctx.GetString("user_id")

	res, err := c.service.Get(userID)
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, res)
}


// REMOVE ITEM

func (c *WishlistController) Remove(ctx *gin.Context) {
	idParam := ctx.Param("product_id")

	productID, err := strconv.Atoi(idParam)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid product id"})
		return
	}

	userID := ctx.GetString("user_id")

	if err := c.service.Remove(userID, uint(productID)); err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "removed from wishlist",
	})
}


// MOVE TO CART

func (c *WishlistController) MoveToCart(ctx *gin.Context) {

	idParam := ctx.Param("product_id")

	productID, err := strconv.Atoi(idParam)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid product id"})
		return
	}

	userID := ctx.GetString("user_id")

	
	err = c.cartService.AddToCart(userID, dto.AddToCartRequest{
		ProductID: uint(productID),
		Quantity:  1,
	})
	if err != nil {
		ctx.Error(err)
		return
	}

	
	err = c.service.Remove(userID, uint(productID))
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "moved to cart successfully",
	})
}