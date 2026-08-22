/** Mirrors of the Prisma models the API returns. Kept flat and explicit so a
 *  change on the backend shows up as a type error here, not as a blank cell. */

export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type EmployeeStatus = "ACTIVE" | "ON_LEAVE" | "RESIGNED" | "TERMINATED";
export type StudentStatus = "ACTIVE" | "GRADUATED" | "DROPPED" | "SUSPENDED";
export type LogLevel = "INFO" | "WARN" | "ERROR";

export interface RoleRef {
  id: string;
  name: string;
}

/** `GET /auth/me` — the signed in account and everything it may do. */
export interface AuthUser {
  id: string;
  email: string;
  status: UserStatus;
  needsPasswordChange: boolean;
  role: RoleRef;
  /** Flat permission codes, e.g. `student.create`. Fully expanded for SUPER_ADMIN. */
  permissions: string[];
}

export interface LoginResult {
  accessToken: string;
  needsPasswordChange: boolean;
  user: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

export interface User {
  id: string;
  email: string;
  status: UserStatus;
  needsPasswordChange: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  role: RoleRef;
  /** Only returned on creation, when the password was auto-generated. */
  temporaryPassword?: string;
}

export interface UserDetail extends User {
  /** Everything the account may do: the role's grants plus its own extras. */
  permissions: string[];
  /** What the role gives, on its own. */
  rolePermissions: string[];
  /** What was granted to this one account, on top of the role. */
  extraPermissions: string[];
  employee: { id: string; employeeId: string; firstName: string; lastName: string } | null;
  student: { id: string; studentId: string; firstName: string; lastName: string } | null;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  /** A switched off role can no longer be handed to an account. */
  isActive: boolean;
  isSystem: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
  userCount: number;
  /** Permission codes on the list endpoint. */
  permissions: string[];
}

export interface Permission {
  id: string;
  code: string;
  subject: string;
  action: string;
  description: string | null;
  createdAt: string;
}

/** `GET /roles/:id` returns full permission rows instead of codes. */
export interface RoleDetail extends Omit<Role, "permissions"> {
  permissions: Permission[];
}

export interface Designation {
  id: string;
  title: string;
  description: string | null;
  /** A switched off designation is no longer offered when adding staff. */
  isActive: boolean;
  isSystem: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
  /** Present on the list endpoint only. */
  employeeCount?: number;
}

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  gender: Gender | null;
  dateOfBirth: string | null;
  address: string | null;
  joiningDate: string;
  salary: string | number | null;
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  designationId: string | null;
  designation?: Pick<Designation, "id" | "title"> | null;
  user?: Pick<User, "id" | "email" | "status"> & { role?: RoleRef };
  temporaryPassword?: string;
}

export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  gender: Gender | null;
  dateOfBirth: string | null;
  address: string | null;
  admissionDate: string;
  guardianName: string | null;
  guardianPhone: string | null;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: Pick<User, "id" | "email" | "status"> & { role?: RoleRef };
  temporaryPassword?: string;
}

export interface ActivityLog {
  id: string;
  userId: string | null;
  userEmail: string | null;
  action: string;
  subject: string;
  subjectId: string | null;
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface ErrorLog {
  id: string;
  userId: string | null;
  level: LogLevel;
  statusCode: number;
  message: string;
  stack: string | null;
  method: string;
  path: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface LoginLog {
  id: string;
  userId: string | null;
  email: string;
  success: boolean;
  reason: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  createdAt: string;
}

export interface LogSummary {
  window: string;
  activity: number;
  errors: number;
  successfulLogins: number;
  failedLogins: number;
}
