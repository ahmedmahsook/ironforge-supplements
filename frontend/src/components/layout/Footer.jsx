import {
  Link,
} from "react-router-dom";

import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
} from "lucide-react";

export default function Footer() {

  return (
    <footer
  className="
    bg-[#0b0b0b]
    border-t
    border-zinc-800
  "
>

      {/* TOP */}

      <div
        className="
          max-w-7xl
          mx-auto

          px-6
          py-16

          grid
          gap-12

          md:grid-cols-2
          lg:grid-cols-4
        "
      >

        {/* BRAND */}

        <div>

          <h2
            className="
              text-2xl
              font-black
              tracking-wide
              text-white
            "
          >
            IRONFORGE
          </h2>

          <p
            className="
              text-sm
              text-zinc-400
              mt-4
              leading-relaxed
            "
          >
            Premium gym supplements
            engineered for performance,
            recovery, endurance, and
            strength progression.
          </p>

          {/* SOCIALS */}

          <div
            className="
              flex
              items-center
              gap-4
              mt-6
            "
          >

            <a
              href="#"
              className="
                text-zinc-500
                hover:text-white
                transition
              "
            >
              <Instagram size={18} />
            </a>

            <a
              href="#"
              className="
                text-zinc-500
                hover:text-white
                transition
              "
            >
              <Facebook size={18} />
            </a>

            <a
              href="#"
              className="
                text-zinc-500
                hover:text-white
                transition
              "
            >
              <Twitter size={18} />
            </a>

            <a
              href="#"
              className="
                text-zinc-500
                hover:text-white
                transition
              "
            >
              <Youtube size={18} />
            </a>

          </div>

        </div>

        {/* SHOP */}

        <div>

          <h3
            className="
              text-sm
              font-semibold
              text-white
              mb-5
              uppercase
              tracking-wider
            "
          >
            Shop
          </h3>

          <ul
            className="
              space-y-3
              text-sm
              text-zinc-400
            "
          >

            <li>
              <Link
                to="/products"
                className="
                  hover:text-white
                  transition
                "
              >
                All Products
              </Link>
            </li>

            <li>
              <Link
                to="/products?category=protein"
                className="
                  hover:text-white
                  transition
                "
              >
                Protein
              </Link>
            </li>

            <li>
              <Link
                to="/products?category=creatine"
                className="
                  hover:text-white
                  transition
                "
              >
                Creatine
              </Link>
            </li>

            <li>
              <Link
                to="/products?category=pre-workout"
                className="
                  hover:text-white
                  transition
                "
              >
                Pre-Workout
              </Link>
            </li>

            <li>
              <Link
                to="/products?category=weight-management"
                className="
                  hover:text-white
                  transition
                "
              >
                Weight Management
              </Link>
            </li>

          </ul>

        </div>

        {/* ACCOUNT */}

        <div>

          <h3
            className="
              text-sm
              font-semibold
              text-white
              mb-5
              uppercase
              tracking-wider
            "
          >
            Account
          </h3>

          <ul
            className="
              space-y-3
              text-sm
              text-zinc-400
            "
          >

            <li>
              <Link
                to="/cart"
                className="
                  hover:text-white
                  transition
                "
              >
                Cart
              </Link>
            </li>

            <li>
              <Link
                to="/wishlist"
                className="
                  hover:text-white
                  transition
                "
              >
                Wishlist
              </Link>
            </li>

            <li>
              <Link
                to="/orders"
                className="
                  hover:text-white
                  transition
                "
              >
                Orders
              </Link>
            </li>

            <li>
              <Link
                to="/profile"
                className="
                  hover:text-white
                  transition
                "
              >
                My Account
              </Link>
            </li>

          </ul>

        </div>

        {/* NEWSLETTER */}

        <div>

          <h3
            className="
              text-sm
              font-semibold
              text-white
              mb-5
              uppercase
              tracking-wider
            "
          >
            Newsletter
          </h3>

          <p
            className="
              text-sm
              text-zinc-400
              leading-relaxed
              mb-4
            "
          >
            Get supplement updates,
            fitness tips, exclusive
            deals, and new arrivals.
          </p>

          <form
            className="
              flex
              flex-col
              gap-3
            "
          >

            <input
              type="email"
              placeholder="Enter your email"
              className="
                bg-[#111]
                border border-zinc-800
                rounded-xl
                px-4 py-3
                text-sm
                text-white
                focus:outline-none
                focus:border-green-500/30
              "
            />

            <button
              type="submit"
              className="
                bg-green-500
                text-black
                font-semibold
                rounded-xl
                py-3
                hover:bg-green-400
                transition
              "
            >
              Subscribe
            </button>

          </form>

        </div>

      </div>

      {/* BOTTOM */}

      <div
        className="
          border-t
          border-zinc-800
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto

            px-6
            py-5

            flex
            flex-col
            md:flex-row

            items-center
            justify-between

            gap-4
          "
        >

          <p
            className="
              text-xs
              text-zinc-500
            "
          >
            © {new Date().getFullYear()}
            {" "}
            IronForge Supplements.
            All rights reserved.
          </p>

          <div
            className="
              flex
              items-center
              gap-6

              text-xs
              text-zinc-500
            "
          >

            <Link
              to="/privacy"
              className="
                hover:text-white
                transition
              "
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="
                hover:text-white
                transition
              "
            >
              Terms of Service
            </Link>

            <Link
              to="/shipping"
              className="
                hover:text-white
                transition
              "
            >
              Shipping Policy
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}