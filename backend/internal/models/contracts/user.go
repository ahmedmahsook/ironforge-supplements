package contracts

import (
	"github.com/google/uuid"
	"gym-backend/internal/models/entities"
)

type UserRepository interface {
	Create(user *entities.User) error
	FindByEmail(email string) (*entities.User, error)
	FindByID(id uuid.UUID) (*entities.User, error)
	Update(user *entities.User) error

	CreateRefreshToken(token *entities.RefreshToken) error
	FindRefreshTokenByID(id uuid.UUID) (*entities.RefreshToken, error)
	DeleteRefreshToken(id uuid.UUID) error
}
