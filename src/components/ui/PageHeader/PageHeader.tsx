import { Breadcrumb } from "antd";
import type { ReactNode } from "react";
import { Link } from "react-router";
import Heading from "@/components/ui/Typography/Heading";
import Text from "@/components/ui/Typography/Text";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Actions for the right hand side -- normally one primary button. */
  actions?: ReactNode;
  /** Hides the trail on screens that sit outside the menu. */
  showBreadcrumb?: boolean;
}

/** The title block every screen opens with, so they all line up identically. */
export default function PageHeader({
  title,
  description,
  actions,
  showBreadcrumb = true,
}: PageHeaderProps) {
  const crumbs = useBreadcrumb(title);

  return (
    <div className="mb-5 sm:mb-6">
      {showBreadcrumb && crumbs.length > 1 && (
        <Breadcrumb
          className="mb-2 text-caption"
          items={crumbs.map((crumb) => ({
            title: crumb.path ? <Link to={crumb.path}>{crumb.label}</Link> : crumb.label,
          }))}
        />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
    </div>
  );
}
