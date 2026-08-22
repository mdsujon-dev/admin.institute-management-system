import { Form } from "antd";
import { useEffect, useState } from "react";
import { FormModal } from "@/components/ui";
import UserForm, { type UserFormValues } from "@/components/form/user/UserForm";
import { useToast } from "@/hooks/useToast";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "@/redux/features/users/users.api";
import type { User } from "@/types/models";
import { getErrorMessage } from "@/utils/apiError";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  /** Fired with the one time password when the API generated one. */
  onTemporaryPassword?: (credentials: { email: string; password: string }) => void;
}

export default function UserFormModal({
  open,
  onClose,
  user,
  onTemporaryPassword,
}: UserFormModalProps) {
  const [form] = Form.useForm<UserFormValues>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toast = useToast();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  useEffect(() => {
    if (!open) return;

    setErrorMessage(null);
    form.setFieldsValue({
      email: user?.email ?? "",
      password: "",
      roleId: user?.role.id ?? "",
      status: user?.status ?? "ACTIVE",
    });
  }, [open, user, form]);

  const handleFinish = async (values: UserFormValues) => {
    setErrorMessage(null);

    try {
      if (user) {
        await updateUser({
          id: user.id,
          body: { roleId: values.roleId, status: values.status },
        }).unwrap();
        toast.success("User updated", user.email);
      } else {
        const created = await createUser({
          email: values.email.trim().toLowerCase(),
          password: values.password?.trim() || undefined,
          roleId: values.roleId,
          status: values.status,
        }).unwrap();

        toast.success("User created", created.email);

        if (created.temporaryPassword) {
          onTemporaryPassword?.({
            email: created.email,
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
      onCancel={onClose}
      onSubmit={() => form.submit()}
      title={user ? "Edit user" : "New user"}
      submitLabel={user ? "Save changes" : "Create user"}
      isSubmitting={isCreating || isUpdating}
      errorMessage={errorMessage ?? undefined}
    >
      <UserForm form={form} onFinish={handleFinish} isEditing={Boolean(user)} />
    </FormModal>
  );
}
