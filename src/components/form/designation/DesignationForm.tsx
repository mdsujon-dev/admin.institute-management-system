import { Form, Switch, type FormInstance } from "antd";
import { Input, Select, TextArea } from "@/components/ui";
import { useRoleOptions } from "@/hooks/useRoleOptions";

export interface DesignationFormValues {
  title: string;
  department?: string;
  description?: string;
  roleId?: string;
  isActive: boolean;
}

interface DesignationFormProps {
  form: FormInstance<DesignationFormValues>;
  onFinish: (values: DesignationFormValues) => void;
}

/**
 * What a staff member does, which department they do it in, and -- the part
 * that matters most -- the role anyone given this designation signs in with.
 * Keeping the role here is what makes "designation decides access" true rather
 * than something an operator has to remember to set twice.
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
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
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

        <Form.Item name="department" label="Department">
          <Input placeholder="Computer Science" maxLength={100} />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
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

        <Form.Item
          name="isActive"
          label="Status"
          valuePropName="checked"
          extra="A switched off designation is kept for current staff, but is not offered to new ones."
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
      </div>

      <Form.Item name="description" label="Description" className="mb-0">
        <TextArea maxLength={255} placeholder="What this role is responsible for" />
      </Form.Item>
    </Form>
  );
}
