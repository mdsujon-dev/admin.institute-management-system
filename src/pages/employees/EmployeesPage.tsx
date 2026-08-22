import { PageHeader } from "@/components/ui";
import PageMeta from "@/components/common/PageMeta";
import EmployeeList from "@/pages/employees/EmployeeList";

export default function EmployeesPage() {
  return (
    <>
      <PageMeta title="Employees" description="Staff records and their designations" />
      <PageHeader
        title="Employees"
        description="Everyone on staff, with the login each of them signs in with."
      />
      <EmployeeList />
    </>
  );
}
