/**
 * The backend runs `forbidNonWhitelisted: true`, so an empty string where it
 * expects a UUID, an enum or a date is a 400, not a "leave it alone". Forms hold
 * every field as a string; this drops the empty ones on the way out.
 */
export function compact<T extends Record<string, unknown>>(payload: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(payload).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  ) as Partial<T>;
}

/** "45000" becomes 45000; an empty string becomes undefined. */
export function toNumber(value: string): number | undefined {
  if (value.trim() === "") return undefined;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

/** Empty string becomes undefined, so an optional text field is simply omitted. */
export function orUndefined(value: string): string | undefined {
  return value.trim() === "" ? undefined : value.trim();
}
