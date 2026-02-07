import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { month: "Apr", amount: 420000 },
  { month: "May", amount: 580000 },
  { month: "Jun", amount: 450000 },
  { month: "Jul", amount: 720000 },
  { month: "Aug", amount: 650000 },
  { month: "Sep", amount: 890000 },
  { month: "Oct", amount: 780000 },
  { month: "Nov", amount: 950000 },
  { month: "Dec", amount: 1120000 },
  { month: "Jan", amount: 980000 },
  { month: "Feb", amount: 1250000 },
  { month: "Mar", amount: 1450000 },
];

const formatAmount = (value: number) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return `₹${(value / 1000).toFixed(0)}K`;
};

export const DonationChart = () => {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-foreground">Donation Trends</h3>
          <p className="text-sm text-muted-foreground">Financial Year 2024-25</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-400">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+32% YoY</span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(270 70% 60%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(270 70% 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 20%)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(240 5% 65%)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(240 5% 65%)", fontSize: 12 }}
              tickFormatter={formatAmount}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(240 15% 10%)",
                border: "1px solid hsl(240 10% 20%)",
                borderRadius: "8px",
                color: "hsl(0 0% 98%)",
              }}
              formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Donations"]}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="hsl(270 70% 60%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAmount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
