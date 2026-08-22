import { Form } from "antd";
import { useEffect, useState } from "react";
import { FormModal, InlineAlert } from "@/components/ui";
import RoleForm, { type RoleFormValues } from "@/components/form/role/RoleForm";
import { usePermissions } from "@/hooks/usePermissions";
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
  const { role: currentRole } = usePermissions();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  // Refill the form whenever a different row is opened.
  useEffect(() => {
    if (!open) return;

    setErrorMessage(null);
    form.setFieldsValue({
      name: role?.name ?? "",
      description: role?.description ?? "",
      permissions: role?.permissions ?? [],
    });
  }, [open, role, form]);

  const handleFinish = async (values: RoleFormValues) => {
    setErrorMessage(null);

    const body = {
      name: values.name.trim().toUpperCase(),
      description: values.description?.trim() || undefined,
      permissions: values.permissions ?? [],
    };

    try {
      if (role) {
        // A system role cannot be renamed, so its name is left out of the patch.
        await updateRole({
          id: role.id,
          body: role.isSystem
            ? { description: body.description, permissions: body.permissions }
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

  const isEditingOwnRole = Boolean(role && currentRole === role.name);

  return (
    <FormModal
      open={open}
      size="lg"
      onCancel={onClose}
      onSubmit={() => form.submit()}
      title={role ? `Edit ${role.name}` : "New role"}
      submitLabel={role ? "Save changes" : "Create role"}
      isSubmitting={isCreating || isUpdating}
      errorMessage={errorMessage ?? undefined}
    >
      {isEditingOwnRole && (
        <InlineAlert
          type="warning"
          message="This is your own role"
          description="Removing a permission here takes effect immediately, including for you."
          className="mb-4"
        />
      )}

      <RoleForm form={form} onFinish={handleFinish} isSystemRole={role?.isSystem} />
    </FormModal>
  );
}
