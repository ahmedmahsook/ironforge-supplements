import { useEffect, useState } from "react";
import api from "../../api/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { data: usersData } = await api.get("/users");
      setUsers(usersData);

      const allOrders = usersData.flatMap((user) =>
        (user.orders || []).map((order) => ({
          ...order,
          userId: user.id,
          username: user.username,
        }))
      );

      setOrders(allOrders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId, userId, newStatus) {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const updatedOrders = user.orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );

    try {
      await api.patch(`/users/${userId}`, {
        orders: updatedOrders,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  }

  if (loading) {
    return <p className="text-gray-400">Loading orders...</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-wide text-white">
        Orders
      </h1>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-300 text-sm">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">User</th>
              <th className="p-4">Total</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t border-gray-800 hover:bg-gray-800/40 transition"
              >
                <td className="p-4 text-white font-medium">
                  {order.id}
                </td>

                <td className="p-4 text-gray-400">
                  {order.username}
                </td>

                <td className="p-4 text-green-400 font-semibold">
                  ₹{order.total}
                </td>

                <td className="p-4 text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4">
                  {/* 🔥 STATUS LOGIC */}
                  {order.status === "cancelled" ? (
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                      Cancelled
                    </span>
                  ) : order.status === "delivered" ? (
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                      Delivered
                    </span>
                  ) : (
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(
                          order.id,
                          order.userId,
                          e.target.value
                        )
                      }
                      className="
                        bg-black
                        border border-gray-700
                        text-white
                        px-3 py-2
                        rounded-md
                        text-sm
                        focus:outline-none
                        focus:ring-2
                        focus:ring-green-500
                      "
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center text-gray-500"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
