package user

import (
	"agora/src/app/database"
	"agora/src/app/item"
	"github.com/gorilla/sessions"
	"net/http"

	log "github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func PreloadSafeSellerInfo(db *gorm.DB) *gorm.DB {
	return db.Preload("Seller", func(tx *gorm.DB) *gorm.DB {
		return tx.Select("id", "first_name", "last_name", "email")
	})
}

func PopulateUser(user *database.User, r *http.Request) error {
	user.FirstName = r.FormValue("first_name")
	user.LastName = r.FormValue("last_name")
	user.Email = r.FormValue("email")
	hash, err := HashPassword(r.FormValue("pword"))
	if err != nil {
		log.WithError(err).Error("Failed to hash passcode.")
		return err
	} else {
		user.Pword = hash
	}

	user.Bio = r.FormValue("bio")

	if image_location, err := item.ProcessImage(r); err != nil {
		log.WithError(err).Error("Failed to process user image.")
		return err
	} else {
		user.Image = image_location
	}
	return nil
}

func GetAuthorizedUserId(store *sessions.CookieStore, r *http.Request) (uint32, error) {
	userId := uint32(0)
	session, err := store.Get(r, "user-auth")
	if err != nil {
		return userId, err
	}

	switch val := session.Values["id"].(type) {
	case uint32:
		userId = val
	case int:
		userId = uint32(val)
	}

	return userId, nil
}
