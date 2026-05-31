
import { useEffect, useState } from "react";

import {
  ChevronDown,
  ChevronUp,
  XCircle,
  Package,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import PageContainer from "../components/layout/PageContainer";

import api from "../api/api";

import toast from "react-hot-toast";

const CANCELLABLE_STATUSES = [
  "pending",
  "confirmed",
];

const STATUS_CONFIG = {
  delivered: {
    label: "Delivered",
    className:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },

  shipped: {
    label: "Shipped",
    className:
      "bg-sky-500/10 text-sky-400 border-sky-500/20",
  },

  confirmed: {
    label: "Confirmed",
    className:
      "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },

  cancelled: {
    label: "Cancelled",
    className:
      "bg-red-500/10 text-red-400 border-red-500/20",
  },

  pending: {
    label: "Pending",
    className:
      "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
};

function StatusBadge({
  status,
}) {

  const {
    label,
    className,
  } =
    STATUS_CONFIG[status] ??
    STATUS_CONFIG.pending;

  return (

    <span
      className={`
        inline-flex
        items-center
        px-2.5
        py-1
        rounded-md
        text-xs
        font-medium
        border
        ${className}
      `}
    >

      {label}

    </span>

  );
}

export default function Orders() {

  const { user } = useAuth();

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    openOrderId,
    setOpenOrderId,
  ] = useState(null);

  useEffect(() => {

    if (!user) return;

    async function fetchOrders() {

      try {

        const { data } =
          await api.get("/orders");

        setOrders(data || []);

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

    fetchOrders();

  }, [user]);

  async function cancelOrder(
    orderId
  ) {

    const toastId =
      toast.loading(
        "Cancelling order..."
      );

    try {

      await api.patch(
        `/orders/${orderId}/cancel`
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status:
                  "cancelled",
              }
            : order
        )
      );

      toast.success(
        "Order cancelled successfully",
        {
          id: toastId,
        }
      );

    } catch (err) {

      console.error(
        "Cancel error:",
        err.response?.data || err
      );

      toast.error(
        err.response?.data?.error ||
          "Failed to cancel order",
        {
          id: toastId,
        }
      );

    }

  }

  if (loading) {

    return (

      <PageContainer>

        <div className="space-y-3 mt-8">

          {[...Array(3)].map(
            (_, i) => (

              <div
                key={i}
                className="
                  rounded-xl
                  border
                  border-[#232323]
                  overflow-hidden
                  animate-pulse
                "
              >

                <div className="h-14 bg-[#161616]" />

                <div className="h-px bg-[#232323]" />

                <div className="h-16 bg-[#131313]" />

                <div className="h-px bg-[#232323]" />

                <div className="h-11 bg-[#111111]" />

              </div>

            )
          )}

        </div>

      </PageContainer>

    );

  }

  if (orders.length === 0) {

    return (

      <PageContainer>

        <div
          className="
            mt-8
            rounded-xl
            border
            border-[#232323]
            bg-[#131313]
            flex
            flex-col
            items-center
            justify-center
            py-20
            text-center
          "
        >

          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-[#1e1e1e]
              border
              border-[#2a2a2a]
              flex
              items-center
              justify-center
              mb-4
            "
          >

            <Package
              size={18}
              className="text-white/20"
              strokeWidth={1.5}
            />

          </div>

          <p
            className="
              text-sm
              font-medium
              text-white/40
            "
          >
            No orders yet
          </p>

        </div>

      </PageContainer>

    );

  }

  return (

    <PageContainer>

      <div
        className="
          flex
          items-center
          justify-between
          mb-6
        "
      >

        <div>

          <h1
            className="
              text-lg
              font-semibold
              text-white
              tracking-tight
            "
          >
            Orders
          </h1>

          <p
            className="
              text-xs
              text-white/30
              mt-0.5
            "
          >

            {orders.length} order
            {orders.length !== 1
              ? "s"
              : ""}

          </p>

        </div>

      </div>

      <div className="space-y-3">

        {[...orders]
          .reverse()
          .map((order) => {

            const isOpen =
              openOrderId ===
              order.id;

            const canCancel =
              CANCELLABLE_STATUSES.includes(
                order.status
              );

            const totalItems =
              order.items.reduce(
                (sum, item) =>
                  sum +
                  item.quantity,
                0
              );

            return (

              <div
                key={order.id}
                className="
                  rounded-xl
                  border
                  border-[#232323]
                  bg-[#131313]
                  overflow-hidden
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    px-5
                    py-3.5
                    bg-[#161616]
                    border-b
                    border-[#232323]
                  "
                >

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-white/80
                      font-mono
                    "
                  >
                    Order #{order.id}
                  </p>

                  <StatusBadge
                    status={
                      order.status
                    }
                  />

                </div>

                <div
                  className="
                    grid
                    grid-cols-2
                    sm:grid-cols-4
                    gap-px
                    bg-[#1e1e1e]
                    border-b
                    border-[#232323]
                  "
                >

                  <div className="bg-[#131313] px-5 py-4">

                    <p className="text-[11px] text-white/30 mb-1">
                      Total
                    </p>

                    <p className="text-base font-bold text-white">
                      ₹{order.total_amount}
                    </p>

                  </div>

                  <div className="bg-[#131313] px-5 py-4">

                    <p className="text-[11px] text-white/30 mb-1">
                      Payment method
                    </p>

                    <p className="text-sm text-white/65 capitalize">
                      {order.payment_method}
                    </p>

                  </div>

                  <div className="bg-[#131313] px-5 py-4">

                    <p className="text-[11px] text-white/30 mb-1">
                      Payment status
                    </p>

                    <p className="text-sm text-white/65 capitalize">
                      {order.payment_status}
                    </p>

                  </div>

                  <div className="bg-[#131313] px-5 py-4">

                    <p className="text-[11px] text-white/30 mb-1">
                      Items
                    </p>

                    <p className="text-sm text-white/65">
                      {totalItems} items
                    </p>

                  </div>

                </div>

                {isOpen && (

                  <div>

                    {order.items.map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          key={index}
                          className="
                            flex
                            items-center
                            justify-between
                            px-5
                            py-3
                            border-b
                            border-[#1e1e1e]
                          "
                        >

                          <div>

                            <p className="text-sm text-white/70">
                              {item.name}
                            </p>

                            <p className="text-xs text-white/30 mt-1">
                              Qty: {item.quantity}
                            </p>

                          </div>

                          <p className="text-sm text-white/60">
                            ₹{item.total}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                )}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    px-5
                    py-2.5
                    bg-[#111111]
                  "
                >

                  <div>

                    {canCancel && (

                      <button
                        onClick={() =>
                          cancelOrder(
                            order.id
                          )
                        }
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          text-xs
                          text-red-400
                          hover:text-red-300
                        "
                      >

                        <XCircle
                          size={13}
                        />

                        Cancel order

                      </button>

                    )}

                  </div>

                  <button
                    onClick={() =>
                      setOpenOrderId(
                        isOpen
                          ? null
                          : order.id
                      )
                    }
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      text-xs
                      text-white/35
                    "
                  >

                    {isOpen
                      ? "Hide items"
                      : "View items"}

                    {isOpen ? (

                      <ChevronUp
                        size={13}
                      />

                    ) : (

                      <ChevronDown
                        size={13}
                      />

                    )}

                  </button>

                </div>

              </div>

            );

          })}

      </div>

    </PageContainer>

  );
}

