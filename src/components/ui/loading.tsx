import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

/* ────────────────────────────────────────────────────────────
   SKELETON VARIANTS
   ──────────────────────────────────────────────────────────── */

/** Base skeleton — thin wrapper around the existing Skeleton */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

/** Page overlay spinner for full-page loads */
function PageLoader({ className, text = "Loading..." }: { className?: string; text?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12",
        className
      )}
    >
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}

/** Inline spinner for buttons / small areas */
function InlineSpinner({ className }: { className?: string }) {
  return (
    <Loader2 className={cn("w-4 h-4 animate-spin text-primary", className)} />
  );
}

/* ─── Card Skeletons ─── */

function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("glass-card p-5 space-y-3", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
      </div>
    </div>
  );
}

function GlassCardSkeleton({ className, lines = 2 }: { className?: string; lines?: number }) {
  return (
    <div className={cn("glass-card p-4 space-y-2", className)}>
      <Skeleton className="h-4 w-3/4" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" />
      ))}
    </div>
  );
}

/* ─── Table Skeleton ─── */

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
  showHeader?: boolean;
}

function TableSkeleton({ rows = 5, columns = 6, className, showHeader = true }: TableSkeletonProps) {
  return (
    <div className={cn("w-full", className)}>
      {showHeader && (
        <div className="flex gap-3 mb-3 px-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton
              key={`h-${i}`}
              className={cn("h-4", i === 0 ? "w-1/6" : i === columns - 1 ? "w-1/12" : "flex-1")}
            />
          ))}
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, ri) => (
          <div
            key={`r-${ri}`}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/20"
          >
            {Array.from({ length: columns }).map((_, ci) => (
              <Skeleton
                key={`c-${ci}`}
                className={cn(
                  "h-3.5",
                  ci === 0 ? "w-1/6" : ci === columns - 1 ? "w-1/12" : "flex-1"
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── List Skeleton ─── */

interface ListSkeletonProps {
  items?: number;
  className?: string;
  avatar?: boolean;
}

function ListSkeleton({ items = 5, className, avatar = false }: ListSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20"
        >
          {avatar && <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}

/* ─── Dashboard Section Skeleton ─── */

function DashboardSectionSkeleton({
  statCards = 4,
  className,
}: {
  statCards?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Stat row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: statCards }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Two panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5 space-y-4">
          <Skeleton className="h-5 w-40" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
        <div className="glass-card p-5 space-y-4">
          <Skeleton className="h-5 w-40" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Grid cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <GlassCardSkeleton key={i} lines={1} />
        ))}
      </div>
    </div>
  );
}

/* ─── Empty State ─── */

function EmptyState({
  icon,
  title,
  description,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
    >
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">{description}</p>
      )}
    </div>
  );
}

export {
  Skeleton,
  PageLoader,
  InlineSpinner,
  StatCardSkeleton,
  GlassCardSkeleton,
  TableSkeleton,
  ListSkeleton,
  DashboardSectionSkeleton,
  EmptyState,
};
