import { useEffect, useState } from "react";

/** Waits for typing to settle before the value is used as a query argument. */
export function useDebouncedValue<T>(value: T, delayMs = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);

    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
