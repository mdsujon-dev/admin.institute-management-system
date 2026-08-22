import { InboxOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
import Heading from "@/components/ui/Typography/Heading";
import Text from "@/components/ui/Typography/Text";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

/** What a list shows instead of zero rows: a reason, and a way forward. */
export default function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-brand-50 text-h4 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400">
        {icon ?? <InboxOutlined />}
      </span>
      <div>
        <Heading level={5}>{title}</Heading>
        {description && (
          <Text size="body-sm" tone="muted" className="mt-1 max-w-sm">
            {description}
          </Text>
        )}
      </div>
      {action}
    </div>
  );
}
