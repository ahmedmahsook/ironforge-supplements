import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useState, useRef, useEffect } from "react";

import {
  ShoppingCart,
  Package,
  Heart,
  User,
  Home,
  LogOut,
} from "lucide-react";

export default function Navbar() {

  const { user, isAuthenticated, logout } = useAuth();

  const { cartCount } = useCart();

  const { wishlist } = useWishlist();

  const navigate = useNavigate();

  const location = useLocation();

  const wishlistCount = wishlist.length;

  const [open, setOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();

    setOpen(false);

    navigate("/login");
  };

  useEffect(() => {

    const handleClickOutside = (e) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

  }, []);

  useEffect(() => {

    const onScroll = () =>
      setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", onScroll);

    return () =>
      window.removeEventListener("scroll", onScroll);

  }, []);

  const navLinks = [
    {
      to: "/",
      icon: <Home size={16} />,
      label: "Home",
    },

    {
      to: "/products",
      icon: <Package size={16} />,
      label: "Products",
    },
  ];

  return (
    <nav
      className={`
        fixed top-0 left-0 w-full z-50
        transition-all duration-500
        ${
          scrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-2xl border-b border-zinc-800/80 shadow-[0_1px_0_0_rgba(255,255,255,0.03)]"
            : "bg-transparent backdrop-blur-sm"
        }
      `}
    >

      {/* TOP LINE */}

      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-green-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}

        <Link to="/" className="flex items-center gap-3 group">

          <div className="flex flex-col leading-none">

            <span className="text-white text-lg font-black tracking-[0.15em] uppercase">
              Iron<span className="text-green-400">Forge</span>
            </span>

            <span className="text-[9px] text-zinc-500 tracking-[0.35em] uppercase font-medium">
              Supplements
            </span>

          </div>
        </Link>

        {/* CENTER NAV */}

        <div className="hidden md:flex items-center gap-1">

          {navLinks.map(({ to, icon, label }) => {

            const active =
              to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(to);

            return (
              <Link
                key={to}
                to={to}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${
                    active
                      ? "text-green-400 bg-green-500/10 border border-green-500/20"
                      : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }
                `}
              >
                {icon}
                {label}
              </Link>
            );
          })}

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-1">

          {/* WISHLIST */}

          <Link
            to="/wishlist"
            className={`
              relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm
              transition-all duration-200
              ${
                location.pathname === "/wishlist"
                  ? "text-pink-400 bg-pink-500/10 border border-pink-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
              }
            `}
          >

            <Heart size={16} />

            <span className="hidden sm:block font-medium">
              Wishlist
            </span>

            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-black text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold leading-none">
                {wishlistCount}
              </span>
            )}

          </Link>

          {/* CART */}

          <Link
            to="/cart"
            className={`
              relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm
              transition-all duration-200
              ${
                location.pathname === "/cart"
                  ? "text-green-400 bg-green-500/10 border border-green-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
              }
            `}
          >

            <ShoppingCart size={16} />

            <span className="hidden sm:block font-medium">
              Cart
            </span>

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-black text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold leading-none">
                {cartCount}
              </span>
            )}

          </Link>

          {/* DIVIDER */}

          <div className="w-px h-6 bg-zinc-800 mx-1" />

          {/* PROFILE */}

          <div className="relative" ref={dropdownRef}>

            <button
              onClick={() => setOpen(!open)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-200 border
                ${
                  open
                    ? "text-green-400 bg-green-500/10 border-green-500/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/5 border-transparent"
                }
              `}
            >

              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center">
                <User size={13} />
              </div>

              <span className="hidden sm:block">
                Account
              </span>

            </button>

            {open && (

              <div className="absolute right-0 mt-2 w-52 bg-[#0f0f0f] border border-zinc-800 rounded-xl shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">

                <div className="px-4 py-2 border-b border-zinc-800">

                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
                    {isAuthenticated ? "My Account" : "Guest"}
                  </p>

                </div>

                {isAuthenticated ? (
                  <>

                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <User size={14} className="text-zinc-500" />
                      Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Package size={14} className="text-zinc-500" />
                      Orders
                    </Link>

                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-green-400 hover:bg-green-500/5 transition-colors"
                      >
                        <Package size={14} className="text-green-400" />
                        Admin Panel
                      </Link>
                    )}

                    <div className="border-t border-zinc-800 mt-1">

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                      >
                        <LogOut size={14} />
                        Logout
                      </button>

                    </div>

                  </>
                ) : (

                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <User size={14} className="text-zinc-500" />
                    Login
                  </Link>

                )}

              </div>
            )}

          </div>

          {/* MOBILE */}

          <div className="flex md:hidden items-center gap-1 ml-1">

            {navLinks.map(({ to, icon }) => {

              const active =
                to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(to);

              return (
                <Link
                  key={to}
                  to={to}
                  className={`p-2 rounded-lg transition-colors ${
                    active
                      ? "text-green-400"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {icon}
                </Link>
              );
            })}

          </div>

        </div>
      </div>
    </nav>
  );
}