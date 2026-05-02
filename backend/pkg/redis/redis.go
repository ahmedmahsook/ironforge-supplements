package redis

import (
	"context"
	"log"

	"gym-backend/internal/infrastructure/config"

	goredis "github.com/redis/go-redis/v9"
)

var Ctx = context.Background()

type Redis struct {
	Client *goredis.Client
}

// use config
func NewRedis(cfg config.RedisConfig) *Redis {

	client := goredis.NewClient(&goredis.Options{
		Addr:     cfg.Addr,
		Password: cfg.Password,
		DB:       cfg.DB,
	})

	// check connection
	_, err := client.Ping(Ctx).Result()
	if err != nil {
		log.Fatal("❌ Redis not connected:", err)
	}

	log.Println("✅ Redis connected")

	return &Redis{Client: client}
}