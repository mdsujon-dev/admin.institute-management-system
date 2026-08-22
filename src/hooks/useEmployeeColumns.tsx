import type { ColumnsType } from "antd/es/table";
import LoginStatusSwitch from "@/components/rbac/LoginStatusSwitch";
import PermissionsButton from "@/components/rbac/PermissionsButton";
import { InitialsAvatar, StatusTag, Text } from "@/components/ui";
import RowActions from "@/components/ui/DataTable/RowActions";
import type { Employee } from "@/types/models";
import { formatCurrency, formatDate, fullName } from "@/utils/format";

interface Options {
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  /** Flips whether this employee's account can sign in, from the row itself. */
  onToggleLogin: (employee: Employee, next: boolean) => void;
  /** The row whose login is being saved right now, if any. */
  togglingId?: string | null;
  /** The signed in account, which may not disable itself. */
  currentUserId?: string;
}

export function useEmployeeColumns({
  onEdit,
  onDelete,
  onToggleLogin,
  togglingId,
  currentUserId,
}: Options): ColumnsType<Employee> {
  return [
    {
      title: "Employee",
      key: "firstName",
      sorter: true,
      render: (_, employee) => (
        <div className="flex items-center gap-3">
          <InitialsAvatar name={fullName(employee)} />
          <div className="min-w-0">
            <Text weight="medium" truncate>
              {fullName(employee)}
            </Text>
            <Text size="caption" tone="subtle" truncate>
              {employee.employeeId}
              {employee.user?.email ? ` - ${employee.user.email}` : ""}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Designation",
      key: "designation",
      responsive: ["md"],
      render: (_, employee) =>
        employee.designation ? (
          <div className="min-w-0">
            <Text size="body-sm">{employee.designation.title}</Text>
            {employee.designation.department && (
              <Text size="caption" tone="subtle">
                {employee.designation.department}
              </Text>
            )}
          </div>
        ) : (
          <span className="text-gray-400">&mdash;</span>
        ),
    },
    {
      title: "Joined",
      key: "joiningDate",
      sorter: true,
      responsive: ["lg"],
      render: (_, employee) => (
        <Text size="body-sm" tone="muted">
          {formatDate(employee.joiningDate)}
        </Text>
      ),
    },
    {
      title: "Salary",
      key: "salary",
      sorter: true,
      responsive: ["xl"],
      render: (_, employee) => (
        <Text size="body-sm">{formatCurrency(employee.salary)}</Text>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, employee) => <StatusTag status={employee.status} />,
    },
    {
      title: "Can sign in",
      key: "loginStatus",
      responsive: ["md"],
      render: (_, employee) => (
        <LoginStatusSwitch
          status={employee.user?.status}
          loading={togglingId === employee.id}
          isSelf={Boolean(employee.user?.id) && employee.user?.id === currentUserId}
          onChange={(next) => onToggleLogin(employee, next)}
        />
      ),
    },
    {
      title: "",
      key: "actions",
      align: "right",
      fixed: "right",
      width: 150,
      render: (_, employee) => (
        <div className="flex items-center justify-end gap-2">
          <PermissionsButton userId={employee.user?.id} />

          <RowActions
            onEdit={() => onEdit(employee)}
            onDelete={() => onDelete(employee)}
            editPermission="employee.update"
            deletePermission="employee.delete"
          />
        </div>
      ),
    },
  ];
}
