import { Switch, Tooltip } from "antd";
import type { ControlSize } from "@/components/ui/types";

interface StatusSwitchProps {
  /** True when the record is active. */
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Spins this one switch while its own save is in flight. */
  loading?: boolean;
  disabled?: boolean;
  /** Explains why it cannot be toggled, when it cannot. */
  disabledReason?: string;
  size?: ControlSize;
  checkedLabel?: string;
  uncheckedLabel?: string;
}

/**
 * A status you can change from the row you are looking at, rather than by
 * opening a dialog to flip one field.
 *
 * The switch carries its own loading state, so toggling one row spins that row
 * and leaves the rest of the table alone -- and it stays disabled while saving,
 * which is what stops a double click sending two opposite updates.
 */
export default function StatusSwitch({
  checked,
  onChange,
  loading = false,
  disabled = false,
  disabledReason,
  size = "md",
  checkedLabel = "Active",
  uncheckedLabel = "Inactive",
}: StatusSwitchProps) {
  const control = (
    <Switch
      checked={checked}
      loading={loading}
      disabled={disabled || loading}
      size={size === "sm" ? "small" : "default"}
      checkedChildren={checkedLabel}
      unCheckedChildren={uncheckedLabel}
      onChange={onChange}
    />
  );

  return disabledReason ? <Tooltip title={disabledReason}>{control}</Tooltip> : control;
}
