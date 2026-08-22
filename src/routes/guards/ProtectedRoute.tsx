import { Navigate, Outlet, useLocation } from "react-router";
import { PageLoader } from "@/components/ui";
import { usePermissions } from "@/hooks/usePermissions";
import { useAppSelector } from "@/redux/hooks";

interface ProtectedRouteProps {
  /** Permission required to reach the route. Omit for "signed in is enough". */
  permission?: string;
  anyOf?: string[];
}

/**
 * Guards a branch of the router. Four outcomes:
 *  - the session is still being restored -> a loader, so nothing flashes;
 *  - not signed in -> the sign in screen, remembering where they were going;
 *  - signed in but still on a temporary password -> the password screen;
 *  - signed in and not allowed -> the 403 page, never a redirect loop.
 */
export default function ProtectedRoute({ permission, anyOf }: ProtectedRouteProps) {
  const status = useAppSelector((state) => state.auth.status);
  const { user, can, canAny } = usePermissions();
  const location = useLocation();

  if (status === "idle" || status === "loading") {
    return <PageLoader label="Restoring your session" />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.needsPasswordChange && location.pathname !== "/change-password") {
    return <Navigate to="/change-password" replace />;
  }

  const allowed =
    (permission === undefined || can(permission)) &&
    (anyOf === undefined || canAny(anyOf));

  return allowed ? <Outlet /> : <Navigate to="/forbidden" replace />;
}
