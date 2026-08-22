import { Tag } from "antd";
import { Card, InitialsAvatar, InlineAlert, StatusTag, Text } from "@/components/ui";
import { usePermissions } from "@/hooks/usePermissions";
import { humanise } from "@/utils/format";

/** The identity half of the profile screen. */
export default function ProfileCard() {
  const { user, isSuperAdmin } = usePermissions();

  if (!user) return null;

  return (
    <Card>
      <div className="flex items-center gap-4">
        <InitialsAvatar name={user.email} className="size-14 text-body-lg" />
        <div className="min-w-0">
          <Text weight="medium" truncate>
            {user.email}
          </Text>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <Tag bordered={false} color={isSuperAdmin ? "cyan" : "default"} className="m-0">
              {humanise(user.role.name)}
            </Tag>
            <StatusTag status={user.status} />
          </div>
        </div>
      </div>

      {isSuperAdmin && (
        <InlineAlert
          type="info"
          className="mt-5"
          message="System owner account"
          description="It passes every permission check without holding a single permission, so nothing can lock it out."
        />
      )}

      {user.needsPasswordChange && (
        <InlineAlert
          type="warning"
          className="mt-3"
          message="Still using the password this account was created with."
        />
      )}
    </Card>
  );
}
