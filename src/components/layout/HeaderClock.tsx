import { useEffect, useState } from "react";
import { Text } from "@/components/ui";

const DATE = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const TIME = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

/**
 * The date and time, as the operator's own machine sees it.
 *
 * It ticks once a minute rather than once a second: the clock shows minutes, so
 * a faster interval would re-render the header sixty times for nothing.
 */
export default function HeaderClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="hidden text-right md:block">
      <Text size="body-sm" weight="medium">
        {TIME.format(now)}
      </Text>
      <Text size="caption" tone="subtle">
        {DATE.format(now)}
      </Text>
    </div>
  );
}
