import { Form, type FormInstance } from "antd";
import StatusField from "@/components/form/shared/StatusField";
import { Input, Select, TextArea } from "@/components/ui";
import { useRoleOptions } from "@/hooks/useRoleOptions";

export interface DesignationFormValues {
  title: string;
  description?: string;
  roleId?: string;
  isActive: boolean;
}

interface DesignationFormProps {
  form: FormInstance<DesignationFormValues>;
  onFinish: (values: DesignationFormValues) => void;
}

/**
 * What a staff member does and -- the part that matters most -- the role anyone
 * given this designation signs in with. Keeping the role here is what makes
 * "designation decides access" true, rather than something an operator has to
 * remember to set twice.
 *
 * One field per row: the dialog is short, and reading it straight down beats a
 * grid that makes the eye zig-zag.
 */
export default function DesignationForm({ form, onFinish }: DesignationFormProps) {
  const { options: roleOptions, isLoading: isLoadingRoles } = useRoleOptions();

  return (
    <Form<DesignationFormValues>
      form={form}
      layout="vertical"
      requiredMark="optional"
      onFinish={onFinish}
      initialValues={{ isActive: true }}
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[
          { required: true, message: "A designation needs a title." },
          { min: 2, message: "Use at least two characters." },
        ]}
      >
        <Input placeholder="Senior Lecturer" maxLength={100} />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <TextArea rows={2} maxLength={255} placeholder="What this job is responsible for" />
      </Form.Item>

      <Form.Item
        name="roleId"
        label="Role"
        extra="Anyone given this designation signs in with this role."
      >
        <Select
          allowClear
          options={roleOptions}
          loading={isLoadingRoles}
          placeholder="No role yet"
        />
      </Form.Item>

      <StatusField
        className="mb-0"
        extra="A switched off designation is kept for current staff, but is not offered to new ones."
      />
    </Form>
  );
}
