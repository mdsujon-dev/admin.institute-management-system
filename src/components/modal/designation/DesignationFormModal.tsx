import { Form } from "antd";
import { useEffect, useState } from "react";
import { FormModal } from "@/components/ui";
import DesignationForm, {
  type DesignationFormValues,
} from "@/components/form/designation/DesignationForm";
import { useToast } from "@/hooks/useToast";
import {
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
} from "@/redux/features/designations/designations.api";
import type { Designation } from "@/types/models";
import { getErrorMessage } from "@/utils/apiError";

interface DesignationFormModalProps {
  open: boolean;
  onClose: () => void;
  designation: Designation | null;
}

export default function DesignationFormModal({
  open,
  onClose,
  designation,
}: DesignationFormModalProps) {
  const [form] = Form.useForm<DesignationFormValues>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toast = useToast();
  const [createDesignation, { isLoading: isCreating }] = useCreateDesignationMutation();
  const [updateDesignation, { isLoading: isUpdating }] = useUpdateDesignationMutation();

  useEffect(() => {
    if (!open) return;

    setErrorMessage(null);
    form.setFieldsValue({
      title: designation?.title ?? "",
      description: designation?.description ?? "",
      isActive: designation?.isActive ?? true,
    });
  }, [open, designation, form]);

  const handleFinish = async (values: DesignationFormValues) => {
    setErrorMessage(null);

    const body = {
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      isActive: values.isActive,
    };

    try {
      if (designation) {
        await updateDesignation({ id: designation.id, body }).unwrap();
        toast.success("Designation updated", body.title);
      } else {
        await createDesignation(body).unwrap();
        toast.success("Designation created", body.title);
      }

      onClose();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  return (
    <FormModal
      open={open}
      onCancel={onClose}
      onSubmit={() => form.submit()}
      title={designation ? "Edit designation" : "New designation"}
      submitLabel={designation ? "Save changes" : "Create designation"}
      isSubmitting={isCreating || isUpdating}
      errorMessage={errorMessage ?? undefined}
    >
      <DesignationForm form={form} onFinish={handleFinish} />
    </FormModal>
  );
}
