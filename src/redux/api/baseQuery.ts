import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { env } from "@/config/env";
import type { ApiResponse } from "@/types/api";
import { tokenReceived, loggedOut } from "@/redux/features/auth/authSlice";
import type { RootState } from "@/redux/store";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.apiUrl,
  // The refresh token is an httpOnly cookie; without this the browser neither
  // sends it nor stores it.
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const { token } = (getState() as RootState).auth;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

/** These endpoints *are* the auth handshake, so a 401 from them is final. */
const HANDSHAKE_PATHS = [
  "/auth/login",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/verify-otp",
  "/auth/reset-password",
];

function urlOf(args: string | FetchArgs): string {
  return typeof args === "string" ? args : args.url;
}

/**
 * One refresh at a time. Without it, every query on a screen would start its own
 * refresh the moment the access token expired, and all but one would race the
 * cookie rotation and lose.
 */
let refreshInFlight: Promise<string | null> | null = null;

/**
 * The access token lasts fifteen minutes. Rather than dropping somebody onto the
 * sign in screen mid-task, a 401 is retried once behind a silent refresh: the
 * browser sends the refresh cookie, the API issues a new pair, and the original
 * request goes out again. Only if that fails does the session end.
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const isHandshake = HANDSHAKE_PATHS.some((path) => urlOf(args).startsWith(path));

  if (result.error?.status !== 401 || isHandshake) {
    return result;
  }

  const refresh = (refreshInFlight ??= (async () => {
    const refreshed = await rawBaseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions,
    );

    const payload = refreshed.data as ApiResponse<{ accessToken: string }> | undefined;

    return payload?.data?.accessToken ?? null;
  })());

  let newToken: string | null;

  try {
    newToken = await refresh;
  } finally {
    // Whoever finishes first clears the slot; the next 401 starts a new refresh.
    refreshInFlight = null;
  }

  if (!newToken) {
    api.dispatch(loggedOut());
    return result;
  }

  api.dispatch(tokenReceived(newToken));
  result = await rawBaseQuery(args, api, extraOptions);

  return result;
};
