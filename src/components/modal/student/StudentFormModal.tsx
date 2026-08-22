import { Form } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FormModal } from "@/components/ui";
import StudentForm, {
  type StudentFormValues,
} from "@/components/form/student/StudentForm";
import { useRoleOptions } from "@/hooks/useRoleOptions";
import { useToast } from "@/hooks/useToast";
import {
  useCreateStudentMutation,
  useUpdateStudentMutation,
} from "@/redux/features/students/students.api";
import type { Student } from "@/types/models";
import { getErrorMessage } from "@/utils/apiError";
import { toApiDate } from "@/utils/format";

interface StudentFormModalProps {
  open: boolean;
  onClose: () => void;
  student: Student | null;
  onTemporaryPassword?: (credentials: { email: string; password: string }) => void;
}

export default function StudentFormModal({
  open,
  onClose,
  student,
  onTemporaryPassword,
}: StudentFormModalProps) {
  const [form] = Form.useForm<StudentFormValues>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toast = useToast();
  const { roles } = useRoleOptions();
  const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation();
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();

  useEffect(() => {
    if (!open) return;

    setErrorMessage(null);

    if (!student) {
      form.resetFields();
      // New admissions default to the seeded STUDENT role, which is the choice
      // nine times out of ten.
      const studentRole = roles.find((role) => role.name === "STUDENT");
      if (studentRole) form.setFieldValue("roleId", studentRole.id);
      return;
    }

    form.setFieldsValue({
      firstName: student.firstName,
      lastName: student.lastName,
      phone: student.phone ?? "",
      gender: student.gender ?? undefined,
      dateOfBirth: student.dateOfBirth ? dayjs(student.dateOfBirth) : undefined,
      admissionDate: student.admissionDate ? dayjs(student.admissionDate) : undefined,
      guardianName: student.guardianName ?? "",
      guardianPhone: student.guardianPhone ?? "",
      address: student.address ?? "",
      status: student.status,
    });
  }, [open, student, form, roles]);

  const handleFinish = async (values: StudentFormValues) => {
    setErrorMessage(null);

    // Free text goes out even when empty so it can be cleared; ids, dates and
    // enums are omitted instead, because "" is a validation error for those.
    const profile = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phone: values.phone?.trim() ?? "",
      address: values.address?.trim() ?? "",
      guardianName: values.guardianName?.trim() ?? "",
      guardianPhone: values.guardianPhone?.trim() ?? "",
      gender: values.gender,
      dateOfBirth: toApiDate(values.dateOfBirth),
      admissionDate: toApiDate(values.admissionDate),
      status: values.status,
    };

    try {
      if (student) {
        await updateStudent({ id: student.id, body: profile }).unwrap();
        toast.success("Student updated", `${profile.firstName} ${profile.lastName}`);
      } else {
        const created = await createStudent({
          ...profile,
          email: values.email!.trim().toLowerCase(),
          password: values.password?.trim() || undefined,
          roleId: values.roleId!,
        }).unwrap();

        toast.success("Student admitted", `${created.firstName} ${created.lastName}`);

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
      title={student ? `Edit ${student.firstName} ${student.lastName}` : "Admit student"}
      submitLabel={student ? "Save changes" : "Admit student"}
      isSubmitting={isCreating || isUpdating}
      errorMessage={errorMessage ?? undefined}
    >
      <StudentForm form={form} onFinish={handleFinish} isEditing={Boolean(student)} />
    </FormModal>
  );
}
