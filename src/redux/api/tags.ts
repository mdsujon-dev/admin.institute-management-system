/** Cache tags. Every endpoint provides or invalidates from this list. */
export const API_TAGS = [
  "Auth",
  "User",
  "Role",
  "Permission",
  "Designation",
  "Employee",
  "Student",
  "ActivityLog",
  "ErrorLog",
  "LoginLog",
  "LogSummary",
] as const;

export type ApiTag = (typeof API_TAGS)[number];
