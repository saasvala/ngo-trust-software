import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  iconBg?: "primary" | "coral" | "teal" | "success";
}

const iconBgClasses = {
  primary: "bg-primary/20 text-primary",
  coral: "bg-coral/20 text-coral",
  teal: "bg-teal/20 text-teal",
  success: "bg-success/20 text-emerald-400",
};

export const StatCard = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  iconBg = "primary",
}: StatCardProps) => {
  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend === "up" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {change}
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBgClasses[iconBg]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
