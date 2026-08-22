import { useState } from "react";
import { useNavigate } from "react-router";
import { InlineAlert } from "@/components/ui";
import PageMeta from "@/components/common/PageMeta";
import AuthShell from "@/components/layout/AuthShell";
import ChangePasswordForm, {
  type ChangePasswordFormValues,
} from "@/components/form/auth/ChangePasswordForm";
import { usePermissions } from "@/hooks/usePermissions";
import { useToast } from "@/hooks/useToast";
import { baseApi } from "@/redux/api/baseApi";
import { useChangePasswordMutation } from "@/redux/features/auth/auth.api";
import { loggedOut } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { getErrorMessage } from "@/utils/apiError";

/**
 * Also the landing screen for an admin-created account: `needsPasswordChange`
 * sends it here and `ProtectedRoute` keeps it here until a password is set.
 *
 * Changing a password invalidates every token issued before it, so the only
 * correct thing to do afterwards is to sign the operator back in.
 */
export default function ChangePasswordPage() {
  const [error, setError] = useState<string | null>(null);

  const { user } = usePermissions();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const isForced = Boolean(user?.needsPasswordChange);

  const handleSubmit = async (values: ChangePasswordFormValues) => {
    setError(null);

    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();

      toast.success("Password changed", "Please sign in with your new password.");
      dispatch(loggedOut());
      dispatch(baseApi.util.resetApiState());
      navigate("/login", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  return (
    <>
      <PageMeta title="Change password" description="Change your account password" />
      <AuthShell
        title={isForced ? "Set your password" : "Change password"}
        subtitle={
          isForced
            ? "This account still uses the password it was created with. Choose your own to continue."
            : "You will be signed out and asked to sign in again."
        }
      >
        {error && <InlineAlert message={error} className="mb-5" />}
        <ChangePasswordForm onSubmit={handleSubmit} isSubmitting={isLoading} />
      </AuthShell>
    </>
  );
}
