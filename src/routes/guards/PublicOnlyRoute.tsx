import { Navigate, Outlet, useLocation } from "react-router";
import { PageLoader } from "@/components/ui";
import { useAppSelector } from "@/redux/hooks";

interface LocationState {
  from?: { pathname: string };
}

/**
 * The sign in and password recovery screens. Somebody already signed in is sent
 * back where they came from instead of being shown a second sign in form.
 */
export default function PublicOnlyRoute() {
  const status = useAppSelector((state) => state.auth.status);
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (status === "idle" || status === "loading") {
    return <PageLoader label="Checking your session" />;
  }

  if (user) {
    const state = location.state as LocationState | null;

    return <Navigate to={state?.from?.pathname ?? "/"} replace />;
  }

  return <Outlet />;
}
