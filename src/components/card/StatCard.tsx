import type { ReactNode } from "react";
import { Skeleton } from "antd";
import { Card, Heading, Text } from "@/components/ui";
import { cn } from "@/utils/cn";

/** The palette a metric tile can be tinted with. Flat colour, never a gradient. */
export type StatTone = "brand" | "info" | "success" | "warning" | "danger";

const TONE: Record<StatTone, { surface: string; chip: string }> = {
  brand: {
    surface: "border-brand-100 bg-brand-25 dark:border-brand-500/20 dark:bg-brand-500/10",
    chip: "bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300",
  },
  info: {
    surface: "border-info-500/20 bg-info-50 dark:border-info-500/20 dark:bg-info-500/10",
    chip: "bg-info-500/15 text-info-600 dark:bg-info-500/20 dark:text-info-500",
  },
  success: {
    surface:
      "border-success-100 bg-success-50 dark:border-success-500/20 dark:bg-success-500/10",
    chip: "bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-500",
  },
  warning: {
    surface:
      "border-warning-100 bg-warning-50 dark:border-warning-500/20 dark:bg-warning-500/10",
    chip: "bg-warning-100 text-warning-700 dark:bg-warning-500/20 dark:text-warning-500",
  },
  danger: {
    surface: "border-error-100 bg-error-50 dark:border-error-500/20 dark:bg-error-500/10",
    chip: "bg-error-100 text-error-700 dark:bg-error-500/20 dark:text-error-500",
  },
};

export interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  /** Which colour the tile carries. Each metric on a row gets its own. */
  tone?: StatTone;
  isLoading?: boolean;
}

/**
 * One metric, on a tinted surface. The icon and the background carry the colour
 * while the number stays near-black, so the tile reads at a glance and the value
 * is still the highest contrast thing in it.
 *
 * Laid out on one line on purpose: a row of four of these is a summary, not the
 * subject of the page, so it should not take a third of the screen.
 */
export default function StatCard({
  label,
  value,
  icon,
  tone = "brand",
  isLoading,
}: StatCardProps) {
  return (
    <Card padded={false} bodyClassName="p-4" className={cn(TONE[tone].surface)}>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl text-h5",
            TONE[tone].chip,
          )}
        >
          {icon}
        </span>

        <div className="min-w-0">
          <Text size="body-sm" tone="muted" truncate>
            {label}
          </Text>

          {isLoading ? (
            <Skeleton.Input active size="small" className="mt-1 !h-6 !min-w-16" />
          ) : (
            <Heading level={3}>{value}</Heading>
          )}
        </div>
      </div>
    </Card>
  );
}
