import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import api from "../api/api";

import PageContainer from "../components/layout/PageContainer";

export default function Checkout() {
  const navigate = useNavigate();

  const {
    cart = [],
    clearCart,
    totalPrice = 0,
  } = useCart();

  const { user } = useAuth();

  const [address, setAddress] =
    useState({
      name: "",
      phone: "",
      house_name: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
    });

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("cod");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* ================= AUTH ================= */

  if (!user) {
    navigate("/login", {
      state: {
        from: "/checkout",
      },
    });

    return null;
  }

  /* ================= EMPTY CART ================= */

  if (cart.length === 0) {
    return (
      <PageContainer>
        <p className="text-center py-32 text-gray-400">
          Your cart is empty
        </p>
      </PageContainer>
    );
  }

  /* ================= INPUT ================= */

  const handleChange = (e) => {
    setAddress({
      ...address,

      [e.target.name]:
        e.target.value,
    });
  };

  /* ================= PLACE ORDER ================= */

  const handlePlaceOrder =
    async () => {
      if (
        !address.name ||
        !address.phone ||
        !address.house_name ||
        !address.street ||
        !address.city ||
        !address.state ||
        !address.pincode
      ) {
        setError(
          "Fill all fields"
        );

        return;
      }

      setLoading(true);

      setError("");

      try {
        const { data } =
          await api.post(
            "/orders",
            {
              payment_method:
                paymentMethod,

              name:
                address.name,

              phone:
                address.phone,

              house_name:
                address.house_name,

              street:
                address.street,

              city:
                address.city,

              state:
                address.state,

              pincode:
                address.pincode,
            }
          );

        /* ================= COD ================= */

        if (
          paymentMethod === "cod"
        ) {
          await clearCart();

          navigate(
            "/order-success"
          );

          return;
        }

        /* ================= RAZORPAY ================= */

        const options = {
         key: "rzp_test_SjLBPQRolOyB8r",

          amount:
            data.total_amount *
            100,

          currency: "INR",

          name: "IronForge",

          description:
            "Order Payment",

          order_id:
            data.payment_id,

          handler:
            async function (
              response
            ) {

              console.log(
                "RAZORPAY SUCCESS",
                response
              );

              try {

                const verifyRes =
                  await api.post(
                    "/payments/verify",
                    {
                      razorpay_order_id:
                        response.razorpay_order_id,

                      razorpay_payment_id:
                        response.razorpay_payment_id,

                      razorpay_signature:
                        response.razorpay_signature,
                    }
                  );

                console.log(
                  "VERIFY RESPONSE",
                  verifyRes.data
                );

                await clearCart();

                navigate(
                  "/order-success"
                );

              } catch (err) {

                console.error(
                  "VERIFY ERROR",
                  err.response?.data ||
                    err
                );

                setError(
                  err.response?.data
                    ?.error ||
                    "Payment verification failed"
                );
              }
            },

          prefill: {
            name:
              address.name,

            contact:
              address.phone,

            email:
              user.email,
          },

          theme: {
            color:
              "#22c55e",
          },
        };

        console.log(
          "RAZORPAY OPTIONS",
          options
        );

        const razor =
          new window.Razorpay(
            options
          );

        razor.open();

      } catch (err) {

        console.error(
          "ORDER ERROR",
          err.response?.data ||
            err
        );

        setError(
          err.response?.data
            ?.error ||
            "Order failed"
        );

      } finally {
        setLoading(false);
      }
    };

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto py-14">
        {/* HEADER */}

        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-white">
            Checkout
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Enter details and
            complete your
            purchase
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <p className="text-red-400 mb-6">
            {error}
          </p>
        )}

        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-14">

          {/* LEFT */}

          <div className="space-y-12">

            {/* ADDRESS */}

            <div>
              <h2 className="text-lg font-semibold text-white mb-5">
                Shipping Address
              </h2>

              <div className="grid md:grid-cols-2 gap-4">

                {[
                  {
                    key: "name",
                    label:
                      "Full Name",
                  },

                  {
                    key: "phone",
                    label:
                      "Phone Number",
                  },

                  {
                    key:
                      "house_name",
                    label:
                      "House Name",
                  },

                  {
                    key: "street",
                    label:
                      "Street Address",
                  },

                  {
                    key: "city",
                    label: "City",
                  },

                  {
                    key: "state",
                    label: "State",
                  },

                  {
                    key:
                      "pincode",
                    label:
                      "Pincode",
                  },
                ].map(
                  ({
                    key,
                    label,
                  }) => (
                    <input
                      key={key}
                      name={key}
                      value={
                        address[
                          key
                        ]
                      }
                      onChange={
                        handleChange
                      }
                      placeholder={
                        label
                      }
                      className="
                        px-4 py-3 rounded-lg
                        bg-[#111]
                        border border-zinc-800
                        text-white
                        focus:outline-none
                        focus:border-green-500
                      "
                    />
                  )
                )}
              </div>
            </div>

            {/* PAYMENT */}

            <div>
              <h2 className="text-lg font-semibold text-white mb-5">
                Payment Method
              </h2>

              <div className="grid gap-4">

                {/* COD */}

                <div
                  onClick={() =>
                    setPaymentMethod(
                      "cod"
                    )
                  }
                  className={`
                    p-4 rounded-xl cursor-pointer border transition
                    ${
                      paymentMethod ===
                      "cod"
                        ? "border-green-500 bg-green-500/10"
                        : "border-zinc-800 hover:border-zinc-600"
                    }
                  `}
                >
                  <p className="text-white font-medium">
                    Cash on Delivery
                  </p>

                  <p className="text-gray-400 text-sm">
                    Pay when product arrives
                  </p>
                </div>

                {/* RAZORPAY */}

                <div
                  onClick={() =>
                    setPaymentMethod(
                      "razorpay"
                    )
                  }
                  className={`
                    p-4 rounded-xl cursor-pointer border transition
                    ${
                      paymentMethod ===
                      "razorpay"
                        ? "border-green-500 bg-green-500/10"
                        : "border-zinc-800 hover:border-zinc-600"
                    }
                  `}
                >
                  <p className="text-white font-medium">
                    Online Payment
                  </p>

                  <p className="text-gray-400 text-sm">
                    Razorpay / UPI / Card
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="sticky top-24 h-fit">

            <div
              className="
                bg-[#0f0f0f]
                border border-zinc-800
                rounded-xl
                p-6
                space-y-6
              "
            >

              <h2 className="text-lg font-semibold text-white">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">

                {cart.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-gray-400"
                    >
                      <span>
                        {item.name} ×{" "}
                        {
                          item.quantity
                        }
                      </span>

                      <span className="text-white">
                        ₹
                        {item.price *
                          item.quantity}
                      </span>
                    </div>
                  )
                )}

              </div>

              <div className="border-t border-zinc-800"></div>

              <div className="flex justify-between items-center">
                <span className="text-white">
                  Total
                </span>

                <span className="text-xl font-bold text-green-400">
                  ₹
                  {totalPrice}
                </span>
              </div>

              <button
                onClick={
                  handlePlaceOrder
                }
                disabled={loading}
                className="
                  w-full h-12
                  bg-green-500 text-black
                  rounded-lg
                  font-semibold
                  hover:bg-green-400
                  active:scale-[0.98]
                  transition
                "
              >
                {loading
                  ? "Processing..."
                  : "Place Order"}
              </button>

            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}