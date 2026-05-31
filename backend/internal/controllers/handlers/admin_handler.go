package handlers

import (
	"math"
	"net/http"
	"strconv"

	"gym-backend/internal/models/dto"
	"gym-backend/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AdminController struct {
	service *services.AdminService
}

func NewAdminController(service *services.AdminService) *AdminController {
	return &AdminController{
		service: service,
	}
}

//
// ======================
// DASHBOARD
// ======================
//

func (ac *AdminController) GetDashboard(c *gin.Context) {

	data, err := ac.service.GetDashboard()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, data)
}

//
// ======================
// GET ALL ORDERS
// ======================
//

func (ac *AdminController) GetAllOrders(c *gin.Context) {

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	status := c.Query("status")

	paymentStatus := c.Query("payment_status")

	paymentMethod := c.Query("payment_method")

	orders, total, err := ac.service.GetAllOrders(
		page,
		limit,
		status,
		paymentStatus,
		paymentMethod,
	)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": dto.ToOrderList(orders),

		"page": page,

		"limit": limit,

		"total": total,

		"total_pages": int(
			math.Ceil(
				float64(total) / float64(limit),
			),
		),
	})
}

//
// ======================
// UPDATE ORDER STATUS
// ======================
//

func (ac *AdminController) UpdateOrderStatus(c *gin.Context) {

	idParam := c.Param("id")

	id, err := strconv.Atoi(idParam)

	if err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid order id",
		})

		return
	}

	var body struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid input",
		})

		return
	}

	err = ac.service.UpdateOrderStatus(
		uint(id),
		body.Status,
	)

	if err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "order status updated successfully",
	})
}

//
// ======================
// GET ALL USERS
// ======================
//

func (ac *AdminController) GetAllUsers(c *gin.Context) {

	page, _ := strconv.Atoi(
		c.DefaultQuery("page", "1"),
	)

	limit, _ := strconv.Atoi(
		c.DefaultQuery("limit", "10"),
	)

	search := c.Query("search")

	users, total, err := ac.service.GetAllUsers(
		page,
		limit,
		search,
	)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": users,

		"page": page,

		"limit": limit,

		"total": total,

		"total_pages": int(
			math.Ceil(
				float64(total) / float64(limit),
			),
		),
	})
}

//
// ======================
// BLOCK USER
// ======================
//

func (ac *AdminController) BlockUser(c *gin.Context) {

	idParam := c.Param("id")

	id, err := uuid.Parse(idParam)

	if err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid user id",
		})

		return
	}

	err = ac.service.BlockUser(id)

	if err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "user blocked",
	})
}

//
// ======================
// UNBLOCK USER
// ======================
//

func (ac *AdminController) UnblockUser(c *gin.Context) {

	idParam := c.Param("id")

	id, err := uuid.Parse(idParam)

	if err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid user id",
		})

		return
	}

	err = ac.service.UnblockUser(id)

	if err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "user unblocked",
	})
}