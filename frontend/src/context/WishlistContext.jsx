import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { useCart } from "./CartContext"
import { persistUser } from "../Hooks/persistUser"

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const { user, updateUser } = useAuth()
  const { addToCart } = useCart()
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    setWishlist(user?.wishlist || [])
  }, [user?.id])

  const addToWishlist = async (product) => {
    if (!user) return
    if (wishlist.some(i => i.id === product.id)) return

    const updatedWishlist = [...wishlist, product]
    const updatedUser = await persistUser(user.id, {
      wishlist: updatedWishlist,
    })

    updateUser(updatedUser)
    setWishlist(updatedWishlist)
  }

  const moveToCart = async (productId) => {
    if (!user) return

    const product = wishlist.find(i => i.id === productId)
    if (!product) return

    await addToCart(product)

    const updatedWishlist = wishlist.filter(i => i.id !== productId)
    const updatedUser = await persistUser(user.id, {
      wishlist: updatedWishlist,
    })

    updateUser(updatedUser)
    setWishlist(updatedWishlist)
  }

  const removeFromWishlist = async (productId) => {
    if (!user) return

    const updatedWishlist = wishlist.filter(i => i.id !== productId)
    const updatedUser = await persistUser(user.id, {
      wishlist: updatedWishlist,
    })

    updateUser(updatedUser)
    setWishlist(updatedWishlist)
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        moveToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
