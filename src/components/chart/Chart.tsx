import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { useChartTheme } from "@/hooks/useChartTheme";

export type ChartType = "area" | "bar" | "donut" | "radialBar" | "line";

interface ChartProps {
  type: ChartType;
  series: ApexOptions["series"];
  /** Only what makes this chart different -- the rest comes from the theme. */
  options?: ApexOptions;
  height?: number;
}

/** Deep merge, so a chart can override one nested option without losing the rest. */
function merge<T extends Record<string, unknown>>(base: T, override?: Partial<T>): T {
  if (!override) return base;

  const result: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const current = result[key];

    result[key] =
      value && typeof value === "object" && !Array.isArray(value) &&
      current && typeof current === "object" && !Array.isArray(current)
        ? merge(current as Record<string, unknown>, value as Record<string, unknown>)
        : value;
  }

  return result as T;
}

/**
 * Every chart in the app goes through here, so they all share one font, one
 * palette and one set of grid rules. A screen supplies the data and the shape;
 * it never restyles a chart of its own.
 */
export default function Chart({ type, series, options, height = 260 }: ChartProps) {
  const { baseOptions } = useChartTheme();

  const merged = merge(baseOptions as Record<string, unknown>, {
    ...(options as Record<string, unknown>),
    chart: {
      ...(baseOptions.chart as Record<string, unknown>),
      ...((options?.chart ?? {}) as Record<string, unknown>),
      type,
    },
  }) as ApexOptions;

  return <ReactApexChart type={type} options={merged} series={series} height={height} />;
}
