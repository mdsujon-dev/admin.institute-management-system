import { Plus } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button, Card, ConfirmModal, DataTable, FilterBar, Select } from "@/components/ui";
import Can from "@/components/rbac/Can";
import StudentFormModal from "@/components/modal/student/StudentFormModal";
import TemporaryPasswordModal from "@/components/modal/user/TemporaryPasswordModal";
import { useStudentColumns } from "@/hooks/useStudentColumns";
import { GENDER_OPTIONS, STUDENT_STATUS_OPTIONS } from "@/constants/options";
import { useCrudDialogs } from "@/hooks/useCrudDialogs";
import { useListQuery } from "@/hooks/useListQuery";
import { useToast } from "@/hooks/useToast";
import {
  useDeleteStudentMutation,
  useGetStudentsQuery,
} from "@/redux/features/students/students.api";
import type { Student } from "@/types/models";
import { getErrorMessage } from "@/utils/apiError";
import { fullName } from "@/utils/format";

export interface StudentListProps {
  embedded?: boolean;
  limit?: number;
  title?: ReactNode;
  description?: ReactNode;
}

/** The student roll, whole. Same component embedded or standalone. */
export default function StudentList({
  embedded = false,
  limit = 10,
  title,
  description,
}: StudentListProps) {
  const list = useListQuery({
    limit,
    sortBy: "createdAt",
    filters: { status: "", gender: "" },
  });
  const dialogs = useCrudDialogs<Student>();
  const toast = useToast();

  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const { data, isLoading, isFetching, error, refetch } = useGetStudentsQuery(list.params);
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();

  const columns = useStudentColumns({
    onEdit: dialogs.openEdit,
    onDelete: dialogs.openDelete,
  });

  const handleDelete = async () => {
    if (!dialogs.deleting) return;

    try {
      await deleteStudent(dialogs.deleting.id).unwrap();
      toast.success("Student removed", fullName(dialogs.deleting));
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
            searchPlaceholder="Search name, student id, phone or email"
            isFiltered={list.isFiltered}
            onReset={list.resetFilters}
          >
            <Select
              allowClear
              placeholder="All statuses"
              options={STUDENT_STATUS_OPTIONS}
              value={list.filters.status || undefined}
              onChange={(value) => list.setFilter("status", (value as string) ?? "")}
              className="sm:w-40"
            />
            <Select
              allowClear
              placeholder="Any gender"
              options={GENDER_OPTIONS}
              value={list.filters.gender || undefined}
              onChange={(value) => list.setFilter("gender", (value as string) ?? "")}
              className="sm:w-36"
            />
            <Can permission="student.create">
              <Button icon={<Plus />} onClick={dialogs.openCreate}>
                Admit student
              </Button>
            </Can>
          </FilterBar>
        )}

        <DataTable<Student>
          columns={embedded ? columns.filter((column) => column.key !== "actions") : columns}
          rows={data?.items ?? []}
          rowKey={(student) => student.id}
          isLoading={isLoading}
          isFetching={isFetching && !isLoading}
          errorMessage={error ? getErrorMessage(error) : undefined}
          onRetry={refetch}
          meta={embedded ? undefined : data?.meta}
          onPageChange={list.setPage}
          onPageSizeChange={list.setLimit}
          onSortChange={list.setSort}
          size={embedded ? "sm" : "md"}
          emptyTitle={list.isFiltered ? "No students match" : "No students yet"}
          emptyDescription="Admit the first student to get started."
        />
      </Card>

      {!embedded && (
        <>
          <StudentFormModal
            open={dialogs.isCreateOpen}
            onClose={dialogs.closeCreate}
            student={null}
            onTemporaryPassword={setCredentials}
          />
          <StudentFormModal
            open={Boolean(dialogs.editing)}
            onClose={dialogs.closeEdit}
            student={dialogs.editing}
          />
          <ConfirmModal
            open={Boolean(dialogs.deleting)}
            onCancel={dialogs.closeDelete}
            onConfirm={handleDelete}
            isLoading={isDeleting}
            title="Remove student"
            message={`${dialogs.deleting ? fullName(dialogs.deleting) : ""} will be taken off the active roll and their login disabled. The record is kept for the audit trail.`}
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
