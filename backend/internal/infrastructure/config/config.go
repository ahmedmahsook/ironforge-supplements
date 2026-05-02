package config

import (
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)


// MAIN CONFIG

type Config struct {
	App        AppConfig
	Database   DatabaseConfig
	JWT        JWTConfig
	SMTP       SMTPConfig
	Redis      RedisConfig
	Razorpay   RazorpayConfig
	Cloudinary CloudinaryConfig
}


// APP

type AppConfig struct {
	Port        string
	Env         string
	CORSOrigins []string
}


// DATABASE

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	SSLMode  string
}


// JWT

type JWTConfig struct {
	Secret        string
	RefreshSecret string
	AccessTTLMin  int
	RefreshTTLHr  int
}


// SMTP

type SMTPConfig struct {
	Host     string
	Port     int
	Username string
	Password string
	From     string
}


// REDIS

type RedisConfig struct {
	Addr     string
	Password string
	DB       int
}


// RAZORPAY

type RazorpayConfig struct {
	KeyID         string
	KeySecret     string
	WebhookSecret string 
}


// CLOUDINARY

type CloudinaryConfig struct {
	CloudURL string
}


// LOAD CONFIG

func Load() *Config {


	_ = godotenv.Load()

	env := getEnv("APP_ENV", "development")


	corsRaw := getEnv("APP_CORS_ORIGINS", "http://localhost:5173")
	var cors []string
	for _, o := range strings.Split(corsRaw, ",") {
		cors = append(cors, strings.TrimSpace(o))
	}

	cfg := &Config{

		App: AppConfig{
			Port:        getEnv("APP_PORT", "8080"),
			Env:         env,
			CORSOrigins: cors,
		},

		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", ""),
			Name:     getEnv("DB_NAME", "gym_db"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},

		JWT: JWTConfig{
			Secret:        getEnv("JWT_SECRET", "dev_secret"),
			RefreshSecret: getEnv("REFRESH_SECRET", "dev_refresh"),
			AccessTTLMin:  getEnvInt("JWT_ACCESS_TTL_MIN", 15),
			RefreshTTLHr:  getEnvInt("JWT_REFRESH_TTL_HR", 168),
		},

		SMTP: SMTPConfig{
			Host:     getEnv("SMTP_HOST", ""),
			Port:     getEnvInt("SMTP_PORT", 587),
			Username: getEnv("SMTP_USER", ""),
			Password: getEnv("SMTP_PASS", ""),
			From:     getEnv("SMTP_FROM", ""),
		},

		Redis: RedisConfig{
			Addr:     getEnv("REDIS_ADDR", "localhost:6379"),
			Password: getEnv("REDIS_PASSWORD", ""),
			DB:       getEnvInt("REDIS_DB", 0),
		},

		Razorpay: RazorpayConfig{
			KeyID:         getEnv("RAZORPAY_KEY_ID", ""),
			KeySecret:     getEnv("RAZORPAY_KEY_SECRET", ""),
			WebhookSecret: getEnv("RAZORPAY_WEBHOOK_SECRET", ""),
		},

		Cloudinary: CloudinaryConfig{
			CloudURL: getEnv("CLOUDINARY_URL", ""),
		},
	}

	
	if env == "production" {
		if cfg.JWT.Secret == "" {
			panic("JWT_SECRET is required in production")
		}
		if cfg.Razorpay.KeyID == "" || cfg.Razorpay.KeySecret == "" {
			panic("Razorpay keys required in production")
		}
	}

	return cfg
}


// HELPERS

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	if val := os.Getenv(key); val != "" {
		if num, err := strconv.Atoi(val); err == nil {
			return num
		}
	}
	return fallback
}