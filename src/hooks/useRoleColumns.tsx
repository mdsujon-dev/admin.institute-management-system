import type { ColumnsType } from "antd/es/table";
import { Tag, Tooltip } from "antd";
import { ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import RowActions from "@/components/ui/DataTable/RowActions";
import Can from "@/components/rbac/Can";
import { Button, Text } from "@/components/ui";
import { ALL_PERMISSIONS } from "@/constants/permissions";
import type { Role } from "@/types/models";

interface Options {
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

/**
 * The columns of the roles table, kept out of the page so the same table can be
 * embedded elsewhere without dragging a screen's worth of code with it.
 */
export function useRoleColumns({ onEdit, onDelete }: Options): ColumnsType<Role> {
  return [
    {
      title: "Role",
      key: "name",
      sorter: true,
      render: (_, role) => (
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Text weight="medium">{role.name}</Text>
            {role.isSystem && (
              <Tag bordered={false} className="m-0">
                System
              </Tag>
            )}
          </div>
          {role.description && (
            <Text size="caption" tone="subtle" truncate className="max-w-xs">
              {role.description}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "Permissions",
      key: "permissions",
      responsive: ["md"],
      render: (_, role) => (
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <span
              className="block h-full rounded-full bg-brand-500"
              style={{
                width: `${Math.round((role.permissions.length / ALL_PERMISSIONS.length) * 100)}%`,
              }}
            />
          </span>
          <Text size="body-sm" tone="muted">
            {role.permissions.length} / {ALL_PERMISSIONS.length}
          </Text>
        </div>
      ),
    },
    {
      title: "Accounts",
      key: "userCount",
      responsive: ["sm"],
      render: (_, role) => <Text size="body-sm">{role.userCount}</Text>,
    },
    {
      title: "",
      key: "actions",
      align: "right",
      fixed: "right",
      width: 140,
      render: (_, role) => (
        <div className="flex items-center justify-end gap-2">
          <Can permission="role.update">
            <Tooltip title="Permissions">
              <Link to={`/roles/${role.id}/permissions`}>
                <Button
                  variant="secondary"
                  size="sm"
                  aria-label="Permissions"
                  className="rounded-[7px]"
                  icon={<ShieldCheck />}
                />
              </Link>
            </Tooltip>
          </Can>

          <RowActions
            onEdit={() => onEdit(role)}
            onDelete={() => onDelete(role)}
            editPermission="role.update"
            deletePermission="role.delete"
          />
        </div>
      ),
    },
  ];
}
