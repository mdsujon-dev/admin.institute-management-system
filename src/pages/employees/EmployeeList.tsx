import { PlusOutlined } from "@ant-design/icons";
import { useState, type ReactNode } from "react";
import { Button, Card, ConfirmModal, DataTable, FilterBar, Select } from "@/components/ui";
import Can from "@/components/rbac/Can";
import EmployeeFormModal from "@/components/modal/employee/EmployeeFormModal";
import TemporaryPasswordModal from "@/components/modal/user/TemporaryPasswordModal";
import { useEmployeeColumns } from "@/hooks/useEmployeeColumns";
import { EMPLOYEE_STATUS_OPTIONS } from "@/constants/options";
import { useCrudDialogs } from "@/hooks/useCrudDialogs";
import { useDesignationOptions } from "@/hooks/useDesignationOptions";
import { useListQuery } from "@/hooks/useListQuery";
import { useToast } from "@/hooks/useToast";
import {
  useDeleteEmployeeMutation,
  useGetEmployeesQuery,
} from "@/redux/features/employees/employees.api";
import type { Employee } from "@/types/models";
import { getErrorMessage } from "@/utils/apiError";
import { fullName } from "@/utils/format";

export interface EmployeeListProps {
  embedded?: boolean;
  limit?: number;
  title?: ReactNode;
  description?: ReactNode;
}

/** The staff list, whole. Same component embedded or standalone. */
export default function EmployeeList({
  embedded = false,
  limit = 10,
  title,
  description,
}: EmployeeListProps) {
  const list = useListQuery({
    limit,
    sortBy: "createdAt",
    filters: { status: "", designationId: "" },
  });
  const dialogs = useCrudDialogs<Employee>();
  const toast = useToast();
  const { options: designationOptions } = useDesignationOptions();

  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const { data, isLoading, isFetching, error, refetch } = useGetEmployeesQuery(list.params);
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();

  const columns = useEmployeeColumns({
    onEdit: dialogs.openEdit,
    onDelete: dialogs.openDelete,
  });

  const handleDelete = async () => {
    if (!dialogs.deleting) return;

    try {
      await deleteEmployee(dialogs.deleting.id).unwrap();
      toast.success("Employee removed", fullName(dialogs.deleting));
      dialogs.closeDelete();
    } catch (deleteError) {
      toast.error("Could not remove", getErrorMessage(deleteError));
    }
  };

  return (
    <>
      <Card padded={false} title={title} description={description}>
        {!embedded && (
          <FilterBar
            search={list.search}
            onSearchChange={list.setSearch}
            searchPlaceholder="Search name, staff id, phone or email"
            isFiltered={list.isFiltered}
            onReset={list.resetFilters}
          >
            <Select
              allowClear
              placeholder="All statuses"
              options={EMPLOYEE_STATUS_OPTIONS}
              value={list.filters.status || undefined}
              onChange={(value) => list.setFilter("status", (value as string) ?? "")}
              className="sm:w-40"
            />
            <Select
              allowClear
              placeholder="All designations"
              options={designationOptions}
              value={list.filters.designationId || undefined}
              onChange={(value) => list.setFilter("designationId", (value as string) ?? "")}
              className="sm:w-52"
            />
            <Can permission="employee.create">
              <Button icon={<PlusOutlined />} onClick={dialogs.openCreate}>
                Add employee
              </Button>
            </Can>
          </FilterBar>
        )}

        <DataTable<Employee>
          columns={embedded ? columns.filter((column) => column.key !== "actions") : columns}
          rows={data?.items ?? []}
          rowKey={(employee) => employee.id}
          isLoading={isLoading}
          isFetching={isFetching && !isLoading}
          errorMessage={error ? getErrorMessage(error) : undefined}
          onRetry={refetch}
          meta={embedded ? undefined : data?.meta}
          onPageChange={list.setPage}
          onPageSizeChange={list.setLimit}
          onSortChange={list.setSort}
          size={embedded ? "sm" : "md"}
          emptyTitle={list.isFiltered ? "No employees match" : "No employees yet"}
          emptyDescription="Add the first staff member to get started."
        />
      </Card>

      {!embedded && (
        <>
          <EmployeeFormModal
            open={dialogs.isCreateOpen}
            onClose={dialogs.closeCreate}
            employee={null}
            onTemporaryPassword={setCredentials}
          />
          <EmployeeFormModal
            open={Boolean(dialogs.editing)}
            onClose={dialogs.closeEdit}
            employee={dialogs.editing}
          />
          <ConfirmModal
            open={Boolean(dialogs.deleting)}
            onCancel={dialogs.closeDelete}
            onConfirm={handleDelete}
            isLoading={isDeleting}
            title="Remove employee"
            message={`${dialogs.deleting ? fullName(dialogs.deleting) : ""} will be marked terminated and their login disabled. The record is kept for the audit trail.`}
            confirmLabel="Remove"
          />
          <TemporaryPasswordModal
            open={Boolean(credentials)}
            onClose={() => setCredentials(null)}
            email={credentials?.email ?? ""}
            password={credentials?.password ?? ""}
          />
        </>
      )}
    </>
  );
}
