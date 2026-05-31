
import { Link } from "react-router-dom"

export default function HeroSection() {
  return (
    <section className="px-6 pt-4 h-[calc(100vh-72px)]">

      <div className="max-w-7xl mx-auto h-full">

        {/* HERO CARD */}
        <div className="
          relative
          rounded-2xl
          overflow-hidden
          h-full
          flex items-center justify-center
        ">

          {/* VIDEO */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="
              absolute inset-0
              w-full h-full
              object-cover
              scale-105
            "
          >
            <source src="https://res.cloudinary.com/driapshxj/video/upload/hero_lctzqh.mp4" type="video/mp4" />
          </video>

          {/* GRADIENT OVERLAY */}
          <div className="
            absolute inset-0
            bg-gradient-to-b
            from-black/80 via-black/60 to-black/85
          "></div>

          {/* CONTENT */}
          <div className="relative z-10 text-center px-6 max-w-3xl">

            {/* TAG */}
            <div className="
              inline-block
              px-4 py-1 mb-6
              rounded-full
              bg-white/10
              border border-white/20
              text-white text-xs font-semibold tracking-wide
              backdrop-blur
            ">
              PERFORMANCE • RECOVERY • STRENGTH
            </div>

            {/* TITLE */}
            <h1 className="
              text-5xl md:text-6xl
              font-extrabold
              text-white
              leading-tight
            ">
              <span className="block text-gray-200">
                Fuel Your
              </span>

              <span className="block text-green-400 mt-2">
                Muscle Growth
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className="
              mt-6
              text-gray-300
              max-w-lg mx-auto
              text-sm md:text-base
              leading-relaxed
            ">
              Premium supplements crafted for serious training,
              faster recovery, and peak performance.
            </p>

            {/* CTA */}
            <Link
              to="/products"
              className="
                inline-flex items-center justify-center
                mt-10
                px-8 py-3
                rounded-lg
                bg-green-500 text-black
                font-semibold
                shadow-lg shadow-green-500/20
                hover:bg-green-400
                active:scale-[0.98]
                transition
              "
            >
              Shop Now
            </Link>

          </div>

        </div>

      </div>

    </section>
  )
}