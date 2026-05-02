import { useEffect, useState } from "react";
import api from "../../api/api";
import toast from "react-hot-toast";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    api.get("/users").then((res) => setUsers(res.data));
  }, []);

  function confirmToggle(user) {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-white">
            {user.isBlocked ? "Unblock" : "Block"}{" "}
            <span className="font-semibold">{user.username}</span>?
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-sm rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                toast.dismiss(t.id);
                toggleBlock(user);
              }}
              className={`px-3 py-1.5 text-sm rounded-md text-white ${
                user.isBlocked
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {user.isBlocked ? "Unblock" : "Block"}
            </button>
          </div>
        </div>
      ),
      {
        duration: 6000,
        style: {
          background: "#161616",
          border: "1px solid #2a2a2a",
        },
      }
    );
  }

  async function toggleBlock(user) {
    if (user.role === "admin") return;

    const toastId = toast.loading(
      `${user.isBlocked ? "Unblocking" : "Blocking"} user...`
    );

    try {
      const updated = !user.isBlocked;

      await api.patch(`/users/${user.id}`, { isBlocked: updated });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isBlocked: updated } : u
        )
      );

      toast.success(
        `User ${updated ? "blocked" : "unblocked"} successfully`,
        { id: toastId }
      );
    } catch {
      toast.error("Failed to update user status", { id: toastId });
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-white">
        Users
      </h1>


      <input
        placeholder="Search by username or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full md:w-96
          bg-black
          border border-gray-800
          text-white
          px-4 py-3
          rounded-lg
          focus:outline-none
          focus:ring-2
          focus:ring-green-500/40
        "
      />

 
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-300 text-sm">
            <tr>
              <th className="p-4">Username</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-t border-gray-800 hover:bg-gray-800/40 transition"
              >
                <td className="p-4 text-white font-medium">
                  {user.username}
                </td>

                <td className="p-4 text-gray-400">
                  {user.email}
                </td>

                <td className="p-4 text-gray-400">
                  {user.role}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.isBlocked
                        ? "bg-red-500/10 text-red-400"
                        : "bg-green-500/10 text-green-400"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="px-3 py-1.5 text-sm rounded-md text-blue-400 border border-blue-500/30 hover:bg-blue-500/10 transition"
                    >
                      View
                    </button>

                    {user.role !== "admin" && (
                      <button
                        onClick={() => confirmToggle(user)}
                        className={`px-3 py-1.5 text-sm rounded-md font-medium transition ${
                          user.isBlocked
                            ? "text-green-400 border border-green-500/30 hover:bg-green-500/10"
                            : "text-red-400 border border-red-500/30 hover:bg-red-500/10"
                        }`}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

     
      {selectedUser && (
        <UserDetails
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}



function UserDetails({ user, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-lg space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            User Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <Detail label="Username" value={user.username} />
          <Detail label="Email" value={user.email} />
          <Detail label="Role" value={user.role} />
          <Detail
            label="Status"
            value={user.isBlocked ? "Blocked" : "Active"}
          />
          <Detail label="Orders" value={user.orders?.length || 0} />
          <Detail label="Cart Items" value={user.cart?.length || 0} />
          <Detail
            label="Wishlist Items"
            value={user.wishlist?.length || 0}
          />
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-800 pb-2">
      <span className="text-gray-400 text-sm">
        {label}
      </span>
      <span className="text-white font-medium">
        {value}
      </span>
    </div>
  );
}
