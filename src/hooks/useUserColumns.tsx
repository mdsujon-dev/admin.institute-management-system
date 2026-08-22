import type { ColumnsType } from "antd/es/table";
import { Tag, Tooltip } from "antd";
import { ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui";
import { InitialsAvatar, StatusSwitch, StatusTag, Text } from "@/components/ui";
import RowActions from "@/components/ui/DataTable/RowActions";
import Can from "@/components/rbac/Can";
import type { User, UserStatus } from "@/types/models";
import { formatDateTime, humanise } from "@/utils/format";

interface Options {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  /** Flips a row between active and inactive from the table itself. */
  onToggleStatus: (user: User, next: UserStatus) => void;
  /** The row whose status is being saved right now, if any. */
  togglingId?: string | null;
  /** The signed in account, which may not delete or disable itself. */
  currentUserId?: string;
}

/** The columns of the users table, separate from the screen that shows them. */
export function useUserColumns({
  onEdit,
  onDelete,
  onToggleStatus,
  togglingId,
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
      render: (_, user) => {
        const isSelf = user.id === currentUserId;

        /**
         * A blocked account is not the other half of "active" -- it is a
         * deliberate third state -- so it is shown rather than offered as a
         * toggle. Blocking and unblocking stays in the edit dialog.
         */
        if (user.status === "BLOCKED") {
          return <StatusTag status={user.status} />;
        }

        return (
          <Can permission="user.update" fallback={<StatusTag status={user.status} />}>
            <StatusSwitch
              checked={user.status === "ACTIVE"}
              loading={togglingId === user.id}
              disabled={isSelf}
              disabledReason={
                isSelf ? "You cannot disable your own account" : undefined
              }
              onChange={(next) =>
                onToggleStatus(user, next ? "ACTIVE" : "INACTIVE")
              }
            />
          </Can>
        );
      },
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
      width: 150,
      render: (_, user) => (
        <div className="flex items-center justify-end gap-2">
          <Can permission="user.update">
            <Tooltip title="Permissions">
              <Link to={`/users/${user.id}/permissions`}>
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
            onEdit={() => onEdit(user)}
            onDelete={() => onDelete(user)}
            editPermission="user.update"
            deletePermission="user.delete"
            lockedReason={
              user.id === currentUserId ? "You cannot delete your own account" : undefined
            }
          />
        </div>
      ),
    },
  ];
}
