import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { API_TAGS } from "./tags";

/**
 * The single API slice. Every feature attaches its own endpoints with
 * `baseApi.injectEndpoints` from `redux/features/<domain>/<domain>.api.ts`, so
 * each domain owns a file while they all share one cache and one tag list.
 *
 * The refresh handling is not here on purpose: swapping an expired access token
 * for a new one is the base *query's* job, and lives in `./baseQuery.ts` as
 * `baseQueryWithReauth`. This file only says which query to use.
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: API_TAGS,
  // List screens and the dashboard read the same data; a short window keeps them
  // in step without a request on every single navigation.
  refetchOnMountOrArgChange: 30,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
