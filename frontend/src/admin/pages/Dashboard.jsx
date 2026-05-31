import { useEffect, useState } from "react";

import api from "../../api/api";

import RevenueChart from "../charts/RevenueChart";
import OrderStatusChart from "../charts/OrderStatusChart";

import {
  Users,
  Package,
  ShoppingCart,
  IndianRupee,
} from "lucide-react";

export default function AdminDashboard() {

  const [stats, setStats] = useState(null);

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchDashboard() {

      try {

        const [
          statsRes,
          ordersRes,
        ] = await Promise.all([
          api.get("/admin/dashboard"),
          api.get("/admin/orders"),
        ]);

        setStats(statsRes.data);

        setOrders(
          ordersRes.data.data || []
        );

      } catch (err) {

        console.error(
          "Dashboard fetch failed",
          err
        );

      } finally {

        setLoading(false);
      }
    }

    fetchDashboard();

  }, []);

  /* ================= LOADING ================= */

  if (loading) {

    return (
      <div className="text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>

        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Monitor platform activity and performance
        </p>

      </div>

      {/* STATS */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >

        <StatCard
          title="Users"
          value={stats?.total_users || 0}
          icon={<Users size={20} />}
        />

        <StatCard
          title="Products"
          value={stats?.total_products || 0}
          icon={<Package size={20} />}
        />

        <StatCard
          title="Orders"
          value={stats?.total_orders || 0}
          icon={<ShoppingCart size={20} />}
        />

        <StatCard
          title="Revenue"
          value={`₹${stats?.total_revenue || 0}`}
          icon={<IndianRupee size={20} />}
        />

      </div>

      {/* CHARTS */}

      <div className="grid xl:grid-cols-2 gap-6">

        <RevenueChart orders={orders} />

        <OrderStatusChart orders={orders} />

      </div>

      {/* RECENT ORDERS */}

      <div
        className="
          bg-[#141414]
          border border-zinc-800
          rounded-2xl
          p-6
        "
      >

        <div className="mb-6">

          <h2 className="text-xl font-semibold text-white">
            Recent Orders
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Latest customer purchases
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>

              <tr
                className="
                  border-b border-zinc-800
                  text-left
                "
              >

                <th className="pb-4 text-gray-500 font-medium">
                  Order ID
                </th>

                <th className="pb-4 text-gray-500 font-medium">
                  Customer
                </th>

                <th className="pb-4 text-gray-500 font-medium">
                  Payment
                </th>

                <th className="pb-4 text-gray-500 font-medium">
                  Status
                </th>

                <th className="pb-4 text-gray-500 font-medium">
                  Total
                </th>

              </tr>

            </thead>

            <tbody>

              {orders
                .slice(0, 6)
                .map((order) => (

                  <tr
                    key={order.id}
                    className="
                      border-b border-zinc-900
                    "
                  >

                    {/* ORDER ID */}

                    <td className="py-4 text-white">
                      #{order.id}
                    </td>

                    {/* CUSTOMER */}

                    <td className="py-4">

                      <div>

                        <p className="text-white">
                          {order.user_name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {order.user_email}
                        </p>

                      </div>

                    </td>

                    {/* PAYMENT */}

                    <td className="py-4">

                      <span
                        className={`
                          px-3 py-1
                          rounded-full
                          text-xs font-medium

                          ${
                            order.payment_status === "paid"
                              ? `
                                bg-green-500/10
                                text-green-400
                              `
                              : `
                                bg-yellow-500/10
                                text-yellow-400
                              `
                          }
                        `}
                      >
                        {order.payment_status}
                      </span>

                    </td>

                    {/* STATUS */}

                    <td className="py-4">

                      <span
                        className={`
                          px-3 py-1
                          rounded-full
                          text-xs font-medium

                          ${
                            order.status === "delivered"

                              ? `
                                bg-green-500/10
                                text-green-400
                              `

                              : order.status === "shipped"

                              ? `
                                bg-blue-500/10
                                text-blue-400
                              `

                              : order.status === "cancelled"

                              ? `
                                bg-red-500/10
                                text-red-400
                              `

                              : `
                                bg-yellow-500/10
                                text-yellow-400
                              `
                          }
                        `}
                      >
                        {order.status}
                      </span>

                    </td>

                    {/* TOTAL */}

                    <td
                      className="
                        py-4
                        text-white
                        font-medium
                      "
                    >
                      ₹{order.total_amount}
                    </td>

                  </tr>
                ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  title,
  value,
  icon,
}) {

  return (
    <div
      className="
        bg-[#141414]
        border border-zinc-800
        rounded-2xl
        p-6
      "
    >

      <div className="flex items-center justify-between mb-5">

        <div
          className="
            w-11 h-11
            rounded-xl

            bg-green-500/10
            border border-green-500/20

            flex items-center justify-center

            text-green-400
          "
        >
          {icon}
        </div>

      </div>

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h3 className="text-3xl font-bold text-white mt-2">
        {value}
      </h3>

    </div>
  );
}