import type { ColumnsType } from "antd/es/table";
import { Tag } from "antd";
import { StatusSwitch, Text } from "@/components/ui";
import Can from "@/components/rbac/Can";
import { humanise } from "@/utils/format";
import RowActions from "@/components/ui/DataTable/RowActions";
import type { Designation } from "@/types/models";
import { formatDate } from "@/utils/format";

interface Options {
  onEdit: (designation: Designation) => void;
  onDelete: (designation: Designation) => void;
  /** Switches a designation on or off from the table itself. */
  onToggleStatus: (designation: Designation, isActive: boolean) => void;
  /** The row whose status is saving right now, if any. */
  togglingId?: string | null;
}

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
      title: "Department",
      key: "department",
      sorter: true,
      render: (_, designation) =>
        designation.department ? (
          <Text size="body-sm">{designation.department}</Text>
        ) : (
          <span className="text-gray-400">&mdash;</span>
        ),
    },
    {
      title: "Role",
      key: "role",
      render: (_, designation) =>
        designation.role ? (
          <Tag bordered={false} color="cyan">
            {humanise(designation.role.name)}
          </Tag>
        ) : (
          <Text size="body-sm" tone="subtle">
            No role yet
          </Text>
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
      title: "Created",
      key: "createdAt",
      sorter: true,
      responsive: ["lg"],
      render: (_, designation) => (
        <Text size="body-sm" tone="muted">
          {formatDate(designation.createdAt)}
        </Text>
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
