import type { SizeType } from "antd/es/config-provider/SizeContext";

/**
 * Every control in the app is `sm`, `md` or `lg`. Ant Design calls the middle
 * one `medium`; translating in one place keeps that detail out of the screens.
 */
export type ControlSize = "sm" | "md" | "lg";

const SIZE_MAP: Record<ControlSize, SizeType> = {
  sm: "small",
  md: "medium",
  lg: "large",
};

export function toAntSize(size: ControlSize = "md"): SizeType {
  return SIZE_MAP[size];
}
