import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export type TextSize = "body-lg" | "body" | "body-sm" | "caption";
export type TextTone =
  | "default"
  | "muted"
  | "subtle"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "inverse";

interface TextProps {
  children: ReactNode;
  size?: TextSize;
  tone?: TextTone;
  weight?: "normal" | "medium" | "semibold";
  className?: string;
  as?: "p" | "span" | "div" | "label";
  truncate?: boolean;
}

/** Body copy. Same idea as `Heading`: sizes come from the scale, never ad hoc. */
const SIZE_CLASS: Record<TextSize, string> = {
  "body-lg": "text-body-lg",
  body: "text-body",
  "body-sm": "text-body-sm",
  caption: "text-caption",
};

const TONE_CLASS: Record<TextTone, string> = {
  default: "text-gray-800 dark:text-gray-200",
  muted: "text-gray-600 dark:text-gray-400",
  subtle: "text-gray-500 dark:text-gray-500",
  primary: "text-brand-600 dark:text-brand-400",
  success: "text-success-600 dark:text-success-500",
  warning: "text-warning-600 dark:text-warning-500",
  danger: "text-error-600 dark:text-error-500",
  inverse: "text-white",
};

const WEIGHT_CLASS = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
} as const;

export default function Text({
  children,
  size = "body",
  tone = "default",
  weight = "normal",
  className,
  as: Tag = "p",
  truncate = false,
}: TextProps) {
  return (
    <Tag
      className={cn(
        SIZE_CLASS[size],
        TONE_CLASS[tone],
        WEIGHT_CLASS[weight],
        truncate && "truncate",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
