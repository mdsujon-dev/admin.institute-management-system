import { Link } from "react-router";
import { Text } from "@/components/ui";
import { env } from "@/config/env";

/** The logo lockup in the sidebar. Collapses to the mark alone on the rail. */
export default function BrandMark({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3 px-1 py-1">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-5">
          <path d="m12 3 9 5-9 5-9-5 9-5Z" strokeLinejoin="round" />
          <path d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" strokeLinecap="round" />
        </svg>
      </span>

      {!collapsed && (
        <span className="min-w-0 flex-1">
          <Text size="body-sm" weight="semibold" truncate>
            {env.appName}
          </Text>
          <Text size="caption" tone="subtle">
            Admin console
          </Text>
        </span>
      )}
    </Link>
  );
}
