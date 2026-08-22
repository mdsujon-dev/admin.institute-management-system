import { useMemo } from "react";
import Chart from "@/components/chart/Chart";
import ChartCard from "@/components/chart/ChartCard";
import { useGetDesignationsQuery } from "@/redux/features/designations/designations.api";
import { getErrorMessage } from "@/utils/apiError";

/** The eight busiest designations; beyond that the axis stops being readable. */
const MAX_BARS = 8;

/**
 * Head count per designation, from the `employeeCount` the list endpoint already
 * returns -- so the whole chart costs one request and no invented totals.
 */
export default function StaffByDesignationChart() {
  const { data, isLoading, error, refetch } = useGetDesignationsQuery({
    page: 1,
    limit: 100,
    sortBy: "title",
    sortOrder: "asc",
  });

  const { categories, series, isEmpty } = useMemo(() => {
    const ranked = [...(data?.items ?? [])]
      .filter((designation) => (designation.employeeCount ?? 0) > 0)
      .sort((a, b) => (b.employeeCount ?? 0) - (a.employeeCount ?? 0))
      .slice(0, MAX_BARS);

    return {
      categories: ranked.map((designation) => designation.title),
      series: [{ name: "Employees", data: ranked.map((d) => d.employeeCount ?? 0) }],
      isEmpty: ranked.length === 0,
    };
  }, [data]);

  return (
    <ChartCard
      title="Staff by designation"
      description="Where the team sits"
      isLoading={isLoading}
      errorMessage={error ? getErrorMessage(error) : undefined}
      onRetry={refetch}
      isEmpty={isEmpty}
      emptyMessage="No employee has been given a designation yet."
    >
      <Chart
        type="bar"
        series={series}
        height={280}
        options={{
          xaxis: { categories },
          yaxis: { labels: { formatter: (value) => String(Math.round(value)) } },
          plotOptions: { bar: { columnWidth: "45%", borderRadius: 6 } },
        }}
      />
    </ChartCard>
  );
}
