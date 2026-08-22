import { SearchOutlined } from "@ant-design/icons";
import { Input as AntInput } from "antd";
import type { ControlSize } from "@/components/ui/types";
import { toAntSize } from "@/components/ui/types";
import { cn } from "@/utils/cn";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: ControlSize;
  className?: string;
}

/**
 * The search box on every list screen. Debouncing lives in `useListQuery`, so
 * this component stays a controlled input and nothing more.
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  size = "md",
  className,
}: SearchInputProps) {
  return (
    <AntInput
      allowClear
      value={value}
      size={toAntSize(size)}
      placeholder={placeholder}
      prefix={<SearchOutlined className="text-gray-400" />}
      onChange={(event) => onChange(event.target.value)}
      className={cn("w-full", className)}
    />
  );
}
