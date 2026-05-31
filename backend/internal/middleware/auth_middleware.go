package middleware

import (
	"net/http"
	"strings"

	"gym-backend/internal/common/apperror"
	"gym-backend/internal/common/logger"
	"gym-backend/internal/models/contracts"
	"gym-backend/pkg/jwt"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func AuthMiddleware(
	jwtManager *jwt.JWTManager,
	userRepo contracts.UserRepository,
) gin.HandlerFunc {

	return func(c *gin.Context) {

		// =====================
		// GET AUTH HEADER
		// =====================

		authHeader :=
			c.GetHeader(
				"Authorization",
			)

		if authHeader == "" {

			c.Error(
				apperror.New(
					"UNAUTHORIZED",
					"missing authorization header",
					http.StatusUnauthorized,
				),
			)

			c.Abort()

			return
		}

		// =====================
		// VALIDATE BEARER FORMAT
		// =====================

		if !strings.HasPrefix(
			authHeader,
			"Bearer ",
		) {

			c.Error(
				apperror.New(
					"INVALID_TOKEN",
					"invalid token format",
					http.StatusUnauthorized,
				),
			)

			c.Abort()

			return
		}

		tokenString :=
			strings.TrimPrefix(
				authHeader,
				"Bearer ",
			)

		// =====================
		// VALIDATE ACCESS TOKEN
		// =====================

		claims, err :=
			jwtManager.ValidateAccess(
				tokenString,
			)

		if err != nil {

			logger.Log.Error(
				"JWT validation failed:",
				err,
			)

			c.Error(
				apperror.New(
					"INVALID_TOKEN",
					"invalid or expired token",
					http.StatusUnauthorized,
				),
			)

			c.Abort()

			return
		}

		// =====================
		// EXTRACT USER ID
		// =====================

		userID, ok :=
			claims["user_id"].(string)

		if !ok || userID == "" {

			c.Error(
				apperror.New(
					"INVALID_TOKEN",
					"invalid user_id",
					http.StatusUnauthorized,
				),
			)

			c.Abort()

			return
		}

		// =====================
		// VALIDATE ISSUER
		// =====================

		if iss, ok :=
			claims["iss"].(string); !ok ||
			iss != "gym-backend" {

			c.Error(
				apperror.New(
					"INVALID_TOKEN",
					"invalid token issuer",
					http.StatusUnauthorized,
				),
			)

			c.Abort()

			return
		}

		// =====================
		// CONVERT USER ID
		// =====================

		uid, err :=
			uuid.Parse(userID)

		if err != nil {

			c.Error(
				apperror.New(
					"INVALID_TOKEN",
					"invalid user_id format",
					http.StatusUnauthorized,
				),
			)

			c.Abort()

			return
		}

		// =====================
		// FETCH USER
		// =====================

		user, err :=
			userRepo.FindByID(uid)

		if err != nil {

			c.Error(
				apperror.New(
					"UNAUTHORIZED",
					"user not found",
					http.StatusUnauthorized,
				),
			)

			c.Abort()

			return
		}

		// =====================
		// BLOCK CHECK
		// =====================

		if user.IsBlocked {

			c.Error(
				apperror.New(
					"BLOCKED",
					"user is blocked",
					http.StatusForbidden,
				),
			)

			c.Abort()

			return
		}

		// =====================
		// ATTACH USER DATA
		// =====================

		c.Set(
			"user_id",
			user.ID.String(),
		)

		c.Set(
			"role",
			user.Role,
		)

		c.Next()
	}
}