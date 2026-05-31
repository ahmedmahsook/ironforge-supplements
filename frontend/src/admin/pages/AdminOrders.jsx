
import { useEffect, useState } from "react";

import api from "../../api/api";

import toast from "react-hot-toast";

export default function AdminOrders() {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [status, setStatus] = useState("");

  const [paymentStatus, setPaymentStatus] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("");

  const limit = 10;

  useEffect(() => {
    fetchOrders();
  }, [
    page,
    status,
    paymentStatus,
    paymentMethod,
  ]);

  /* ================= FETCH ================= */

  async function fetchOrders() {

    try {

      setLoading(true);

      const res = await api.get(
        `/admin/orders?page=${page}&limit=${limit}&status=${status}&payment_status=${paymentStatus}&payment_method=${paymentMethod}`
      );

      console.log(res.data.data);

      setOrders(res.data.data || []);

      setTotalPages(
        res.data.total_pages || 1
      );

    } catch (err) {

      console.error(
        "Failed to fetch orders",
        err
      );

      toast.error(
        "Failed to load orders"
      );

    } finally {

      setLoading(false);
    }
  }

  /* ================= UPDATE STATUS ================= */

  async function updateStatus(
    orderId,
    newStatus
  ) {

    try {

     await api.patch(
  `/admin/orders/${orderId}/status`,
  {
    status: newStatus,
  }
);

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );

      toast.success(
        "Order updated"
      );

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to update status"
      );
    }
  }

  /* ================= LOADING ================= */

  if (loading) {

    return (
      <p className="text-gray-400">
        Loading orders...
      </p>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>

        <h1 className="text-3xl font-bold text-white">
          Orders
        </h1>

        <p className="text-gray-500 mt-1">
          Manage customer orders
        </p>

      </div>

      {/* FILTERS */}

      <div className="flex flex-wrap gap-4">

        {/* STATUS */}

        <select
          value={status}
          onChange={(e) => {

            setStatus(
              e.target.value
            );

            setPage(1);

          }}
          className="
            bg-black
            border border-zinc-800

            text-white

            px-4 py-3
            rounded-xl
          "
        >

          <option value="">
            All Status
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="confirmed">
            Confirmed
          </option>

          <option value="shipped">
            Shipped
          </option>

          <option value="delivered">
            Delivered
          </option>

          <option value="cancelled">
            Cancelled
          </option>

        </select>

        {/* PAYMENT STATUS */}

        <select
          value={paymentStatus}
          onChange={(e) => {

            setPaymentStatus(
              e.target.value
            );

            setPage(1);

          }}
          className="
            bg-black
            border border-zinc-800

            text-white

            px-4 py-3
            rounded-xl
          "
        >

          <option value="">
            Payment Status
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="paid">
            Paid
          </option>

          <option value="failed">
            Failed
          </option>

        </select>

        {/* PAYMENT METHOD */}

        <select
          value={paymentMethod}
          onChange={(e) => {

            setPaymentMethod(
              e.target.value
            );

            setPage(1);

          }}
          className="
            bg-black
            border border-zinc-800

            text-white

            px-4 py-3
            rounded-xl
          "
        >

          <option value="">
            Payment Method
          </option>

          <option value="cod">
            COD
          </option>

          <option value="razorpay">
            Razorpay
          </option>

        </select>

      </div>

      {/* TABLE */}

      <div
        className="
          bg-[#141414]
          border border-zinc-800
          rounded-2xl
          overflow-hidden
        "
      >

        <table className="w-full text-left">

          {/* HEAD */}

          <thead
            className="
              bg-[#181818]
              text-gray-400
              text-sm
            "
          >

            <tr>

              <th className="p-4">
                Order ID
              </th>

              <th className="p-4">
                Customer
              </th>

              <th className="p-4">
                Total
              </th>

              <th className="p-4">
                Payment
              </th>

              <th className="p-4">
                Date
              </th>

              <th className="p-4">
                Status
              </th>

            </tr>

          </thead>

          {/* BODY */}

          <tbody>

            {orders.map((order) => {

              console.log(order);

              return (

                <tr
                  key={order.id}
                  className="
                    border-t border-zinc-800

                    hover:bg-[#1a1a1a]

                    transition
                  "
                >

                  {/* ID */}

                  <td className="p-4 text-white font-medium">
                    #{order.id}
                  </td>

                  {/* USER */}

                  <td className="p-4">

                    <div>

                      <p className="text-white">
                        {order.user_name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {order.user_email}
                      </p>

                    </div>

                  </td>

                  {/* TOTAL */}

                  <td
                    className="
                      p-4
                      text-green-400
                      font-semibold
                    "
                  >
                    ₹{order.total_amount}
                  </td>

                  {/* PAYMENT */}

                  <td className="p-4">

                    <div className="space-y-1">

                      <p className="text-white capitalize">
                        {order.payment_method}
                      </p>

                      <p
                        className={`
                          text-xs

                          ${
                            order.payment_status ===
                            "paid"
                              ? "text-green-400"
                              : "text-yellow-400"
                          }
                        `}
                      >
                        {order.payment_status}
                      </p>

                    </div>

                  </td>

                  {/* DATE */}

                  <td className="p-4 text-gray-400">

                    {order.createdAt ? (

                      <div className="space-y-1">

                        <p className="text-sm text-white/70">
                          {new Date(
                            order.createdAt
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>

                        <p className="text-xs text-gray-500">
                          {new Date(
                            order.createdAt
                          ).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>

                      </div>

                    ) : (

                      <span className="text-red-400">
                        Missing from API
                      </span>

                    )}

                  </td>

                  {/* STATUS */}

                  <td className="p-4">

                    {order.status ===
                    "cancelled" ? (

                      <span
                        className="
                          inline-flex

                          px-3 py-1

                          rounded-full

                          text-xs
                          font-medium

                          bg-red-500/10
                          text-red-400
                        "
                      >
                        Cancelled
                      </span>

                    ) : order.status ===
                      "delivered" ? (

                      <span
                        className="
                          inline-flex

                          px-3 py-1

                          rounded-full

                          text-xs
                          font-medium

                          bg-green-500/10
                          text-green-400
                        "
                      >
                        Delivered
                      </span>

                    ) : (

                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(
                            order.id,
                            e.target.value
                          )
                        }
                        className="
                          bg-black
                          border border-zinc-700

                          text-white

                          px-3 py-2
                          rounded-lg

                          text-sm
                        "
                      >

                        <option value="pending">
                          Pending
                        </option>

                        <option value="confirmed">
                          Confirmed
                        </option>

                        <option value="shipped">
                          Shipped
                        </option>

                        <option value="delivered">
                          Delivered
                        </option>

                        <option value="cancelled">
                          Cancelled
                        </option>

                      </select>

                    )}

                  </td>

                </tr>
              );
            })}

            {/* EMPTY */}

            {orders.length === 0 && (

              <tr>

                <td
                  colSpan="6"
                  className="
                    p-8
                    text-center
                    text-gray-500
                  "
                >
                  No orders found
                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}

      <div className="flex items-center justify-between">

        <button
          disabled={page === 1}
          onClick={() =>
            setPage((prev) => prev - 1)
          }
          className="
            px-4 py-2
            rounded-lg

            bg-zinc-800
            text-white

            disabled:opacity-50
          "
        >
          Previous
        </button>

        <p className="text-gray-400">
          Page {page} of {totalPages}
        </p>

        <button
          disabled={
            page === totalPages
          }
          onClick={() =>
            setPage((prev) => prev + 1)
          }
          className="
            px-4 py-2
            rounded-lg

            bg-zinc-800
            text-white

            disabled:opacity-50
          "
        >
          Next
        </button>

      </div>

    </div>
  );
}

