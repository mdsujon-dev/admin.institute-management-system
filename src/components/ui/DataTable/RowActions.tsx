import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import Button from "@/components/ui/Button/Button";
import Can from "@/components/rbac/Can";

interface RowActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  /** Permission each action needs, e.g. `student.update`. */
  viewPermission?: string;
  editPermission?: string;
  deletePermission?: string;
  /** Set when the row is a seeded record that must not be touched. */
  lockedReason?: string;
}

/**
 * The trailing actions of every table row. Each button is wrapped in the
 * permission it needs, so a role without `*.delete` simply never sees a bin.
 */
export default function RowActions({
  onView,
  onEdit,
  onDelete,
  viewPermission,
  editPermission,
  deletePermission,
  lockedReason,
}: RowActionsProps) {
  const locked = Boolean(lockedReason);

  return (
    <div className="flex items-center justify-end gap-1">
      {onView && (
        <Can permission={viewPermission}>
          <Tooltip title="View">
            <Button variant="ghost" size="sm" icon={<EyeOutlined />} onClick={onView} />
          </Tooltip>
        </Can>
      )}

      {onEdit && (
        <Can permission={editPermission}>
          <Tooltip title={lockedReason ?? "Edit"}>
            <Button
              variant="ghost"
              size="sm"
              icon={<EditOutlined />}
              disabled={locked}
              onClick={onEdit}
            />
          </Tooltip>
        </Can>
      )}

      {onDelete && (
        <Can permission={deletePermission}>
          <Tooltip title={lockedReason ?? "Delete"}>
            <Button
              variant="ghost"
              size="sm"
              danger
              icon={<DeleteOutlined />}
              disabled={locked}
              onClick={onDelete}
            />
          </Tooltip>
        </Can>
      )}
    </div>
  );
}
