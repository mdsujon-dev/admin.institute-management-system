import { Plus } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button, Card, ConfirmModal, DataTable, FilterBar, Select } from "@/components/ui";
import Can from "@/components/rbac/Can";
import TemporaryPasswordModal from "@/components/modal/user/TemporaryPasswordModal";
import UserFormModal from "@/components/modal/user/UserFormModal";
import { useUserColumns } from "@/hooks/useUserColumns";
import { USER_STATUS_OPTIONS } from "@/constants/options";
import { useCrudDialogs } from "@/hooks/useCrudDialogs";
import { useListQuery } from "@/hooks/useListQuery";
import { useRoleOptions } from "@/hooks/useRoleOptions";
import { usePermissions } from "@/hooks/usePermissions";
import { useToast } from "@/hooks/useToast";
import { useDeleteUserMutation, useGetUsersQuery } from "@/redux/features/users/users.api";
import type { User } from "@/types/models";
import { getErrorMessage } from "@/utils/apiError";

export interface UserListProps {
  /** Short read-only slice, for embedding in a dashboard panel. */
  embedded?: boolean;
  limit?: number;
  title?: ReactNode;
  description?: ReactNode;
}

/**
 * The users list, whole: query, filters, dialogs and the create button. The
 * users screen renders it plain; the dashboard renders it embedded.
 */
export default function UserList({
  embedded = false,
  limit = 10,
  title,
  description,
}: UserListProps) {
  const list = useListQuery({
    limit,
    sortBy: "createdAt",
    filters: { status: "", roleId: "" },
  });
  const dialogs = useCrudDialogs<User>();
  const toast = useToast();
  const { user: currentUser } = usePermissions();
  const { options: roleOptions } = useRoleOptions();

  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(
    null,
  );

  const { data, isLoading, isFetching, error, refetch } = useGetUsersQuery(list.params);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const columns = useUserColumns({
    onEdit: dialogs.openEdit,
    onDelete: dialogs.openDelete,
    currentUserId: currentUser?.id,
  });

  const handleDelete = async () => {
    if (!dialogs.deleting) return;

    try {
      await deleteUser(dialogs.deleting.id).unwrap();
      toast.success("User deleted", dialogs.deleting.email);
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
            searchPlaceholder="Search by email or role"
            isFiltered={list.isFiltered}
            onReset={list.resetFilters}
          >
            <Select
              allowClear
              placeholder="All statuses"
              options={USER_STATUS_OPTIONS}
              value={list.filters.status || undefined}
              onChange={(value) => list.setFilter("status", (value as string) ?? "")}
              className="sm:w-40"
            />
            <Select
              allowClear
              placeholder="All roles"
              options={roleOptions}
              value={list.filters.roleId || undefined}
              onChange={(value) => list.setFilter("roleId", (value as string) ?? "")}
              className="sm:w-44"
            />
            <Can permission="user.create">
              <Button icon={<Plus />} onClick={dialogs.openCreate}>
                New user
              </Button>
            </Can>
          </FilterBar>
        )}

        <DataTable<User>
          columns={embedded ? columns.filter((column) => column.key !== "actions") : columns}
          rows={data?.items ?? []}
          rowKey={(user) => user.id}
          isLoading={isLoading}
          isFetching={isFetching && !isLoading}
          errorMessage={error ? getErrorMessage(error) : undefined}
          onRetry={refetch}
          meta={embedded ? undefined : data?.meta}
          onPageChange={list.setPage}
          onPageSizeChange={list.setLimit}
          onSortChange={list.setSort}
          size={embedded ? "sm" : "md"}
          emptyTitle={list.isFiltered ? "No users match" : "No users yet"}
          emptyDescription="Create a login, or add an employee or student to create one with a profile."
        />
      </Card>

      {!embedded && (
        <>
          <UserFormModal
            open={dialogs.isCreateOpen}
            onClose={dialogs.closeCreate}
            user={null}
            onTemporaryPassword={setCredentials}
          />
          <UserFormModal
            open={Boolean(dialogs.editing)}
            onClose={dialogs.closeEdit}
            user={dialogs.editing}
          />
          <ConfirmModal
            open={Boolean(dialogs.deleting)}
            onCancel={dialogs.closeDelete}
            onConfirm={handleDelete}
            isLoading={isDeleting}
            title="Delete user"
            message={`${dialogs.deleting?.email} will no longer be able to sign in. The record is kept for the audit trail.`}
            confirmLabel="Delete"
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
