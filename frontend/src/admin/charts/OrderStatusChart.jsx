import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#eab308",
  "#3b82f6",
  "#22c55e",
];

export default function OrderStatusChart({
  orders,
}) {

  const data = [
    {
      name: "Pending",
      value:
        orders.filter(
          (o) =>
            o.status ===
            "pending"
        ).length,
    },

    {
      name: "Shipped",
      value:
        orders.filter(
          (o) =>
            o.status ===
            "shipped"
        ).length,
    },

    {
      name: "Delivered",
      value:
        orders.filter(
          (o) =>
            o.status ===
            "delivered"
        ).length,
    },
  ];

  return (
    <div
      className="
        bg-[#141414]
        border border-zinc-800
        rounded-2xl
        p-6
        h-80
      "
    >

      <div className="mb-5">

        <h2 className="text-white font-semibold text-lg">
          Order Status
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Distribution of
          order processing
        </p>
      </div>

      <ResponsiveContainer
        width="100%"
        height="85%"
      >

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            innerRadius={55}
            paddingAngle={4}
          >

            {data.map(
              (_, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index
                    ]
                  }
                />
              )
            )}

          </Pie>
<Tooltip
  contentStyle={{
    backgroundColor: "#18181b",
    border: "1px solid #27272a",
    borderRadius: "12px",
    color: "#fff",
  }}
  itemStyle={{
    color: "#fff",
  }}
  labelStyle={{
    color: "#a1a1aa",
  }}
  cursor={{
    fill: "rgba(255,255,255,0.04)",
  }}
/>

        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}