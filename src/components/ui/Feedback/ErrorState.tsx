import { CircleAlert } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import Heading from "@/components/ui/Typography/Heading";
import Text from "@/components/ui/Typography/Text";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

/** Shown when a request fails: what went wrong, and a way to try again. */
export default function ErrorState({
  title = "Could not load this",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-error-50 text-h4 text-error-500 dark:bg-error-500/10">
        <CircleAlert />
      </span>
      <div>
        <Heading level={5}>{title}</Heading>
        <Text size="body-sm" tone="muted" className="mt-1 max-w-md">
          {message}
        </Text>
      </div>
      {onRetry && (
        <Button size="sm" variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
