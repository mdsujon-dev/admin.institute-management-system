import { Select as AntSelect } from "antd";
import type { SelectProps as AntSelectProps } from "antd";
import type { ControlSize } from "@/components/ui/types";
import { toAntSize } from "@/components/ui/types";
import { cn } from "@/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<AntSelectProps, "size"> {
  size?: ControlSize;
}

/**
 * A select. Searchable by default -- a role or designation list gets long, and
 * typing three letters beats scrolling.
 */
export default function Select({ size = "md", className, ...rest }: SelectProps) {
  return (
    <AntSelect
      showSearch
      optionFilterProp="label"
      {...rest}
      size={toAntSize(size)}
      className={cn("w-full", className)}
    />
  );
}
