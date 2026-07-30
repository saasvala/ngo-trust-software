import { toast } from "sonner";

/**
 * Global, accessible notification helpers.
 *
 * Every message is announced to assistive tech: sonner renders its toast
 * region with role="status" / aria-live="polite", and we escalate errors to
 * aria-live="assertive" so failures are never silently missed.
 */

type NotifyOptions = {
  description?: string;
  /** Optional recovery action, e.g. "Retry" */
  action?: { label: string; onClick: () => void };
  duration?: number;
};

const politeProps = {
  role: "status" as const,
  "aria-live": "polite" as const,
};

const assertiveProps = {
  role: "alert" as const,
  "aria-live": "assertive" as const,
};

export const notify = {
  success(message: string, options: NotifyOptions = {}) {
    return toast.success(message, {
      ...options,
      duration: options.duration ?? 4000,
      ...politeProps,
    });
  },
  error(message: string, options: NotifyOptions = {}) {
    return toast.error(message, {
      ...options,
      description:
        options.description ?? "Nothing was saved. You can safely try again.",
      duration: options.duration ?? 7000,
      ...assertiveProps,
    });
  },
  warning(message: string, options: NotifyOptions = {}) {
    return toast.warning(message, {
      ...options,
      duration: options.duration ?? 6000,
      ...assertiveProps,
    });
  },
  info(message: string, options: NotifyOptions = {}) {
    return toast.info(message, {
      ...options,
      duration: options.duration ?? 4000,
      ...politeProps,
    });
  },
  loading(message: string) {
    return toast.loading(message, politeProps);
  },
  dismiss(id?: string | number) {
    toast.dismiss(id);
  },
  /**
   * Wraps an async action with loading -> success/failure announcements.
   * Always resolves so callers never need a try/catch just for the toast.
   */
  async action<T>(
    fn: () => Promise<T> | T,
    messages: { loading: string; success: string; error: string },
  ): Promise<{ ok: boolean; data?: T; error?: unknown }> {
    const id = notify.loading(messages.loading);
    try {
      const data = await fn();
      toast.dismiss(id);
      notify.success(messages.success);
      return { ok: true, data };
    } catch (error) {
      toast.dismiss(id);
      notify.error(messages.error, {
        description:
          error instanceof Error ? error.message : "Unexpected error occurred.",
      });
      return { ok: false, error };
    }
  },
};

export type Notify = typeof notify;