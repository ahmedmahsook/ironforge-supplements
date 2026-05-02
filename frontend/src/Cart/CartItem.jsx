export default function CartItem({ item, onRemove, onUpdateQuantity }) {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1)
    }
  }

  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1)
  }

  return (
    <div
      className="
        flex items-center gap-5
        bg-[#1a1a1a]
        rounded-xl
        p-5
        transition
        hover:shadow-lg hover:shadow-black/30
      "
    >
      
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg"
      />


      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium text-sm truncate">
          {item.name}
        </h3>

        <p className="text-green-400 font-semibold text-sm mt-1">
          ₹{item.price.toLocaleString("en-IN")}
        </p>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleDecrease}
            disabled={item.quantity === 1}
            className="
              w-8 h-8 flex items-center justify-center
              rounded-full
              bg-[#121212]
              text-[#b0b0b0]
              hover:bg-[#2a2a2a]
              disabled:opacity-40 disabled:cursor-not-allowed
              transition
            "
          >
            −
          </button>

          <span className="text-sm text-white w-6 text-center">
            {item.quantity}
          </span>

          <button
            onClick={handleIncrease}
            className="
              w-8 h-8 flex items-center justify-center
              rounded-full
              bg-[#121212]
              text-[#b0b0b0]
              hover:bg-[#2a2a2a]
              transition
            "
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="
          text-xs
          text-[#8a8a8a]
          hover:text-red-400
          transition
        "
      >
        Remove
      </button>
    </div>
  )
}
