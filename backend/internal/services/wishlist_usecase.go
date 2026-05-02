package services

import (
	"net/http"

	"gym-backend/internal/common/apperror"
	"gym-backend/internal/models/contracts"
	"gym-backend/internal/models/dto"
	"gym-backend/internal/models/entities"

	"gorm.io/gorm"
)

type WishlistService struct {
	repo        contracts.WishlistRepository
	productRepo contracts.ProductRepository
}

func NewWishlistService(
	repo contracts.WishlistRepository,
	productRepo contracts.ProductRepository,
) *WishlistService {
	return &WishlistService{
		repo:        repo,
		productRepo: productRepo,
	}
}


// ADD TO WISHLIST

func (s *WishlistService) Add(userID string, input dto.AddToWishlistRequest) (bool, error) {

	// Validate product
	_, err := s.productRepo.GetByID(input.ProductID)
	if err != nil {
		return false, apperror.New("PRODUCT_NOT_FOUND", "product not found", http.StatusNotFound)
	}

	//  Get or create wishlist
	wishlist, err := s.repo.GetByUser(userID)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			wishlist = &entities.Wishlist{UserID: userID}

			if err := s.repo.Create(wishlist); err != nil {
				return false, apperror.New("DB_ERROR", "failed to create wishlist", http.StatusInternalServerError)
			}
		} else {
			return false, apperror.New("DB_ERROR", "failed to fetch wishlist", http.StatusInternalServerError)
		}
	}

	// Check duplicate
	item, err := s.repo.GetItem(wishlist.ID, input.ProductID)

	if err == nil && item != nil {
		return false, nil // already exists
	}

	if err != nil && err != gorm.ErrRecordNotFound {
		return false, apperror.New("DB_ERROR", "failed to check wishlist item", http.StatusInternalServerError)
	}

	// Add item
	err = s.repo.AddItem(&entities.WishlistItem{
		WishlistID: wishlist.ID,
		ProductID:  input.ProductID,
	})

	if err != nil {
		// DB-level duplicate safety
		return false, nil
	}

	return true, nil // added successfully
}


// GET
func (s *WishlistService) Get(userID string) (*dto.WishlistResponse, error) {

	wishlist, err := s.repo.GetByUser(userID)
	if err != nil {
		return &dto.WishlistResponse{
			Items: []dto.WishlistItemResponse{},
		}, nil
	}

	var items []dto.WishlistItemResponse

	for _, i := range wishlist.Items {
		items = append(items, dto.WishlistItemResponse{
			ProductID: i.ProductID,
			Name:      i.Product.Name,
			Price:     i.Product.Price,
			Image:     i.Product.Image,
		})
	}

	return &dto.WishlistResponse{Items: items}, nil
}


// REMOVE
func (s *WishlistService) Remove(userID string, productID uint) error {

	wishlist, err := s.repo.GetByUser(userID)
	if err != nil {
		return apperror.New("WISHLIST_NOT_FOUND", "wishlist not found", http.StatusNotFound)
	}

	err = s.repo.DeleteItem(wishlist.ID, productID)
	if err != nil {
		return apperror.New("ITEM_NOT_FOUND", "item not found", http.StatusNotFound)
	}

	return nil
}