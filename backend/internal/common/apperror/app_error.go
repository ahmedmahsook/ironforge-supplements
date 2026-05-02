package apperror

type AppError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Status  int    `json:"-"`
}

func (e *AppError) Error() string {
	return e.Message
}

func New(code, message string, status int) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
		Status:  status,
	}
}

// Optional common errors
var (
	ErrInternal     = New("INTERNAL_ERROR", "internal server error", 500)
	ErrInvalidInput = New("INVALID_INPUT", "invalid input", 400)
	ErrNotFound     = New("NOT_FOUND", "resource not found", 404)
)