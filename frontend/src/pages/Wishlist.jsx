import { Link } from "react-router-dom";

import { useWishlist } from "../context/WishlistContext";

import PageContainer from "../components/layout/PageContainer";

export default function Wishlist() {
  const {
    wishlist,
    moveToCart,
    removeFromWishlist,
  } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <PageContainer>
        <div className="py-32 text-center space-y-3">
          <h2 className="text-2xl font-semibold text-white">
            Your wishlist is empty
          </h2>

          <p className="text-gray-400 text-sm">
            Save products to view them later
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* HEADER */}

      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-white">
          Wishlist
        </h1>
      </div>

      {/* COLUMN LABELS */}

      <div className="hidden md:flex text-xs text-gray-500 uppercase tracking-wide pb-4 border-b border-zinc-800">
        <div className="w-[50%]">
          Product
        </div>

        <div className="w-[15%]">
          Price
        </div>

        <div className="w-[15%]">
          Stock
        </div>

        <div className="w-[20%] text-right">
          Action
        </div>
      </div>

      {/* ITEMS */}

      <div className="divide-y divide-zinc-800">
        {wishlist.map((product) => (
          <div
            key={product.product_id}
            className="flex flex-col md:flex-row md:items-center py-6 gap-4"
          >
            {/* PRODUCT */}

            <div className="flex items-center gap-4 w-full md:w-[50%]">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-contain"
              />

              <div>
                <Link
                  to={`/product/${product.product_id}`}
                >
                  <h3 className="text-sm text-white font-medium leading-snug">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-xs text-gray-500 mt-1">
                  SKU:{" "}
                  {product.product_id}
                </p>
              </div>
            </div>

            {/* PRICE */}

            <div className="w-full md:w-[15%] text-sm text-white">
              ₹{product.price}
            </div>

            {/* STOCK */}

            <div className="w-full md:w-[15%] text-sm text-green-400">
              ✔ In stock
            </div>

            {/* ACTION */}

            <div className="w-full md:w-[20%] flex md:justify-end items-center gap-3">
              <button
                onClick={() =>
                  moveToCart(product)
                }
                className="
                  px-4 py-2
                  text-sm font-medium
                  bg-green-500 text-black
                  rounded-md
                  hover:bg-green-400
                  transition
                "
              >
                Add to Cart
              </button>

              <button
                onClick={() =>
                  removeFromWishlist(
                    product.product_id
                  )
                }
                className="
                  text-gray-400
                  hover:text-red-400
                  text-sm
                "
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}