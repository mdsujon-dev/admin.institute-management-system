import { Form } from "antd";
import { useEffect, useState } from "react";
import { FormModal } from "@/components/ui";
import RoleForm, { type RoleFormValues } from "@/components/form/role/RoleForm";
import { useToast } from "@/hooks/useToast";
import {
  useCreateRoleMutation,
  useUpdateRoleMutation,
} from "@/redux/features/roles/roles.api";
import type { Role } from "@/types/models";
import { getErrorMessage } from "@/utils/apiError";

interface RoleFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Null when creating. */
  role: Role | null;
}

/** Create and edit share one form; only the mutation behind Save differs. */
export default function RoleFormModal({ open, onClose, role }: RoleFormModalProps) {
  const [form] = Form.useForm<RoleFormValues>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toast = useToast();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  // Refill the form whenever a different row is opened.
  useEffect(() => {
    if (!open) return;

    setErrorMessage(null);
    form.setFieldsValue({
      name: role?.name ?? "",
      description: role?.description ?? "",
      isActive: role?.isActive ?? true,
    });
  }, [open, role, form]);

  const handleFinish = async (values: RoleFormValues) => {
    setErrorMessage(null);

    const body = {
      name: values.name.trim().toUpperCase(),
      description: values.description?.trim() || undefined,
      isActive: values.isActive,
    };

    try {
      if (role) {
        // A system role cannot be renamed, so its name is left out of the patch.
        await updateRole({
          id: role.id,
          // A system role cannot be renamed, so only the description goes.
          body: role.isSystem
            ? { description: body.description, isActive: body.isActive }
            : body,
        }).unwrap();
        toast.success("Role updated", body.name);
      } else {
        await createRole(body).unwrap();
        toast.success("Role created", body.name);
      }

      onClose();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  return (
    <FormModal
      open={open}
      size="md"
      onCancel={onClose}
      onSubmit={() => form.submit()}
      title={role ? `Edit ${role.name}` : "New role"}
      submitLabel={role ? "Save changes" : "Create role"}
      isSubmitting={isCreating || isUpdating}
      errorMessage={errorMessage ?? undefined}
    >
      <RoleForm form={form} onFinish={handleFinish} isSystemRole={role?.isSystem} />
    </FormModal>
  );
}
