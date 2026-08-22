import { useMemo } from "react";
import { SUPER_ADMIN_ROLE } from "@/constants/permissions";
import { useAppSelector } from "@/redux/hooks";
import type { AuthUser } from "@/types/models";

export interface PermissionApi {
  /** The signed in account, or null while the session is still being restored. */
  user: AuthUser | null;
  /** Role name, e.g. `ADMIN`. Null when signed out. */
  role: string | null;
  /** SUPER_ADMIN passes every check without holding a single permission row. */
  isSuperAdmin: boolean;
  can: (permission?: string | null) => boolean;
  canAny: (permissions: string[]) => boolean;
  canAll: (permissions: string[]) => boolean;
}

/**
 * The one place the frontend decides what the signed in account may do.
 *
 * It mirrors `PermissionsGuard` on the backend exactly: SUPER_ADMIN is waved
 * through unconditionally, everybody else is checked against the flat list of
 * codes `/auth/me` returned. Hiding a control is a courtesy -- the API is what
 * enforces it.
 */
export function usePermissions(): PermissionApi {
  const user = useAppSelector((state) => state.auth.user);

  return useMemo(() => {
    const role = user?.role.name ?? null;
    const isSuperAdmin = role === SUPER_ADMIN_ROLE;
    const granted = new Set(user?.permissions ?? []);

    const can = (permission?: string | null): boolean => {
      // No permission asked for means "any signed in user may see this".
      if (!permission) return Boolean(user);
      if (!user) return false;

      return isSuperAdmin || granted.has(permission);
    };

    return {
      user,
      role,
      isSuperAdmin,
      can,
      canAny: (permissions) =>
        permissions.length === 0 ? Boolean(user) : permissions.some((code) => can(code)),
      canAll: (permissions) =>
        permissions.length === 0 ? Boolean(user) : permissions.every((code) => can(code)),
    };
  }, [user]);
}
