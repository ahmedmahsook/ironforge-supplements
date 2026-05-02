import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
      isActive
        ? "bg-blue-900 text-green-400"
        : "text-blue-100 hover:bg-blue-900 hover:text-white"
    }`;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-black text-white">

      <aside
        className="
          w-64
          bg-slate-900
          border-r border-slate-800
          flex
          flex-col
          h-screen
          fixed
          left-0
          top-0
        "
      >
      
        <div className="flex-1 p-6 overflow-y-auto">
        
          <h2 className="text-xl font-bold mb-10 tracking-wide">
            IRONFORGE
            <span className="block text-xs font-normal text-slate-400">
              Admin Panel
            </span>
          </h2>

          <nav className="flex flex-col gap-2">
            <NavLink to="/admin" end className={linkClass}>
              Dashboard
            </NavLink>

            <NavLink to="/admin/products" className={linkClass}>
              Products
            </NavLink>

            <NavLink to="/admin/users" className={linkClass}>
              Users
            </NavLink>

            <NavLink to="/admin/orders" className={linkClass}>
              Orders
            </NavLink>
          </nav>
        </div>

   
        <div className="p-6 border-t border-slate-800 space-y-4">
          <p className="text-xs text-slate-400">
            Performance • Recovery • Strength
          </p>

          <button
            onClick={handleLogout}
            className="
              w-full
              px-4 py-3
              rounded-lg
              text-sm font-medium
              text-red-300
              border border-red-400/30
              bg-red-500/10
              hover:bg-red-500/20
              transition
            "
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
