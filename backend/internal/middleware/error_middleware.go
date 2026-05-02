package middleware

import (
	"net/http"

	"gym-backend/internal/common/apperror"
	"gym-backend/internal/common/logger"

	"github.com/gin-gonic/gin"
)

func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {

		c.Next()

		if len(c.Errors) > 0 {
			err := c.Errors.Last().Err

			// 🔹 AppError
			if appErr, ok := err.(*apperror.AppError); ok {
				logger.Log.Error(appErr.Message)

				c.JSON(appErr.Status, gin.H{
					"error": gin.H{
						"code":    appErr.Code,
						"message": appErr.Message,
					},
				})
				return
			}

			// Unknown error
			logger.Log.Error(err.Error())

			c.JSON(http.StatusInternalServerError, gin.H{
				"error": gin.H{
					"code":    "INTERNAL_ERROR",
					"message": "something went wrong",
				},
			})
		}
	}
}