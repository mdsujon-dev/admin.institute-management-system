import {
  ContactsOutlined,
  IdcardOutlined,
  SolutionOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import StatCard from "@/components/card/StatCard";
import { usePermissions } from "@/hooks/usePermissions";
import { useGetDesignationsQuery } from "@/redux/features/designations/designations.api";
import { useGetEmployeesQuery } from "@/redux/features/employees/employees.api";
import { useGetStudentsQuery } from "@/redux/features/students/students.api";
import { useGetUsersQuery } from "@/redux/features/users/users.api";
import { formatNumber } from "@/utils/format";

/** One row is enough to know a total: `meta.total` carries the count. */
const COUNT_ONLY = { page: 1, limit: 1 } as const;

/**
 * The metric row. Each tile is gated on the permission that backs it, so two
 * roles see two different dashboards rather than a grid of failed requests.
 */
export default function StatGrid() {
  const { can } = usePermissions();

  const students = useGetStudentsQuery(COUNT_ONLY, { skip: !can("student.read") });
  const employees = useGetEmployeesQuery(COUNT_ONLY, { skip: !can("employee.read") });
  const users = useGetUsersQuery(COUNT_ONLY, { skip: !can("user.read") });
  const designations = useGetDesignationsQuery(COUNT_ONLY, {
    skip: !can("designation.read"),
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {can("student.read") && (
        <StatCard
          label="Students"
          tone="brand"
          icon={<SolutionOutlined />}
          value={formatNumber(students.data?.meta.total)}
          isLoading={students.isLoading}
        />
      )}

      {can("employee.read") && (
        <StatCard
          label="Employees"
          tone="info"
          icon={<TeamOutlined />}
          value={formatNumber(employees.data?.meta.total)}
          isLoading={employees.isLoading}
        />
      )}

      {can("user.read") && (
        <StatCard
          label="Login accounts"
          tone="success"
          icon={<IdcardOutlined />}
          value={formatNumber(users.data?.meta.total)}
          isLoading={users.isLoading}
        />
      )}

      {can("designation.read") && (
        <StatCard
          label="Designations"
          tone="warning"
          icon={<ContactsOutlined />}
          value={formatNumber(designations.data?.meta.total)}
          isLoading={designations.isLoading}
        />
      )}
    </div>
  );
}
