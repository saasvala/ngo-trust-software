import { AlertCircle, Inbox, RefreshCw, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Consistent empty state used by every table, list and form section. */
export const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}) => (
  <div
    role="status"
    className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className,
    )}
  >
    <div
      className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center mb-4"
      aria-hidden="true"
    >
      {icon ?? <Inbox className="w-6 h-6 text-muted-foreground" />}
    </div>
    <p className="text-sm font-medium text-foreground">{title}</p>
    {description && (
      <p className="text-xs text-muted-foreground mt-1 max-w-sm">{description}</p>
    )}
    {(actionLabel || secondaryActionLabel) && (
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
        {actionLabel && onAction && (
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button size="sm" variant="outline" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    )}
  </div>
);

/** Empty state specialised for "filters matched nothing". */
export const NoResultsState = ({
  entity,
  onClearFilters,
}: {
  entity: string;
  onClearFilters?: () => void;
}) => (
  <EmptyState
    icon={<SearchX className="w-6 h-6 text-muted-foreground" />}
    title={`No ${entity} match your filters`}
    description="Try a different search term, or clear the filters to see everything again."
    actionLabel={onClearFilters ? "Clear filters" : undefined}
    onAction={onClearFilters}
  />
);

/** Block-level error with a recovery path. Announced assertively. */
export const ErrorState = ({
  title = "Something went wrong",
  description = "We couldn't load this data. Check your connection and try again.",
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) => (
  <div
    role="alert"
    className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-destructive/20 bg-destructive/5",
      className,
    )}
  >
    <div
      className="w-12 h-12 rounded-xl bg-destructive/15 flex items-center justify-center mb-4"
      aria-hidden="true"
    >
      <AlertCircle className="w-6 h-6 text-destructive" />
    </div>
    <p className="text-sm font-medium text-foreground">{title}</p>
    <p className="text-xs text-muted-foreground mt-1 max-w-sm">{description}</p>
    {onRetry && (
      <Button size="sm" variant="outline" className="mt-4" onClick={onRetry}>
        <RefreshCw className="w-3.5 h-3.5 mr-2" aria-hidden="true" />
        Try again
      </Button>
    )}
  </div>
);

/** Inline field-level error, wired to an input via aria-describedby. */
export const InlineError = ({
  id,
  message,
  className,
}: {
  id?: string;
  message?: string | null;
  className?: string;
}) => {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className={cn("flex items-center gap-1.5 text-xs text-destructive", className)}
    >
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
};