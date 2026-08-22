import type { ColumnsType } from "antd/es/table";
import { Tag } from "antd";
import { InitialsAvatar, StatusTag, Text } from "@/components/ui";
import RowActions from "@/components/ui/DataTable/RowActions";
import type { User } from "@/types/models";
import { formatDateTime, humanise } from "@/utils/format";

interface Options {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  /** The signed in account, which may not delete itself. */
  currentUserId?: string;
}

/** The columns of the users table, separate from the screen that shows them. */
export function useUserColumns({
  onEdit,
  onDelete,
  currentUserId,
}: Options): ColumnsType<User> {
  return [
    {
      title: "Account",
      key: "email",
      sorter: true,
      render: (_, user) => (
        <div className="flex items-center gap-3">
          <InitialsAvatar name={user.email} />
          <div className="min-w-0">
            <Text weight="medium" truncate>
              {user.email}
            </Text>
            {user.needsPasswordChange && (
              <Text size="caption" tone="warning">
                Has not set their own password yet
              </Text>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      key: "role",
      render: (_, user) => (
        <Tag bordered={false} color="cyan">
          {humanise(user.role.name)}
        </Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, user) => <StatusTag status={user.status} />,
    },
    {
      title: "Last sign in",
      key: "lastLoginAt",
      sorter: true,
      responsive: ["lg"],
      render: (_, user) => (
        <Text size="body-sm" tone="muted">
          {formatDateTime(user.lastLoginAt)}
        </Text>
      ),
    },
    {
      title: "Created",
      key: "createdAt",
      sorter: true,
      responsive: ["xl"],
      render: (_, user) => (
        <Text size="body-sm" tone="muted">
          {formatDateTime(user.createdAt)}
        </Text>
      ),
    },
    {
      title: "",
      key: "actions",
      align: "right",
      fixed: "right",
      width: 96,
      render: (_, user) => (
        <RowActions
          onEdit={() => onEdit(user)}
          onDelete={() => onDelete(user)}
          editPermission="user.update"
          deletePermission="user.delete"
          lockedReason={
            user.id === currentUserId ? "You cannot delete your own account" : undefined
          }
        />
      ),
    },
  ];
}
