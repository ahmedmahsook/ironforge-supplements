package contracts

import (
	"gym-backend/internal/models/dto"
	"gym-backend/internal/models/entities"
)

type ProductRepository interface {
	Create(product *entities.Product) error
	GetAll(filter dto.ProductFilter) ([]entities.Product, int64, error)
	GetByID(id uint) (*entities.Product, error)
	Update(product *entities.Product) error
	Delete(id uint) error
}