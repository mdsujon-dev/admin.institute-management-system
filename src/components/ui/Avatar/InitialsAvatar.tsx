import { cn } from "@/utils/cn";
import { initials } from "@/utils/format";

interface InitialsAvatarProps {
  /** Full name or email. Only the initials are shown. */
  name: string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Two letters in a brand tinted circle. There are no uploaded avatars in the
 * system, so this is the one identity mark used wherever a person is listed.
 */
export default function InitialsAvatar({
  name,
  size = "md",
  className,
}: InitialsAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-brand-50 font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
        size === "sm" ? "size-8 text-caption" : "size-10 text-body-sm",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
