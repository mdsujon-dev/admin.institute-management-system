import { baseApi } from "@/redux/api/baseApi";
import { cleanParams, listTags, unwrap, unwrapList } from "@/redux/api/helpers";
import type { ApiResponse, ListParams, Paginated } from "@/types/api";
import type { Gender, Student, StudentStatus } from "@/types/models";

/** Admits a student and creates their login in one call. */
export interface CreateStudentPayload {
  email: string;
  password?: string;
  roleId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: Gender;
  dateOfBirth?: string;
  address?: string;
  admissionDate?: string;
  guardianName?: string;
  guardianPhone?: string;
  status?: StudentStatus;
}

export type UpdateStudentPayload = Partial<
  Omit<CreateStudentPayload, "email" | "password" | "roleId">
>;

export const studentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<Paginated<Student>, ListParams | void>({
      query: (params) => ({ url: "/students", params: cleanParams(params ?? {}) }),
      transformResponse: unwrapList<Student>,
      providesTags: (result) => listTags("Student", result),
    }),

    getStudent: builder.query<Student, string>({
      query: (id) => `/students/${id}`,
      transformResponse: unwrap<Student>,
      providesTags: (_result, _error, id) => [{ type: "Student", id }],
    }),

    createStudent: builder.mutation<Student, CreateStudentPayload>({
      query: (body) => ({ url: "/students", method: "POST", body }),
      transformResponse: unwrap<Student>,
      invalidatesTags: [
        { type: "Student", id: "LIST" },
        { type: "User", id: "LIST" },
      ],
    }),

    updateStudent: builder.mutation<Student, { id: string; body: UpdateStudentPayload }>({
      query: ({ id, body }) => ({ url: `/students/${id}`, method: "PATCH", body }),
      transformResponse: unwrap<Student>,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Student", id },
        { type: "Student", id: "LIST" },
      ],
    }),

    deleteStudent: builder.mutation<null, string>({
      query: (id) => ({ url: `/students/${id}`, method: "DELETE" }),
      transformResponse: (response: ApiResponse<null>) => response.data,
      invalidatesTags: [
        { type: "Student", id: "LIST" },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentsApi;
