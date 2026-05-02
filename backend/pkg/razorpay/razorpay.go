package razorpay

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"errors"

	"github.com/razorpay/razorpay-go"
)

type RazorpayClient struct {
	Client    *razorpay.Client
	KeyID     string
	KeySecret string
}


// CONSTRUCTOR

func NewRazorpayClient(key, secret string) *RazorpayClient {
	return &RazorpayClient{
		Client:    razorpay.NewClient(key, secret),
		KeyID:     key,
		KeySecret: secret,
	}
}


// CREATE ORDER

func (r *RazorpayClient) CreateOrder(amount int) (map[string]interface{}, error) {

	if amount <= 0 {
		return nil, errors.New("invalid amount")
	}

	data := map[string]interface{}{
		"amount":   amount * 100, 
		"currency": "INR",
		"receipt":  "order_receipt",
	}

	order, err := r.Client.Order.Create(data, nil)
	if err != nil {
		return nil, err
	}

	return order, nil
}


// VERIFY SIGNATURE 

func (r *RazorpayClient) VerifySignature(
	razorpayOrderID string,
	razorpayPaymentID string,
	razorpaySignature string,
) error {

	// create payload
	payload := razorpayOrderID + "|" + razorpayPaymentID

	// create HMAC SHA256 hash
	h := hmac.New(sha256.New, []byte(r.KeySecret))
	h.Write([]byte(payload))
	expectedSignature := hex.EncodeToString(h.Sum(nil))

	// compare signatures
	if expectedSignature != razorpaySignature {
		return errors.New("invalid payment signature")
	}

	return nil
}