import { ReactNode, useState } from "react";
import { Search, Filter, Download, Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeepResearchViewProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onExport?: () => void;
  className?: string;
}

export const DeepResearchView = ({
  title,
  subtitle,
  children,
  onExport,
  className,
}: DeepResearchViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("fy");

  const dateRanges = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "fy", label: "This FY" },
    { value: "custom", label: "Custom" },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-48 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary">
            {dateRanges.slice(0, 4).map((range) => (
              <button
                key={range.value}
                onClick={() => setDateRange(range.value)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  dateRange === range.value
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Filter */}
          <button className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
            <Filter className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Export */}
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="glass-card p-6">{children}</div>
    </div>
  );
};
