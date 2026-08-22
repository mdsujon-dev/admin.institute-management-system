import type { ReactNode } from "react";
import { Skeleton } from "antd";
import { Card, Heading, Text } from "@/components/ui";
import { cn } from "@/utils/cn";

/** The accent a metric tile carries. Flat colour, never a gradient. */
export type StatTone = "brand" | "info" | "success" | "warning" | "danger";

const ACCENT: Record<StatTone, string> = {
  brand: "bg-brand-500",
  info: "bg-info-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-error-500",
};

export interface StatCardProps {
  label: string;
  value: ReactNode;
  /** Which colour the tile carries. Each metric on a row gets its own. */
  tone?: StatTone;
  isLoading?: boolean;
}

/**
 * One metric: a quiet label, the number, and a colour bar along the bottom.
 *
 * The colour identifies the tile without competing with the value -- the card
 * stays white so the number is the highest contrast thing on the row, which is
 * the whole point of a figure you are meant to read at a glance.
 */
export default function StatCard({
  label,
  value,
  tone = "brand",
  isLoading,
}: StatCardProps) {
  return (
    <Card padded={false} bodyClassName="relative overflow-hidden px-4 pb-4 pt-3">
      <Text
        size="caption"
        tone="subtle"
        weight="medium"
        truncate
        className="uppercase tracking-wide"
      >
        {label}
      </Text>

      {isLoading ? (
        <Skeleton.Input active size="small" className="mt-1.5 !h-7 !min-w-24" />
      ) : (
        <Heading level={2} className="mt-0.5">
          {value}
        </Heading>
      )}

      <span
        aria-hidden
        className={cn("absolute inset-x-0 bottom-0 h-1", ACCENT[tone])}
      />
    </Card>
  );
}
