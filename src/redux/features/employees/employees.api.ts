import { baseApi } from "@/redux/api/baseApi";
import { cleanParams, listTags, unwrap, unwrapList } from "@/redux/api/helpers";
import type { ApiResponse, ListParams, Paginated } from "@/types/api";
import type { Employee, EmployeeStatus, Gender } from "@/types/models";

/** Creates the login and the staff profile in one call. */
export interface CreateEmployeePayload {
  email: string;
  password?: string;
  /** Optional: the designation already carries the role its holders get. */
  roleId?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: Gender;
  dateOfBirth?: string;
  address?: string;
  joiningDate?: string;
  salary?: number;
  designationId?: string;
  status?: EmployeeStatus;
}

/** The login half is not editable here -- Users owns role and status. */
export type UpdateEmployeePayload = Partial<
  Omit<CreateEmployeePayload, "email" | "password" | "roleId">
>;

export const employeesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<Paginated<Employee>, ListParams | void>({
      query: (params) => ({ url: "/employees", params: cleanParams(params ?? {}) }),
      transformResponse: unwrapList<Employee>,
      providesTags: (result) => listTags("Employee", result),
    }),

    getEmployee: builder.query<Employee, string>({
      query: (id) => `/employees/${id}`,
      transformResponse: unwrap<Employee>,
      providesTags: (_result, _error, id) => [{ type: "Employee", id }],
    }),

    createEmployee: builder.mutation<Employee, CreateEmployeePayload>({
      query: (body) => ({ url: "/employees", method: "POST", body }),
      transformResponse: unwrap<Employee>,
      // A new employee is also a new login and one more head on a designation.
      invalidatesTags: [
        { type: "Employee", id: "LIST" },
        { type: "User", id: "LIST" },
        { type: "Designation", id: "LIST" },
      ],
    }),

    updateEmployee: builder.mutation<
      Employee,
      { id: string; body: UpdateEmployeePayload }
    >({
      query: ({ id, body }) => ({ url: `/employees/${id}`, method: "PATCH", body }),
      transformResponse: unwrap<Employee>,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
        { type: "Designation", id: "LIST" },
      ],
    }),

    deleteEmployee: builder.mutation<null, string>({
      query: (id) => ({ url: `/employees/${id}`, method: "DELETE" }),
      transformResponse: (response: ApiResponse<null>) => response.data,
      invalidatesTags: [
        { type: "Employee", id: "LIST" },
        { type: "User", id: "LIST" },
        { type: "Designation", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeesApi;
