import { Modal as AntModal } from "antd";
import type { ModalProps as AntModalProps } from "antd";
import type { ReactNode } from "react";

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps extends Omit<AntModalProps, "width" | "footer"> {
  size?: ModalSize;
  footer?: ReactNode;
  children?: ReactNode;
}

/**
 * The dialog shell. Three widths only, each capped by the viewport, so the same
 * modal that is comfortable on a desktop is still usable on a phone.
 */
const WIDTH: Record<ModalSize, number> = { sm: 460, md: 640, lg: 860 };

export default function Modal({
  size = "md",
  footer = null,
  children,
  ...rest
}: ModalProps) {
  return (
    <AntModal
      centered
      destroyOnHidden
      maskClosable={false}
      {...rest}
      width={WIDTH[size]}
      footer={footer}
      styles={{ body: { maxHeight: "68vh", overflowY: "auto" } }}
      className="max-w-[calc(100vw-2rem)]"
    >
      {children}
    </AntModal>
  );
}
