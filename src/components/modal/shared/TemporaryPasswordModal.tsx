import { Tooltip } from "antd";
import { Copy } from "lucide-react";
import { Button, Modal, Text } from "@/components/ui";
import { useToast } from "@/hooks/useToast";

interface TemporaryPasswordModalProps {
  open: boolean;
  onClose: () => void;
  email: string;
  password: string;
}

/**
 * The one and only time a generated password is readable.
 *
 * It is stored hashed, so closing this without copying it means the account has
 * to go through a password reset -- which is why the dialog says so plainly
 * instead of looking like a receipt that can be dismissed.
 */
export default function TemporaryPasswordModal({
  open,
  onClose,
  email,
  password,
}: TemporaryPasswordModalProps) {
  const toast = useToast();

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Could not copy", "Please select the text and copy it manually.");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Account created"
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => void copy(`${email}\n${password}`, "Credentials")}>
            Copy both
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Text size="body-sm" tone="muted">
          This password is shown once. Hand it over now &mdash; it cannot be read again
          afterwards, only reset.
        </Text>

        <Field label="Email" value={email} onCopy={() => void copy(email, "Email")} />
        <Field
          label="Temporary password"
          value={password}
          mono
          onCopy={() => void copy(password, "Password")}
        />

        <Text size="caption" tone="subtle">
          They will be asked to choose their own password the first time they sign in.
        </Text>
      </div>
    </Modal>
  );
}

interface FieldProps {
  label: string;
  value: string;
  mono?: boolean;
  onCopy: () => void;
}

function Field({ label, value, mono, onCopy }: FieldProps) {
  return (
    <div>
      <Text size="caption" tone="subtle">
        {label}
      </Text>
      <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-950">
        <span className={`min-w-0 flex-1 truncate text-body-sm ${mono ? "font-mono" : ""}`}>
          {value}
        </span>
        <Tooltip title={`Copy ${label.toLowerCase()}`}>
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Copy ${label.toLowerCase()}`}
            icon={<Copy />}
            onClick={onCopy}
          />
        </Tooltip>
      </div>
    </div>
  );
}
