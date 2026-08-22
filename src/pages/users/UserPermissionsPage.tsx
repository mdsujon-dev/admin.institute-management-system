import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Button, Card, ErrorState, InlineAlert, PageHeader, Text } from "@/components/ui";
import PageMeta from "@/components/common/PageMeta";
import PermissionMatrix from "@/components/form/role/PermissionMatrix";
import { useToast } from "@/hooks/useToast";
import {
  useGetUserQuery,
  useSetUserPermissionsMutation,
} from "@/redux/features/users/users.api";
import { getErrorMessage } from "@/utils/apiError";
import { humanise } from "@/utils/format";

/**
 * Extra permissions for one account, on top of whatever its role already gives.
 *
 * The role's own grants are shown ticked and locked: they are not this screen's
 * to change, and letting somebody untick one here would quietly disagree with
 * what the role says. Everything else can be granted to this person alone.
 */
export default function UserPermissionsPage() {
  const { userId = "" } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: user, error, refetch } = useGetUserQuery(userId, { skip: !userId });
  const [setPermissions, { isLoading: isSaving }] = useSetUserPermissionsMutation();

  const [extras, setExtras] = useState<string[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setExtras(user.extraPermissions);
    }
  }, [user]);

  const handleSave = async () => {
    // Until the account has arrived, `extras` is still the empty initial state
    // and saving it would wipe whatever was granted before.
    if (!user) return;

    setSaveError(null);

    try {
      await setPermissions({ id: userId, permissions: extras }).unwrap();
      toast.success("Permissions updated", user.email);
      navigate(backPath);
    } catch (requestError) {
      setSaveError(getErrorMessage(requestError));
    }
  };

  const fromRole = user?.rolePermissions ?? [];

  /**
   * Back goes to the list the account belongs to. An account is always an
   * employee or a student, so there is no third place it could have come from.
   */
  const backPath = user?.student ? "/students" : "/employees";
  const backLabel = user?.student ? "Back to students" : "Back to employees";

  /** The person, when the account has a profile; the email is the fallback. */
  const accountName = user
    ? [user.employee ?? user.student]
        .filter(Boolean)
        .map((profile) => `${profile!.firstName} ${profile!.lastName}`)[0] ?? user.email
    : "";

  return (
    <>
      <PageMeta
        title={user ? `${accountName} permissions` : "Account permissions"}
        description="Extra permissions granted to one account"
      />

      <PageHeader
        title={user ? accountName : "Account permissions"}
        description={
          user
            ? `${user.email} — extra permissions on top of what the ${humanise(user.role.name)} role already allows.`
            : "Extra permissions for this account, on top of what its role already allows."
        }
        actions={
          <>
            <Link to={backPath}>
              <Button variant="secondary" icon={<ArrowLeft />}>
                {backLabel}
              </Button>
            </Link>
            <Button loading={isSaving} disabled={!user} onClick={handleSave}>
              Save permissions
            </Button>
          </>
        }
      />

      {error ? (
        <Card>
          <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
        </Card>
      ) : (
        <Card>
          <InlineAlert
            type="info"
            className="mb-4"
            message={
              user
                ? `${fromRole.length} permission(s) come from the ${humanise(user.role.name)} role`
                : "Loading the account"
            }
            description="Those are ticked and locked here. Anything else you tick is granted to this account alone."
          />

          {saveError && <InlineAlert message={saveError} className="mb-4" />}

          <PermissionMatrix
            value={[...new Set([...fromRole, ...extras])]}
            lockedValue={fromRole}
            disabled={!user || isSaving}
            onChange={(next) =>
              setExtras(next.filter((code) => !fromRole.includes(code)))
            }
          />

          <Text size="caption" tone="subtle" className="mt-3">
            Granted to this account alone: {extras.length}
          </Text>
        </Card>
      )}
    </>
  );
}
