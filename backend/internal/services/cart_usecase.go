package services

import (
	"net/http"

	"gym-backend/internal/common/apperror"
	"gym-backend/internal/models/contracts"
	"gym-backend/internal/models/dto"
	"gym-backend/internal/models/entities"

	"gorm.io/gorm"
)

type CartService struct {
	repo        contracts.CartRepository
	productRepo contracts.ProductRepository
}


func NewCartService(
	repo contracts.CartRepository,
	productRepo contracts.ProductRepository,
) *CartService {
	return &CartService{
		repo:        repo,
		productRepo: productRepo,
	}
}


// ADD TO CART

func (s *CartService) AddToCart(userID string, input dto.AddToCartRequest) error {

	if input.Quantity <= 0 {
		return apperror.New("INVALID_QUANTITY", "quantity must be greater than 0", http.StatusBadRequest)
	}

	//  check product exists
	_, err := s.productRepo.GetByID(input.ProductID)
	if err != nil {
		return apperror.New("PRODUCT_NOT_FOUND", "product not found", http.StatusNotFound)
	}

	cart, err := s.repo.GetByUserID(userID)

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			cart = &entities.Cart{
				UserID: userID,
			}

			if err := s.repo.CreateCart(cart); err != nil {
				return apperror.New("DB_ERROR", "failed to create cart", http.StatusInternalServerError)
			}
		} else {
			return apperror.New("DB_ERROR", "failed to fetch cart", http.StatusInternalServerError)
		}
	}

	item, err := s.repo.GetItem(cart.ID, input.ProductID)

	if err == nil {
		item.Quantity += input.Quantity
		return s.repo.UpdateItem(item)
	}

	if err != gorm.ErrRecordNotFound {
		return apperror.New("DB_ERROR", "failed to fetch cart item", http.StatusInternalServerError)
	}

	newItem := &entities.CartItem{
		CartID:    cart.ID,
		ProductID: input.ProductID,
		Quantity:  input.Quantity,
	}

	return s.repo.AddItem(newItem)
}


// GET CART
func (s *CartService) GetCart(userID string) (*dto.CartResponse, error) {

	cart, err := s.repo.GetByUserID(userID)
	if err != nil {
		return &dto.CartResponse{
			Items: []dto.CartItemResponse{},
			Total: 0,
		}, nil
	}

	var response dto.CartResponse
	total := 0

	for _, item := range cart.Items {

		subtotal := item.Product.Price * item.Quantity
		total += subtotal

		response.Items = append(response.Items, dto.CartItemResponse{
			ProductID: item.ProductID,
			Name:      item.Product.Name,
			Price:     item.Product.Price,
			Image:     item.Product.Image,
			Quantity:  item.Quantity,
			Subtotal:  subtotal,
		})
	}

	response.Total = total

	return &response, nil
}


// UPDATE ITEM
func (s *CartService) UpdateItem(userID string, productID uint, input dto.UpdateCartItemRequest) error {

	if input.Quantity <= 0 {
		return apperror.New("INVALID_QUANTITY", "quantity must be greater than 0", http.StatusBadRequest)
	}


	cart, err := s.repo.GetByUserID(userID)
	if err != nil {
		return apperror.New("CART_NOT_FOUND", "cart not found", http.StatusNotFound)
	}

	item, err := s.repo.GetItem(cart.ID, productID)
	if err != nil {
		return apperror.New("ITEM_NOT_FOUND", "item not found", http.StatusNotFound)
	}

	item.Quantity = input.Quantity

	return s.repo.UpdateItem(item)
}


// REMOVE ITEM
func (s *CartService) RemoveItem(userID string, productID uint) error {


	cart, err := s.repo.GetByUserID(userID)
	if err != nil {
		return apperror.New("CART_NOT_FOUND", "cart not found", http.StatusNotFound)
	}

	if err := s.repo.DeleteItem(cart.ID, productID); err != nil {
		return apperror.New("ITEM_NOT_FOUND", "item not found", http.StatusNotFound)
	}

	return nil
}


// CLEAR CART
func (s *CartService) ClearCart(userID string) error {

	
	cart, err := s.repo.GetByUserID(userID)
	if err != nil {
		return apperror.New("CART_NOT_FOUND", "cart not found", http.StatusNotFound)
	}

	if err := s.repo.ClearCart(cart.ID); err != nil {
		return apperror.New("DB_ERROR", "failed to clear cart", http.StatusInternalServerError)
	}

	return nil
}