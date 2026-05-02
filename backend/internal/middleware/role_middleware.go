package middleware

import (
	"net/http"

	"gym-backend/internal/common/apperror"

	"github.com/gin-gonic/gin"
)

func RequireRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {

		roleVal, exists := c.Get("role")
		if !exists {
			c.Error(apperror.New("UNAUTHORIZED", "no role found", http.StatusUnauthorized))
			c.Abort()
			return
		}

		role, ok := roleVal.(string)
		if !ok || role == "" {
			c.Error(apperror.New("INVALID_ROLE", "invalid role", http.StatusUnauthorized))
			c.Abort()
			return
		}

		for _, allowed := range roles {
			if role == allowed {
				c.Next()
				return
			}
		}

		c.Error(apperror.New("FORBIDDEN", "access denied", http.StatusForbidden))
		c.Abort()
	}
}