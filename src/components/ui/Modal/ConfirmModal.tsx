import { TriangleAlert } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import Heading from "@/components/ui/Typography/Heading";
import Text from "@/components/ui/Typography/Text";
import Modal from "./Modal";

interface ConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
  /** Destructive actions get the red button; everything else gets the brand one. */
  tone?: "danger" | "primary";
}

/** The one "are you sure" in the app. Used for every delete. */
export default function ConfirmModal({
  open,
  onCancel,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  isLoading = false,
  tone = "danger",
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      size="sm"
      closable={!isLoading}
      onCancel={isLoading ? undefined : onCancel}
      footer={
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant={tone === "danger" ? "danger" : "primary"}
            loading={isLoading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="flex gap-3">
        <span className={tone === "danger" ? "text-h4 text-error-500" : "text-h4 text-brand-500"}>
          <TriangleAlert />
        </span>
        <div>
          <Heading level={5}>{title}</Heading>
          <Text size="body-sm" tone="muted" className="mt-1">
            {message}
          </Text>
        </div>
      </div>
    </Modal>
  );
}
