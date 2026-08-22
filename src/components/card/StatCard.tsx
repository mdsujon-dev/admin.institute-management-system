import type { ReactNode } from "react";
import { Skeleton } from "antd";
import { Card, Heading, Text } from "@/components/ui";

export interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  /** A small line under the number, e.g. "12 active". */
  caption?: string;
  isLoading?: boolean;
}

/** One metric. The smallest piece the dashboard is assembled from. */
export default function StatCard({
  label,
  value,
  icon,
  caption,
  isLoading,
}: StatCardProps) {
  return (
    <Card>
      <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-h5 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
        {icon}
      </span>

      <Text size="body-sm" tone="muted" className="mt-3">
        {label}
      </Text>

      {isLoading ? (
        <Skeleton.Input active size="small" className="mt-1" />
      ) : (
        <Heading level={2} className="mt-0.5">
          {value}
        </Heading>
      )}

      {caption && !isLoading && (
        <Text size="caption" tone="subtle" className="mt-1">
          {caption}
        </Text>
      )}
    </Card>
  );
}
