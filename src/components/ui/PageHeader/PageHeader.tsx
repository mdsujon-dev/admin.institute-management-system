import type { ReactNode } from "react";
import Heading from "@/components/ui/Typography/Heading";
import Text from "@/components/ui/Typography/Text";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Actions for the right hand side -- normally one primary button. */
  actions?: ReactNode;
}

/** The title block every screen opens with, so they all line up identically. */
export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <Heading level={1}>{title}</Heading>
        {description && (
          <Text size="body-sm" tone="muted" className="mt-1">
            {description}
          </Text>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">{actions}</div>
      )}
    </div>
  );
}
