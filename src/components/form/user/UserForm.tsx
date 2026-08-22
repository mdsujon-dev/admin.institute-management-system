import { Form, type FormInstance } from "antd";
import { Input, PasswordInput, Select } from "@/components/ui";
import { USER_STATUS_OPTIONS } from "@/constants/options";
import { useRoleOptions } from "@/hooks/useRoleOptions";
import type { UserStatus } from "@/types/models";

export interface UserFormValues {
  email: string;
  password?: string;
  roleId: string;
  status: UserStatus;
}

interface UserFormProps {
  form: FormInstance<UserFormValues>;
  onFinish: (values: UserFormValues) => void;
  /** Editing: email is fixed and the password half of the form disappears. */
  isEditing?: boolean;
}

/**
 * A login account: an email, the role that decides what it may do, and whether
 * it may sign in at all. Passwords are only ever set at creation -- changing one
 * has to go through the flow that invalidates old tokens.
 */
export default function UserForm({ form, onFinish, isEditing }: UserFormProps) {
  const { options: roleOptions, isLoading: isLoadingRoles } = useRoleOptions();

  return (
    <Form<UserFormValues>
      form={form}
      layout="vertical"
      requiredMark="optional"
      onFinish={onFinish}
      initialValues={{ status: "ACTIVE" }}
    >
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "An email is required." },
          { type: "email", message: "That does not look like an email address." },
        ]}
        extra={isEditing ? "An email cannot be changed after the account exists." : undefined}
      >
        <Input placeholder="teacher@institute.com" disabled={isEditing} />
      </Form.Item>

      {!isEditing && (
        <Form.Item
          name="password"
          label="Password"
          extra="Leave empty to generate one. A generated password is shown once, right after the account is created."
        >
          <PasswordInput placeholder="Leave empty to generate" autoComplete="new-password" />
        </Form.Item>
      )}

      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <Form.Item
          name="roleId"
          label="Role"
          rules={[{ required: true, message: "Pick the role this account signs in with." }]}
        >
          <Select
            options={roleOptions}
            loading={isLoadingRoles}
            placeholder="Select a role"
          />
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select options={USER_STATUS_OPTIONS} />
        </Form.Item>
      </div>
    </Form>
  );
}
