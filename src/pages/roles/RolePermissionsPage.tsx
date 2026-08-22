import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Button, Card, ErrorState, InlineAlert, PageHeader } from "@/components/ui";
import PageMeta from "@/components/common/PageMeta";
import PermissionMatrix from "@/components/form/role/PermissionMatrix";
import { usePermissions } from "@/hooks/usePermissions";
import { useToast } from "@/hooks/useToast";
import { useGetRoleQuery, useUpdateRoleMutation } from "@/redux/features/roles/roles.api";
import { getErrorMessage } from "@/utils/apiError";

/**
 * What a role may do, on a screen of its own.
 *
 * The matrix is loaded from `GET /roles/:id`, which returns the permission rows
 * themselves, and saved with the same PATCH the rest of the role uses -- the API
 * replaces the whole set, so what is ticked here is exactly what the role ends
 * up with.
 */
export default function RolePermissionsPage() {
  const { roleId = "" } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { role: currentRole } = usePermissions();

  const { data: role, error, refetch } = useGetRoleQuery(roleId, { skip: !roleId });
  const [updateRole, { isLoading: isSaving }] = useUpdateRoleMutation();

  const [granted, setGranted] = useState<string[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (role) {
      setGranted(role.permissions.map((permission) => permission.code));
    }
  }, [role]);

  const handleSave = async () => {
    // Until the role has arrived, `granted` is still the empty initial state --
    // saving it would replace every permission the role has with nothing.
    if (!role) return;

    setSaveError(null);

    try {
      await updateRole({ id: roleId, body: { permissions: granted } }).unwrap();
      toast.success("Permissions updated", role?.name);
      navigate("/roles");
    } catch (requestError) {
      setSaveError(getErrorMessage(requestError));
    }
  };

  const isOwnRole = Boolean(role && currentRole === role.name);

  return (
    <>
      <PageMeta
        title={role ? `${role.name} permissions` : "Role permissions"}
        description="What this role is allowed to do"
      />

      <PageHeader
        title={role ? `${role.name} permissions` : "Role permissions"}
        description="Tick what this role may do. Every account with it follows immediately."
        actions={
          <>
            <Link to="/roles">
              <Button variant="secondary" icon={<ArrowLeft />}>
                Back to roles
              </Button>
            </Link>
            <Button loading={isSaving} disabled={!role} onClick={handleSave}>
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
          {isOwnRole && (
            <InlineAlert
              type="warning"
              className="mb-4"
              message="This is your own role"
              description="Removing a permission here takes effect immediately, including for you."
            />
          )}

          {saveError && <InlineAlert message={saveError} className="mb-4" />}

          <PermissionMatrix
            value={granted}
            onChange={setGranted}
            disabled={!role || isSaving}
          />
        </Card>
      )}
    </>
  );
}
