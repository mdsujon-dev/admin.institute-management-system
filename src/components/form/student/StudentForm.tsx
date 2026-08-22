import { DatePicker, Form, type FormInstance } from "antd";
import type { Dayjs } from "dayjs";
import { Input, PasswordInput, Select, TextArea } from "@/components/ui";
import { GENDER_OPTIONS, STUDENT_STATUS_OPTIONS } from "@/constants/options";
import StatusField from "@/components/form/shared/StatusField";
import type { Gender, StudentStatus } from "@/types/models";

export interface StudentFormValues {
  email?: string;
  password?: string;
  isLoginActive?: boolean;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: Gender;
  dateOfBirth?: Dayjs;
  address?: string;
  admissionDate?: Dayjs;
  guardianName?: string;
  guardianPhone?: string;
  status: StudentStatus;
}

interface StudentFormProps {
  form: FormInstance<StudentFormValues>;
  onFinish: (values: StudentFormValues) => void;
  isEditing?: boolean;
}

/** Admitting a student creates their login too, so they can sign in from day one. */
export default function StudentForm({ form, onFinish, isEditing }: StudentFormProps) {

  return (
    <Form<StudentFormValues>
      form={form}
      layout="vertical"
      requiredMark="optional"
      onFinish={onFinish}
      initialValues={{ status: "ACTIVE", isLoginActive: true }}
    >
      {/*
        A student is an account, not a profile that needs one made for it
        somewhere else -- so whether they can sign in is decided right here. The
        role is not asked for: an admission signs in as a STUDENT, and the API
        looks that up rather than making it a second decision.
      */}
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
              <Input placeholder="student@institute.com" />
            </Form.Item>
          )}

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

      <h3 className="mb-3 text-caption font-semibold uppercase tracking-wide text-gray-500">
        Student
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

        <Form.Item name="admissionDate" label="Admission date">
          <DatePicker className="w-full" size="large" />
        </Form.Item>

        <Form.Item name="guardianName" label="Guardian name">
          <Input maxLength={100} />
        </Form.Item>

        <Form.Item name="guardianPhone" label="Guardian phone">
          <Input maxLength={20} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Enrolment status"
          extra="Where they are in their time here. Separate from whether they can sign in."
        >
          <Select options={STUDENT_STATUS_OPTIONS} />
        </Form.Item>
      </div>

      <Form.Item name="address" label="Address" className="mb-0">
        <TextArea maxLength={255} />
      </Form.Item>
    </Form>
  );
}
