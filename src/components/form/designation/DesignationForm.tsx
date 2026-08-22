import { Form, type FormInstance } from "antd";
import StatusField from "@/components/form/shared/StatusField";
import { Input, TextArea } from "@/components/ui";

export interface DesignationFormValues {
  title: string;
  description?: string;
  isActive: boolean;
}

interface DesignationFormProps {
  form: FormInstance<DesignationFormValues>;
  onFinish: (values: DesignationFormValues) => void;
}

/**
 * A job title, and nothing more. Access is decided by the role on the account,
 * chosen when the employee is created -- two people can share a designation and
 * still need different access, so the two are kept apart.
 *
 * One field per row: the dialog is short, and reading it straight down beats a
 * grid that makes the eye zig-zag.
 */
export default function DesignationForm({ form, onFinish }: DesignationFormProps) {
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

      <StatusField className="mb-0" />
    </Form>
  );
}
