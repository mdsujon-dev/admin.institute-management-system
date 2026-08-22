import { DatePicker, Form, InputNumber, type FormInstance } from "antd";
import type { Dayjs } from "dayjs";
import { Input, Select, TextArea } from "@/components/ui";
import EmployeeLoginFields from "./EmployeeLoginFields";
import { EMPLOYEE_STATUS_OPTIONS, GENDER_OPTIONS } from "@/constants/options";
import { useDesignationOptions } from "@/hooks/useDesignationOptions";
import type { EmployeeStatus, Gender } from "@/types/models";

export interface EmployeeFormValues {
  email?: string;
  password?: string;
  isLoginActive?: boolean;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: Gender;
  dateOfBirth?: Dayjs;
  address?: string;
  joiningDate?: Dayjs;
  salary?: number;
  designationId?: string;
  status: EmployeeStatus;
}

interface EmployeeFormProps {
  form: FormInstance<EmployeeFormValues>;
  onFinish: (values: EmployeeFormValues) => void;
  isEditing?: boolean;
}

/** An employee is a login plus a profile; on edit only the profile half shows. */
export default function EmployeeForm({ form, onFinish, isEditing }: EmployeeFormProps) {
  const { options: designationOptions } = useDesignationOptions();

  return (
    <Form<EmployeeFormValues>
      form={form}
      layout="vertical"
      requiredMark="optional"
      onFinish={onFinish}
      initialValues={{ status: "ACTIVE", isLoginActive: true }}
    >
      <EmployeeLoginFields isEditing={isEditing} />

      <h3 className="mb-3 text-caption font-semibold uppercase tracking-wide text-gray-500">
        Profile
      </h3>

      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <Form.Item
          name="firstName"
          label="First name"
          rules={[{ required: true, message: "A first name is required." }]}
        >
          <Input maxLength={50} />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last name"
          rules={[{ required: true, message: "A last name is required." }]}
        >
          <Input maxLength={50} />
        </Form.Item>

        <Form.Item name="phone" label="Phone">
          <Input placeholder="+8801700000000" maxLength={20} />
        </Form.Item>

        <Form.Item name="gender" label="Gender">
          <Select allowClear options={GENDER_OPTIONS} placeholder="Not specified" />
        </Form.Item>

        <Form.Item name="dateOfBirth" label="Date of birth">
          <DatePicker className="w-full" size="large" />
        </Form.Item>

        <Form.Item name="joiningDate" label="Joining date">
          <DatePicker className="w-full" size="large" />
        </Form.Item>

        <Form.Item
          name="designationId"
          label="Designation"
          rules={
            isEditing
              ? undefined
              : [
                  {
                    required: true,
                    message: "Pick a designation -- it decides the role they sign in with.",
                  },
                ]
          }
        >
          <Select
            allowClear={isEditing}
            options={designationOptions}
            placeholder="Select a designation"
          />
        </Form.Item>

        <Form.Item name="salary" label="Salary">
          <InputNumber className="w-full" size="large" min={0} step={500} placeholder="45000" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Employment status"
          extra="Where they are in their time here. Separate from whether they can sign in."
        >
          <Select options={EMPLOYEE_STATUS_OPTIONS} />
        </Form.Item>
      </div>

      <Form.Item name="address" label="Address" className="mb-0">
        <TextArea maxLength={255} />
      </Form.Item>
    </Form>
  );
}
