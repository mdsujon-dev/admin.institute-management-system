import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router";
import AppLayout from "@/components/layout/AppLayout";
import { PageLoader } from "@/components/ui";
import ProtectedRoute from "./guards/ProtectedRoute";
import PublicOnlyRoute from "./guards/PublicOnlyRoute";
import LoginPage from "@/pages/auth/LoginPage";

/**
 * Every screen except sign in is loaded on demand, so the first paint carries
 * the shell and the login form rather than the whole console. `Suspense` shows
 * the same loader the session gate uses, so a route change never flashes bare.
 */
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const ChangePasswordPage = lazy(() => import("@/pages/auth/ChangePasswordPage"));
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const StudentsPage = lazy(() => import("@/pages/students/StudentsPage"));
const EmployeesPage = lazy(() => import("@/pages/employees/EmployeesPage"));
const DesignationsPage = lazy(() => import("@/pages/designations/DesignationsPage"));
const UsersPage = lazy(() => import("@/pages/users/UsersPage"));
const UserPermissionsPage = lazy(() => import("@/pages/users/UserPermissionsPage"));
const RolesPage = lazy(() => import("@/pages/roles/RolesPage"));
const RolePermissionsPage = lazy(() => import("@/pages/roles/RolePermissionsPage"));
const ActivityLogsPage = lazy(() => import("@/pages/logs/ActivityLogsPage"));
const ErrorLogsPage = lazy(() => import("@/pages/logs/ErrorLogsPage"));
const SignInLogsPage = lazy(() => import("@/pages/logs/SignInLogsPage"));
const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"));
const ForbiddenPage = lazy(() => import("@/pages/common/ForbiddenPage"));
const NotFoundPage = lazy(() => import("@/pages/common/NotFoundPage"));

/**
 * Three kinds of route:
 *  - public only (sign in, recovery), which redirect away once signed in;
 *  - signed in, no permission needed (dashboard, profile, password change);
 *  - permission gated, naming the same codes the API guards read.
 *
 * A new screen is one more block: copy one, change the permission and the page.
 */
export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/change-password" element={<ChangePasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/forbidden" element={<ForbiddenPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute permission="student.read" />}>
          <Route element={<AppLayout />}>
            <Route path="/students" element={<StudentsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute permission="employee.read" />}>
          <Route element={<AppLayout />}>
            <Route path="/employees" element={<EmployeesPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute permission="designation.read" />}>
          <Route element={<AppLayout />}>
            <Route path="/designations" element={<DesignationsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute permission="user.read" />}>
          <Route element={<AppLayout />}>
            <Route path="/users" element={<UsersPage />} />
            <Route
              path="/users/:userId/permissions"
              element={<UserPermissionsPage />}
            />
          </Route>
        </Route>

        <Route element={<ProtectedRoute permission="role.read" />}>
          <Route element={<AppLayout />}>
            <Route path="/roles" element={<RolesPage />} />
            <Route
              path="/roles/:roleId/permissions"
              element={<RolePermissionsPage />}
            />
          </Route>
        </Route>

        <Route element={<ProtectedRoute permission="log.read" />}>
          <Route element={<AppLayout />}>
            <Route path="/logs" element={<Navigate to="/logs/activity" replace />} />
            <Route path="/logs/activity" element={<ActivityLogsPage />} />
            <Route path="/logs/errors" element={<ErrorLogsPage />} />
            <Route path="/logs/sign-ins" element={<SignInLogsPage />} />
          </Route>
        </Route>

        {/* The old sign in path, kept working for anything still linking to it. */}
        <Route path="/signin" element={<Navigate to="/login" replace />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
