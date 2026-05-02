package services

import (
	"net/http"
	"strings"
	"fmt"

	"gym-backend/internal/common/apperror"
	"gym-backend/internal/models/contracts"
	"gym-backend/internal/models/dto"
	"gym-backend/internal/models/mappers"
	"gym-backend/pkg/cloudinary"
)

type ProductService struct {
	repo contracts.ProductRepository
}


func NewProductService(repo contracts.ProductRepository) *ProductService {
	return &ProductService{repo: repo}
}


// CREATE
func (s *ProductService) CreateProduct(input dto.CreateProductRequest) error {

	if strings.TrimSpace(input.Name) == "" {
		return apperror.New("INVALID_NAME", "product name is required", http.StatusBadRequest)
	}

	if input.Price <= 0 {
		return apperror.New("INVALID_PRICE", "price must be greater than 0", http.StatusBadRequest)
	}

	if strings.TrimSpace(input.Category) == "" {
		return apperror.New("INVALID_CATEGORY", "category is required", http.StatusBadRequest)
	}

	if strings.HasPrefix(input.Image, "http") {
		newURL, err := cloudinary.UploadFromURL(input.Image)
		if err != nil {
			return apperror.New("IMAGE_UPLOAD_FAILED", err.Error(), http.StatusInternalServerError)
		}
		input.Image = newURL
	}

	product := mappers.ToProductEntity(input)

	if err := s.repo.Create(&product); err != nil {
		return apperror.New("DB_ERROR", "failed to create product", http.StatusInternalServerError)
	}

	return nil
}


// GET ALL (PAGINATION)

func (s *ProductService) GetAllProducts(filter dto.ProductFilter) (*dto.PaginatedResponse[dto.ProductResponse], error) {

	if filter.Page <= 0 {
		filter.Page = 1
	}
	if filter.Limit <= 0 {
		filter.Limit = 10
	}

	products, total, err := s.repo.GetAll(filter)
	if err != nil {
		return nil, apperror.New("DB_ERROR", "failed to fetch products", http.StatusInternalServerError)
	}

	response := mappers.ToProductList(products)

	totalPages := int((total + int64(filter.Limit) - 1) / int64(filter.Limit))

	return &dto.PaginatedResponse[dto.ProductResponse]{
		Data:       response,
		Page:       filter.Page,
		Limit:      filter.Limit,
		Total:      total,
		TotalPages: totalPages,
	}, nil
}


// GET BY ID

func (s *ProductService) GetProductByID(id uint) (*dto.ProductResponse, error) {

	if id == 0 {
		return nil, apperror.New("INVALID_ID", "invalid product id", http.StatusBadRequest)
	}

	product, err := s.repo.GetByID(id)
	if err != nil {
		return nil, apperror.New("PRODUCT_NOT_FOUND", "product not found", http.StatusNotFound)
	}

	res := mappers.ToProductResponse(*product)
	return &res, nil
}


// UPDATE

func (s *ProductService) UpdateProduct(input dto.UpdateProductRequest) error {

	if input.ID == 0 {
		return apperror.New("INVALID_ID", "invalid product id", http.StatusBadRequest)
	}

	existing, err := s.repo.GetByID(input.ID)
	if err != nil {
		return apperror.New("PRODUCT_NOT_FOUND", "product not found", http.StatusNotFound)
	}

	mappers.UpdateProductEntity(existing, input)

	if err := s.repo.Update(existing); err != nil {
		return apperror.New("DB_ERROR", "failed to update product", http.StatusInternalServerError)
	}

	return nil
}


// DELETE

func (s *ProductService) DeleteProduct(id uint) error {

	if id == 0 {
		return apperror.New("INVALID_ID", "invalid product id", http.StatusBadRequest)
	}

	if err := s.repo.Delete(id); err != nil {
		return apperror.New("DB_ERROR", "failed to delete product", http.StatusInternalServerError)
	}

	return nil
}
func (s *ProductService) BulkCreateProducts(inputs []dto.CreateProductRequest) (int, []string) {

	successCount := 0
	var errorsList []string

	for i, input := range inputs {

		// Validate basic fields
		if strings.TrimSpace(input.Name) == "" || input.Price <= 0 {
			errorsList = append(errorsList, 
				fmt.Sprintf("index %d: invalid data", i))
			continue
		}

		// Cloudinary upload
		if strings.HasPrefix(input.Image, "http") {
			newURL, err := cloudinary.UploadFromURL(input.Image)
			if err != nil {
				errorsList = append(errorsList, 
					fmt.Sprintf("index %d: image upload failed", i))
				continue
			}
			input.Image = newURL
		}

		product := mappers.ToProductEntity(input)

		if err := s.repo.Create(&product); err != nil {
			errorsList = append(errorsList, 
				fmt.Sprintf("index %d: db error", i))
			continue
		}

		successCount++
	}

	return successCount, errorsList
}