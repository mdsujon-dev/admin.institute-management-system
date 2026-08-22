import type { ReactNode } from "react";
import { Skeleton } from "antd";
import { Card, Heading, Text } from "@/components/ui";
import { cn } from "@/utils/cn";

/** The colour a tile is filled with. Flat fills only -- no gradients. */
export type StatTone = "brand" | "info" | "success" | "warning" | "danger";

/**
 * Each fill is picked to stay at 4.5:1 or better against white text -- light
 * enough to read as colour rather than as ink, dark enough that the number on
 * top of it is never the thing straining to be seen.
 */
const TONE: Record<StatTone, string> = {
  brand: "bg-[#0f7f9c]",
  info: "bg-[#1a63d8]",
  success: "bg-[#05834e]",
  warning: "bg-[#c04f09]",
  danger: "bg-[#c22a1d]",
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
      bodyClassName="relative p-4 sm:px-5"
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
            <Text size="body-sm" className="mt-0.5 text-white/85">
              {caption}
            </Text>
          )}
        </div>

        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-h4",
            {
              brand: "text-[#0f7f9c]",
              info: "text-[#1a63d8]",
              success: "text-[#05834e]",
              warning: "text-[#c04f09]",
              danger: "text-[#c22a1d]",
            }[tone],
          )}
        >
          {icon}
        </span>
      </div>
    </Card>
  );
}
