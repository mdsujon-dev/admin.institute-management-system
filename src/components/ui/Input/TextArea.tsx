import { Input as AntInput } from "antd";
import type { TextAreaProps as AntTextAreaProps } from "antd/es/input";
import type { ControlSize } from "@/components/ui/types";
import { toAntSize } from "@/components/ui/types";

export interface TextAreaProps extends Omit<AntTextAreaProps, "size"> {
  size?: ControlSize;
}

export default function TextArea({ size = "md", rows = 3, ...rest }: TextAreaProps) {
  return <AntInput.TextArea {...rest} rows={rows} size={toAntSize(size)} />;
}
