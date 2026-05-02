import CategoryCard from "./CategoryCard"

const categories = [
  {
    name: "Protein",
    slug: "protein",
    image: "/categories/protein.jpeg",
  },
  {
    name: "Pre Workout",
    slug: "pre-workout",
    image: "/categories/preworkout.jpeg",
  },
  {
    name: "Creatine",
    slug: "creatine",
    image: "/categories/extra1.jpeg",
  },
  {
    name: "Aminos",
    slug: "aminos",
    image: "/categories/extra2.jpeg",
  },
  {
    name: "Vitamins",
    slug: "vitamins",
    image: "/categories/vitamins.jpeg",
  },
  {
    name: "Weight Management",
    slug: "weight-management",
    image: "/categories/fatburner.jpeg",
  },
]

export default function CategoryGrid() {
  return (
    <section className="relative py-20">

      {/* BACKGROUND GLOW */}
      <div
        className="
          absolute top-0 left-1/2
          -translate-x-1/2
          w-[500px] h-[500px]
          bg-green-500/5
          blur-[120px]
          rounded-full
        "
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-white tracking-tight">
             Category
          </h2>

          <p className="text-gray-400 text-sm mt-2 max-w-md">
            Find supplements tailored to your fitness goals
          </p>
        </div>

        {/* GRID */}
        <div
          className="
            grid gap-6
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>

      </div>

    </section>
  )
}