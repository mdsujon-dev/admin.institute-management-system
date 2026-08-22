import type { ApiResponse, ListParams, Paginated } from "@/types/api";
import { EMPTY_PAGINATION } from "@/types/api";
import type { ApiTag } from "./tags";

/**
 * The backend wraps every response in `{ success, message, data, meta }`. These
 * helpers unwrap it in `transformResponse`, so no component ever sees the
 * envelope -- it asks for a role and it gets a role.
 */
export function unwrap<T>(response: ApiResponse<T>): T {
  return response.data;
}

/** For a list endpoint: keeps `data` and `meta` together as one value. */
export function unwrapList<T>(response: ApiResponse<T[]>): Paginated<T> {
  return {
    items: response.data ?? [],
    meta: response.meta ?? { ...EMPTY_PAGINATION, total: response.data?.length ?? 0 },
  };
}

/** Drops empty filters, so the URL stays clean and the API keeps its defaults. */
export function cleanParams(params: ListParams = {}): ListParams {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );
}

/**
 * Tags for a list result: one per row plus a `LIST` sentinel, so creating a row
 * refetches the list while editing one row does not.
 */
export function listTags<T extends { id: string }>(
  tag: ApiTag,
  result: Paginated<T> | undefined,
) {
  return result
    ? [
        ...result.items.map((item) => ({ type: tag, id: item.id }) as const),
        { type: tag, id: "LIST" } as const,
      ]
    : [{ type: tag, id: "LIST" } as const];
}
