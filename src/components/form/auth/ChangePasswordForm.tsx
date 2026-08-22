import { Form } from "antd";
import { Button, PasswordInput } from "@/components/ui";

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordFormProps {
  onSubmit: (values: ChangePasswordFormValues) => void;
  isSubmitting?: boolean;
}

export default function ChangePasswordForm({
  onSubmit,
  isSubmitting,
}: ChangePasswordFormProps) {
  return (
    <Form<ChangePasswordFormValues>
      layout="vertical"
      requiredMark={false}
      onFinish={onSubmit}
    >
      <Form.Item
        name="currentPassword"
        label="Current password"
        rules={[{ required: true, message: "Enter the password you use now." }]}
      >
        <PasswordInput size="lg" autoComplete="current-password" />
      </Form.Item>

      <Form.Item
        name="newPassword"
        label="New password"
        extra="At least 8 characters, with upper case, lower case, a number and a symbol."
        rules={[
          { required: true, message: "Choose a new password." },
          ({ getFieldValue }) => ({
            validator: (_rule, value) =>
              !value || value !== getFieldValue("currentPassword")
                ? Promise.resolve()
                : Promise.reject(
                    new Error("The new password must differ from the current one."),
                  ),
          }),
        ]}
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

      <Button htmlType="submit" size="lg" block loading={isSubmitting}>
        Change password
      </Button>
    </Form>
  );
}
