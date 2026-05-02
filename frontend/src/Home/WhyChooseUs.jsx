import { ShieldCheck, Truck, Award } from "lucide-react"

const reasons = [
  {
    icon: ShieldCheck,
    title: "Lab Tested Quality",
    desc: "Every supplement is tested for purity and safety.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Reliable shipping across India, straight to your door.",
  },
  {
    icon: Award,
    title: "Trusted by Athletes",
    desc: "Chosen by fitness enthusiasts and professionals.",
  },
]

export default function WhyChooseUs() {
  return (
    <section className="relative py-20">

      {/* subtle glow */}
      <div className="
        absolute top-0 left-1/2
        -translate-x-1/2
        w-[500px] h-[500px]
        bg-green-500/5
        blur-[120px]
        rounded-full
      " />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* HEADER (LEFT = PREMIUM) */}
        <div className="mb-12 max-w-lg">
          <h2 className="text-3xl font-semibold text-white tracking-tight">
            Why Choose IronForge
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            Built for performance, trusted for results
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-6">

          {reasons.map((item, index) => {
            const Icon = item.icon

            return (
              <div
                key={index}
                className="
                  group
                  relative
                  border border-zinc-800
                  rounded-xl
                  p-6
                  transition
                  hover:border-green-500/40
                  hover:-translate-y-1
                "
              >

                {/* ICON */}
                <div className="
                  w-12 h-12 mb-5
                  flex items-center justify-center
                  rounded-lg
                  bg-green-500/10
                  group-hover:bg-green-500/20
                  transition
                ">
                  <Icon size={22} className="text-green-400" />
                </div>

                {/* TITLE */}
                <h3 className="text-base font-semibold text-white">
                  {item.title}
                </h3>

                {/* DESC */}
                <p className="text-sm text-gray-400 mt-3 leading-relaxed">
                  {item.desc}
                </p>

                {/* subtle hover glow */}
                <div className="
                  absolute inset-0
                  rounded-xl
                  opacity-0
                  group-hover:opacity-100
                  transition
                  shadow-[0_10px_30px_rgba(34,197,94,0.1)]
                " />

              </div>
            )
          })}

        </div>

      </div>

    </section>
  )
}