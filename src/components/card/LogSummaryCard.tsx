import { Skeleton } from "antd";
import { Card, Text } from "@/components/ui";
import { useGetLogSummaryQuery } from "@/redux/features/logs/logs.api";
import { formatNumber } from "@/utils/format";

interface SummaryRowProps {
  label: string;
  value: number | undefined;
  tone?: "default" | "danger";
  isLoading?: boolean;
}

function SummaryRow({ label, value, tone = "default", isLoading }: SummaryRowProps) {
  const isBad = tone === "danger" && (value ?? 0) > 0;

  return (
    <div className="flex items-center justify-between gap-4">
      <Text size="body-sm" tone="muted">
        {label}
      </Text>
      {isLoading ? (
        <Skeleton.Button active size="small" />
      ) : (
        <Text size="body-lg" weight="semibold" tone={isBad ? "danger" : "default"}>
          {formatNumber(value)}
        </Text>
      )}
    </div>
  );
}

/** The last twenty four hours, straight from the audit trail. */
export default function LogSummaryCard() {
  const { data, isLoading } = useGetLogSummaryQuery();

  return (
    <Card title="Last 24 hours" description="Straight from the audit trail">
      <div className="space-y-4">
        <SummaryRow label="Changes" value={data?.activity} isLoading={isLoading} />
        <SummaryRow
          label="Errors"
          value={data?.errors}
          tone="danger"
          isLoading={isLoading}
        />
        <SummaryRow
          label="Successful sign ins"
          value={data?.successfulLogins}
          isLoading={isLoading}
        />
        <SummaryRow
          label="Failed sign ins"
          value={data?.failedLogins}
          tone="danger"
          isLoading={isLoading}
        />
      </div>
    </Card>
  );
}
