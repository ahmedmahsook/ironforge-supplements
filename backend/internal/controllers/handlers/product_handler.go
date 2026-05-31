package handlers

import (
	"net/http"
	"strconv"

	"gym-backend/internal/common/apperror"
	"gym-backend/internal/models/dto"
	"gym-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type ProductController struct {
	service *services.ProductService
}

func NewProductController(service *services.ProductService) *ProductController {
	return &ProductController{service: service}
}


// CREATE PRODUCT

func (pc *ProductController) CreateProduct(c *gin.Context) {
	var req dto.CreateProductRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(apperror.New("INVALID_INPUT", err.Error(), http.StatusBadRequest))
		return
	}

	if err := pc.service.CreateProduct(req); err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "product created",
	})
}


// GET ALL PRODUCTS

func (pc *ProductController) GetProducts(c *gin.Context) {
	var filter dto.ProductFilter

	filter.Search = c.Query("search")
	filter.Category = c.Query("category")

if min := c.Query("min_price"); min != "" {
	if val, err := strconv.Atoi(min); err == nil {
		filter.MinPrice = val
	}
}

if max := c.Query("max_price"); max != "" {
	if val, err := strconv.Atoi(max); err == nil {
		filter.MaxPrice = val
	}
}
	if page := c.Query("page"); page != "" {
		if val, err := strconv.Atoi(page); err == nil {
			filter.Page = val
		}
	}

	if limit := c.Query("limit"); limit != "" {
		if val, err := strconv.Atoi(limit); err == nil {
			filter.Limit = val
		}
	}

	result, err := pc.service.GetAllProducts(filter)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, result)
}


// GET PRODUCT BY ID

func (pc *ProductController) GetProductByID(c *gin.Context) {
	idParam := c.Param("id")

	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.Error(apperror.New("INVALID_ID", "invalid id", http.StatusBadRequest))
		return
	}

	product, err := pc.service.GetProductByID(uint(id))
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, product)
}


// UPDATE PRODUCT

func (pc *ProductController) UpdateProduct(c *gin.Context) {
	idParam := c.Param("id")

	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.Error(apperror.New("INVALID_ID", "invalid id", http.StatusBadRequest))
		return
	}

	var req dto.UpdateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(apperror.New("INVALID_INPUT", err.Error(), http.StatusBadRequest))
		return
	}

	req.ID = uint(id)

	if err := pc.service.UpdateProduct(req); err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "product updated",
	})
}


// DELETE PRODUCT

func (pc *ProductController) DeleteProduct(c *gin.Context) {
	idParam := c.Param("id")

	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.Error(apperror.New("INVALID_ID", "invalid id", http.StatusBadRequest))
		return
	}

	if err := pc.service.DeleteProduct(uint(id)); err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "product deleted",
	})
}
func (pc *ProductController) BulkCreate(c *gin.Context) {

	var req struct {
		Products []dto.CreateProductRequest `json:"products"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	successCount, errorsList := pc.service.BulkCreateProducts(req.Products)

	c.JSON(201, gin.H{
		"success_count": successCount,
		"failed_count":  len(errorsList),
		"errors":        errorsList,
	})
}