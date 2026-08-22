import { Form } from "antd";
import { Input, PasswordInput, Text } from "@/components/ui";
import { useDesignationOptions } from "@/hooks/useDesignationOptions";
import { humanise } from "@/utils/format";

/**
 * The login half of a new staff member. Only shown when creating: afterwards the
 * email, password and role belong to the users screen, because changing them has
 * consequences a profile form should not hide.
 *
 * There is no role picker here on purpose -- the designation chosen below
 * carries the role, so the two can never be set to disagree.
 */
export default function EmployeeLoginFields() {
  const { designations } = useDesignationOptions();

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
