import { useState } from "react";
import { Button, Modal, Text } from "@/components/ui";

interface TemporaryPasswordModalProps {
  open: boolean;
  onClose: () => void;
  email: string;
  password: string;
}

/**
 * A generated password is shown exactly once -- it is hashed on the way into the
 * database and cannot be read back. This makes that clear, and makes it easy to
 * copy before it is gone.
 */
export default function TemporaryPasswordModal({
  open,
  onClose,
  email,
  password,
}: TemporaryPasswordModalProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${email} / ${password}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked; the value is on screen either way.
      setCopied(false);
    }
  };

  return (
    <Modal
      open={open}
      size="sm"
      title="Account created"
      onCancel={onClose}
      footer={
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={copy}>
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button onClick={onClose}>Done</Button>
        </div>
      }
    >
      <Text size="body-sm" tone="muted">
        Hand these credentials over now. The password cannot be shown again, and the
        account will be asked to change it at first sign in.
      </Text>

      <dl className="mt-4 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-caption uppercase tracking-wide text-gray-500">Email</dt>
          <dd className="truncate text-body-sm font-medium text-gray-900 dark:text-gray-100">
            {email}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-caption uppercase tracking-wide text-gray-500">Password</dt>
          <dd className="font-mono text-body-lg font-semibold text-brand-600 dark:text-brand-400">
            {password}
          </dd>
        </div>
      </dl>
    </Modal>
  );
}
