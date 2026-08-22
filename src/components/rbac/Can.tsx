import type { ReactNode } from "react";
import { usePermissions } from "@/hooks/usePermissions";

interface CanProps {
  /** A single permission code, e.g. `student.create`. */
  permission?: string;
  /** Passes when the account holds any of these. */
  anyOf?: string[];
  /** Passes when the account holds all of these. */
  allOf?: string[];
  children: ReactNode;
  /** Rendered instead of the children when the check fails. Usually nothing. */
  fallback?: ReactNode;
}

/**
 * Renders its children only when the signed in account holds the permission.
 *
 * ```tsx
 * <Can permission="student.create">
 *   <Button onClick={open}>Admit student</Button>
 * </Can>
 * ```
 *
 * SUPER_ADMIN passes every check, so nothing needs a special case for it.
 */
export default function Can({
  permission,
  anyOf,
  allOf,
  children,
  fallback = null,
}: CanProps) {
  const { can, canAny, canAll } = usePermissions();

  const allowed =
    (permission === undefined || can(permission)) &&
    (anyOf === undefined || canAny(anyOf)) &&
    (allOf === undefined || canAll(allOf));

  return <>{allowed ? children : fallback}</>;
}
