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

  const canReadStudents = can("student.read");
  const canReadEmployees = can("employee.read");
  const canReadUsers = can("user.read");

  const students = useGetStudentsQuery(COUNT_ONLY, { skip: !canReadStudents });
  const employees = useGetEmployeesQuery(COUNT_ONLY, { skip: !canReadEmployees });
  const users = useGetUsersQuery(COUNT_ONLY, { skip: !canReadUsers });

  const designations = useGetDesignationsQuery(COUNT_ONLY, {
    skip: !can("designation.read"),
  });

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {canReadStudents && (
        <StatCard
          tone="brand"
          label="Students"
          caption="Total admitted"
          icon={<SolutionOutlined />}
          value={formatNumber(students.data?.meta.total)}
          isLoading={students.isLoading}
        />
      )}

      {canReadEmployees && (
        <StatCard
          tone="info"
          label="Employees"
          caption="Total staff"
          icon={<TeamOutlined />}
          value={formatNumber(employees.data?.meta.total)}
          isLoading={employees.isLoading}
        />
      )}

      {canReadUsers && (
        <StatCard
          tone="success"
          label="Login accounts"
          caption="Can sign in"
          icon={<IdcardOutlined />}
          value={formatNumber(users.data?.meta.total)}
          isLoading={users.isLoading}
        />
      )}

      {can("designation.read") && (
        <StatCard
          tone="warning"
          label="Designations"
          caption="Job titles"
          icon={<ContactsOutlined />}
          value={formatNumber(designations.data?.meta.total)}
          isLoading={designations.isLoading}
        />
      )}
    </div>
  );
}
