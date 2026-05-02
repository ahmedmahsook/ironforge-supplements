package mappers

import (
	"gym-backend/internal/models/dto"
	"gym-backend/internal/models/entities"
)

// ENTITY → RESPONSE
func ToProductResponse(p entities.Product) dto.ProductResponse {
	return dto.ProductResponse{
		ID:          p.ID,
		Name:        p.Name,
		Price:       p.Price,
		Category:    p.Category,
		Description: p.Description,
		Image:       p.Image,
		Stock:       p.Stock,
		InStock:     p.Stock > 0, 
	}
}


// LIST → RESPONSE

func ToProductList(products []entities.Product) []dto.ProductResponse {
	res := make([]dto.ProductResponse, 0, len(products))

	for _, p := range products {
		res = append(res, ToProductResponse(p))
	}

	return res
}

// CREATE → ENTITY
func ToProductEntity(req dto.CreateProductRequest) entities.Product {
	return entities.Product{
		Name:        req.Name,
		Price:       req.Price,
		Category:    req.Category,
		Description: req.Description,
		Image:       req.Image,
		Stock:       req.Stock, 
	}
}

// UPDATE → ENTITY
func UpdateProductEntity(p *entities.Product, req dto.UpdateProductRequest) {

	if req.Name != "" {
		p.Name = req.Name
	}

	if req.Price != 0 {
		p.Price = req.Price
	}

	if req.Category != "" {
		p.Category = req.Category
	}

	if req.Description != "" {
		p.Description = req.Description
	}

	if req.Image != "" {
		p.Image = req.Image
	}

	if req.Stock != nil {
		p.Stock = *req.Stock 
	}
}