package logger

import (
	"os"

	"github.com/sirupsen/logrus"
)

var Log = logrus.New()

func Init() {
	// Set output (console)
	Log.SetOutput(os.Stdout)

	//  Set format (JSON for production, Text for dev)
	Log.SetFormatter(&logrus.JSONFormatter{})

	// Set log level
	Log.SetLevel(logrus.InfoLevel)
}