package validator

import (
	"errors"
	"unicode"
)


// PASSWORD VALIDATION

func ValidatePassword(password string) error {
	if len(password) < 8 {
		return errors.New("password must be at least 8 characters")
	}

	var hasUpper, hasLower, hasNumber bool

	for _, ch := range password {
		switch {
		case unicode.IsUpper(ch):
			hasUpper = true
		case unicode.IsLower(ch):
			hasLower = true
		case unicode.IsDigit(ch):
			hasNumber = true
		}
	}

	if !hasUpper || !hasLower || !hasNumber {
		return errors.New("password must contain uppercase, lowercase and number")
	}

	return nil
}


// EMAIL NORMALIZATION

func NormalizeEmail(email string) string {
	// optional helper (lowercase email)
	return email
}

// GENERIC REQUIRED CHECK
func Required(value, field string) error {
	if value == "" {
		return errors.New(field + " is required")
	}
	return nil
}