import { useEffect, useState } from "react";

import api from "../api/api";

export default function useProducts({
  search = "",
  category = "",
  priceRange = "",
  page = 1,
} = {}) {

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 12,
      total: 0,
      total_pages: 1,
    });

  useEffect(() => {

    const fetchProducts =
      async () => {

        // TRACK LOADING START TIME

        const start =
          Date.now();

        try {

          // SHOW SKELETON

          setLoading(true);

          setError("");

          /* ================= QUERY PARAMS ================= */

          const params =
            new URLSearchParams();

          /* PAGE */

          params.append(
            "page",
            page
          );

          /* LIMIT */

          params.append(
            "limit",
            12
          );

          /* SEARCH */

          if (search.trim()) {

            params.append(
              "search",
              search.trim()
            );

          }

          /* CATEGORY */

          if (
            category &&
            category !== "all"
          ) {

            params.append(
              "category",
              category
            );

          }

          /* PRICE FILTER */

          if (
            priceRange === "low"
          ) {

            params.append(
              "max_price",
              1000
            );

          }

          if (
            priceRange === "mid"
          ) {

            params.append(
              "min_price",
              1000
            );

            params.append(
              "max_price",
              2000
            );

          }

          if (
            priceRange === "high"
          ) {

            params.append(
              "min_price",
              2000
            );

          }

          /* ================= API CALL ================= */

          const res =
            await api.get(
              `/products?${params.toString()}`
            );

          /* ================= SET PRODUCTS ================= */

          setProducts(
            res.data.data || []
          );

          setPagination({

            page:
              res.data.page || 1,

            limit:
              res.data.limit || 12,

            total:
              res.data.total || 0,

            total_pages:
              res.data.total_pages || 1,

          });

        } catch (err) {

          console.error(
            "Failed to load products:",
            err
          );

          setError(
            "Failed to load products"
          );

        } finally {

          // KEEP SKELETON VISIBLE
          // FOR AT LEAST 400ms

          const elapsed =
            Date.now() - start;

          const remaining =
            400 - elapsed;

          if (remaining > 0) {

            await new Promise(
              (resolve) =>
                setTimeout(
                  resolve,
                  remaining
                )
            );

          }

          setLoading(false);

        }

      };

    fetchProducts();

  }, [
    search,
    category,
    priceRange,
    page,
  ]);

  return {

    products,

    loading,

    error,

    pagination,

  };

}