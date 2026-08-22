/** The envelope every backend response is wrapped in. */
export interface ApiResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta?: Pagination;
  responseTime: string;
  timestamp: string;
}

/** The shape of a failure, from validation errors through to 500s. */
export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  /** Validation failures: an array of human readable constraint messages. */
  errors?: unknown;
  hint?: string;
  path: string;
  timestamp: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/** What a list endpoint hands to a component once the envelope is off. */
export interface Paginated<T> {
  items: T[];
  meta: Pagination;
}

export type SortOrder = "asc" | "desc";

/** The query string every list endpoint understands. */
export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  [key: string]: string | number | boolean | undefined;
}

export const EMPTY_PAGINATION: Pagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};
