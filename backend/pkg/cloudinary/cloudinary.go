package cloudinary

import (
	"context"
	"errors"
	"mime/multipart"


	cld "github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

var client *cld.Cloudinary

// INIT

func Init(cloudURL string) error {
	if cloudURL == "" {
		return errors.New("cloudinary URL is empty")
	}

	var err error
	client, err = cld.NewFromURL(cloudURL)
	if err != nil {
		return err
	}

	return nil
}


// UPLOAD FROM FILE

func UploadFile(file *multipart.FileHeader) (string, error) {
	if client == nil {
		return "", errors.New("cloudinary not initialized")
	}

	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	res, err := client.Upload.Upload(
		context.Background(),
		src,
		uploader.UploadParams{
			Folder: "gym/products", // optional folder
		},
	)
	if err != nil {
		return "", err
	}

	return res.SecureURL, nil
}

// =====================
// UPLOAD FROM URL
// =====================
func UploadFromURL(imageURL string) (string, error) {

	if client == nil {
		return "", errors.New("cloudinary not initialized")
	}

	res, err := client.Upload.Upload(
		context.Background(),
		imageURL,
		uploader.UploadParams{
			Folder: "gym/products",
		},
	)

	if err != nil {
		return "", err
	}

	if res == nil || res.SecureURL == "" {
		return "", errors.New("upload failed: empty response from cloudinary")
	}

	return res.SecureURL, nil
}