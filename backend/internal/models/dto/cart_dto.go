package dto


// ADD TO CART
type AddToCartRequest struct {
	ProductID uint `json:"product_id" binding:"required"`
	Quantity  int  `json:"quantity" binding:"required,gt=0"`
}


// UPDATE CART ITEM
type UpdateCartItemRequest struct {
	Quantity int `json:"quantity" binding:"required,gt=0"`
}


// CART ITEM RESPONSE
type CartItemResponse struct {
	ProductID uint   `json:"product_id"`
	Name      string `json:"name"`
	Price     int    `json:"price"`
	Image     string `json:"image"`
	Quantity  int    `json:"quantity"`
	Subtotal  int    `json:"subtotal"` 
}


// FULL CART RESPONSE
type CartResponse struct {
	Items []CartItemResponse `json:"items"`
	Total int                `json:"total"`
}