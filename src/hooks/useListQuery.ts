import { useCallback, useMemo, useState } from "react";
import type { ListParams, SortOrder } from "@/types/api";
import { useDebouncedValue } from "./useDebouncedValue";

export interface ListQueryOptions {
  /** Rows per page. The API caps this at 100. */
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  /** Extra query keys the endpoint understands, e.g. `{ status: "ACTIVE" }`. */
  filters?: Record<string, string>;
}

/**
 * The state behind every list screen: page, page size, debounced search, sort
 * and an open bag of filters -- already shaped as the query string the API
 * expects. Changing a filter or the search term resets to page one, which is
 * what an operator expects and what prevents "no results on page 4".
 */
export function useListQuery(options: ListQueryOptions = {}) {
  const {
    limit: initialLimit = 10,
    sortBy: initialSortBy,
    sortOrder: initialSortOrder = "desc",
    filters: initialFilters = {},
  } = options;

  const [page, setPage] = useState(1);
  const [limit, setLimitState] = useState(initialLimit);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<SortOrder | undefined>(initialSortOrder);
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);

  const debouncedSearch = useDebouncedValue(search);

  const changeSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const setFilter = useCallback((key: string, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }, []);

  const setLimit = useCallback((value: number) => {
    setLimitState(value);
    setPage(1);
  }, []);

  /** Fed straight from the table's own sort control. */
  const setSort = useCallback((field: string | undefined, order: SortOrder | undefined) => {
    setSortBy(field ?? initialSortBy);
    setSortOrder(field ? order : initialSortOrder);
    setPage(1);
  }, [initialSortBy, initialSortOrder]);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearch("");
    setPage(1);
    // `initialFilters` is a literal at every call site; capturing the first one
    // keeps this callback stable instead of rebuilding it on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const params: ListParams = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch.trim() || undefined,
      sortBy,
      sortOrder,
      ...filters,
    }),
    [page, limit, debouncedSearch, sortBy, sortOrder, filters],
  );

  /** True when anything narrows the list -- drives the "Clear filters" button. */
  const isFiltered = useMemo(
    () =>
      Boolean(debouncedSearch.trim()) ||
      Object.values(filters).some((value) => value !== ""),
    [debouncedSearch, filters],
  );

  return {
    params,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch: changeSearch,
    sortBy,
    sortOrder,
    setSort,
    filters,
    setFilter,
    resetFilters,
    isFiltered,
  };
}
