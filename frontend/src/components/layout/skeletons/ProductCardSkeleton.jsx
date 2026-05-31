import Skeleton from "react-loading-skeleton";

export default function ProductCardSkeleton() {

  return (

    <div className="group h-full">

      <div
        className="
          relative h-full flex flex-col
          bg-[#0f0f0f]
          border border-zinc-800/80
          rounded-2xl overflow-hidden
        "
      >

        {/* shimmer */}

        <div
          className="
            absolute inset-0 z-30
            -translate-x-full
            animate-[shimmer_2.2s_infinite]
            bg-gradient-to-r
            from-transparent
            via-white/[0.04]
            to-transparent
          "
        />

        {/* IMAGE AREA */}

        <div
          className="
            relative h-56
            bg-gradient-to-b
            from-zinc-900
            to-[#0a0a0a]
            overflow-hidden
          "
        >

          {/* grid texture */}

          <div
            className="
              absolute inset-0 opacity-[0.03]
              [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
              [background-size:24px_24px]
            "
          />

          {/* fake product image */}

          <div
            className="
              absolute inset-0
              flex items-center justify-center
              p-6
            "
          >

            <div
              className="
                w-full h-full
                rounded-2xl
                bg-zinc-800/70
              "
            />

          </div>

          {/* category badge */}

          <div
            className="
              absolute top-3 left-3 z-20
              w-20 h-5
              rounded-md
              bg-zinc-800
            "
          />

          {/* wishlist button */}

          <div
            className="
              absolute top-3 right-3 z-20
              w-8 h-8
              rounded-full
              bg-zinc-800
            "
          />

        </div>

        {/* CONTENT */}

        <div className="flex flex-col flex-1 p-4 pt-3.5">

          {/* title line 1 */}

          <div
            className="
              h-4
              w-[85%]
              rounded-md
              bg-zinc-800
            "
          />

          {/* title line 2 */}

          <div
            className="
              h-4
              w-[55%]
              rounded-md
              bg-zinc-800
              mt-2
            "
          />

          {/* bottom row */}

          <div
            className="
              flex items-center justify-between
              mt-auto pt-4
            "
          >

            {/* price */}

            <div
              className="
                h-7
                w-20
                rounded-md
                bg-zinc-800
              "
            />

            {/* button */}

            <div
              className="
                h-10
                w-24
                rounded-lg
                bg-zinc-800
              "
            />

          </div>

        </div>

        {/* bottom accent */}

        <div
          className="
            absolute bottom-0 left-0 right-0 h-[2px]
            bg-gradient-to-r
            from-transparent
            via-zinc-700
            to-transparent
          "
        />

      </div>

    </div>

  );



}