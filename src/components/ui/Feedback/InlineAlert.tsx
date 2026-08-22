import { Alert } from "antd";

interface InlineAlertProps {
  type?: "error" | "warning" | "info" | "success";
  message: string;
  description?: string;
  className?: string;
}

/**
 * The message strip inside a form or a card -- a failed save, or a warning
 * about what an action will do. Page level feedback uses a toast instead.
 */
export default function InlineAlert({
  type = "error",
  message,
  description,
  className,
}: InlineAlertProps) {
  return (
    <Alert
      showIcon
      type={type}
      message={message}
      description={description}
      className={className}
    />
  );
}
