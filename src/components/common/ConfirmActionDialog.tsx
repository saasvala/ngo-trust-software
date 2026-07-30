import { useEffect, useId, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRules } from "@/contexts/RuleContext";
import type { RolePermissions } from "@/lib/types/rules";
import { notify } from "@/lib/notify";
import { AlertTriangle, ShieldAlert, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type PermissionKey = keyof Omit<RolePermissions, "role" | "dashboardWidgets">;

interface ConfirmActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  /** Extra irreversibility notice shown in a highlighted block. */
  impact?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "destructive";
  /** Permission the current role must hold to perform the action. */
  requiredPermission?: PermissionKey;
  /** Human label used in the "not allowed" message. */
  actionLabel?: string;
  /** Force a typed reason before confirming (mandatory on rejections). */
  requireReason?: boolean;
  reasonLabel?: string;
  onConfirm: (reason: string) => void | Promise<void>;
}

export const ConfirmActionDialog = ({
  open,
  onOpenChange,
  title,
  description,
  impact,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  requiredPermission,
  actionLabel = "this action",
  requireReason = false,
  reasonLabel = "Reason",
  onConfirm,
}: ConfirmActionDialogProps) => {
  const { permissions, currentRole } = useRules();
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const reasonId = useId();
  const errorId = `${reasonId}-error`;
  const reasonRef = useRef<HTMLTextAreaElement>(null);

  const allowed = requiredPermission
    ? Boolean(permissions?.[requiredPermission])
    : true;

  useEffect(() => {
    if (open) {
      setReason("");
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  const handleConfirm = async () => {
    if (!allowed) return;
    if (requireReason && reason.trim().length < 5) {
      setError("Please enter at least 5 characters explaining this decision.");
      reasonRef.current?.focus();
      return;
    }
    try {
      setSubmitting(true);
      await onConfirm(reason.trim());
      onOpenChange(false);
    } catch (err) {
      setSubmitting(false);
      setError(
        err instanceof Error ? err.message : "The action could not be completed.",
      );
      notify.error("Action failed", {
        description: "No changes were saved. Review the details and retry.",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                allowed
                  ? tone === "destructive"
                    ? "bg-destructive/20"
                    : "bg-primary/20"
                  : "bg-warning/20",
              )}
              aria-hidden="true"
            >
              {allowed ? (
                <AlertTriangle
                  className={cn(
                    "w-5 h-5",
                    tone === "destructive" ? "text-destructive" : "text-primary",
                  )}
                />
              ) : (
                <ShieldAlert className="w-5 h-5 text-warning" />
              )}
            </div>
            <div className="min-w-0">
              <AlertDialogTitle>
                {allowed ? title : "You don't have permission"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {allowed
                  ? description
                  : `Your current role (${currentRole.replace(/_/g, " ")}) is not authorised to perform ${actionLabel}. Ask an administrator with the right permission, or switch roles.`}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {allowed && impact && (
          <p className="text-xs text-warning bg-warning/10 border border-warning/20 rounded-lg p-3">
            {impact}
          </p>
        )}

        {allowed && requireReason && (
          <div className="space-y-2">
            <Label htmlFor={reasonId}>
              {reasonLabel} <span aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </Label>
            <Textarea
              id={reasonId}
              ref={reasonRef}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              required
              aria-required="true"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              placeholder="This reason is stored in the audit trail."
              className="bg-secondary border-border"
            />
          </div>
        )}

        {allowed && error && (
          <p id={errorId} role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>
            {allowed ? cancelLabel : "Close"}
          </AlertDialogCancel>
          {allowed && (
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleConfirm();
              }}
              disabled={submitting}
              className={cn(
                tone === "destructive" &&
                  "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              )}
            >
              {submitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
              )}
              {confirmLabel}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};