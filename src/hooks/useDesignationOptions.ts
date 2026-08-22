import { useMemo } from "react";
import type { SelectOption } from "@/components/ui";
import { useGetDesignationsQuery } from "@/redux/features/designations/designations.api";
import { usePermissions } from "./usePermissions";

/** Only what is still on offer: a switched off designation is not a choice. */
const LOOKUP_PARAMS = {
  page: 1,
  limit: 100,
  sortBy: "title",
  sortOrder: "asc",
  isActive: true,
} as const;

/** Designations for the staff forms, in the same shape as `useRoleOptions`. */
export function useDesignationOptions() {
  const { can } = usePermissions();
  const { data, isLoading } = useGetDesignationsQuery(LOOKUP_PARAMS, {
    skip: !can("designation.read"),
  });

  const options: SelectOption[] = useMemo(
    () =>
      (data?.items ?? []).map((designation) => ({
        value: designation.id,
        label: designation.department
          ? `${designation.title} (${designation.department})`
          : designation.title,
      })),
    [data],
  );

  return { options, designations: data?.items ?? [], isLoading };
}
