import Chart from "@/components/chart/Chart";
import ChartCard from "@/components/chart/ChartCard";
import { useGetLogSummaryQuery } from "@/redux/features/logs/logs.api";
import { getErrorMessage } from "@/utils/apiError";

/**
 * Successful against failed sign ins over the last day, straight from the log
 * summary. A donut because there are exactly two parts of one whole, and the
 * ratio is the point -- a run of failures against one account should stand out.
 */
export default function SignInSplitChart() {
  const { data, isLoading, error, refetch } = useGetLogSummaryQuery();

  const successful = data?.successfulLogins ?? 0;
  const failed = data?.failedLogins ?? 0;

  return (
    <ChartCard
      title="Sign ins"
      description="Last 24 hours"
      isLoading={isLoading}
      errorMessage={error ? getErrorMessage(error) : undefined}
      onRetry={refetch}
      isEmpty={successful + failed === 0}
      emptyMessage="Nobody has tried to sign in today."
    >
      <Chart
        type="donut"
        series={[successful, failed]}
        height={280}
        options={{
          labels: ["Successful", "Failed"],
          colors: ["#0e7490", "#b42318"],
          stroke: { width: 0 },
          plotOptions: {
            pie: {
              donut: {
                size: "68%",
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: "Attempts",
                    fontSize: "13px",
                    formatter: () => String(successful + failed),
                  },
                },
              },
            },
          },
        }}
      />
    </ChartCard>
  );
}
