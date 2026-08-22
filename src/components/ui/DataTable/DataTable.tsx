import { Table } from "antd";
import type { TablePaginationConfig } from "antd";
import type { ColumnsType, SorterResult } from "antd/es/table/interface";
import type { ReactNode } from "react";
import EmptyState from "@/components/ui/Feedback/EmptyState";
import ErrorState from "@/components/ui/Feedback/ErrorState";
import type { ControlSize } from "@/components/ui/types";
import type { Pagination, SortOrder } from "@/types/api";
import { cn } from "@/utils/cn";

export interface DataTableProps<T> {
  columns: ColumnsType<T>;
  rows: T[];
  rowKey: (row: T) => string;
  /** First load: the table draws its own skeleton rows. */
  isLoading?: boolean;
  /** Background refetch: keep the rows readable, just mark them busy. */
  isFetching?: boolean;
  errorMessage?: string;
  onRetry?: () => void;

  /** Server side paging. Omit to render the rows without a pager. */
  meta?: Pagination;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  /** Called with the backend field name, or undefined when sorting is cleared. */
  onSortChange?: (field: string | undefined, order: SortOrder | undefined) => void;

  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  size?: ControlSize;
  className?: string;
}

const ANT_SIZE = { sm: "small", md: "middle", lg: "large" } as const;

/**
 * The table every list screen renders.
 *
 * It owns the four states a remote list can be in -- loading, failed, empty,
 * populated -- so no screen spells them out again and they all look identical
 * when they happen. On a narrow screen the grid scrolls sideways rather than
 * crushing its columns; a column that is noise on mobile can opt out with
 * antd's own `responsive` flag.
 */
export default function DataTable<T extends object>({
  columns,
  rows,
  rowKey,
  isLoading = false,
  isFetching = false,
  errorMessage,
  onRetry,
  meta,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  emptyTitle = "Nothing here yet",
  emptyDescription,
  emptyAction,
  size = "md",
  className,
}: DataTableProps<T>) {
  if (errorMessage) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }

  const pagination: TablePaginationConfig | false = meta
    ? {
        current: meta.page,
        pageSize: meta.limit,
        total: meta.total,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50, 100],
        // Rows per page is a desktop nicety; on a phone the pager alone is enough.
        responsive: true,
        showTotal: (total, [from, to]) => `${from}-${to} of ${total}`,
        onChange: (page, pageSize) => {
          if (pageSize !== meta.limit) {
            onPageSizeChange?.(pageSize);
            return;
          }

          onPageChange?.(page);
        },
      }
    : false;

  return (
    <Table<T>
      columns={columns}
      dataSource={rows}
      rowKey={rowKey}
      loading={isLoading || isFetching}
      size={ANT_SIZE[size]}
      pagination={pagination}
      // `max-content` keeps every column at its natural width and lets the
      // wrapper scroll, which is what makes the table usable on a phone.
      scroll={{ x: "max-content" }}
      className={cn("w-full", className)}
      locale={{
        emptyText: (
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
          />
        ),
      }}
      onChange={(_pagination, _filters, sorter) => {
        if (!onSortChange) return;

        const active = (Array.isArray(sorter) ? sorter[0] : sorter) as SorterResult<T>;
        const field = (active.columnKey ?? active.field) as string | undefined;

        if (!active.order) {
          onSortChange(undefined, undefined);
          return;
        }

        onSortChange(field, active.order === "ascend" ? "asc" : "desc");
      }}
    />
  );
}
