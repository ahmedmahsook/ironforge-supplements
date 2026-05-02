export default function ProductInfo({ product }) {
  return (
    <div className="space-y-6">

      {/* CATEGORY */}
      <span className="
        inline-block
        text-xs
        uppercase tracking-widest
        text-gray-400
      ">
        {product.category}
      </span>

      {/* TITLE */}
      <h1 className="
        text-3xl md:text-4xl
        font-bold
        text-white
        leading-tight
      ">
        {product.name}
      </h1>

      {/* PRICE */}
      <div className="flex items-center gap-3">

        <span className="
          text-3xl md:text-4xl
          font-bold
          text-green-400
        ">
          ₹{product.price}
        </span>

        <span className="text-xs text-gray-500">
          Inclusive of taxes
        </span>

      </div>

      {/* DIVIDER */}
      <div className="border-t border-zinc-800"></div>

      {/* DESCRIPTION */}
      <p className="
        text-gray-400
        text-sm
        leading-relaxed
        max-w-md
      ">
        {product.description}
      </p>

    </div>
  )
}