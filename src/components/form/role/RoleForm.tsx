import { Form, type FormInstance } from "antd";
import { Input, TextArea } from "@/components/ui";

export interface RoleFormValues {
  name: string;
  description?: string;
}

interface RoleFormProps {
  form: FormInstance<RoleFormValues>;
  onFinish: (values: RoleFormValues) => void;
  /** Seeded roles cannot be renamed, only re-permissioned. */
  isSystemRole?: boolean;
}

const NAME_PATTERN = /^[A-Z][A-Z0-9_]*$/;

/**
 * What a role *is*: a name and a description. What it may *do* is a screen of
 * its own -- a permission matrix is too big a decision to make inside a dialog
 * that is also asking you to name something.
 */
export default function RoleForm({ form, onFinish, isSystemRole }: RoleFormProps) {
  return (
    <Form<RoleFormValues>
      form={form}
      layout="vertical"
      requiredMark="optional"
      onFinish={onFinish}
    >
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: "A role needs a name." },
            {
              pattern: NAME_PATTERN,
              message: "Upper case letters, digits and underscores, e.g. LIBRARIAN.",
            },
          ]}
          extra={isSystemRole ? "Seeded roles cannot be renamed." : "Upper case, no spaces."}
          normalize={(value: string) => value?.toUpperCase()}
        >
          <Input placeholder="LIBRARIAN" disabled={isSystemRole} />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea rows={2} maxLength={255} placeholder="What this role is for" />
        </Form.Item>
      </div>
    </Form>
  );
}
