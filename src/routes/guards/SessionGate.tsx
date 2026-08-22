import { useEffect, type ReactNode } from "react";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  loggedOut,
  sessionRestoring,
  sessionUnavailable,
  userLoaded,
} from "@/redux/features/auth/authSlice";
import { getErrorStatus } from "@/utils/apiError";

/**
 * Restores the session once, on the first render of the app.
 *
 * A stored access token is the marker that a session might still exist: with
 * one, `/auth/me` is called and, if the token has expired, the base query
 * silently refreshes it against the httpOnly cookie and retries -- which keeps a
 * page reload signed in for the whole seven day refresh window. Without one
 * there is nothing to restore, so the app settles on "signed out" rather than
 * firing a request that can only come back 401.
 */
export default function SessionGate({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const status = useAppSelector((state) => state.auth.status);

  const { data, error, isLoading, isError, isSuccess } = useGetMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (status !== "idle") return;

    dispatch(token ? sessionRestoring() : loggedOut());
  }, [dispatch, status, token]);

  useEffect(() => {
    if (isLoading) dispatch(sessionRestoring());
  }, [dispatch, isLoading]);

  useEffect(() => {
    if (isSuccess && data) dispatch(userLoaded(data));
  }, [dispatch, isSuccess, data]);

  useEffect(() => {
    // `!isSuccess` keeps a stale error from a previous session out of the way of
    // a sign in that has just succeeded.
    if (!isError || isSuccess) return;

    // Only the API saying "not you" ends a session. A 429 from the rate limiter,
    // a 500, or an unreachable server must not throw away a token that is very
    // probably still valid.
    const httpStatus = getErrorStatus(error);

    dispatch(
      httpStatus === 401 || httpStatus === 403 ? loggedOut() : sessionUnavailable(),
    );
  }, [dispatch, error, isError, isSuccess]);

  return <>{children}</>;
}
