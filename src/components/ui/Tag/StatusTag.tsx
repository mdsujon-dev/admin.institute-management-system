import { Tag } from "antd";
import { humanise } from "@/utils/format";

type TagColor = "success" | "error" | "warning" | "processing" | "default" | "cyan";

/**
 * One mapping from every status enum in the system to a colour, so `ACTIVE`
 * looks the same on the users screen as it does on the students screen.
 */
const STATUS_COLOR: Record<string, TagColor> = {
  // User
  ACTIVE: "success",
  INACTIVE: "default",
  BLOCKED: "error",
  // Employee
  ON_LEAVE: "warning",
  RESIGNED: "default",
  TERMINATED: "error",
  // Student
  GRADUATED: "processing",
  DROPPED: "default",
  SUSPENDED: "error",
  // Log levels
  INFO: "processing",
  WARN: "warning",
  ERROR: "error",
};

export default function StatusTag({ status }: { status: string | null | undefined }) {
  if (!status) {
    return <span className="text-gray-400">&mdash;</span>;
  }

  return (
    <Tag bordered={false} color={STATUS_COLOR[status] ?? "default"}>
      {humanise(status)}
    </Tag>
  );
}
