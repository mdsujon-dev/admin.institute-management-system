import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { InlineAlert } from "@/components/ui";
import PageMeta from "@/components/common/PageMeta";
import AuthShell from "@/components/layout/AuthShell";
import ForgotPasswordForm, {
  type RecoveryFormValues,
  type RecoveryStep,
} from "@/components/form/auth/ForgotPasswordForm";
import { useToast } from "@/hooks/useToast";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyOtpMutation,
} from "@/redux/features/auth/auth.api";
import { getErrorMessage } from "@/utils/apiError";

const COPY: Record<RecoveryStep, { title: string; subtitle: string }> = {
  email: {
    title: "Forgot password",
    subtitle: "Enter your email and we will send you a six digit code.",
  },
  otp: {
    title: "Enter your code",
    subtitle: "Check your inbox for the code. It expires in a few minutes.",
  },
  password: {
    title: "Set a new password",
    subtitle: "Choose a password you have not used here before.",
  },
};

/**
 * The three step recovery the API exposes: request a code, trade the code for a
 * short lived reset token, then set the password with that token. The code
 * itself is never sent twice.
 */
export default function ForgotPasswordPage() {
  const [step, setStep] = useState<RecoveryStep>("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const toast = useToast();
  const [requestCode, { isLoading: isRequesting }] = useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const handleSubmit = async (values: RecoveryFormValues) => {
    setError(null);

    try {
      if (step === "email") {
        const address = values.email!.trim().toLowerCase();
        await requestCode({ email: address }).unwrap();
        setEmail(address);
        setStep("otp");
        toast.info("Code sent", "If that email exists, a code is on its way.");
        return;
      }

      if (step === "otp") {
        const result = await verifyOtp({ email, otp: values.otp!.trim() }).unwrap();
        setResetToken(result.resetToken);
        setStep("password");
        return;
      }

      await resetPassword({ resetToken, newPassword: values.newPassword! }).unwrap();
      toast.success("Password updated", "Sign in with your new password.");
      navigate("/login", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  return (
    <>
      <PageMeta title="Forgot password" description="Recover access to your account" />
      <AuthShell
        title={COPY[step].title}
        subtitle={COPY[step].subtitle}
        footer={
          <Link
            to="/login"
            className="text-body-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            Back to sign in
          </Link>
        }
      >
        {error && <InlineAlert message={error} className="mb-5" />}
        <ForgotPasswordForm
          step={step}
          email={email}
          onSubmit={handleSubmit}
          isSubmitting={isRequesting || isVerifying || isResetting}
        />
      </AuthShell>
    </>
  );
}
