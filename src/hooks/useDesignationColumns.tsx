import type { ColumnsType } from "antd/es/table";
import { Tag } from "antd";
import { StatusSwitch, Text } from "@/components/ui";
import Can from "@/components/rbac/Can";
import RowActions from "@/components/ui/DataTable/RowActions";
import type { Designation } from "@/types/models";

interface Options {
  onEdit: (designation: Designation) => void;
  onDelete: (designation: Designation) => void;
  /** Switches a designation on or off from the table itself. */
  onToggleStatus: (designation: Designation, isActive: boolean) => void;
  /** The row whose status is saving right now, if any. */
  togglingId?: string | null;
}

/**
 * A designation is a title and whether it is still on offer. When it was
 * created is not part of that, so the table does not carry a column for it --
 * the row is the job, not its paperwork.
 */
export function useDesignationColumns({
  onEdit,
  onDelete,
  onToggleStatus,
  togglingId,
}: Options): ColumnsType<Designation> {
  return [
    {
      title: "Title",
      key: "title",
      sorter: true,
      render: (_, designation) => (
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Text weight="medium">{designation.title}</Text>
            {designation.isSystem && (
              <Tag bordered={false} className="m-0">
                System
              </Tag>
            )}
          </div>
          {designation.description && (
            <Text size="caption" tone="subtle" truncate className="max-w-xs">
              {designation.description}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      key: "isActive",
      responsive: ["md"],
      render: (_, designation) => (
        <Can
          permission="designation.update"
          fallback={
            <Text size="body-sm">{designation.isActive ? "Active" : "Inactive"}</Text>
          }
        >
          <StatusSwitch
            checked={designation.isActive}
            loading={togglingId === designation.id}
            disabled={designation.isSystem}
            disabledReason={
              designation.isSystem ? "System designations cannot be changed" : undefined
            }
            onChange={(isActive) => onToggleStatus(designation, isActive)}
          />
        </Can>
      ),
    },
    {
      title: "Employees",
      key: "employeeCount",
      responsive: ["sm"],
      render: (_, designation) => (
        <Text size="body-sm">{designation.employeeCount ?? 0}</Text>
      ),
    },
    {
      title: "",
      key: "actions",
      align: "right",
      fixed: "right",
      width: 96,
      render: (_, designation) => (
        <RowActions
          onEdit={() => onEdit(designation)}
          onDelete={() => onDelete(designation)}
          editPermission="designation.update"
          deletePermission="designation.delete"
          lockedReason={
            designation.isSystem ? "System designations cannot be changed" : undefined
          }
        />
      ),
    },
  ];
}
