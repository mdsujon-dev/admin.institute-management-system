import { Button as AntButton } from "antd";
import type { ButtonProps as AntButtonProps } from "antd";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import type { ControlSize } from "@/components/ui/types";
import { toAntSize } from "@/components/ui/types";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "link";

export interface ButtonProps
  extends Omit<AntButtonProps, "size" | "type" | "variant" | "color"> {
  /** `sm` | `md` | `lg` -- the same three sizes every control in the app uses. */
  size?: ControlSize;
  variant?: ButtonVariant;
  children?: ReactNode;
}

/**
 * The one button. Five intents, three sizes, nothing else -- so two screens can
 * never disagree about what a destructive action looks like.
 *
 * `primary` carries the brand colour and is the default: it is the action a
 * screen wants you to take. `secondary` is its outlined companion, `ghost` is
 * for toolbars and table rows, `danger` is only ever a delete.
 */
const VARIANT_PROPS: Record<ButtonVariant, Partial<AntButtonProps>> = {
  primary: { type: "primary" },
  secondary: { type: "default" },
  danger: { type: "primary", danger: true },
  ghost: { type: "text" },
  link: { type: "link" },
};

export default function Button({
  size = "md",
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <AntButton
      {...VARIANT_PROPS[variant]}
      {...rest}
      size={toAntSize(size)}
      className={cn("font-medium", className)}
    >
      {children}
    </AntButton>
  );
}
