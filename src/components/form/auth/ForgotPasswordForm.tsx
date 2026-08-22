import { Form } from "antd";
import { Button, Input, PasswordInput } from "@/components/ui";

export type RecoveryStep = "email" | "otp" | "password";

export interface RecoveryFormValues {
  email?: string;
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface ForgotPasswordFormProps {
  step: RecoveryStep;
  email: string;
  onSubmit: (values: RecoveryFormValues) => void;
  isSubmitting?: boolean;
}

const SUBMIT_LABEL: Record<RecoveryStep, string> = {
  email: "Send code",
  otp: "Verify code",
  password: "Update password",
};

/** One form, three steps: ask for the code, check it, then set the password. */
export default function ForgotPasswordForm({
  step,
  email,
  onSubmit,
  isSubmitting,
}: ForgotPasswordFormProps) {
  return (
    <Form<RecoveryFormValues>
      key={step}
      layout="vertical"
      requiredMark={false}
      onFinish={onSubmit}
    >
      {step === "email" && (
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Enter the email you sign in with." },
            { type: "email", message: "That does not look like an email address." },
          ]}
        >
          <Input size="lg" autoComplete="username" placeholder="you@institute.com" />
        </Form.Item>
      )}

      {step === "otp" && (
        <Form.Item
          name="otp"
          label="Six digit code"
          extra={`Sent to ${email}`}
          normalize={(value: string) => value?.replace(/\D/g, "").slice(0, 6)}
          rules={[{ required: true, message: "Enter the code from your inbox." }]}
        >
          <Input size="lg" placeholder="123456" inputMode="numeric" />
        </Form.Item>
      )}

      {step === "password" && (
        <>
          <Form.Item
            name="newPassword"
            label="New password"
            extra="At least 8 characters, with upper case, lower case, a number and a symbol."
            rules={[{ required: true, message: "Choose a new password." }]}
          >
            <PasswordInput size="lg" autoComplete="new-password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm new password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Type the new password again." },
              ({ getFieldValue }) => ({
                validator: (_rule, value) =>
                  !value || getFieldValue("newPassword") === value
                    ? Promise.resolve()
                    : Promise.reject(new Error("The two passwords do not match.")),
              }),
            ]}
          >
            <PasswordInput size="lg" autoComplete="new-password" />
          </Form.Item>
        </>
      )}

      <Button htmlType="submit" size="lg" block loading={isSubmitting}>
        {SUBMIT_LABEL[step]}
      </Button>
    </Form>
  );
}
