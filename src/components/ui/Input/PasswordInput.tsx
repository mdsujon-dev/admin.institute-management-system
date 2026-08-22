import { Input as AntInput } from "antd";
import type { PasswordProps } from "antd/es/input";
import type { ControlSize } from "@/components/ui/types";
import { toAntSize } from "@/components/ui/types";

export interface PasswordInputProps extends Omit<PasswordProps, "size"> {
  size?: ControlSize;
}

/** A password field with the show/hide toggle already wired up. */
export default function PasswordInput({ size = "md", ...rest }: PasswordInputProps) {
  return <AntInput.Password {...rest} size={toAntSize(size)} />;
}
