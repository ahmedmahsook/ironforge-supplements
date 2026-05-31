package postgres

import (
	"gym-backend/internal/models/contracts"
	"gym-backend/internal/models/dto"
	"gym-backend/internal/models/entities"

	"gorm.io/gorm"
)

type productRepository struct {
	DB *gorm.DB
}

func NewProductRepository(db *gorm.DB) contracts.ProductRepository {
	return &productRepository{DB: db}
}

//
// ======================
// CREATE
// ======================
//

func (r *productRepository) Create(product *entities.Product) error {
	return r.DB.Create(product).Error
}

//
// ======================
// GET ALL (FILTER + PAGINATION)
// ======================
//

func (r *productRepository) GetAll(filter dto.ProductFilter) ([]entities.Product, int64, error) {

	var products []entities.Product
	var total int64

	// Base query
	baseQuery := r.DB.Model(&entities.Product{})

	//  Search
	if filter.Search != "" {
		search := "%" + filter.Search + "%"
		baseQuery = baseQuery.Where("LOWER(name) LIKE LOWER(?)", search)
	}

	//  Category (CASE INSENSITIVE FIX)
	if filter.Category != "" {

	baseQuery = baseQuery.Where(
		"REPLACE(LOWER(category), ' ', '') = ?",
		filter.Category,
	)

}

	// Price range
	if filter.MinPrice > 0 {
		baseQuery = baseQuery.Where("price >= ?", filter.MinPrice)
	}

	if filter.MaxPrice > 0 {
		baseQuery = baseQuery.Where("price <= ?", filter.MaxPrice)
	}

	// ======================
	// COUNT
	// ======================

	countQuery := baseQuery

	if err := countQuery.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// ======================
	// PAGINATION DEFAULTS
	// ======================

	if filter.Page <= 0 {
		filter.Page = 1
	}

	if filter.Limit <= 0 {
		filter.Limit = 10
	}

	offset := (filter.Page - 1) * filter.Limit

	// ======================
	// FETCH DATA
	// ======================

	dataQuery := baseQuery

	err := dataQuery.
		Limit(filter.Limit).
		Offset(offset).
		Order("id DESC").
		Find(&products).Error

	if err != nil {
		return nil, 0, err
	}

	return products, total, nil
}

//
// ======================
// GET BY ID
// ======================
//

func (r *productRepository) GetByID(id uint) (*entities.Product, error) {

	var product entities.Product

	err := r.DB.First(&product, "id = ?", id).Error

	if err != nil {
		return nil, err
	}

	return &product, nil
}

//
// ======================
// UPDATE
// ======================
//

func (r *productRepository) Update(product *entities.Product) error {
	return r.DB.Save(product).Error
}

//
// ======================
// DELETE
// ======================
//

func (r *productRepository) Delete(id uint) error {

	result := r.DB.Delete(&entities.Product{}, "id = ?", id)

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

//
// ======================
// DASHBOARD SUPPORT
// ======================
//

// COUNT PRODUCTS

func (r *productRepository) CountProducts() (int64, error) {

	var count int64

	err := r.DB.Model(&entities.Product{}).
		Count(&count).Error

	return count, err
}