import type { ReactNode } from "react";
import { Heading, Text } from "@/components/ui";
import { cn } from "@/utils/cn";

interface MessagePageProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  tone?: "default" | "danger";
}

/**
 * The full page "something to tell you" layout, shared by 403 and 404 so both
 * read the same way instead of each inventing its own.
 */
export default function MessagePage({
  icon,
  title,
  description,
  action,
  tone = "default",
}: MessagePageProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <span
        className={cn(
          "mb-5 flex size-14 items-center justify-center rounded-xl text-h2",
          tone === "danger"
            ? "bg-error-50 text-error-500 dark:bg-error-500/15"
            : "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400",
        )}
      >
        {icon}
      </span>

      <Heading level={2}>{title}</Heading>
      <Text size="body" tone="muted" className="mt-2 max-w-md">
        {description}
      </Text>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
