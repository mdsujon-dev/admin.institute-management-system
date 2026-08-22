import { Tag } from "antd";
import { Card, Text } from "@/components/ui";
import {
  ACTION_LABELS,
  PERMISSION_ACTIONS,
  PERMISSION_SUBJECTS,
  SUBJECT_LABELS,
} from "@/constants/permissions";
import { usePermissions } from "@/hooks/usePermissions";
import { humanise } from "@/utils/format";

/**
 * Exactly what the signed in role allows, read from the same list the guards
 * read -- so there is never a question of what actually applies.
 */
export default function PermissionSummary() {
  const { user } = usePermissions();

  if (!user) return null;

  const granted = new Set(user.permissions);

  return (
    <Card
      padded={false}
      title="What you can do"
      description={`${user.permissions.length} permission(s) through the ${humanise(user.role.name)} role`}
    >
      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {PERMISSION_SUBJECTS.map((subject) => {
          const actions = PERMISSION_ACTIONS.filter((action) =>
            granted.has(`${subject}.${action}`),
          );

          return (
            <li
              key={subject}
              className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5"
            >
              <Text size="body-sm" weight="medium">
                {SUBJECT_LABELS[subject]}
              </Text>

              {actions.length === 0 ? (
                <Text size="caption" tone="subtle">
                  No access
                </Text>
              ) : (
                <span className="flex flex-wrap justify-end gap-1">
                  {actions.map((action) => (
                    <Tag key={action} bordered={false} className="m-0">
                      {ACTION_LABELS[action]}
                    </Tag>
                  ))}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
