/** Display helpers. Every date and enum in the UI goes through one of these. */

const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? "—" : DATE_FORMATTER.format(date);
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? "—" : DATE_TIME_FORMATTER.format(date);
}

/** `2026-08-21` — the shape an `<input type="date">` expects. */
export function toDateInputValue(value: string | Date | null | undefined): string {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

export function formatCurrency(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";

  const amount = typeof value === "string" ? Number(value) : value;

  if (Number.isNaN(amount)) return "—";

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number | null | undefined): string {
  return value === null || value === undefined
    ? "—"
    : new Intl.NumberFormat("en-US").format(value);
}

/** `ON_LEAVE` -> `On leave`, so an enum never reaches the screen raw. */
export function humanise(value: string | null | undefined): string {
  if (!value) return "—";

  const words = value.toLowerCase().replace(/[_.]/g, " ").trim();

  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function fullName(person: { firstName: string; lastName: string }): string {
  return `${person.firstName} ${person.lastName}`.trim();
}

/** Two letter avatar fallback. */
export function initials(value: string): string {
  const parts = value.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/** `2 minutes ago`, for log tables where the exact second rarely matters. */
export function timeAgo(value: string | Date | null | undefined): string {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  const seconds = Math.round((Date.now() - date.getTime()) / 1000);

  // Each pair is "divide by this, and the result is in that unit" -- 60 seconds
  // make a minute, 60 minutes make an hour, and so on.
  const steps: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "minute"],
    [60, "hour"],
    [24, "day"],
    [7, "week"],
    [4.35, "month"],
    [12, "year"],
  ];

  let amount = seconds;
  let unit: Intl.RelativeTimeFormatUnit = "second";

  for (const [size, nextUnit] of steps) {
    if (Math.abs(amount) < size) break;
    amount = Math.round(amount / size);
    unit = nextUnit;
  }

  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(-amount, unit);
}

/**
 * A date picker value on the way to the API: `YYYY-MM-DD`, or nothing at all.
 * An empty date must be omitted rather than sent blank -- the backend validates
 * it as a date, and "" is not one.
 */
export function toApiDate(value: { toISOString: () => string } | null | undefined) {
  return value ? value.toISOString().slice(0, 10) : undefined;
}
