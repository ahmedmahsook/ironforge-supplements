import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../../api/api";

import toast from "react-hot-toast";

export default function ProductForm() {

  const { id } = useParams();

  const navigate =
    useNavigate();

  const isEdit =
    Boolean(id);

  const [form, setForm] =
    useState({
      name: "",
      price: "",
      category: "",
      description: "",
      image: "",
    });

  const [loading, setLoading] =
    useState(isEdit);

  /* ================= FETCH PRODUCT ================= */

  useEffect(() => {

    if (!isEdit) return;

    async function fetchProduct() {

      try {

        const res =
          await api.get(
            `/products/${id}`
          );

        setForm({

          name:
            res.data.name || "",

          price:
            res.data.price || "",

          category:
            res.data.category || "",

          description:
            res.data.description || "",

          image:
            res.data.image || "",

        });

      } catch (err) {

        console.error(
          "Failed to fetch product",
          err
        );

        toast.error(
          "Failed to load product"
        );

      } finally {

        setLoading(false);

      }
    }

    fetchProduct();

  }, [id, isEdit]);

  /* ================= HANDLE CHANGE ================= */

  function handleChange(e) {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });
  }

  /* ================= VALIDATION ================= */

  function validateForm() {

    if (!form.name.trim()) {

      toast.error(
        "Product name is required"
      );

      return false;
    }

    if (
      form.name.length < 3
    ) {

      toast.error(
        "Product name must be at least 3 characters"
      );

      return false;
    }

    if (!form.price) {

      toast.error(
        "Price is required"
      );

      return false;
    }

    if (
      isNaN(form.price) ||
      Number(form.price) <= 0
    ) {

      toast.error(
        "Price must be a positive number"
      );

      return false;
    }

    if (
      !form.category.trim()
    ) {

      toast.error(
        "Category is required"
      );

      return false;
    }

    if (
      !form.description.trim()
    ) {

      toast.error(
        "Description is required"
      );

      return false;
    }

    if (
      !form.image.trim()
    ) {

      toast.error(
        "Image URL is required"
      );

      return false;
    }

    try {

      new URL(form.image);

    } catch {

      toast.error(
        "Invalid image URL"
      );

      return false;
    }

    return true;
  }

  /* ================= SUBMIT ================= */

  async function handleSubmit(e) {

    e.preventDefault();

    if (!validateForm()) return;

    const toastId =
      toast.loading(

        isEdit
          ? "Updating product..."
          : "Adding product..."

      );

    try {

      if (isEdit) {

        await api.put(
          `/products/${id}`,
          {

            ...form,

            price:
              Number(form.price),

          }
        );

        toast.success(
          "Product updated successfully",
          {
            id: toastId,
          }
        );

      } else {

        await api.post(
          "/products",
          {

            ...form,

            price:
              Number(form.price),

          }
        );

        toast.success(
          "Product added successfully",
          {
            id: toastId,
          }
        );
      }

      navigate(
        "/admin/products"
      );

    } catch (err) {

      console.error(
        "Failed to save product",
        err
      );

      toast.error(

        err.response?.data?.error ||
          "Failed to save product",

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
        Loading product...
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">

      {/* HEADER */}

      <div>

        <h1
          className="
            text-3xl
            font-bold
            text-white
          "
        >
          {isEdit
            ? "Edit Product"
            : "Add Product"}
        </h1>

        <p
          className="
            text-gray-500
            mt-1
          "
        >
          {isEdit
            ? "Update product details"
            : "Create a new product"}
        </p>

      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="
          bg-[#141414]
          border border-zinc-800
          rounded-2xl
          p-6
          space-y-5
        "
      >

        {/* NAME */}

        <div className="space-y-2">

          <label className="text-sm text-gray-400">
            Product Name
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="
              w-full
              bg-black
              border border-zinc-800
              text-white
              px-4 py-3
              rounded-xl
              focus:outline-none
              focus:border-green-500/30
            "
          />

        </div>

        {/* PRICE */}

        <div className="space-y-2">

          <label className="text-sm text-gray-400">
            Price
          </label>

          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Enter price"
            className="
              w-full
              bg-black
              border border-zinc-800
              text-white
              px-4 py-3
              rounded-xl
              focus:outline-none
              focus:border-green-500/30
            "
          />

        </div>

        {/* CATEGORY */}

        <div className="space-y-2">

          <label className="text-sm text-gray-400">
            Category
          </label>

          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Enter category"
            className="
              w-full
              bg-black
              border border-zinc-800
              text-white
              px-4 py-3
              rounded-xl
              focus:outline-none
              focus:border-green-500/30
            "
          />

        </div>

        {/* DESCRIPTION */}

        <div className="space-y-2">

          <label className="text-sm text-gray-400">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            placeholder="Enter product description"
            className="
              w-full
              bg-black
              border border-zinc-800
              text-white
              px-4 py-3
              rounded-xl
              focus:outline-none
              focus:border-green-500/30
              resize-none
            "
          />

        </div>

        {/* IMAGE */}

        <div className="space-y-2">

          <label className="text-sm text-gray-400">
            Image URL
          </label>

          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Enter image URL"
            className="
              w-full
              bg-black
              border border-zinc-800
              text-white
              px-4 py-3
              rounded-xl
              focus:outline-none
              focus:border-green-500/30
            "
          />

        </div>

        {/* BUTTONS */}

        <div className="flex items-center gap-3 pt-2">

          <button
            type="submit"
            className="
              bg-green-500
              text-black
              px-6 py-3
              rounded-xl
              font-semibold
              hover:bg-green-400
              transition
            "
          >
            {isEdit
              ? "Update Product"
              : "Add Product"}
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/products"
              )
            }
            className="
              bg-zinc-800
              text-white
              px-6 py-3
              rounded-xl
              hover:bg-zinc-700
              transition
            "
          >
            Cancel
          </button>

        </div>

      </form>

    </div>
  );
}