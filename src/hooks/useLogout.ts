import { useCallback } from "react";
import { useNavigate } from "react-router";
import { baseApi } from "@/redux/api/baseApi";
import { useLogoutMutation } from "@/redux/features/auth/auth.api";
import { loggedOut } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";

/**
 * Signing out, in one place: clear the refresh cookie, drop the token, empty the
 * cache so the next account never sees the last one's data, and land on the
 * sign in screen.
 *
 * A network failure still signs the operator out locally -- the access token is
 * gone either way, so leaving them on a half-signed-out screen would be worse.
 */
export function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutRequest, { isLoading }] = useLogoutMutation();

  const logout = useCallback(async () => {
    try {
      await logoutRequest().unwrap();
    } catch {
      /* ignored on purpose -- see above */
    }

    dispatch(loggedOut());
    dispatch(baseApi.util.resetApiState());
    navigate("/login", { replace: true });
  }, [dispatch, logoutRequest, navigate]);

  return { logout, isLoggingOut: isLoading };
}
