import type { ReactNode } from "react";
import { Skeleton } from "antd";
import { Card, Heading, Text } from "@/components/ui";
import { cn } from "@/utils/cn";

/** The colour a tile is filled with. Flat fills only -- no gradients. */
export type StatTone = "brand" | "info" | "success" | "warning" | "danger";

/**
 * Each fill is dark enough to carry white text at 4.5:1 or better, which is why
 * these are the deep steps of the palette rather than the bright ones.
 */
const TONE: Record<StatTone, string> = {
  brand: "bg-brand-500",
  info: "bg-info-700",
  success: "bg-success-700",
  warning: "bg-warning-700",
  danger: "bg-error-700",
};

export interface StatCardProps {
  label: string;
  value: ReactNode;
  /** The mark on the right. One per tile -- the label carries the rest. */
  icon: ReactNode;
  /** One line under the number, e.g. "Total admitted". */
  caption?: string;
  tone?: StatTone;
  isLoading?: boolean;
}

/**
 * One metric, filled with its own colour: the label, the number, and a single
 * glyph on the right. Everything on it is white, so the only thing competing
 * for attention is the figure itself.
 */
export default function StatCard({
  label,
  value,
  icon,
  caption,
  tone = "brand",
  isLoading,
}: StatCardProps) {
  return (
    <Card
      padded={false}
      className={cn("relative overflow-hidden border-0", TONE[tone])}
      bodyClassName="relative p-4 sm:p-5"
    >
      {/* Flat white at a low opacity -- depth without a gradient. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -right-10 size-44 rounded-full bg-white/[0.07]"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Text size="body-sm" weight="medium" tone="inverse" truncate>
            {label}
          </Text>

          {isLoading ? (
            <Skeleton.Input active size="small" className="mt-3 !h-8 !min-w-24" />
          ) : (
            <Heading level={1} tone="inverse" className="mt-3">
              {value}
            </Heading>
          )}

          {caption && (
            <Text size="body-sm" className="mt-0.5 text-white/70">
              {caption}
            </Text>
          )}
        </div>

        <span
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-h3",
            {
              brand: "text-brand-500",
              info: "text-info-700",
              success: "text-success-700",
              warning: "text-warning-700",
              danger: "text-error-700",
            }[tone],
          )}
        >
          {icon}
        </span>
      </div>
    </Card>
  );
}
