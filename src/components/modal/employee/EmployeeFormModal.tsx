import { Form } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FormModal } from "@/components/ui";
import EmployeeForm, {
  type EmployeeFormValues,
} from "@/components/form/employee/EmployeeForm";
import { useToast } from "@/hooks/useToast";
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from "@/redux/features/employees/employees.api";
import type { Employee } from "@/types/models";
import { getErrorMessage } from "@/utils/apiError";
import { toApiDate } from "@/utils/format";

interface EmployeeFormModalProps {
  open: boolean;
  onClose: () => void;
  employee: Employee | null;
  onTemporaryPassword?: (credentials: { email: string; password: string }) => void;
}

export default function EmployeeFormModal({
  open,
  onClose,
  employee,
  onTemporaryPassword,
}: EmployeeFormModalProps) {
  const [form] = Form.useForm<EmployeeFormValues>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toast = useToast();
  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();

  useEffect(() => {
    if (!open) return;

    setErrorMessage(null);

    if (!employee) {
      form.resetFields();
      return;
    }

    form.setFieldsValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      phone: employee.phone ?? "",
      gender: employee.gender ?? undefined,
      dateOfBirth: employee.dateOfBirth ? dayjs(employee.dateOfBirth) : undefined,
      joiningDate: employee.joiningDate ? dayjs(employee.joiningDate) : undefined,
      salary: employee.salary === null ? undefined : Number(employee.salary),
      designationId: employee.designationId ?? undefined,
      address: employee.address ?? "",
      status: employee.status,
      isLoginActive: employee.user?.status === "ACTIVE",
    });
  }, [open, employee, form]);

  const handleFinish = async (values: EmployeeFormValues) => {
    setErrorMessage(null);

    /**
     * Free text is sent even when empty, so a phone number or an address can be
     * cleared. Ids, dates and enums are omitted instead: an empty string is a
     * validation error for those, not a "remove it".
     */
    const profile = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phone: values.phone?.trim() ?? "",
      address: values.address?.trim() ?? "",
      gender: values.gender,
      dateOfBirth: toApiDate(values.dateOfBirth),
      joiningDate: toApiDate(values.joiningDate),
      salary: values.salary ?? undefined,
      designationId: values.designationId,
      status: values.status,
      isLoginActive: values.isLoginActive,
    };

    try {
      if (employee) {
        await updateEmployee({ id: employee.id, body: profile }).unwrap();
        toast.success("Employee updated", `${profile.firstName} ${profile.lastName}`);
      } else {
        const created = await createEmployee({
          ...profile,
          email: values.email!.trim().toLowerCase(),
          password: values.password?.trim() || undefined,
          // No roleId: the designation carries the role, and the API reads it
          // from there. Sending one here would be a second source of truth.
        }).unwrap();

        toast.success("Employee added", `${created.firstName} ${created.lastName}`);

        if (created.temporaryPassword && created.user?.email) {
          onTemporaryPassword?.({
            email: created.user.email,
            password: created.temporaryPassword,
          });
        }
      }

      onClose();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  return (
    <FormModal
      open={open}
      size="lg"
      onCancel={onClose}
      onSubmit={() => form.submit()}
      title={
        employee ? `Edit ${employee.firstName} ${employee.lastName}` : "New employee"
      }
      submitLabel={employee ? "Save changes" : "Add employee"}
      isSubmitting={isCreating || isUpdating}
      errorMessage={errorMessage ?? undefined}
    >
      <EmployeeForm form={form} onFinish={handleFinish} isEditing={Boolean(employee)} />
    </FormModal>
  );
}
