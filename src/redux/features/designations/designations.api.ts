import { baseApi } from "@/redux/api/baseApi";
import { cleanParams, listTags, unwrap, unwrapList } from "@/redux/api/helpers";
import type { ApiResponse, ListParams, Paginated } from "@/types/api";
import type { Designation } from "@/types/models";

export interface DesignationPayload {
  title: string;
  description?: string;
  /** The role its holders sign in with. */
  roleId?: string;
  isActive?: boolean;
}

export const designationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDesignations: builder.query<Paginated<Designation>, ListParams | void>({
      query: (params) => ({ url: "/designations", params: cleanParams(params ?? {}) }),
      transformResponse: unwrapList<Designation>,
      providesTags: (result) => listTags("Designation", result),
    }),

    getDesignation: builder.query<Designation, string>({
      query: (id) => `/designations/${id}`,
      transformResponse: unwrap<Designation>,
      providesTags: (_result, _error, id) => [{ type: "Designation", id }],
    }),

    createDesignation: builder.mutation<Designation, DesignationPayload>({
      query: (body) => ({ url: "/designations", method: "POST", body }),
      transformResponse: unwrap<Designation>,
      invalidatesTags: [{ type: "Designation", id: "LIST" }],
    }),

    updateDesignation: builder.mutation<
      Designation,
      { id: string; body: Partial<DesignationPayload> }
    >({
      query: ({ id, body }) => ({ url: `/designations/${id}`, method: "PATCH", body }),
      transformResponse: unwrap<Designation>,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Designation", id },
        { type: "Designation", id: "LIST" },
        // Employee rows carry the designation title.
        { type: "Employee", id: "LIST" },
      ],
    }),

    deleteDesignation: builder.mutation<null, string>({
      query: (id) => ({ url: `/designations/${id}`, method: "DELETE" }),
      transformResponse: (response: ApiResponse<null>) => response.data,
      invalidatesTags: [{ type: "Designation", id: "LIST" }],
    }),
  }),
});

export const {
  useGetDesignationsQuery,
  useGetDesignationQuery,
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,
} = designationsApi;
