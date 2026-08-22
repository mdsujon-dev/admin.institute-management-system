import { baseApi } from "@/redux/api/baseApi";
import { cleanParams, listTags, unwrap, unwrapList } from "@/redux/api/helpers";
import type { ApiResponse, ListParams, Paginated } from "@/types/api";
import type { Permission, Role, RoleDetail } from "@/types/models";

export interface RolePayload {
  name: string;
  description?: string;
  /** The complete set the role should end up with -- the API replaces, not merges. */
  permissions?: string[];
  isActive?: boolean;
}

export const rolesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<Paginated<Role>, ListParams | void>({
      query: (params) => ({ url: "/roles", params: cleanParams(params ?? {}) }),
      transformResponse: unwrapList<Role>,
      providesTags: (result) => listTags("Role", result),
    }),

    getRole: builder.query<RoleDetail, string>({
      query: (id) => `/roles/${id}`,
      transformResponse: unwrap<RoleDetail>,
      providesTags: (_result, _error, id) => [{ type: "Role", id }],
    }),

    createRole: builder.mutation<RoleDetail, RolePayload>({
      query: (body) => ({ url: "/roles", method: "POST", body }),
      transformResponse: unwrap<RoleDetail>,
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),

    updateRole: builder.mutation<RoleDetail, { id: string; body: Partial<RolePayload> }>({
      query: ({ id, body }) => ({ url: `/roles/${id}`, method: "PATCH", body }),
      transformResponse: unwrap<RoleDetail>,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Role", id },
        { type: "Role", id: "LIST" },
        // Changing a role's permissions changes what its holders may do.
        "Auth",
      ],
    }),

    deleteRole: builder.mutation<null, string>({
      query: (id) => ({ url: `/roles/${id}`, method: "DELETE" }),
      transformResponse: (response: ApiResponse<null>) => response.data,
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),

    /**
     * The seeded catalogue, grouped by subject. Requires `permission.read`,
     * which only SUPER_ADMIN holds -- the role editor falls back to the local
     * catalogue in `constants/permissions.ts`.
     */
    getPermissions: builder.query<
      { total: number; grouped: Record<string, Permission[]> },
      void
    >({
      query: () => "/permissions",
      transformResponse: unwrap<{ total: number; grouped: Record<string, Permission[]> }>,
      providesTags: ["Permission"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetPermissionsQuery,
} = rolesApi;
