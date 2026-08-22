import { App } from "antd";
import { useMemo } from "react";

type Notify = (title: string, description?: string) => void;

export interface Toast {
  success: Notify;
  error: Notify;
  warning: Notify;
  info: Notify;
}

/**
 * `const toast = useToast(); toast.success("Saved")`.
 *
 * Goes through antd's `App` context rather than the static `message.*` calls,
 * which is the only way a toast picks up the theme configured in
 * `providers/AntdProvider.tsx`.
 */
export function useToast(): Toast {
  const { message } = App.useApp();

  return useMemo(() => {
    const notify =
      (type: "success" | "error" | "warning" | "info"): Notify =>
      (title, description) => {
        void message.open({
          type,
          content: description ? `${title} - ${description}` : title,
          duration: type === "error" ? 5 : 3,
        });
      };

    return {
      success: notify("success"),
      error: notify("error"),
      warning: notify("warning"),
      info: notify("info"),
    };
  }, [message]);
}
