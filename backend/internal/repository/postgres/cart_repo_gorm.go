package postgres

import (
	"gym-backend/internal/models/contracts"
	"gym-backend/internal/models/entities"

	"gorm.io/gorm"
)

type cartRepository struct {
	DB *gorm.DB
}


func NewCartRepository(db *gorm.DB) contracts.CartRepository {
	return &cartRepository{DB: db}
}


// GET CART BY USER
func (r *cartRepository) GetByUserID(userID string) (*entities.Cart, error) {
	var cart entities.Cart

	err := r.DB.
		Preload("Items").
		Preload("Items.Product").
		Where("user_id = ?", userID).
		First(&cart).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, gorm.ErrRecordNotFound
		}
		return nil, err
	}

	return &cart, nil
}


// CREATE CART
func (r *cartRepository) CreateCart(cart *entities.Cart) error {
	return r.DB.Create(cart).Error
}


// GET ITEM
func (r *cartRepository) GetItem(cartID uint, productID uint) (*entities.CartItem, error) {
	var item entities.CartItem

	err := r.DB.
		Where("cart_id = ? AND product_id = ?", cartID, productID).
		First(&item).Error

	if err != nil {
		return nil, err
	}

	return &item, nil
}


// ADD ITEM

func (r *cartRepository) AddItem(item *entities.CartItem) error {
	return r.DB.Create(item).Error
}


// UPDATE ITEM
func (r *cartRepository) UpdateItem(item *entities.CartItem) error {
	return r.DB.Model(&entities.CartItem{}).
		Where("id = ?", item.ID).
		Updates(item).Error
}


// DELETE ITEM
func (r *cartRepository) DeleteItem(cartID uint, productID uint) error {

	result := r.DB.
		Where("cart_id = ? AND product_id = ?", cartID, productID).
		Delete(&entities.CartItem{})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}


// CLEAR CART 

func (r *cartRepository) ClearCart(cartID uint) error {
	return r.DB.
		Where("cart_id = ?", cartID).
		Delete(&entities.CartItem{}).Error
}


// CLEAR CART WITH TX 
func (r *cartRepository) ClearCartWithTx(tx *gorm.DB, userID string) error {

	// First get cart
	var cart entities.Cart

	if err := tx.Where("user_id = ?", userID).First(&cart).Error; err != nil {
		return err
	}

	// Delete items
	return tx.
		Where("cart_id = ?", cart.ID).
		Delete(&entities.CartItem{}).Error
}