package dto

// CREATE PRODUCT
type CreateProductRequest struct {
	Name        string `json:"name" binding:"required"`
	Price       int    `json:"price" binding:"required,gt=0"`
	Category    string `json:"category" binding:"required"`
	Description string `json:"description"`
	Image       string `json:"image"`
	Stock       int    `json:"stock"` 
}


// UPDATE PRODUCT
type UpdateProductRequest struct {
	ID          uint   `json:"id"`
	Name        string `json:"name"`
	Price       int    `json:"price"`
	Category    string `json:"category"`
	Description string `json:"description"`
	Image       string `json:"image"`
	Stock       *int   `json:"stock"` 
}

// RESPONSE DTO
type ProductResponse struct {
	ID          uint   `json:"id"`
	Name        string `json:"name"`
	Price       int    `json:"price"`
	Category    string `json:"category"`
	Description string `json:"description"`
	Image       string `json:"image"`
	Stock       int    `json:"stock"`    
	InStock     bool   `json:"in_stock"`  
}

// FILTER + PAGINATION
type ProductFilter struct {
	Search   string `form:"search"`
	Category string `form:"category"`
	MinPrice int    `form:"minPrice"`
	MaxPrice int    `form:"maxPrice"`
	Page     int    `form:"page"`
	Limit    int    `form:"limit"`
}


// GENERIC PAGINATION RESPONSE
type PaginatedResponse[T any] struct {
	Data       []T   `json:"data"`
	Page       int   `json:"page"`
	Limit      int   `json:"limit"`
	Total      int64 `json:"total"`
	TotalPages int   `json:"total_pages"`
}
type BulkCreateProductRequest struct {
	Products []CreateProductRequest `json:"products"`
}