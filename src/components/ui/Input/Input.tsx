import { Input as AntInput } from "antd";
import type { InputProps as AntInputProps } from "antd";
import type { ControlSize } from "@/components/ui/types";
import { toAntSize } from "@/components/ui/types";

export interface InputProps extends Omit<AntInputProps, "size"> {
  size?: ControlSize;
}

/** A text input. Sizes match every other control: `sm`, `md`, `lg`. */
export default function Input({ size = "md", ...rest }: InputProps) {
  return <AntInput {...rest} size={toAntSize(size)} />;
}
