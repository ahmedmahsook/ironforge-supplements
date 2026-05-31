package postgres

import (
	"errors"

	"gym-backend/internal/models/contracts"
	"gym-backend/internal/models/entities"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type userRepository struct {
	DB *gorm.DB
}

func NewUserRepository(
	db *gorm.DB,
) contracts.UserRepository {

	return &userRepository{
		DB: db,
	}
}

//
// ======================
// CREATE USER
// ======================
//

func (r *userRepository) Create(
	user *entities.User,
) error {

	return r.DB.Create(user).Error
}

//
// ======================
// FIND BY EMAIL
// ======================
//

func (r *userRepository) FindByEmail(
	email string,
) (*entities.User, error) {

	var user entities.User

	err := r.DB.
		Where(
			"email = ?",
			email,
		).
		First(&user).Error

	if err != nil {

		if errors.Is(
			err,
			gorm.ErrRecordNotFound,
		) {

			return nil, nil
		}

		return nil, err
	}

	return &user, nil
}

//
// ======================
// FIND BY ID
// ======================
//

func (r *userRepository) FindByID(
	id uuid.UUID,
) (*entities.User, error) {

	var user entities.User

	err := r.DB.
		First(
			&user,
			"id = ?",
			id,
		).Error

	if err != nil {

		if errors.Is(
			err,
			gorm.ErrRecordNotFound,
		) {

			return nil, nil
		}

		return nil, err
	}

	return &user, nil
}

//
// ======================
// UPDATE USER
// ======================
//

func (r *userRepository) Update(
	user *entities.User,
) error {

	return r.DB.Save(user).Error
}

//
// ======================
// REFRESH TOKEN
// ======================
//

func (r *userRepository) CreateRefreshToken(
	token *entities.RefreshToken,
) error {

	return r.DB.Create(token).Error
}

func (r *userRepository) FindRefreshTokenByID(
	id uuid.UUID,
) (*entities.RefreshToken, error) {

	var token entities.RefreshToken

	err := r.DB.
		Where(
			"id = ?",
			id,
		).
		First(&token).Error

	if err != nil {

		if errors.Is(
			err,
			gorm.ErrRecordNotFound,
		) {

			return nil, nil
		}

		return nil, err
	}

	return &token, nil
}

func (r *userRepository) DeleteRefreshToken(
	id uuid.UUID,
) error {

	result := r.DB.Delete(
		&entities.RefreshToken{},
		"id = ?",
		id,
	)

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

// COUNT USERS

func (r *userRepository) CountUsers() (
	int64,
	error,
) {

	var count int64

	err := r.DB.
		Model(
			&entities.User{},
		).
		Count(&count).Error

	return count, err
}

//
// ======================
// GET ALL USERS
// ======================
//

func (r *userRepository) GetAllUsers(
	page int,
	limit int,
	search string,
) ([]entities.User, int64, error) {

	var users []entities.User

	var total int64

	offset := (page - 1) * limit

	query := r.DB.Model(
		&entities.User{},
	)

	// SEARCH

	if search != "" {

		query = query.Where(
			"name ILIKE ? OR email ILIKE ?",
			"%"+search+"%",
			"%"+search+"%",
		)
	}

	// TOTAL COUNT

	if err := query.
		Count(&total).Error; err != nil {

		return nil, 0, err
	}

	// USERS

	err := query.
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&users).Error

	if err != nil {

		return nil, 0, err
	}

	return users, total, nil
}

//
// ======================
// UPDATE BLOCK STATUS
// ======================
//

func (r *userRepository) UpdateStatus(
	userID uuid.UUID,
	isBlocked bool,
) error {

	return r.DB.Model(
		&entities.User{},
	).
		Where(
			"id = ?",
			userID,
		).
		Updates(
			map[string]interface{}{
				"is_blocked": isBlocked,
			},
		).Error
}