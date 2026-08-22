import { useMemo } from "react";
import Chart from "@/components/chart/Chart";
import ChartCard from "@/components/chart/ChartCard";
import { useGetRolesQuery } from "@/redux/features/roles/roles.api";
import { getErrorMessage } from "@/utils/apiError";
import { humanise } from "@/utils/format";

/**
 * How many accounts sit behind each role, from the `userCount` the roles list
 * already carries. Horizontal, because role names are words rather than dates
 * and read better along the axis than under it.
 */
export default function AccountsByRoleChart() {
  const { data, isLoading, error, refetch } = useGetRolesQuery({
    page: 1,
    limit: 100,
    sortBy: "name",
    sortOrder: "asc",
  });

  const { categories, series, isEmpty } = useMemo(() => {
    const ranked = [...(data?.items ?? [])].sort((a, b) => b.userCount - a.userCount);

    return {
      categories: ranked.map((role) => humanise(role.name)),
      series: [{ name: "Accounts", data: ranked.map((role) => role.userCount) }],
      isEmpty: ranked.length === 0 || ranked.every((role) => role.userCount === 0),
    };
  }, [data]);

  return (
    <ChartCard
      title="Accounts by role"
      description="Who signs in as what"
      isLoading={isLoading}
      errorMessage={error ? getErrorMessage(error) : undefined}
      onRetry={refetch}
      isEmpty={isEmpty}
      emptyMessage="No account has been given a role yet."
    >
      <Chart
        type="bar"
        series={series}
        height={280}
        options={{
          xaxis: { categories },
          plotOptions: {
            bar: { horizontal: true, barHeight: "55%", borderRadius: 6 },
          },
          dataLabels: { enabled: true, style: { fontSize: "12px" } },
        }}
      />
    </ChartCard>
  );
}
