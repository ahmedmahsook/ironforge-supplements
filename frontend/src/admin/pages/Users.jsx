import { useEffect, useState } from "react";

import api from "../../api/api";

import toast from "react-hot-toast";

export default function Users() {

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const limit = 10;

  useEffect(() => {

    fetchUsers();

  }, [page, search]);

  /* ================= FETCH USERS ================= */

  async function fetchUsers() {

    try {

      const res = await api.get(
        `/admin/users?page=${page}&limit=${limit}&search=${search}`
      );

      if (
        Array.isArray(
          res.data
        )
      ) {

        setUsers(
          res.data
        );

      } else {

        setUsers(
          res.data.data || []
        );
      }

    } catch (err) {

      console.error(
        "Failed to fetch users",
        err
      );

      toast.error(
        "Failed to load users"
      );

    } finally {

      setLoading(false);

    }
  }

  /* ================= BLOCK / UNBLOCK ================= */

  async function toggleBlock(
    userId,
    blocked
  ) {

    try {

      const endpoint =
        blocked
          ? `/admin/users/${userId}/unblock`
          : `/admin/users/${userId}/block`;

      await api.patch(
        endpoint
      );

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                is_blocked:
                  !blocked,
              }
            : user
        )
      );

      toast.success(
        blocked
          ? "User unblocked"
          : "User blocked"
      );

    } catch (err) {

      console.error(err);

      toast.error(
        "Action failed"
      );

    }
  }

  /* ================= LOADING ================= */

  if (loading) {

    return (
      <div className="text-gray-400">
        Loading users...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>

        <h1
          className="
            text-3xl
            font-bold
            text-white
          "
        >
          Users
        </h1>

        <p
          className="
            text-gray-500
            mt-1
          "
        >
          Manage platform users
        </p>

      </div>

      {/* SEARCH */}

      <div>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {

            setSearch(
              e.target.value
            );

            setPage(1);

          }}
          className="
            bg-black
            border border-zinc-800

            text-white

            px-4 py-3
            rounded-xl

            w-full max-w-sm

            focus:outline-none
            focus:border-green-500/30
          "
        />

      </div>

      {/* TABLE */}

      <div
        className="
          bg-[#141414]
          border border-zinc-800
          rounded-2xl
          overflow-hidden
        "
      >

        <table className="w-full">

          {/* HEAD */}

          <thead
            className="
              bg-[#181818]
              text-gray-400
              text-sm
            "
          >

            <tr>

              <th
                className="
                  p-4
                  text-left
                  font-medium
                "
              >
                Name
              </th>

              <th
                className="
                  p-4
                  text-left
                  font-medium
                "
              >
                Email
              </th>

              <th
                className="
                  p-4
                  text-left
                  font-medium
                "
              >
                Role
              </th>

              <th
                className="
                  p-4
                  text-left
                  font-medium
                "
              >
                Status
              </th>

              <th
                className="
                  p-4
                  text-left
                  font-medium
                "
              >
                Actions
              </th>

            </tr>

          </thead>

          {/* BODY */}

          <tbody>

            {users.map(
              (user) => (

              <tr
                key={user.id}
                className="
                  border-t
                  border-zinc-800

                  hover:bg-[#1a1a1a]

                  transition
                "
              >

                {/* NAME */}

                <td
                  className="
                    p-4
                    text-white
                    font-medium
                  "
                >
                  {user.name}
                </td>

                {/* EMAIL */}

                <td
                  className="
                    p-4
                    text-gray-400
                  "
                >
                  {user.email}
                </td>

                {/* ROLE */}

                <td className="p-4">

                  <span
                    className={`
                      px-3 py-1
                      rounded-full
                      text-xs
                      font-medium

                      ${
                        user.role ===
                        "admin"
                          ? `
                            bg-green-500/10
                            text-green-400
                          `
                          : `
                            bg-zinc-800
                            text-gray-300
                          `
                      }
                    `}
                  >
                    {user.role}
                  </span>

                </td>

                {/* STATUS */}

                <td className="p-4">

                  <span
                    className={`
                      px-3 py-1
                      rounded-full
                      text-xs
                      font-medium

                      ${
                        user.is_blocked
                          ? `
                            bg-red-500/10
                            text-red-400
                          `
                          : `
                            bg-green-500/10
                            text-green-400
                          `
                      }
                    `}
                  >
                    {user.is_blocked
                      ? "Blocked"
                      : "Active"}
                  </span>

                </td>

                {/* ACTION */}

                <td className="p-4">

                  <button
                    onClick={() =>
                      toggleBlock(
                        user.id,
                        user.is_blocked
                      )
                    }
                    className={`
                      px-3 py-1.5
                      rounded-lg
                      text-sm

                      transition

                      ${
                        user.is_blocked
                          ? `
                            text-green-400
                            border border-green-500/20

                            hover:bg-green-500/10
                          `
                          : `
                            text-red-400
                            border border-red-500/20

                            hover:bg-red-500/10
                          `
                      }
                    `}
                  >
                    {user.is_blocked
                      ? "Unblock"
                      : "Block"}
                  </button>

                </td>

              </tr>
            ))}

            {/* EMPTY */}

            {users.length === 0 && (

              <tr>

                <td
                  colSpan="5"
                  className="
                    p-8
                    text-center
                    text-gray-500
                  "
                >
                  No users found
                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <button
          disabled={page === 1}
          onClick={() =>
            setPage(
              (prev) => prev - 1
            )
          }
          className="
            px-4 py-2
            rounded-lg

            bg-zinc-800
            text-white

            disabled:opacity-50
          "
        >
          Previous
        </button>

        <p className="text-gray-400">
          Page {page}
        </p>

        <button
          onClick={() =>
            setPage(
              (prev) => prev + 1
            )
          }
          className="
            px-4 py-2
            rounded-lg

            bg-zinc-800
            text-white
          "
        >
          Next
        </button>

      </div>

    </div>
  );
}