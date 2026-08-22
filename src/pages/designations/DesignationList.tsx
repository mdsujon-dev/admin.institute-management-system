import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { Button, Card, ConfirmModal, DataTable, FilterBar } from "@/components/ui";
import Can from "@/components/rbac/Can";
import DesignationFormModal from "@/components/modal/designation/DesignationFormModal";
import { useDesignationColumns } from "@/hooks/useDesignationColumns";
import { useCrudDialogs } from "@/hooks/useCrudDialogs";
import { useListQuery } from "@/hooks/useListQuery";
import { useToast } from "@/hooks/useToast";
import {
  useDeleteDesignationMutation,
  useGetDesignationsQuery,
} from "@/redux/features/designations/designations.api";
import type { Designation } from "@/types/models";
import { getErrorMessage } from "@/utils/apiError";

export interface DesignationListProps {
  embedded?: boolean;
  limit?: number;
  title?: ReactNode;
  description?: ReactNode;
}

/** The designations list, whole. Same component embedded or standalone. */
export default function DesignationList({
  embedded = false,
  limit = 10,
  title,
  description,
}: DesignationListProps) {
  const list = useListQuery({ limit, sortBy: "title", sortOrder: "asc" });
  const dialogs = useCrudDialogs<Designation>();
  const toast = useToast();

  const { data, isLoading, isFetching, error, refetch } = useGetDesignationsQuery(
    list.params,
  );
  const [deleteDesignation, { isLoading: isDeleting }] = useDeleteDesignationMutation();

  const columns = useDesignationColumns({
    onEdit: dialogs.openEdit,
    onDelete: dialogs.openDelete,
  });

  const handleDelete = async () => {
    if (!dialogs.deleting) return;

    try {
      await deleteDesignation(dialogs.deleting.id).unwrap();
      toast.success("Designation deleted", dialogs.deleting.title);
      dialogs.closeDelete();
    } catch (deleteError) {
      toast.error("Could not delete", getErrorMessage(deleteError));
    }
  };

  return (
    <>
      <Card padded={false} title={title} description={description}>
        {!embedded && (
          <FilterBar
            search={list.search}
            onSearchChange={list.setSearch}
            searchPlaceholder="Search title, department or description"
            isFiltered={list.isFiltered}
            onReset={list.resetFilters}
          >
            <Can permission="designation.create">
              <Button icon={<Plus />} onClick={dialogs.openCreate}>
                New designation
              </Button>
            </Can>
          </FilterBar>
        )}

        <DataTable<Designation>
          columns={embedded ? columns.filter((column) => column.key !== "actions") : columns}
          rows={data?.items ?? []}
          rowKey={(designation) => designation.id}
          isLoading={isLoading}
          isFetching={isFetching && !isLoading}
          errorMessage={error ? getErrorMessage(error) : undefined}
          onRetry={refetch}
          meta={embedded ? undefined : data?.meta}
          onPageChange={list.setPage}
          onPageSizeChange={list.setLimit}
          onSortChange={list.setSort}
          size={embedded ? "sm" : "md"}
          emptyTitle={list.isFiltered ? "No designations match" : "No designations yet"}
          emptyDescription="Create the first designation to start assigning staff."
        />
      </Card>

      {!embedded && (
        <>
          <DesignationFormModal
            open={dialogs.isCreateOpen}
            onClose={dialogs.closeCreate}
            designation={null}
          />
          <DesignationFormModal
            open={Boolean(dialogs.editing)}
            onClose={dialogs.closeEdit}
            designation={dialogs.editing}
          />
          <ConfirmModal
            open={Boolean(dialogs.deleting)}
            onCancel={dialogs.closeDelete}
            onConfirm={handleDelete}
            isLoading={isDeleting}
            title="Delete designation"
            message={`"${dialogs.deleting?.title}" will be removed. Designations still assigned to staff cannot be deleted.`}
            confirmLabel="Delete"
          />
        </>
      )}
    </>
  );
}
