import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { Toaster } from "sonner";
import { useTheme } from "./ThemeProvider";

/**
 * Where toasts appear: bottom right, out of the way of the header and of the
 * primary action in a dialog, which both sit at the top.
 *
 * The look is set here rather than per call, so a toast raised from anywhere in
 * the app is the same object: the app's radius, a border instead of a shadow,
 * and its own close button for anyone who does not want to wait it out.
 */
export default function ToastProvider() {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme}
      position="bottom-right"
      closeButton
      offset={20}
      gap={10}
      duration={4000}
      visibleToasts={4}
      icons={{
        success: <CircleCheck className="text-success-600" />,
        error: <CircleAlert className="text-error-600" />,
        warning: <TriangleAlert className="text-warning-600" />,
        info: <Info className="text-info-600" />,
        close: <X />,
      }}
      toastOptions={{
        classNames: {
          toast: "ims-toast",
          title: "ims-toast-title",
          description: "ims-toast-description",
          closeButton: "ims-toast-close",
        },
      }}
    />
  );
}
