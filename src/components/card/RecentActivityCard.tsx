import { Link } from "react-router";
import { Skeleton } from "antd";
import { Button, Card, Text } from "@/components/ui";
import { useGetActivityLogsQuery } from "@/redux/features/logs/logs.api";
import { humanise, timeAgo } from "@/utils/format";

/** The last few things anybody changed, with a way through to the full trail. */
export default function RecentActivityCard({ limit = 6 }: { limit?: number }) {
  const { data, isLoading } = useGetActivityLogsQuery({
    page: 1,
    limit,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const entries = data?.items ?? [];

  return (
    <Card
      padded={false}
      title="Recent changes"
      description="The last few things anybody changed"
      extra={
        <Link to="/logs/activity">
          <Button variant="link" size="sm">
            View all
          </Button>
        </Link>
      }
    >
      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {isLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <li key={`skeleton-${index}`} className="px-4 py-3 sm:px-5">
              <Skeleton active paragraph={false} />
            </li>
          ))}

        {!isLoading && entries.length === 0 && (
          <li className="px-4 py-8 text-center sm:px-5">
            <Text size="body-sm" tone="muted">
              Nothing has been changed yet.
            </Text>
          </li>
        )}

        {entries.map((entry) => (
          <li key={entry.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-full text-caption font-semibold ${
                entry.statusCode < 400
                  ? "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500"
                  : "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-500"
              }`}
            >
              {entry.method.slice(0, 3)}
            </span>

            <div className="min-w-0 flex-1">
              <Text size="body-sm" weight="medium" truncate>
                {humanise(entry.action)}
              </Text>
              <Text size="caption" tone="subtle" truncate>
                {entry.userEmail ?? "Anonymous"}
              </Text>
            </div>

            <Text size="caption" tone="subtle" className="shrink-0">
              {timeAgo(entry.createdAt)}
            </Text>
          </li>
        ))}
      </ul>
    </Card>
  );
}
