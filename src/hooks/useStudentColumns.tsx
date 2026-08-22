import type { ColumnsType } from "antd/es/table";
import LoginStatusSwitch from "@/components/rbac/LoginStatusSwitch";
import PermissionsButton from "@/components/rbac/PermissionsButton";
import { InitialsAvatar, StatusTag, Text } from "@/components/ui";
import RowActions from "@/components/ui/DataTable/RowActions";
import type { Student } from "@/types/models";
import { formatDate, fullName } from "@/utils/format";

interface Options {
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  /** Flips whether this student's account can sign in, from the row itself. */
  onToggleLogin: (student: Student, next: boolean) => void;
  /** The row whose login is being saved right now, if any. */
  togglingId?: string | null;
}

export function useStudentColumns({
  onEdit,
  onDelete,
  onToggleLogin,
  togglingId,
}: Options): ColumnsType<Student> {
  return [
    {
      title: "Student",
      key: "firstName",
      sorter: true,
      render: (_, student) => (
        <div className="flex items-center gap-3">
          <InitialsAvatar name={fullName(student)} />
          <div className="min-w-0">
            <Text weight="medium" truncate>
              {fullName(student)}
            </Text>
            <Text size="caption" tone="subtle" truncate>
              {student.studentId}
              {student.user?.email ? ` - ${student.user.email}` : ""}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Guardian",
      key: "guardian",
      responsive: ["md"],
      render: (_, student) =>
        student.guardianName ? (
          <div className="min-w-0">
            <Text size="body-sm">{student.guardianName}</Text>
            {student.guardianPhone && (
              <Text size="caption" tone="subtle">
                {student.guardianPhone}
              </Text>
            )}
          </div>
        ) : (
          <span className="text-gray-400">&mdash;</span>
        ),
    },
    {
      title: "Admitted",
      key: "admissionDate",
      sorter: true,
      responsive: ["lg"],
      render: (_, student) => (
        <Text size="body-sm" tone="muted">
          {formatDate(student.admissionDate)}
        </Text>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, student) => <StatusTag status={student.status} />,
    },
    {
      title: "Can sign in",
      key: "loginStatus",
      responsive: ["md"],
      render: (_, student) => (
        <LoginStatusSwitch
          status={student.user?.status}
          loading={togglingId === student.id}
          onChange={(next) => onToggleLogin(student, next)}
        />
      ),
    },
    {
      title: "",
      key: "actions",
      align: "right",
      fixed: "right",
      width: 150,
      render: (_, student) => (
        <div className="flex items-center justify-end gap-2">
          <PermissionsButton userId={student.user?.id} />

          <RowActions
            onEdit={() => onEdit(student)}
            onDelete={() => onDelete(student)}
            editPermission="student.update"
            deletePermission="student.delete"
          />
        </div>
      ),
    },
  ];
}
