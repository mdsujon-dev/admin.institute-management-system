import type { SelectOption } from "@/components/ui";

/** The enum choices the API accepts, in the order an operator expects them. */
export const USER_STATUS_OPTIONS: SelectOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "BLOCKED", label: "Blocked" },
];

export const EMPLOYEE_STATUS_OPTIONS: SelectOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "ON_LEAVE", label: "On leave" },
  { value: "RESIGNED", label: "Resigned" },
  { value: "TERMINATED", label: "Terminated" },
];

export const STUDENT_STATUS_OPTIONS: SelectOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "GRADUATED", label: "Graduated" },
  { value: "DROPPED", label: "Dropped" },
  { value: "SUSPENDED", label: "Suspended" },
];

export const GENDER_OPTIONS: SelectOption[] = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

export const LOG_LEVEL_OPTIONS: SelectOption[] = [
  { value: "ERROR", label: "Error" },
  { value: "WARN", label: "Warning" },
  { value: "INFO", label: "Info" },
];

export const HTTP_METHOD_OPTIONS: SelectOption[] = [
  { value: "POST", label: "POST" },
  { value: "PATCH", label: "PATCH" },
  { value: "PUT", label: "PUT" },
  { value: "DELETE", label: "DELETE" },
];

export const LOGIN_RESULT_OPTIONS: SelectOption[] = [
  { value: "true", label: "Successful" },
  { value: "false", label: "Failed" },
];
