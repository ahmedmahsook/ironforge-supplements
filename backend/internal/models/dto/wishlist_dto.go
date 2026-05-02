package dto

type AddToWishlistRequest struct {
	ProductID uint `json:"product_id"`
}

type WishlistItemResponse struct {
	ProductID uint   `json:"product_id"`
	Name      string `json:"name"`
	Price     int    `json:"price"`
	Image     string `json:"image"`
}

type WishlistResponse struct {
	Items []WishlistItemResponse `json:"items"`
}