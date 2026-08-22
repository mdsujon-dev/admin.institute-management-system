/**
 * Calls `fn` only once the caller has stopped calling it for `waitMs`.
 * Used for search boxes, so a query fires per pause rather than per keystroke.
 */
export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  waitMs = 400,
): ((...args: TArgs) => void) & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: TArgs) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), waitMs);
  };

  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = undefined;
  };

  return debounced;
}
