import type { ReactNode } from "react";
import Heading from "@/components/ui/Typography/Heading";
import Text from "@/components/ui/Typography/Text";
import { cn } from "@/utils/cn";

interface CardProps {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** Right hand side of the header -- usually a button or a filter. */
  extra?: ReactNode;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Off when the child draws its own padding, e.g. a table. */
  padded?: boolean;
}

/**
 * The surface everything sits on: one border, one radius, no shadow.
 *
 * Used for every panel in the app, so a card on the dashboard and a card around
 * a table are the same object with different contents.
 */
export default function Card({
  children,
  title,
  description,
  extra,
  footer,
  className,
  bodyClassName,
  padded = true,
}: CardProps) {
  const hasHeader = Boolean(title || description || extra);

  return (
    <section
      className={cn(
        "rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900",
        className,
      )}
    >
      {hasHeader && (
        <header className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-gray-800">
          <div className="min-w-0">
            {title && <Heading level={5}>{title}</Heading>}
            {description && (
              <Text size="caption" tone="subtle" className="mt-0.5">
                {description}
              </Text>
            )}
          </div>
          {extra && <div className="flex shrink-0 items-center gap-2">{extra}</div>}
        </header>
      )}

      <div className={cn(padded && "p-4 sm:p-5", bodyClassName)}>{children}</div>

      {footer && (
        <footer className="border-t border-gray-200 px-4 py-3 sm:px-5 dark:border-gray-800">
          {footer}
        </footer>
      )}
    </section>
  );
}
