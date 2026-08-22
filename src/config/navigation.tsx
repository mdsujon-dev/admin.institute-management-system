import {
  GraduationCap,
  LayoutDashboard,
  ScrollText,
  Settings,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";

export interface NavItem {
  key: string;
  label: string;
  /** Top level entries carry an icon; children are identified by their label. */
  icon?: ReactNode;
  /** Leaf items navigate; a parent with `children` only expands. */
  path?: string;
  /** Hidden unless the account holds this permission. */
  permission?: string;
  children?: NavItem[];
}

export interface NavSection {
  key: string;
  title?: string;
  items: NavItem[];
}

/**
 * The whole menu, in one list. Each entry names the permission behind the screen
 * it points at, and the sidebar hides anything the current role cannot reach --
 * the same codes `ProtectedRoute` checks, so the menu can never offer a page
 * that would answer 403. A parent disappears once all of its children have.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    key: "overview",
    items: [
      { key: "dashboard", label: "Dashboard", path: "/", icon: <LayoutDashboard /> },
      {
        key: "students",
        label: "Students",
        path: "/students",
        permission: "student.read",
        icon: <GraduationCap />,
      },
    ],
  },
  {
    key: "staff",
    title: "Staff",
    items: [
      {
        key: "employee-management",
        label: "Employee management",
        icon: <UsersRound />,
        children: [
          {
            key: "employees",
            label: "Employee list",
            path: "/employees",
            permission: "employee.read",
          },
          {
            key: "designations",
            label: "Designations",
            path: "/designations",
            permission: "designation.read",
          },
          {
            key: "roles",
            label: "Roles",
            path: "/roles",
            permission: "role.read",
          },
        ],
      },
    ],
  },
  {
    key: "administration",
    title: "Administration",
    items: [
      {
        key: "logs",
        label: "Logs",
        icon: <ScrollText />,
        children: [
          {
            key: "activity-logs",
            label: "Activity logs",
            path: "/logs/activity",
            permission: "log.read",
          },
          {
            key: "error-logs",
            label: "Error logs",
            path: "/logs/errors",
            permission: "log.read",
          },
          {
            key: "sign-in-logs",
            label: "Sign in logs",
            path: "/logs/sign-ins",
            permission: "log.read",
          },
        ],
      },
    ],
  },
  {
    key: "account",
    title: "Account",
    items: [
      {
        key: "settings",
        label: "Settings",
        icon: <Settings />,
        children: [
          {
            key: "profile",
            label: "My profile",
            path: "/profile",
          },
          {
            key: "change-password",
            label: "Change password",
            path: "/change-password",
          },
        ],
      },
    ],
  },
];
