import { Form } from "antd";
import { Link } from "react-router";
import { Button, Input, PasswordInput } from "@/components/ui";

export interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
  isSubmitting?: boolean;
}

/** Email, password, and the way out if the password is forgotten. */
export default function LoginForm({ onSubmit, isSubmitting }: LoginFormProps) {
  return (
    <Form<LoginFormValues> layout="vertical" requiredMark={false} onFinish={onSubmit}>
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

      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Enter your password." }]}
      >
        <PasswordInput
          size="lg"
          autoComplete="current-password"
          placeholder="Enter your password"
        />
      </Form.Item>

      <div className="mb-5 flex justify-end">
        <Link
          to="/forgot-password"
          className="text-body-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          Forgot password?
        </Link>
      </div>

      <Button htmlType="submit" size="lg" block loading={isSubmitting}>
        Sign in
      </Button>
    </Form>
  );
}
