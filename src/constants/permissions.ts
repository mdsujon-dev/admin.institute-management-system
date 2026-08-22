/**
 * Mirror of `backend/src/common/constants/permissions.ts`.
 *
 * The catalogue is duplicated here on purpose: the roles screen has to render
 * every permission a role *could* have, and `GET /permissions` itself needs the
 * `permission.read` permission — which ADMIN deliberately does not hold. Reading
 * the catalogue from constants keeps that screen working for every role that can
 * edit roles, and the backend still validates every code it is sent.
 */
export const PERMISSION_SUBJECTS = [
  "user",
  "role",
  "permission",
  "designation",
  "employee",
  "student",
  "log",
] as const;

export const PERMISSION_ACTIONS = ["create", "read", "update", "delete"] as const;

/**
 * Actions that only make sense for one subject, so they are listed rather than
 * generated. `log.readAll` widens `log.read` from "your own trail" to
 * "everybody's" -- without it, an operator sees only what they did themselves.
 */
export const EXTRA_PERMISSION_ACTIONS = ["readAll"] as const;

export type PermissionSubject = (typeof PERMISSION_SUBJECTS)[number];
export type PermissionAction =
  | (typeof PERMISSION_ACTIONS)[number]
  | (typeof EXTRA_PERMISSION_ACTIONS)[number];
export type PermissionCode = `${PermissionSubject}.${PermissionAction}`;

/** Audit trails are written by the system and only ever read. */
const READ_ONLY_SUBJECTS: PermissionSubject[] = ["permission", "log"];

export interface PermissionDefinition {
  code: PermissionCode;
  subject: PermissionSubject;
  action: PermissionAction;
}

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  ...PERMISSION_SUBJECTS.flatMap((subject) =>
    PERMISSION_ACTIONS.filter(
      (action) => action === "read" || !READ_ONLY_SUBJECTS.includes(subject),
    ).map((action) => ({
      code: `${subject}.${action}` as PermissionCode,
      subject,
      action: action as PermissionAction,
    })),
  ),
  { code: "log.readAll", subject: "log", action: "readAll" },
];

/** Holding this widens every log screen from "mine" to "everybody's". */
export const READ_ALL_LOGS = "log.readAll";

/** `{ user: [...], role: [...] }` — the shape the role editor renders. */
export const PERMISSIONS_BY_SUBJECT = PERMISSION_SUBJECTS.map((subject) => ({
  subject,
  permissions: ALL_PERMISSIONS.filter((p) => p.subject === subject),
})).filter((group) => group.permissions.length > 0);

/** Human labels, so the UI never shows a raw code to an operator. */
export const SUBJECT_LABELS: Record<PermissionSubject, string> = {
  user: "Users",
  role: "Roles",
  permission: "Permissions",
  designation: "Designations",
  employee: "Employees",
  student: "Students",
  log: "Audit logs",
};

export const ACTION_LABELS: Record<PermissionAction, string> = {
  create: "Create",
  read: "View",
  update: "Edit",
  delete: "Delete",
  readAll: "View all",
};

/**
 * The role that owns the system. It holds no permission rows in the database —
 * `PermissionsGuard` on the backend waves it through every check, and
 * `usePermissions()` does the same on the frontend, so the two never disagree.
 */
export const SUPER_ADMIN_ROLE = "SUPER_ADMIN";
