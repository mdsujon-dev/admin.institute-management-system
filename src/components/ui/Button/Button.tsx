import { Button as AntButton } from "antd";
import type { ButtonProps as AntButtonProps } from "antd";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import type { ControlSize } from "@/components/ui/types";
import { toAntSize } from "@/components/ui/types";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "danger-outline"
  | "ghost"
  | "link";

export interface ButtonProps
  extends Omit<AntButtonProps, "size" | "type" | "variant" | "color"> {
  /** `sm` | `md` | `lg` -- the same three sizes every control in the app uses. */
  size?: ControlSize;
  variant?: ButtonVariant;
  children?: ReactNode;
}

/**
 * The one button in the app. Six intents, three sizes, nothing else -- so two
 * screens can never disagree about what a destructive action looks like.
 *
 * `primary` carries the brand colour and is the action a screen wants you to
 * take. `secondary` is its outlined companion. `danger` is a confirmed delete;
 * `danger-outline` is the one that *offers* a delete -- a red border over a pale
 * red fill, so it reads as dangerous without shouting from inside a table row.
 */
const VARIANT: Record<
  ButtonVariant,
  { props: Partial<AntButtonProps>; className?: string }
> = {
  primary: { props: { color: "primary", variant: "solid" } },
  secondary: { props: { color: "default", variant: "outlined" } },
  danger: { props: { color: "danger", variant: "solid" } },
  "danger-outline": {
    props: { color: "danger", variant: "outlined" },
    // antd's outlined variant is transparent; the pale fill is ours.
    className: "bg-error-50 dark:bg-error-500/10",
  },
  ghost: { props: { color: "default", variant: "text" } },
  link: { props: { color: "primary", variant: "link" } },
};

export default function Button({
  size = "md",
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonProps) {
  const { props, className: variantClassName } = VARIANT[variant];

  return (
    <AntButton
      {...props}
      {...rest}
      size={toAntSize(size)}
      className={cn("font-medium", variantClassName, className)}
    >
      {children}
    </AntButton>
  );
}
