export default function ProductImage({ product }) {
  return (
    <div className="flex justify-center items-center">

      <div className="
        relative
        w-full max-w-md
        flex items-center justify-center
      ">

        {/* subtle glow */}
        <div className="absolute w-72 h-72 bg-green-500/10 blur-2xl opacity-50"></div>

        <img
          src={product.image}
          alt={product.name}
          className="
            relative
            w-full h-[380px]
            object-contain
          "
        />

      </div>

    </div>
  )
}