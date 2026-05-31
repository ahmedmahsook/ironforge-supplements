import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RevenueChart({
  orders,
}) {

  const revenueByDate =
    orders.reduce(
      (acc, order) => {

        const date =
          new Date(
            order.createdAt
          ).toLocaleDateString();

        acc[date] =
          (acc[date] || 0) +
          order.total_amount;

        return acc;
      },

      {}
    );

  const data =
    Object.entries(
      revenueByDate
    ).map(
      ([date, total]) => ({
        date,
        revenue: total,
      })
    );

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

      {/* HEADER */}

      <div className="mb-5">

        <h2 className="text-white font-semibold text-lg">
          Revenue Overview
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Revenue generated
          from orders
        </p>
      </div>

      {/* CHART */}

      <ResponsiveContainer
        width="100%"
        height="82%"
      >

        <BarChart data={data}>

          <XAxis
            dataKey="date"
            stroke="#71717a"
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            stroke="#71717a"
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            contentStyle={{
              background:
                "#111",
              border:
                "1px solid #27272a",
              borderRadius:
                "12px",
              color:
                "#fff",
            }}
          />

          <Bar
            dataKey="revenue"
            fill="#22c55e"
            radius={[
              8,
              8,
              0,
              0,
            ]}
          />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}