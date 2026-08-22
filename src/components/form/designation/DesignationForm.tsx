import { Form, type FormInstance } from "antd";
import { Input, TextArea } from "@/components/ui";

export interface DesignationFormValues {
  title: string;
  department?: string;
  description?: string;
}

interface DesignationFormProps {
  form: FormInstance<DesignationFormValues>;
  onFinish: (values: DesignationFormValues) => void;
}

/** What a staff member does, and which department they do it in. */
export default function DesignationForm({ form, onFinish }: DesignationFormProps) {
  return (
    <Form<DesignationFormValues>
      form={form}
      layout="vertical"
      requiredMark="optional"
      onFinish={onFinish}
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

      <Form.Item name="description" label="Description" className="mb-0">
        <TextArea maxLength={255} placeholder="What this role is responsible for" />
      </Form.Item>
    </Form>
  );
}
