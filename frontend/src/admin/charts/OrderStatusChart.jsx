import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#facc15", "#38bdf8", "#22c55e"];

export default function OrderStatusChart({ orders }) {
  const data = [
    {
      name: "Pending",
      value: orders.filter(o => o.status === "pending").length,
    },
    {
      name: "Shipped",
      value: orders.filter(o => o.status === "shipped").length,
    },
    {
      name: "Delivered",
      value: orders.filter(o => o.status === "delivered").length,
    },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 h-80">
      <h2 className="text-white font-semibold mb-4">
        Order Status
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
