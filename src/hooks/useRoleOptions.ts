import { useMemo } from "react";
import type { SelectOption } from "@/components/ui";
import { useGetRolesQuery } from "@/redux/features/roles/roles.api";
import { humanise } from "@/utils/format";
import { usePermissions } from "./usePermissions";

/** Dropdowns need every row, not the first page of ten. 100 is the API ceiling. */
/** Only roles still in use: a switched off role cannot be handed out. */
const LOOKUP_PARAMS = {
  page: 1,
  limit: 100,
  sortBy: "name",
  sortOrder: "asc",
  isActive: true,
} as const;

/**
 * Roles for the "which login is this" dropdowns.
 *
 * Skipped when the account cannot read roles, so a form degrades to an empty
 * select instead of a 403 in the console. SUPER_ADMIN is never listed by the API
 * at all -- it is a hidden role, and handing it out through a dropdown is
 * exactly what `isHidden` exists to prevent.
 */
export function useRoleOptions() {
  const { can } = usePermissions();
  const { data, isLoading } = useGetRolesQuery(LOOKUP_PARAMS, { skip: !can("role.read") });

  const options: SelectOption[] = useMemo(
    () =>
      (data?.items ?? []).map((role) => ({
        value: role.id,
        label: humanise(role.name),
      })),
    [data],
  );

  return { options, roles: data?.items ?? [], isLoading };
}
