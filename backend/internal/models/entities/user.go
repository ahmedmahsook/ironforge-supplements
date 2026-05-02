package entities

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID uuid.UUID `gorm:"type:uuid;primaryKey"`

	Name     string `gorm:"not null"`
	Email    string `gorm:"unique;not null"`
	Password string `gorm:"not null"`

	Role       string `gorm:"default:user"` 
	IsVerified bool   `gorm:"default:false"`

	
	IsBlocked bool `gorm:"default:false"`

	CreatedAt time.Time
	UpdatedAt time.Time
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

func (r *RefreshToken) BeforeCreate(tx *gorm.DB) error {
	r.ID = uuid.New()
	return nil
}
