import type { ReactNode } from "react";
import Button from "@/components/ui/Button/Button";
import SearchInput from "@/components/ui/Input/SearchInput";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  /** Selects and pickers that narrow the list. */
  children?: ReactNode;
  isFiltered?: boolean;
  onReset?: () => void;
}

/**
 * Search on the left, filters on the right, one reset. Stacks to a single
 * column on a phone so nothing is ever squeezed into an unusable width.
 */
export default function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder,
  children,
  isFiltered,
  onReset,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-gray-200 p-4 lg:flex-row lg:items-center lg:justify-between dark:border-gray-800">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
        className="lg:max-w-xs"
      />

      {(children || (isFiltered && onReset)) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          {children}
          {isFiltered && onReset && (
            <Button variant="link" size="md" onClick={onReset}>
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
