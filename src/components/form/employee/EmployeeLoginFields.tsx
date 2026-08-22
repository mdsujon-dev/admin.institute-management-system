import { Form } from "antd";
import StatusField from "@/components/form/shared/StatusField";
import { Input, PasswordInput, Select } from "@/components/ui";
import { useRoleOptions } from "@/hooks/useRoleOptions";

interface EmployeeLoginFieldsProps {
  /** On edit the email and password are gone, but the rest still applies. */
  isEditing?: boolean;
}

/**
 * The login half of a staff member.
 *
 * There is no separate users screen to go to: an employee *is* an account, so
 * the role they sign in with and whether they can sign in at all are decided
 * here, next to everything else about them.
 *
 * The role is asked for rather than derived from the designation -- two people
 * can share a job title and still need different access. The email and password
 * only appear while creating, because changing either has consequences (old
 * sessions stop working) that a profile form should not hide inside a save.
 */
export default function EmployeeLoginFields({ isEditing }: EmployeeLoginFieldsProps) {
  const { options: roleOptions, isLoading: isLoadingRoles } = useRoleOptions();

  return (
    <section className="mb-2">
      <h3 className="mb-3 text-caption font-semibold uppercase tracking-wide text-gray-500">
        Login
      </h3>

      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        {!isEditing && (
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
        )}

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

        <StatusField name="isLoginActive" label="Can sign in" checkedLabel="Yes" uncheckedLabel="No" />
      </div>

      {!isEditing && (
        <Form.Item
          name="password"
          label="Password"
          extra="Leave empty to generate one. A generated password is shown once."
        >
          <PasswordInput placeholder="Leave empty to generate" autoComplete="new-password" />
        </Form.Item>
      )}
    </section>
  );
}
