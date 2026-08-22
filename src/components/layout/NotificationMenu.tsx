import { Badge, Dropdown, Tooltip } from "antd";
import { Bell } from "lucide-react";
import { Link } from "react-router";
import { Button, Text } from "@/components/ui";
import { usePermissions } from "@/hooks/usePermissions";
import {
  useGetActivityLogsQuery,
  useGetLogSummaryQuery,
} from "@/redux/features/logs/logs.api";
import { humanise, timeAgo } from "@/utils/format";

/**
 * The bell shows what actually happened, read from the audit trail: the last
 * few changes, and how many there have been in the past day. There is no
 * notification store in the system, so nothing here is invented -- and because
 * the trail is scoped per viewer, an operator without `log.readAll` sees their
 * own changes rather than everybody's.
 */
export default function NotificationMenu() {
  const { can } = usePermissions();
  const canRead = can("log.read");

  const { data: summary } = useGetLogSummaryQuery(undefined, { skip: !canRead });
  const { data: recent } = useGetActivityLogsQuery(
    { page: 1, limit: 5, sortBy: "createdAt", sortOrder: "desc" },
    { skip: !canRead },
  );

  if (!canRead) {
    return null;
  }

  const entries = recent?.items ?? [];
  const changes = summary?.activity ?? 0;

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      popupRender={() => (
        <div className="w-80 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <Text size="body-sm" weight="medium">
              Recent changes
            </Text>
            <Text size="caption" tone="subtle">
              {changes} in the last 24 hours
            </Text>
          </div>

          <ul className="max-h-80 divide-y divide-gray-200 overflow-y-auto dark:divide-gray-800">
            {entries.length === 0 && (
              <li className="px-4 py-6 text-center">
                <Text size="body-sm" tone="muted">
                  Nothing has changed yet.
                </Text>
              </li>
            )}

            {entries.map((entry) => (
              <li key={entry.id} className="px-4 py-2.5">
                <Text size="body-sm" weight="medium" truncate>
                  {humanise(entry.action)}
                </Text>
                <Text size="caption" tone="subtle" truncate>
                  {entry.userEmail ?? "Anonymous"} - {timeAgo(entry.createdAt)}
                </Text>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-200 px-2 py-1.5 dark:border-gray-800">
            <Link to="/logs/activity">
              <Button variant="link" size="sm" block>
                View activity log
              </Button>
            </Link>
          </div>
        </div>
      )}
    >
      <Tooltip title="Recent changes">
        <Badge count={changes} size="small" overflowCount={99} offset={[-2, 2]}>
          <Button
            variant="secondary"
            shape="circle"
            aria-label="Recent changes"
            icon={<Bell />}
          />
        </Badge>
      </Tooltip>
    </Dropdown>
  );
}
