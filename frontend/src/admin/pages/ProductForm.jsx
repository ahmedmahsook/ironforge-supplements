import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import toast from "react-hot-toast";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
  });

  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;

    async function fetchProduct() {
      try {
        const res = await api.get(`/products/${id}`);
        setForm(res.data);
      } catch {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id, isEdit]);

 

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  

  function validateForm() {
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return false;
    }

    if (form.name.length < 3) {
      toast.error("Product name must be at least 3 characters");
      return false;
    }

    if (!form.price) {
      toast.error("Price is required");
      return false;
    }

    if (isNaN(form.price) || Number(form.price) <= 0) {
      toast.error("Price must be a positive number");
      return false;
    }

    if (!form.category.trim()) {
      toast.error("Category is required");
      return false;
    }

    if (!form.image.trim()) {
      toast.error("Image URL is required");
      return false;
    }

    try {
      new URL(form.image);
    } catch {
      toast.error("Invalid image URL");
      return false;
    }

    return true;
  }



  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isEdit) {
        await api.patch(`/products/${id}`, {
          ...form,
          price: Number(form.price),
        });
        toast.success("Product updated successfully");
      } else {
        await api.post("/products", {
          ...form,
          price: Number(form.price),
        });
        toast.success("Product added successfully");
      }

      navigate("/admin/products");
    } catch {
      toast.error("Failed to save product");
    }
  }

  

  if (loading) {
    return <p className="text-gray-400">Loading product...</p>;
  }

 

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-white">
        {isEdit ? "Edit Product" : "Add Product"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4"
      >
        <input
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          className="w-full bg-black border border-gray-800 text-white p-3 rounded-lg"
        />

        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full bg-black border border-gray-800 text-white p-3 rounded-lg"
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full bg-black border border-gray-800 text-white p-3 rounded-lg"
        />

        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="w-full bg-black border border-gray-800 text-white p-3 rounded-lg"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-green-500 text-black px-6 py-3 rounded-lg font-semibold"
          >
            {isEdit ? "Update Product" : "Add Product"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="bg-gray-700 text-white px-6 py-3 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
