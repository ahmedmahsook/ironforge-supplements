import { Link } from "react-router-dom"

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="
        group
        relative
        rounded-2xl
        overflow-hidden
        h-48
        block
        transition
        hover:-translate-y-1
      "
    >

      {/* IMAGE */}
      <img
        src={category.image}
        alt={category.name}
        className="
          absolute inset-0
          w-full h-full
          object-cover
          transition duration-700 ease-out
          group-hover:scale-110
        "
      />

      {/* OVERLAY (dynamic feel) */}
      <div className="
        absolute inset-0
        bg-gradient-to-t
        from-black/85 via-black/40 to-transparent
        transition
        group-hover:from-black/70
      " />

      {/* CONTENT */}
      <div className="
        relative z-10
        h-full
        flex flex-col justify-end
        p-5
        translate-y-1
        group-hover:translate-y-0
        transition duration-300
      ">

        <h3 className="
          text-white
          text-lg font-semibold
          tracking-tight
        ">
          {category.name}
        </h3>

        <p className="
          text-xs text-gray-300 mt-1
        ">
          Explore supplements
        </p>

        {/* ACTION */}
        <span className="
          text-xs text-green-400 mt-3
          opacity-0 group-hover:opacity-100
          translate-y-1 group-hover:translate-y-0
          transition duration-300
        ">
          Browse →
        </span>

      </div>

      {/* BORDER + GLOW */}
      <div className="
        absolute inset-0
        rounded-2xl
        border border-transparent
        group-hover:border-green-500/40
        transition
      " />

      {/* subtle shadow on hover */}
      <div className="
        absolute inset-0
        rounded-2xl
        shadow-none
        group-hover:shadow-[0_10px_30px_rgba(34,197,94,0.15)]
        transition
      " />

    </Link>
  )
}