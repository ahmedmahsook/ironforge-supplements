import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RevenueChart({ orders }) {
  const revenueByDate = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + order.total;
    return acc;
  }, {});

  const data = Object.entries(revenueByDate).map(
    ([date, total]) => ({
      date,
      revenue: total,
    })
  );

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 h-80">
      <h2 className="text-white font-semibold mb-4">
        Revenue Over Time
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="date" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />
          <Bar dataKey="revenue" fill="#22c55e" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
