import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] border-t border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">

       
        <div>
          <h2 className="text-xl font-black text-white">
            IRONFORGE
          </h2>
          <p className="text-sm text-[#8a8a8a] mt-3 leading-relaxed">
            Premium gym supplements designed for strength,
            recovery, and performance.
          </p>
        </div>

       
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-[#8a8a8a]">
            <li><Link to="/products" className="hover:text-white">Products</Link></li>
            <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
            <li><Link to="/wishlist" className="hover:text-white">Wishlist</Link></li>
            <li><Link to="/orders" className="hover:text-white">Orders</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white mb-4">
            Categories
          </h3>
          <ul className="space-y-2 text-sm text-[#8a8a8a]">
            <li><Link to="/products?category=protein" className="hover:text-white">Protein</Link></li>
            <li><Link to="/products?category=creatine" className="hover:text-white">Creatine</Link></li>
            <li><Link to="/products?category=pre-workout" className="hover:text-white">Pre-Workout</Link></li>
            <li><Link to="/products?category=aminos" className="hover:text-white">Aminos</Link></li>
          </ul>
        </div>

        
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">
            About
          </h3>
          <p className="text-sm text-[#8a8a8a] leading-relaxed">
            Demo e-commerce project built with React, Tailwind CSS,
            and JSON Server.
          </p>
        </div>
      </div>

  
      <div className="border-t border-[#2a2a2a] py-4 text-center text-xs text-[#6a6a6a]">
        © {new Date().getFullYear()} IronForge Supplements
      </div>
    </footer>
  )
}
