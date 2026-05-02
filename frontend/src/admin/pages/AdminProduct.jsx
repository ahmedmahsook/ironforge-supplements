import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import toast from "react-hot-toast";

export default function AdminProduct() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch {
      toast.error("Failed to load products");
    }
  }

  function confirmDelete(product) {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-white">
            Delete <span className="font-semibold">{product.name}</span>?
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="
                px-3 py-1.5 text-sm rounded-md
                bg-gray-800 text-gray-300
                hover:bg-gray-700
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
                px-3 py-1.5 text-sm rounded-md
                bg-red-600 text-white
                hover:bg-red-700
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
          background: "#161616",
          border: "1px solid #2a2a2a",
        },
      }
    );
  }

  async function deleteProduct(id) {
    const toastId = toast.loading("Deleting product...");

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted", { id: toastId });
    } catch {
      toast.error("Failed to delete product", { id: toastId });
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          Products
        </h1>

        <Link
          to="/admin/products/new"
          className="
            inline-flex items-center gap-2
            bg-green-500 text-black
            px-5 py-2.5
            rounded-lg
            font-semibold
            text-sm
            hover:bg-green-400
            transition
          "
        >
          <span className="text-lg leading-none">+</span>
          Add Product
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800 text-gray-300 text-sm">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-t border-gray-800 hover:bg-gray-800/40 transition"
              >
                <td className="p-4">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-700"
                  />
                </td>

                <td className="p-4 text-white font-medium">
                  {p.name}
                </td>

                <td className="p-4 text-green-400 font-semibold">
                  ₹{p.price}
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/admin/products/${p.id}`}
                      className="
                        px-3 py-1.5 rounded-md text-sm
                        text-green-400 border border-green-500/30
                        hover:bg-green-500/10 transition
                      "
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => confirmDelete(p)}
                      className="
                        px-3 py-1.5 rounded-md text-sm
                        text-red-400 border border-red-500/30
                        hover:bg-red-500/10 transition
                      "
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-400">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
