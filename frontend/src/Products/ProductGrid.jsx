import ProductCard from "./ProductCard"

import ProductCardSkeleton from "../components/layout/skeletons/ProductCardSkeleton"

export default function ProductGrid({
  products,
  loading,
}) {

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="relative">

        {/* subtle background glow */}

        <div
          className="
            absolute inset-0
            bg-gradient-to-b
            from-green-500/5
            via-transparent
            to-transparent
            blur-3xl
            opacity-40
            pointer-events-none
          "
        />

        {/* skeleton grid */}

        <div
          className="
            relative
            grid
            gap-8
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
          "
        >
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <ProductCardSkeleton
              key={index}
            />
          ))}
        </div>
      </div>
    )
  }

  /* ================= EMPTY ================= */

  if (products.length === 0) {
    return (
      <div
        className="
          py-32
          flex flex-col
          items-center
          justify-center
          gap-3
        "
      >
        <div
          className="
            w-12 h-12
            rounded-full
            bg-zinc-800
            flex items-center
            justify-center
            text-gray-500
          "
        >
          🛒
        </div>

        <p className="text-gray-400 text-sm">
          No products found
        </p>

        <p className="text-xs text-gray-500">
          Try adjusting filters or search
        </p>
      </div>
    )
  }

  /* ================= PRODUCTS ================= */

  return (
    <div className="relative">

      {/* subtle background glow */}

      <div
        className="
          absolute inset-0
          bg-gradient-to-b
          from-green-500/5
          via-transparent
          to-transparent
          blur-3xl
          opacity-40
          pointer-events-none
        "
      />

      {/* GRID */}

      <div
        className="
          relative
          grid
          gap-8
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
        "
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  )
}