package dto

type AdminDashboardResponse struct {
	TotalUsers    int64           `json:"total_users"`
	TotalProducts int64           `json:"total_products"`
	TotalOrders   int64           `json:"total_orders"`
	TotalRevenue  int64           `json:"total_revenue"`
	PendingOrders int64           `json:"pending_orders"`
	RecentOrders  []OrderResponse `json:"recent_orders"`
}