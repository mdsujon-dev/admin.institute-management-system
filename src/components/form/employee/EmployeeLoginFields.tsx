import { Form } from "antd";
import StatusField from "@/components/form/shared/StatusField";
import { Input, PasswordInput, Text } from "@/components/ui";
import { useDesignationOptions } from "@/hooks/useDesignationOptions";
import { humanise } from "@/utils/format";

interface EmployeeLoginFieldsProps {
  /** On edit the email and password are gone, but the rest still applies. */
  isEditing?: boolean;
}

/**
 * The login half of a staff member.
 *
 * There is no separate users screen to go to: an employee *is* an account, so
 * whether they can sign in and which role they sign in with is decided here,
 * next to everything else about them.
 *
 * The role is shown but not chosen -- the designation carries it, so the two
 * can never be set to disagree. The email and password only appear while
 * creating, because changing either has consequences (old sessions stop
 * working) that a profile form should not hide inside a save.
 */
export default function EmployeeLoginFields({ isEditing }: EmployeeLoginFieldsProps) {
  const { designations } = useDesignationOptions();

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
          noStyle
          shouldUpdate={(prev, next) => prev.designationId !== next.designationId}
        >
          {({ getFieldValue }) => {
            const designation = designations.find(
              (entry) => entry.id === getFieldValue("designationId"),
            );

            return (
              <Form.Item label="Role" extra="Comes from the designation below.">
                <div className="flex h-10 items-center rounded-[9px] border border-gray-200 bg-gray-50 px-3 dark:border-gray-800 dark:bg-gray-950">
                  <Text size="body-sm" tone={designation?.role ? "default" : "subtle"}>
                    {designation?.role
                      ? humanise(designation.role.name)
                      : "Pick a designation to set the role"}
                  </Text>
                </div>
              </Form.Item>
            );
          }}
        </Form.Item>

        <StatusField
          name="isLoginActive"
          label="Can sign in"
          checkedLabel="Yes"
          uncheckedLabel="No"
          extra="Switch off to keep the record but stop the account signing in."
        />
      </div>

      {!isEditing && (
        <Form.Item
          name="password"
          label="Password"
          extra="Leave empty to generate one. A generated password is shown once, right after the account is created."
        >
          <PasswordInput placeholder="Leave empty to generate" autoComplete="new-password" />
        </Form.Item>
      )}
    </section>
  );
}
