import { useMemo } from "react";
import { toast as sonner } from "sonner";

type Notify = (title: string, description?: string) => void;

export interface Toast {
  success: Notify;
  error: Notify;
  warning: Notify;
  info: Notify;
}

/**
 * `const toast = useToast(); toast.success("Saved", "3 rows updated")`.
 *
 * The title is what happened and the description is the detail, kept as two
 * arguments so every toast in the app reads the same way round.
 *
 * An error stays up longer than the rest: the others confirm something the
 * person just did, while an error is the only one they have to read.
 */
export function useToast(): Toast {
  return useMemo(() => {
    const notify =
      (type: "success" | "error" | "warning" | "info"): Notify =>
      (title, description) => {
        sonner[type](title, {
          description,
          duration: type === "error" ? 6000 : 4000,
        });
      };

    return {
      success: notify("success"),
      error: notify("error"),
      warning: notify("warning"),
      info: notify("info"),
    };
  }, []);
}
