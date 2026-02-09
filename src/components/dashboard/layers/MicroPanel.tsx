import { ReactNode, useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MicroPanelProps {
  trigger: ReactNode;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export const MicroPanel = ({
  trigger,
  title,
  subtitle,
  children,
  className,
}: MicroPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-full text-left group flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-all duration-200",
          className
        )}
      >
        {trigger}
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </button>

      {/* Slide-in Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-background border-l border-border z-50 animate-slide-in-right overflow-y-auto">
            {/* Panel Header */}
            <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">{title}</h3>
                {subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="p-6">{children}</div>
          </div>
        </>
      )}
    </>
  );
};
