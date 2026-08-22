import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps {
  level?: HeadingLevel;
  children: ReactNode;
  className?: string;
  /** Renders a different tag than the level implies, for correct outlines. */
  as?: ElementType;
  tone?: "default" | "muted" | "primary" | "inverse";
}

/**
 * The only way a heading is written in this app.
 *
 * Each level maps to one token from the type scale in `styles/theme.css`, so
 * resizing `--text-h2` there resizes every second level heading everywhere --
 * there is no screen with its own idea of how big a title should be.
 */
const LEVEL_CLASS: Record<HeadingLevel, string> = {
  1: "text-h1",
  2: "text-h2",
  3: "text-h3",
  4: "text-h4",
  5: "text-h5",
  6: "text-h6",
};

const TONE_CLASS = {
  default: "text-gray-900 dark:text-gray-50",
  muted: "text-gray-600 dark:text-gray-400",
  primary: "text-brand-600 dark:text-brand-400",
  inverse: "text-white",
} as const;

export default function Heading({
  level = 2,
  children,
  className,
  as,
  tone = "default",
}: HeadingProps) {
  const Tag: ElementType = as ?? `h${level}`;

  return (
    <Tag className={cn(LEVEL_CLASS[level], TONE_CLASS[tone], className)}>{children}</Tag>
  );
}
