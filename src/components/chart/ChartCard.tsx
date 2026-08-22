import type { ReactNode } from "react";
import { Skeleton } from "antd";
import { Card, EmptyState, ErrorState } from "@/components/ui";

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  isLoading?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  /** True when the query worked but there is nothing to plot yet. */
  isEmpty?: boolean;
  emptyMessage?: string;
  className?: string;
}

/**
 * The frame around a chart: title, and the three states a chart can be in
 * before it has anything to draw. Keeps every panel on the dashboard the same
 * height and shape whether or not its data has arrived.
 */
export default function ChartCard({
  title,
  description,
  children,
  isLoading,
  errorMessage,
  onRetry,
  isEmpty,
  emptyMessage = "There is nothing to chart yet.",
  className,
}: ChartCardProps) {
  return (
    <Card title={title} description={description} className={className}>
      {isLoading && <Skeleton active paragraph={{ rows: 5 }} />}

      {!isLoading && errorMessage && (
        <ErrorState message={errorMessage} onRetry={onRetry} />
      )}

      {!isLoading && !errorMessage && isEmpty && (
        <EmptyState title="No data yet" description={emptyMessage} />
      )}

      {!isLoading && !errorMessage && !isEmpty && children}
    </Card>
  );
}
