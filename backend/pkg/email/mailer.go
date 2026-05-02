package email

import (
	"fmt"
	"net/smtp"
	"os"
)

func SendOTP(to, otp string) error {
	host := os.Getenv("SMTP_HOST")
	port := os.Getenv("SMTP_PORT")
	from := os.Getenv("SMTP_EMAIL")
	password := os.Getenv("SMTP_PASSWORD")

	// basic RFC headers
	msg := []byte(
		"From: " + from + "\r\n" +
			"To: " + to + "\r\n" +
			"Subject: Your OTP\r\n" +
			"MIME-Version: 1.0\r\n" +
			"Content-Type: text/plain; charset=UTF-8\r\n\r\n" +
			"Your OTP is: " + otp + "\nIt expires in 5 minutes.",
	)

	auth := smtp.PlainAuth("", from, password, host)

	err := smtp.SendMail(host+":"+port, auth, from, []string{to}, msg)
	if err != nil {
		return err
	}

	fmt.Println("OTP sent to:", to)
	return nil
}
