import { baseApi } from "@/redux/api/baseApi";
import { unwrap } from "@/redux/api/helpers";
import type { ApiResponse } from "@/types/api";
import type { AuthUser, LoginResult } from "@/types/models";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  resetToken: string;
  newPassword: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResult, LoginPayload>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: unwrap<LoginResult>,
      // Deliberately no `invalidatesTags`: the sign in screen stores the token
      // first and then loads the profile itself, so the profile request can
      // never race the token it needs.
    }),

    /** Who am I, and what may I do. This drives the whole permission layer. */
    getMe: builder.query<AuthUser, void>({
      query: () => "/auth/me",
      transformResponse: unwrap<AuthUser>,
      providesTags: ["Auth"],
    }),

    logout: builder.mutation<null, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      transformResponse: (response: ApiResponse<null>) => response.data,
    }),

    changePassword: builder.mutation<null, ChangePasswordPayload>({
      query: (body) => ({ url: "/auth/change-password", method: "POST", body }),
      transformResponse: (response: ApiResponse<null>) => response.data,
    }),

    /** Step 1 of 3 -- email a six digit code. */
    forgotPassword: builder.mutation<null, { email: string }>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
      transformResponse: (response: ApiResponse<null>) => response.data,
    }),

    /** Step 2 of 3 -- trade the code for a short lived reset token. */
    verifyOtp: builder.mutation<{ resetToken: string }, VerifyOtpPayload>({
      query: (body) => ({ url: "/auth/verify-otp", method: "POST", body }),
      transformResponse: unwrap<{ resetToken: string }>,
    }),

    /** Step 3 of 3 -- set the new password. */
    resetPassword: builder.mutation<null, ResetPasswordPayload>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
      transformResponse: (response: ApiResponse<null>) => response.data,
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useLogoutMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} = authApi;
