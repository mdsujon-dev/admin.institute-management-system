import { Form } from "antd";
import { Input, PasswordInput, Select } from "@/components/ui";
import { useRoleOptions } from "@/hooks/useRoleOptions";

/**
 * The login half of a new staff member. Only shown when creating: afterwards the
 * email, password and role belong to the users screen, because changing them has
 * consequences a profile form should not hide.
 */
export default function EmployeeLoginFields() {
  const { options: roleOptions, isLoading } = useRoleOptions();

  return (
    <section className="mb-2">
      <h3 className="mb-3 text-caption font-semibold uppercase tracking-wide text-gray-500">
        Login
      </h3>

      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "An email is required to create the login." },
            { type: "email", message: "That does not look like an email address." },
          ]}
        >
          <Input placeholder="teacher@institute.com" />
        </Form.Item>

        <Form.Item
          name="roleId"
          label="Role"
          rules={[{ required: true, message: "Pick the role this account signs in with." }]}
        >
          <Select options={roleOptions} loading={isLoading} placeholder="Select a role" />
        </Form.Item>
      </div>

      <Form.Item
        name="password"
        label="Password"
        extra="Leave empty to generate one. A generated password is shown once, right after the account is created."
      >
        <PasswordInput placeholder="Leave empty to generate" autoComplete="new-password" />
      </Form.Item>
    </section>
  );
}
