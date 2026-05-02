package dto

// SIGNUP
type SignupRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// LOGIN
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// SEND OTP
type SendOTPRequest struct {
	Email string `json:"email" binding:"required,email"`
}

// VERIFY OTP
type VerifyOTPRequest struct {
	Email string `json:"email" binding:"required,email"`
	OTP   string `json:"otp" binding:"required"`
}

// REFRESH TOKEN
type RefreshRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

// LOGOUT
type LogoutRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

// RESPONSE DTO
type AuthResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}