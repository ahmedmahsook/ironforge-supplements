import {
  Outlet,
  NavLink,
  useNavigate,
  Link,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {

  const { logout } =
    useAuth();

  const navigate =
    useNavigate();

  const linkClass = ({
    isActive,
  }) =>
    `
      block
      px-4 py-3
      rounded-xl
      transition-all duration-200
      font-medium
      border
      ${
        isActive
          ? `
            bg-green-500/10
            border-green-500/20
            text-green-400
          `
          : `
            border-transparent
            text-gray-300
            hover:bg-[#1a1a1a]
            hover:border-zinc-800
            hover:text-white
          `
      }
    `;

  function handleLogout() {

    logout();

    navigate("/login");
  }

  return (
    <div
      className="
        flex
        min-h-screen
        bg-[#0b0b0b]
        text-white
      "
    >

      {/* SIDEBAR */}

      <aside
        className="
          w-64
          bg-[#111]
          border-r border-zinc-800
          flex flex-col
          h-screen
          fixed left-0 top-0
        "
      >

        {/* TOP */}

        <div className="flex-1 p-6 overflow-y-auto">

          {/* LOGO */}

          <div className="mb-10">

            <h2 className="text-2xl font-bold tracking-wide text-white">
              IRONFORGE
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Admin Panel
            </p>

          </div>

          {/* NAVIGATION */}

          <nav className="flex flex-col gap-2">

            <NavLink
              to="/admin"
              end
              className={linkClass}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/products"
              className={linkClass}
            >
              Products
            </NavLink>

            <NavLink
              to="/admin/users"
              className={linkClass}
            >
              Users
            </NavLink>

            <NavLink
              to="/admin/orders"
              className={linkClass}
            >
              Orders
            </NavLink>

          </nav>
        </div>

        {/* FOOTER */}

        <div
          className="
            p-6
            border-t border-zinc-800
            space-y-4
          "
        >

          <p className="text-xs text-gray-500 leading-relaxed">
            Performance • Recovery • Strength
          </p>

          {/* USER SITE BUTTON */}

          <Link
            to="/"
            className="
              block
              w-full

              px-4 py-3
              rounded-xl

              text-center
              text-sm
              font-medium

              text-blue-300

              border border-blue-500/20
              bg-blue-500/5

              hover:bg-blue-500/10
              hover:border-blue-500/30

              transition
            "
          >
            Go To User Site
          </Link>

          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="
              w-full
              px-4 py-3
              rounded-xl
              text-sm
              font-medium

              text-red-400

              border border-red-500/20
              bg-red-500/5

              hover:bg-red-500/10
              hover:border-red-500/30

              transition
            "
          >
            Logout
          </button>

        </div>
      </aside>

      {/* MAIN */}

      <main
        className="
          flex-1
          ml-64
          p-8
          bg-[#0b0b0b]
        "
      >

        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>

      </main>
    </div>
  );
}