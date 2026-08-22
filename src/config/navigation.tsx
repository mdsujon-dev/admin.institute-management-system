import {
  AuditOutlined,
  ContactsOutlined,
  DashboardOutlined,
  IdcardOutlined,
  SafetyCertificateOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";

export interface NavItem {
  key: string;
  label: string;
  icon: ReactNode;
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
      {
        key: "dashboard",
        label: "Dashboard",
        path: "/",
        icon: <DashboardOutlined />,
      },
      {
        key: "students",
        label: "Students",
        path: "/students",
        permission: "student.read",
        icon: <SolutionOutlined />,
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
        icon: <UsergroupAddOutlined />,
        children: [
          {
            key: "employees",
            label: "Employee list",
            path: "/employees",
            permission: "employee.read",
            icon: <TeamOutlined />,
          },
          {
            key: "designations",
            label: "Designations",
            path: "/designations",
            permission: "designation.read",
            icon: <ContactsOutlined />,
          },
          {
            key: "roles",
            label: "Roles",
            path: "/roles",
            permission: "role.read",
            icon: <SafetyCertificateOutlined />,
          },
        ],
      },
    ],
  },
  {
    key: "access",
    title: "Access control",
    items: [
      {
        key: "users",
        label: "Users",
        path: "/users",
        permission: "user.read",
        icon: <IdcardOutlined />,
      },
      {
        key: "logs",
        label: "Audit logs",
        path: "/logs",
        permission: "log.read",
        icon: <AuditOutlined />,
      },
    ],
  },
  {
    key: "account",
    title: "Account",
    items: [
      {
        key: "profile",
        label: "My profile",
        path: "/profile",
        icon: <UserOutlined />,
      },
    ],
  },
];
