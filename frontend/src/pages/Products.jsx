import { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";

import PageContainer from "../components/layout/PageContainer";

import ProductGrid from "../Products/ProductGrid";

import useProducts from "../Hooks/useProducts";

import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

export default function Products() {
  const [params, setParams] =
    useSearchParams();

  const urlCategory =
    params.get("category") ||
    "all";

  /* ================= FILTER STATES ================= */

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState(urlCategory);

  const [priceRange, setPriceRange] =
    useState("all");

  const [page, setPage] =
    useState(1);

  /* ================= FETCH PRODUCTS ================= */

  const {
    products,
    loading,
    error,
    pagination,
  } = useProducts({
    search,
    category,
    priceRange,
    page,
  });

  /* ================= URL CATEGORY SYNC ================= */

  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

  /* ================= CATEGORIES ================= */

  const categories = [
    { label: "All", value: "all" },

    ...Array.from(
      new Map(
        products.map((p) => [
          p.category,
          {
            label: p.category,
            value: p.category,
          },
        ])
      ).values()
    ),
  ];

  /* ================= CATEGORY CHANGE ================= */

  const handleCategoryChange = (
    value
  ) => {
    setCategory(value);

    setPage(1);

    value === "all"
      ? setParams({})
      : setParams({
          category: value,
        });
  };

  /* ================= RESET ================= */

  const handleReset = () => {
    setSearch("");

    setCategory("all");

    setPriceRange("all");

    setPage(1);

    setParams({});
  };

  /* ================= ACTIVE FILTER CHECK ================= */

  const hasFilters =
    search ||
    category !== "all" ||
    priceRange !== "all";

  return (
    <PageContainer>
      {/* ================= PAGE HEADER ================= */}

      <div className="mb-10 pt-2">
        <div className="flex items-end justify-between">
          <div>
            <p
              className="
                text-[11px]
                text-green-400/80
                uppercase
                tracking-[0.3em]
                font-medium
                mb-2
              "
            >
              Store
            </p>

            <h1
              className="
                text-4xl
                font-black
                text-white
                tracking-tight
                leading-none
              "
            >
              Products
            </h1>
          </div>

          {!loading && (
            <p className="text-sm text-zinc-500 mb-1">
              <span className="text-white font-semibold">
                {
                  pagination.total
                }
              </span>{" "}
              items
            </p>
          )}
        </div>

        {/* decorative line */}

        <div
          className="
            mt-5 h-px
            bg-gradient-to-r
            from-green-500/40
            via-zinc-700
            to-transparent
          "
        />
      </div>

      {/* ================= FILTER BAR ================= */}

      <div className="mb-10 space-y-3">
        {/* SEARCH */}

        <div className="relative">
          <Search
            size={15}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-zinc-500
              pointer-events-none
            "
          />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(
                e.target.value
              );

              setPage(1);
            }}
            className="
              w-full
              pl-11 pr-4 py-3
              bg-zinc-900/60
              border border-zinc-800
              rounded-xl
              text-white text-sm
              placeholder:text-zinc-600
              focus:outline-none
              focus:border-green-500/50
              focus:bg-zinc-900
              transition-all duration-200
            "
          />
        </div>

        {/* CATEGORY + PRICE */}

        <div className="flex flex-wrap items-center gap-2">
          {/* CATEGORY PILLS */}

          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map(
              (cat) => (
                <button
                  key={cat.value}
                  onClick={() =>
                    handleCategoryChange(
                      cat.value
                    )
                  }
                  className={`
                    px-3.5 py-1.5 rounded-lg text-xs font-medium
                    transition-all duration-200
                    ${
                      category ===
                      cat.value
                        ? "bg-green-500 text-black shadow-[0_0_12px_rgba(74,222,128,0.3)]"
                        : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-white"
                    }
                  `}
                >
                  {cat.label}
                </button>
              )
            )}
          </div>

          {/* SPACER */}

          <div className="flex-1" />

          {/* PRICE */}

          <div className="relative">
            <SlidersHorizontal
              size={13}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-zinc-500
                pointer-events-none
              "
            />

            <select
              value={priceRange}
              onChange={(e) => {
                setPriceRange(
                  e.target.value
                );

                setPage(1);
              }}
              className="
                appearance-none
                pl-8 pr-8 py-2
                bg-zinc-900
                border border-zinc-800
                rounded-lg
                text-white text-xs font-medium
                focus:outline-none
                focus:border-green-500/50
                transition-colors duration-200
                cursor-pointer
              "
            >
              <option value="all">
                All Prices
              </option>

              <option value="low">
                Below ₹1000
              </option>

              <option value="mid">
                ₹1000 – ₹2000
              </option>

              <option value="high">
                Above ₹2000
              </option>
            </select>

            <span
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-zinc-500
                text-[10px]
                pointer-events-none
              "
            >
              ▾
            </span>
          </div>

          {/* RESET */}

          {hasFilters && (
            <button
              onClick={
                handleReset
              }
              className="
                flex items-center gap-1.5
                px-3 py-2
                text-xs text-zinc-400
                border border-zinc-800
                rounded-lg
                hover:text-red-400
                hover:border-red-500/30
                hover:bg-red-500/5
                transition-all duration-200
              "
            >
              <X size={12} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div
          className="
            mb-6
            px-4 py-3
            rounded-xl
            border border-red-500/20
            bg-red-500/5
            text-red-400
            text-sm
          "
        >
          {error}
        </div>
      )}

      {/* ================= GRID ================= */}

      <ProductGrid
        products={products}
        loading={loading}
      />

      {/* ================= PAGINATION ================= */}

      {pagination.total_pages > 1 && (
        <div
          className="
            flex items-center justify-center gap-3
            mt-14
          "
        >
          {/* PREV */}

          <button
            onClick={() =>
              setPage((prev) =>
                Math.max(
                  prev - 1,
                  1
                )
              )
            }
            disabled={page === 1}
            className="
              px-4 py-2
              rounded-lg
              border border-zinc-800
              bg-zinc-900
              text-sm text-white
              disabled:opacity-40
              disabled:cursor-not-allowed
              hover:border-green-500/40
              transition
            "
          >
            Prev
          </button>

          {/* PAGE NUMBERS */}

          {Array.from(
            {
              length:
                pagination.total_pages,
            },
            (_, index) => {
              const pageNumber =
                index + 1;

              return (
                <button
                  key={pageNumber}
                  onClick={() =>
                    setPage(
                      pageNumber
                    )
                  }
                  className={`
                    w-10 h-10
                    rounded-lg
                    text-sm font-medium
                    transition
                    ${
                      page ===
                      pageNumber
                        ? "bg-green-500 text-black"
                        : "bg-zinc-900 border border-zinc-800 text-white hover:border-green-500/40"
                    }
                  `}
                >
                  {pageNumber}
                </button>
              );
            }
          )}

          {/* NEXT */}

          <button
            onClick={() =>
              setPage((prev) =>
                Math.min(
                  prev + 1,
                  pagination.total_pages
                )
              )
            }
            disabled={
              page ===
              pagination.total_pages
            }
            className="
              px-4 py-2
              rounded-lg
              border border-zinc-800
              bg-zinc-900
              text-sm text-white
              disabled:opacity-40
              disabled:cursor-not-allowed
              hover:border-green-500/40
              transition
            "
          >
            Next
          </button>
        </div>
      )}
    </PageContainer>
  );
}