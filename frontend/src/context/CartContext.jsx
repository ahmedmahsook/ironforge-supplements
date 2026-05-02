import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { persistUser } from "../Hooks/persistUser"
import toast from "react-hot-toast"

const CartContext = createContext()

export function CartProvider({ children }) {
  const { user, updateUser } = useAuth()
  const [cart, setCart] = useState([])


  useEffect(() => {
    setCart(user?.cart || [])
  }, [user?.id])

  const addToCart = async (product) => {
    if (!user) return

    const existing = cart.find(i => i.id === product.id)

    const updatedCart = existing
      ? cart.map(i =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      : [...cart, { ...product, quantity: 1 }]

    const updatedUser = await persistUser(user.id, { cart: updatedCart })
    updateUser(updatedUser)
    setCart(updatedCart)

    toast.success(existing ? "Quantity increased" : "Added to cart")
  }

  const removeFromCart = async (id) => {
    if (!user) return

    const updatedCart = cart.filter(i => i.id !== id)
    const updatedUser = await persistUser(user.id, { cart: updatedCart })

    updateUser(updatedUser)
    setCart(updatedCart)

    toast.error("Removed from cart")
  }

  const updateQuantity = async (id, quantity) => {
    if (!user || quantity < 1) return

    const updatedCart = cart.map(i =>
      i.id === id ? { ...i, quantity } : i
    )

    const updatedUser = await persistUser(user.id, { cart: updatedCart })
    updateUser(updatedUser)
    setCart(updatedCart)
  }

  const clearCart = async () => {
    if (!user) return

    const updatedUser = await persistUser(user.id, { cart: [] })
    updateUser(updatedUser)
    setCart([])

    toast.error("Cart cleared")
  }

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
