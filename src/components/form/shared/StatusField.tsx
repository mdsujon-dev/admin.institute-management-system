import { Form } from "antd";
import { StatusSwitch } from "@/components/ui";

interface StatusFieldProps {
  /** The boolean field this writes to. */
  name?: string;
  label?: string;
  /** The line under the switch that says what switching it off actually does. */
  extra?: string;
  checkedLabel?: string;
  uncheckedLabel?: string;
  className?: string;
}

/**
 * The status field, wherever a form has one.
 *
 * Every form that can switch something on or off uses this rather than its own
 * switch, so the control, its labels and its spacing are the same on a role, a
 * designation, an employee and a student -- and so is the shape of the value
 * that reaches the API.
 */
export default function StatusField({
  name = "isActive",
  label = "Status",
  extra,
  checkedLabel,
  uncheckedLabel,
  className,
}: StatusFieldProps) {
  return (
    <Form.Item
      name={name}
      label={label}
      valuePropName="checked"
      extra={extra}
      className={className}
    >
      <StatusSwitch checkedLabel={checkedLabel} uncheckedLabel={uncheckedLabel} />
    </Form.Item>
  );
}
