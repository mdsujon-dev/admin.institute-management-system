import { Plus } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button, Card, ConfirmModal, DataTable, FilterBar } from "@/components/ui";
import Can from "@/components/rbac/Can";
import RoleFormModal from "@/components/modal/role/RoleFormModal";
import { useRoleColumns } from "@/hooks/useRoleColumns";
import { useCrudDialogs } from "@/hooks/useCrudDialogs";
import { useListQuery } from "@/hooks/useListQuery";
import { useToast } from "@/hooks/useToast";
import {
  useDeleteRoleMutation,
  useGetRolesQuery,
  useUpdateRoleMutation,
} from "@/redux/features/roles/roles.api";
import type { Role } from "@/types/models";
import { getErrorMessage } from "@/utils/apiError";

export interface RoleListProps {
  /**
   * Embedded mode: a short read-only slice for a dashboard panel -- no search,
   * no pager, no dialogs. The same component either way, which is the point.
   */
  embedded?: boolean;
  limit?: number;
  title?: ReactNode;
  description?: ReactNode;
}

/**
 * The roles list, whole. It owns its query, its filters, its dialogs and its
 * create button, so a screen renders `<RoleList />` and is done, and a dashboard
 * renders `<RoleList embedded limit={5} />` without a second implementation.
 */
export default function RoleList({
  embedded = false,
  limit = 10,
  title,
  description,
}: RoleListProps) {
  const list = useListQuery({ limit, sortBy: "name", sortOrder: "asc" });
  const dialogs = useCrudDialogs<Role>();
  const toast = useToast();

  const { data, isLoading, isFetching, error, refetch } = useGetRolesQuery(list.params);
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();
  const [updateRole] = useUpdateRoleMutation();

  /** Which row's status is saving, so only that switch spins. */
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleStatus = async (role: Role, isActive: boolean) => {
    setTogglingId(role.id);

    try {
      await updateRole({ id: role.id, body: { isActive } }).unwrap();
      toast.success(isActive ? "Role switched on" : "Role switched off", role.name);
    } catch (updateError) {
      toast.error("Could not change status", getErrorMessage(updateError));
    } finally {
      setTogglingId(null);
    }
  };

  const columns = useRoleColumns({
    onEdit: dialogs.openEdit,
    onDelete: dialogs.openDelete,
    onToggleStatus: (role, isActive) => void handleToggleStatus(role, isActive),
    togglingId,
  });

  const handleDelete = async () => {
    if (!dialogs.deleting) return;

    try {
      await deleteRole(dialogs.deleting.id).unwrap();
      toast.success("Role deleted", dialogs.deleting.name);
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
            searchPlaceholder="Search roles"
            isFiltered={list.isFiltered}
            onReset={list.resetFilters}
          >
            <Can permission="role.create">
              <Button icon={<Plus />} onClick={dialogs.openCreate}>
                New role
              </Button>
            </Can>
          </FilterBar>
        )}

        <DataTable<Role>
          columns={embedded ? columns.filter((column) => column.key !== "actions") : columns}
          rows={data?.items ?? []}
          rowKey={(role) => role.id}
          isLoading={isLoading}
          isFetching={isFetching && !isLoading}
          errorMessage={error ? getErrorMessage(error) : undefined}
          onRetry={refetch}
          meta={embedded ? undefined : data?.meta}
          onPageChange={list.setPage}
          onPageSizeChange={list.setLimit}
          onSortChange={list.setSort}
          size={embedded ? "sm" : "md"}
          emptyTitle={list.isFiltered ? "No roles match" : "No roles yet"}
          emptyDescription="A role is a bundle of permissions that accounts sign in with."
        />
      </Card>

      {!embedded && (
        <>
          <RoleFormModal open={dialogs.isCreateOpen} onClose={dialogs.closeCreate} role={null} />
          <RoleFormModal
            open={Boolean(dialogs.editing)}
            onClose={dialogs.closeEdit}
            role={dialogs.editing}
          />
          <ConfirmModal
            open={Boolean(dialogs.deleting)}
            onCancel={dialogs.closeDelete}
            onConfirm={handleDelete}
            isLoading={isDeleting}
            title="Delete role"
            message={`"${dialogs.deleting?.name}" will be removed. A role still assigned to an account cannot be deleted.`}
            confirmLabel="Delete"
          />
        </>
      )}
    </>
  );
}
