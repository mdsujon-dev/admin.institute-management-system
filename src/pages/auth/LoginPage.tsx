import { useState } from "react";
import { useNavigate } from "react-router";
import { InlineAlert } from "@/components/ui";
import PageMeta from "@/components/common/PageMeta";
import AuthShell from "@/components/layout/AuthShell";
import LoginForm, { type LoginFormValues } from "@/components/form/auth/LoginForm";
import { useLazyGetMeQuery, useLoginMutation } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hooks";
import { tokenReceived, userLoaded } from "@/redux/features/auth/authSlice";
import { getErrorMessage } from "@/utils/apiError";

export default function LoginPage() {
  const [formError, setFormError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [loadProfile, { isFetching }] = useLazyGetMeQuery();

  const handleSubmit = async (values: LoginFormValues) => {
    setFormError(null);

    try {
      const result = await login({
        email: values.email.trim(),
        password: values.password,
      }).unwrap();

      // The token has to be in the store before /auth/me goes out, or the
      // profile request pays for a needless refresh round trip.
      dispatch(tokenReceived(result.accessToken));

      const profile = await loadProfile().unwrap();
      dispatch(userLoaded(profile));

      navigate(profile.needsPasswordChange ? "/change-password" : "/", { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not sign you in. Please try again."));
    }
  };

  return (
    <>
      <PageMeta title="Sign in" description="Sign in to the Institute Management System" />
      <AuthShell
        title="Sign in"
        subtitle="Enter your email and password to reach your dashboard."
      >
        {formError && <InlineAlert message={formError} className="mb-5" />}
        <LoginForm onSubmit={handleSubmit} isSubmitting={isLoading || isFetching} />
      </AuthShell>
    </>
  );
}
