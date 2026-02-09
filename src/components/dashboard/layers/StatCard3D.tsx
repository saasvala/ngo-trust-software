import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "./AnimatedCounter";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCard3DProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: ReactNode;
  iconBg?: "primary" | "coral" | "teal" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const iconBgColors = {
  primary: "bg-gradient-to-br from-primary to-purple-glow",
  coral: "bg-gradient-to-br from-coral to-orange-500",
  teal: "bg-gradient-to-br from-teal to-emerald-500",
  success: "bg-gradient-to-br from-success to-green-500",
  warning: "bg-gradient-to-br from-warning to-amber-500",
};

export const StatCard3D = ({
  title,
  value,
  prefix = "",
  suffix = "",
  change,
  trend = "neutral",
  icon,
  iconBg = "primary",
  size = "md",
  className,
}: StatCard3DProps) => {
  const sizeClasses = {
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
  };

  const iconSizes = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-14 h-14",
  };

  return (
    <div
      className={cn(
        "glass-card group relative overflow-hidden transition-all duration-300",
        "hover:translate-y-[-2px] hover:shadow-xl hover:shadow-primary/10",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-0 before:transition-opacity",
        "hover:before:opacity-100",
        sizeClasses[size],
        className
      )}
    >
      {/* Decorative glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground truncate mb-1">{title}</p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <AnimatedCounter
              value={value}
              prefix={prefix}
              className="text-2xl font-bold text-foreground"
            />
            {suffix && (
              <span className="text-sm text-muted-foreground">{suffix}</span>
            )}
          </div>
          {change && (
            <div
              className={cn(
                "flex items-center gap-1 mt-2 text-xs font-medium",
                trend === "up" && "text-success",
                trend === "down" && "text-coral",
                trend === "neutral" && "text-muted-foreground"
              )}
            >
              {trend === "up" && <TrendingUp className="w-3 h-3" />}
              {trend === "down" && <TrendingDown className="w-3 h-3" />}
              <span>{change}</span>
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex-shrink-0 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
            iconBgColors[iconBg],
            iconSizes[size]
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
