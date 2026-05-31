import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/api";

import toast from "react-hot-toast";

export default function AdminProduct() {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [page, setPage] = useState(1);

  const limit = 10;

  useEffect(() => {
    fetchProducts();
  }, [page, search, category]);

  /* ================= FETCH PRODUCTS ================= */

  async function fetchProducts() {

    try {

      const res = await api.get(
        `/products?page=${page}&limit=${limit}&search=${search}&category=${category}`
      );

      if (Array.isArray(res.data)) {

        setProducts(res.data);

      } else {

        setProducts(res.data.data || []);
      }

    } catch (err) {

      console.error(
        "Products fetch error",
        err
      );

      toast.error(
        "Failed to load products"
      );

    } finally {

      setLoading(false);
    }
  }

  /* ================= CONFIRM DELETE ================= */

  function confirmDelete(product) {

    toast(
      (t) => (
        <div className="flex flex-col gap-3">

          <p className="text-sm text-white">

            Delete{" "}

            <span className="font-semibold">
              {product.name}
            </span>

            ?

          </p>

          <div className="flex justify-end gap-2">

            <button
              onClick={() =>
                toast.dismiss(t.id)
              }
              className="
                px-3 py-1.5
                rounded-lg
                text-sm

                bg-zinc-800
                text-gray-300

                hover:bg-zinc-700
                transition
              "
            >
              Cancel
            </button>

            <button
              onClick={() => {

                toast.dismiss(t.id);

                deleteProduct(product.id);

              }}
              className="
                px-3 py-1.5
                rounded-lg
                text-sm

                bg-red-500/10
                text-red-400

                border border-red-500/20

                hover:bg-red-500/20

                transition
              "
            >
              Delete
            </button>

          </div>
        </div>
      ),

      {
        duration: 6000,

        style: {
          background: "#141414",
          border: "1px solid #27272a",
        },
      }
    );
  }

  /* ================= DELETE PRODUCT ================= */

  async function deleteProduct(id) {

    const toastId =
      toast.loading(
        "Deleting product..."
      );

    try {

      await api.delete(
        `/products/${id}`
      );

      setProducts((prev) =>
        prev.filter(
          (p) => p.id !== id
        )
      );

      toast.success(
        "Product deleted",
        {
          id: toastId,
        }
      );

    } catch (err) {

      console.error(
        "Delete failed",
        err
      );

      toast.error(
        "Failed to delete product",
        {
          id: toastId,
        }
      );
    }
  }

  /* ================= LOADING ================= */

  if (loading) {

    return (
      <div className="text-gray-400">
        Loading products...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold text-white">
            Products
          </h1>

          <p className="text-gray-500 mt-1">
            Manage store inventory
          </p>

        </div>

        <Link
          to="/admin/products/new"
          className="
            inline-flex items-center gap-2

            bg-green-500
            text-black

            px-5 py-2.5
            rounded-xl

            font-semibold
            text-sm

            hover:bg-green-400
            transition
          "
        >

          <span className="text-lg leading-none">
            +
          </span>

          Add Product

        </Link>

      </div>

      {/* FILTERS */}

      <div className="flex flex-wrap items-center gap-4">

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {

            setSearch(e.target.value);

            setPage(1);

          }}
          className="
            bg-black
            border border-zinc-800

            text-white

            px-4 py-3
            rounded-xl

            focus:outline-none
            focus:border-green-500/30
          "
        />

        {/* CATEGORY */}

       <select
  value={category}
  onChange={(e) => {

    setCategory(e.target.value);

    setPage(1);

  }}
  className="
    bg-black
    border border-zinc-800

    text-white

    px-4 py-3
    rounded-xl

    focus:outline-none
    focus:border-green-500/30
  "
>

  <option value="">
    All Categories
  </option>

 <option value="protein">Protein</option>

<option value="preworkout">Pre Workout</option>

<option value="creatine">Creatine</option>

<option value="aminos">Aminos</option>

<option value="vitamins">Vitamins</option>

<option value="weightmanagement">
  Weight Management
</option>

</select>
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

          {/* TABLE HEAD */}

          <thead
            className="
              bg-[#181818]
              text-gray-400
              text-sm
            "
          >

            <tr>

              <th className="p-4 text-left font-medium">
                Image
              </th>

              <th className="p-4 text-left font-medium">
                Name
              </th>

              <th className="p-4 text-left font-medium">
                Price
              </th>

              <th className="p-4 text-left font-medium">
                Actions
              </th>

            </tr>

          </thead>

          {/* TABLE BODY */}

          <tbody>

            {products.map((p) => (

              <tr
                key={p.id}
                className="
                  border-t border-zinc-800

                  hover:bg-[#1a1a1a]

                  transition
                "
              >

                {/* IMAGE */}

                <td className="p-4">

                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="
                      w-14 h-14
                      rounded-xl
                      object-cover

                      border border-zinc-700
                    "
                  />

                </td>

                {/* NAME */}

                <td className="p-4">

                  <p className="text-white font-medium">
                    {p.name}
                  </p>

                </td>

                {/* PRICE */}

                <td
                  className="
                    p-4
                    text-green-400
                    font-semibold
                  "
                >
                  ₹{p.price}
                </td>

                {/* ACTIONS */}

                <td className="p-4">

                  <div className="flex items-center gap-3">

                    {/* EDIT */}

                    <Link
                      to={`/admin/products/${p.id}`}
                      className="
                        px-3 py-1.5
                        rounded-lg
                        text-sm

                        text-green-400

                        border border-green-500/20

                        hover:bg-green-500/10

                        transition
                      "
                    >
                      Edit
                    </Link>

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        confirmDelete(p)
                      }
                      className="
                        px-3 py-1.5
                        rounded-lg
                        text-sm

                        text-red-400

                        border border-red-500/20

                        hover:bg-red-500/10

                        transition
                      "
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>
            ))}

            {/* EMPTY */}

            {products.length === 0 && (

              <tr>

                <td
                  colSpan="4"
                  className="
                    p-8
                    text-center
                    text-gray-500
                  "
                >
                  No products found
                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}

      <div className="flex items-center justify-between">

        <button
          disabled={page === 1}
          onClick={() =>
            setPage((prev) => prev - 1)
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
            setPage((prev) => prev + 1)
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