import { LoaderCircle } from "lucide-react";
import { Spin } from "antd";
import Text from "@/components/ui/Typography/Text";

/** Shown while the session is being restored, before any layout is drawn. */
export default function PageLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-gray-950">
      <Spin indicator={<LoaderCircle className="animate-spin text-h3 text-brand-500" />} />
      <Text size="body-sm" tone="muted">
        {label}...
      </Text>
    </div>
  );
}
