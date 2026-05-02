import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import useProducts from "../Hooks/useProducts"
import ProductCard from "../Products/ProductCard"

export default function FeaturedProducts() {
  const { products, loading } = useProducts()

  const featured = products.filter(p => p.featured).slice(0, 4)

  if (loading || featured.length === 0) return null

  return (
    <section className="relative py-24 overflow-hidden">

      {/* BACKGROUND GLOWS */}
      <div className="
        absolute top-1/2 left-1/2
        -translate-x-1/2 -translate-y-1/2
        w-[600px] h-[600px]
        bg-green-500/4
        blur-[140px] rounded-full pointer-events-none
      " />
      <div className="
        absolute top-0 left-0 right-0
        h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent
      " />
      <div className="
        absolute bottom-0 left-0 right-0
        h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent
      " />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[11px] text-green-400/80 uppercase tracking-[0.3em] font-medium mb-3">
              Handpicked for You
            </p>
            <h2 className="text-4xl font-black text-white tracking-tight leading-none">
              Featured<br />
              <span className="text-green-400">Supplements</span>
            </h2>
            <p className="text-zinc-500 text-sm mt-4 max-w-xs leading-relaxed">
              Top picks engineered for strength, endurance, and faster recovery.
            </p>
          </div>

          <Link
            to="/products"
            className="
              hidden md:inline-flex items-center gap-2
              px-5 py-2.5 rounded-xl
              border border-zinc-800
              text-sm text-zinc-400 font-medium
              hover:text-white hover:border-zinc-600
              hover:bg-white/5
              transition-all duration-200
            "
          >
            View All
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* GRID */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((product, i) => (
            <div
              key={product.id}
              style={{ animationDelay: `${i * 80}ms` }}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* MOBILE CTA */}
        <div className="flex justify-center mt-10 md:hidden">
          <Link
            to="/products"
            className="
              inline-flex items-center gap-2
              px-7 py-3 rounded-xl
              bg-green-500 text-black
              text-sm font-bold
              shadow-[0_0_24px_rgba(74,222,128,0.3)]
              hover:bg-green-400
              active:scale-[0.97]
              transition-all duration-200
            "
          >
            View All Products
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  )
}
