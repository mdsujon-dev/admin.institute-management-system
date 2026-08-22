import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import { useTheme } from "@/providers/ThemeProvider";

/** The brand ramp, used in order wherever a chart needs more than one colour. */
export const CHART_COLORS = [
  "#0e7490", // brand
  "#2f9db8",
  "#175cd3", // info
  "#027a48", // success
  "#b54708", // warning
  "#b42318", // error
] as const;

/**
 * The options every chart starts from: the app's font, the brand ramp, flat
 * fills, no shadows, and grid lines that hold up in both themes.
 *
 * Charts pass only what makes them different -- a type, a series, its labels --
 * so a change here restyles every chart in the app at once.
 */
export function useChartTheme(): { baseOptions: ApexOptions; isDark: boolean } {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return useMemo(() => {
    const border = isDark ? "#1d2939" : "#e4e7ec";
    const label = isDark ? "#98a2b3" : "#667085";

    const baseOptions: ApexOptions = {
      chart: {
        fontFamily: "Outfit, sans-serif",
        foreColor: label,
        toolbar: { show: false },
        zoom: { enabled: false },
        // Elevation is off everywhere else, so it is off here too.
        dropShadow: { enabled: false },
        animations: { enabled: true, speed: 400 },
        background: "transparent",
      },
      colors: [...CHART_COLORS],
      // Flat fills only: the app uses no gradients.
      fill: { type: "solid" },
      dataLabels: { enabled: false },
      grid: {
        borderColor: border,
        strokeDashArray: 4,
        padding: { left: 8, right: 8, top: 0, bottom: 0 },
      },
      stroke: { curve: "smooth", width: 2, lineCap: "round" },
      xaxis: {
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { fontSize: "12px" } },
      },
      yaxis: { labels: { style: { fontSize: "12px" } } },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        fontSize: "13px",
        markers: { size: 6 },
        itemMargin: { horizontal: 8, vertical: 4 },
      },
      tooltip: { theme: isDark ? "dark" : "light" },
      states: { active: { filter: { type: "none" } } },
    };

    return { baseOptions, isDark };
  }, [isDark]);
}
