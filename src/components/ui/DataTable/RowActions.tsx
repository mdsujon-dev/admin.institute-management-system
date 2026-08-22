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
 * The trailing actions of every table row. Each is a bordered button so it
 * reads as a control rather than as decoration, and each is wrapped in the
 * permission it needs -- a role without `*.delete` never sees a bin.
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
    <div className="flex items-center justify-end gap-2">
      {onView && (
        <Can permission={viewPermission}>
          <Tooltip title="View">
            <Button
              variant="secondary"
              size="sm"
              aria-label="View"
              icon={<EyeOutlined />}
              onClick={onView}
            />
          </Tooltip>
        </Can>
      )}

      {onEdit && (
        <Can permission={editPermission}>
          <Tooltip title={lockedReason ?? "Edit"}>
            <Button
              variant="secondary"
              size="sm"
              aria-label="Edit"
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
              variant="danger-outline"
              size="sm"
              aria-label="Delete"
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
