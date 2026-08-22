import { Tooltip } from "antd";
import { ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui";
import Can from "@/components/rbac/Can";

interface PermissionsButtonProps {
  /** The account whose extras are being edited -- not the profile id. */
  userId?: string | null;
}

/**
 * The way into the extra permissions granted to one account, on top of what its
 * role already allows. Shown on any row that has a login behind it.
 */
export default function PermissionsButton({ userId }: PermissionsButtonProps) {
  if (!userId) return null;

  return (
    <Can permission="user.update">
      <Tooltip title="Permissions">
        <Link to={`/users/${userId}/permissions`}>
          <Button
            variant="secondary"
            size="sm"
            aria-label="Permissions"
            className="rounded-[7px]"
            icon={<ShieldCheck />}
          />
        </Link>
      </Tooltip>
    </Can>
  );
}
