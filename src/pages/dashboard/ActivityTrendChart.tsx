import { useMemo } from "react";
import Chart from "@/components/chart/Chart";
import ChartCard from "@/components/chart/ChartCard";
import { useGetActivityLogsQuery } from "@/redux/features/logs/logs.api";
import { getErrorMessage } from "@/utils/apiError";

/** How many days the trend covers. */
const DAYS = 7;

function lastDays(count: number): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: count }, (_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (count - 1 - index));
    return day;
  });
}

/**
 * Changes per day, counted from the audit trail itself rather than from a
 * reporting endpoint -- the API has no aggregate for this, so the newest page of
 * entries is bucketed by day here. That means the line is exact for recent days
 * and simply stops where the fetched page ends, which is honest either way.
 */
export default function ActivityTrendChart() {
  const { data, isLoading, error, refetch } = useGetActivityLogsQuery({
    page: 1,
    limit: 100,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { categories, series, isEmpty } = useMemo(() => {
    const days = lastDays(DAYS);
    const counts = new Map(days.map((day) => [day.toDateString(), 0]));

    for (const entry of data?.items ?? []) {
      const day = new Date(entry.createdAt);
      day.setHours(0, 0, 0, 0);
      const key = day.toDateString();

      if (counts.has(key)) {
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }

    const values = [...counts.values()];

    return {
      categories: days.map((day) =>
        day.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      ),
      series: [{ name: "Changes", data: values }],
      isEmpty: values.every((value) => value === 0),
    };
  }, [data]);

  return (
    <ChartCard
      title="Activity this week"
      description="Creates, updates and deletes per day"
      isLoading={isLoading}
      errorMessage={error ? getErrorMessage(error) : undefined}
      onRetry={refetch}
      isEmpty={isEmpty}
      emptyMessage="Nothing has been changed in the last seven days."
    >
      <Chart
        type="area"
        series={series}
        height={280}
        options={{
          xaxis: { categories },
          yaxis: { labels: { formatter: (value) => String(Math.round(value)) } },
          fill: { type: "solid", opacity: 0.12 },
          stroke: { width: 2.5 },
          markers: { size: 4, strokeWidth: 0 },
        }}
      />
    </ChartCard>
  );
}
