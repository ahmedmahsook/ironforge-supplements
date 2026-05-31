package services

import (
	"errors"

	"gym-backend/internal/models/contracts"
	"gym-backend/internal/models/dto"
	"gym-backend/internal/models/entities"

	"github.com/google/uuid"
)

type AdminService struct {
	userRepo    contracts.UserRepository
	productRepo contracts.ProductRepository
	orderRepo   contracts.OrderRepository
}

func NewAdminService(
	userRepo contracts.UserRepository,
	productRepo contracts.ProductRepository,
	orderRepo contracts.OrderRepository,
) *AdminService {

	return &AdminService{
		userRepo:    userRepo,
		productRepo: productRepo,
		orderRepo:   orderRepo,
	}
}

//
// ======================
// DASHBOARD
// ======================
//

func (s *AdminService) GetDashboard() (*dto.AdminDashboardResponse, error) {

	users, err := s.userRepo.CountUsers()
	if err != nil {
		return nil, err
	}

	products, err := s.productRepo.CountProducts()
	if err != nil {
		return nil, err
	}

	orders, err := s.orderRepo.CountOrders()
	if err != nil {
		return nil, err
	}

	revenue, err := s.orderRepo.GetTotalRevenue()
	if err != nil {
		return nil, err
	}

	pending, err := s.orderRepo.CountPendingOrders()
	if err != nil {
		return nil, err
	}

	recentOrders, err := s.orderRepo.GetRecentOrders(5)
	if err != nil {
		return nil, err
	}

	return &dto.AdminDashboardResponse{
		TotalUsers:    users,
		TotalProducts: products,
		TotalOrders:   orders,
		TotalRevenue:  revenue,
		PendingOrders: pending,
		RecentOrders:  dto.ToOrderList(recentOrders),
	}, nil
}

//
// ======================
// ORDERS
// ======================
//

// GET ALL ORDERS
func (s *AdminService) GetAllOrders(
	page int,
	limit int,
	status string,
	paymentStatus string,
	paymentMethod string,
) ([]entities.Order, int64, error) {

	return s.orderRepo.GetFilteredOrders(
		page,
		limit,
		status,
		paymentStatus,
		paymentMethod,
	)
}

// UPDATE ORDER STATUS
func (s *AdminService) UpdateOrderStatus(
	orderID uint,
	status string,
) error {

	order, err := s.orderRepo.GetByID(orderID)
	if err != nil {
		return err
	}

	if order == nil {
		return errors.New("order not found")
	}

	// Prevent updates

	if order.Status == "delivered" {
		return errors.New(
			"cannot update delivered order",
		)
	}

	if order.Status == "cancelled" {
		return errors.New(
			"cannot update cancelled order",
		)
	}

	// Allowed statuses

	validStatuses := map[string]bool{
		"pending":   true,
		"confirmed": true,
		"shipped":   true,
		"delivered": true,
		"cancelled": true,
	}

	if !validStatuses[status] {
		return errors.New("invalid status")
	}

	return s.orderRepo.UpdateStatus(
		orderID,
		status,
	)
}

//
// ======================
// USERS
// ======================
//

func (s *AdminService) GetAllUsers(
	page int,
	limit int,
	search string,
) ([]entities.User, int64, error) {

	return s.userRepo.GetAllUsers(
		page,
		limit,
		search,
	)
}

func (s *AdminService) BlockUser(
	userID uuid.UUID,
) error {

	return s.userRepo.UpdateStatus(
		userID,
		true,
	)
}

func (s *AdminService) UnblockUser(
	userID uuid.UUID,
) error {

	return s.userRepo.UpdateStatus(
		userID,
		false,
	)
}