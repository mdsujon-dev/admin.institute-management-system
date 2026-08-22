import type { ReactNode } from "react";
import Button from "@/components/ui/Button/Button";
import InlineAlert from "@/components/ui/Feedback/InlineAlert";
import Modal, { type ModalSize } from "./Modal";

interface FormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  title: string;
  children: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  /** Shown above the buttons -- normally the API message from a failed save. */
  errorMessage?: string;
  size?: ModalSize;
}

/**
 * Every create and edit dialog in the app. It owns the chrome -- title, error
 * strip, footer buttons, busy state -- so a feature supplies only its fields and
 * a submit handler, and no two dialogs drift apart.
 */
export default function FormModal({
  open,
  onCancel,
  onSubmit,
  title,
  children,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isSubmitting = false,
  errorMessage,
  size = "md",
}: FormModalProps) {
  return (
    <Modal
      open={open}
      title={title}
      size={size}
      onCancel={isSubmitting ? undefined : onCancel}
      closable={!isSubmitting}
      footer={
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            {cancelLabel}
          </Button>
          <Button variant="primary" loading={isSubmitting} onClick={onSubmit}>
            {submitLabel}
          </Button>
        </div>
      }
    >
      {errorMessage && (
        <InlineAlert type="error" message={errorMessage} className="mb-4" />
      )}
      {children}
    </Modal>
  );
}
