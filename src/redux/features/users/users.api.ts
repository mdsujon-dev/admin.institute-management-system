import { baseApi } from "@/redux/api/baseApi";
import { cleanParams, listTags, unwrap, unwrapList } from "@/redux/api/helpers";
import type { ApiResponse, ListParams, Paginated } from "@/types/api";
import type { User, UserDetail, UserStatus } from "@/types/models";

export interface CreateUserPayload {
  email: string;
  /** Leave empty and the API returns a one time temporary password. */
  password?: string;
  roleId: string;
  status?: UserStatus;
}

export interface UpdateUserPayload {
  roleId?: string;
  status?: UserStatus;
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<Paginated<User>, ListParams | void>({
      query: (params) => ({ url: "/users", params: cleanParams(params ?? {}) }),
      transformResponse: unwrapList<User>,
      providesTags: (result) => listTags("User", result),
    }),

    getUser: builder.query<UserDetail, string>({
      query: (id) => `/users/${id}`,
      transformResponse: unwrap<UserDetail>,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    createUser: builder.mutation<User, CreateUserPayload>({
      query: (body) => ({ url: "/users", method: "POST", body }),
      transformResponse: unwrap<User>,
      invalidatesTags: [
        { type: "User", id: "LIST" },
        { type: "Role", id: "LIST" },
      ],
    }),

    updateUser: builder.mutation<User, { id: string; body: UpdateUserPayload }>({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: "PATCH", body }),
      transformResponse: unwrap<User>,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
        { type: "Role", id: "LIST" },
      ],
    }),

    /**
     * Replaces the extras granted to one account. These are added to whatever
     * its role already allows -- they never take a permission away.
     */
    setUserPermissions: builder.mutation<
      UserDetail,
      { id: string; permissions: string[] }
    >({
      query: ({ id, permissions }) => ({
        url: `/users/${id}/permissions`,
        method: "PUT",
        body: { permissions },
      }),
      transformResponse: unwrap<UserDetail>,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
        // The signed in account may have just changed what it can see.
        "Auth",
      ],
    }),

    deleteUser: builder.mutation<null, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      transformResponse: (response: ApiResponse<null>) => response.data,
      invalidatesTags: [
        { type: "User", id: "LIST" },
        { type: "Role", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useSetUserPermissionsMutation,
  useDeleteUserMutation,
} = usersApi;
