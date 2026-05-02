package postgres

import (
	"gym-backend/internal/models/contracts"
	"gym-backend/internal/models/entities"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type userRepository struct {
	DB *gorm.DB
}


func NewUserRepository(db *gorm.DB) contracts.UserRepository {
	return &userRepository{DB: db}
}


// CREATE USER
func (r *userRepository) Create(user *entities.User) error {
	return r.DB.Create(user).Error
}


// FIND USER BY EMAIL
func (r *userRepository) FindByEmail(email string) (*entities.User, error) {
	var user entities.User

	err := r.DB.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}

	return &user, nil
}


// FIND USER BY ID
func (r *userRepository) FindByID(id uuid.UUID) (*entities.User, error) {
	var user entities.User

	err := r.DB.First(&user, "id = ?", id).Error
	if err != nil {
		return nil, err
	}

	return &user, nil
}


// UPDATE USER
func (r *userRepository) Update(user *entities.User) error {
	return r.DB.Save(user).Error
}


// CREATE REFRESH TOKEN
func (r *userRepository) CreateRefreshToken(token *entities.RefreshToken) error {
	return r.DB.Create(token).Error
}


// FIND REFRESH TOKEN
func (r *userRepository) FindRefreshTokenByID(id uuid.UUID) (*entities.RefreshToken, error) {
	var token entities.RefreshToken

	err := r.DB.Where("id = ?", id).First(&token).Error
	if err != nil {
		return nil, err
	}

	return &token, nil
}


// DELETE REFRESH TOKEN
func (r *userRepository) DeleteRefreshToken(id uuid.UUID) error {
	return r.DB.Delete(&entities.RefreshToken{}, "id = ?", id).Error
}