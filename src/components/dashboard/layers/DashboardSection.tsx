import { ReactNode, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSectionProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  level: "macro" | "micro" | "nano" | "deep";
  defaultExpanded?: boolean;
  children: ReactNode;
  className?: string;
}

const levelStyles = {
  macro: {
    wrapper: "",
    header: "text-xl font-bold",
    iconBg: "bg-gradient-to-br from-primary to-coral",
  },
  micro: {
    wrapper: "glass-card p-6",
    header: "text-lg font-semibold",
    iconBg: "bg-primary/20",
  },
  nano: {
    wrapper: "bg-secondary/30 rounded-xl p-5 border border-border/50",
    header: "text-base font-medium",
    iconBg: "bg-teal/20",
  },
  deep: {
    wrapper: "bg-secondary/20 rounded-lg p-4 border border-border/30",
    header: "text-sm font-medium",
    iconBg: "bg-coral/20",
  },
};

export const DashboardSection = ({
  title,
  subtitle,
  icon,
  level,
  defaultExpanded = true,
  children,
  className,
}: DashboardSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const styles = levelStyles[level];
  const isCollapsible = level !== "macro";

  return (
    <div className={cn("animate-fade-in", styles.wrapper, className)}>
      {/* Header */}
      <button
        onClick={() => isCollapsible && setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center gap-3 text-left",
          isCollapsible && "cursor-pointer group",
          level === "macro" && "mb-6"
        )}
        disabled={!isCollapsible}
      >
        {icon && (
          <div
            className={cn(
              "flex items-center justify-center rounded-xl transition-transform duration-300",
              styles.iconBg,
              level === "macro" ? "w-12 h-12" : "w-10 h-10",
              isCollapsible && "group-hover:scale-105"
            )}
          >
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className={cn("text-foreground", styles.header)}>{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        {isCollapsible && (
          <div className="text-muted-foreground transition-transform duration-300">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </div>
        )}
      </button>

      {/* Content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          isCollapsible && !isExpanded && "max-h-0 opacity-0",
          isCollapsible && isExpanded && "max-h-[2000px] opacity-100",
          isCollapsible && "mt-4"
        )}
      >
        {children}
      </div>
    </div>
  );
};
