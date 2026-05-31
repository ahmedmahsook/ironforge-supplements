import { optimizeImage } from "../utils/cloudinary";

export default function ProductImage({ product }) {

  return (
    <div className="flex justify-center items-center">

      <div
        className="
          relative
          w-full
          max-w-md

          flex items-center justify-center
        "
      >

        {/* subtle glow */}

        <div className="absolute w-72 h-72 bg-green-500/10 blur-2xl opacity-50" />

        <img
          src={optimizeImage(product.image, 700)}
          alt={product.name}

          loading="lazy"

          className="
            relative
            w-full
            h-[380px]

            object-contain
          "
        />

      </div>

    </div>
  );
}