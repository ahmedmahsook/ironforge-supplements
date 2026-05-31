package entities

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`

	Name     string `gorm:"not null" json:"name"`
	Email    string `gorm:"unique;not null" json:"email"`
	Password string `gorm:"not null" json:"-"`

	Role       string `gorm:"default:user" json:"role"`
	IsVerified bool   `gorm:"default:false" json:"isVerified"`
	IsBlocked  bool   `gorm:"default:false" json:"isBlocked"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

//  Auto-generate UUID before insert
func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	u.ID = uuid.New()
	return
}

type RefreshToken struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
	UserID    uuid.UUID `gorm:"type:uuid;index"`
	Token     string
	ExpiresAt time.Time
	CreatedAt time.Time
}

func (r *RefreshToken) BeforeCreate(
	tx *gorm.DB,
) error {

	if r.ID == uuid.Nil {
		r.ID = uuid.New()
	}

	return nil
}
