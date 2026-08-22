import { KeyRound, LogOut, User } from "lucide-react";
import { Dropdown } from "antd";
import { useNavigate } from "react-router";
import { InitialsAvatar, Text } from "@/components/ui";
import { useLogout } from "@/hooks/useLogout";
import { usePermissions } from "@/hooks/usePermissions";

/** Who is signed in, and the three things you can do about it. */
export default function ProfileMenu() {
  const { user } = usePermissions();
  const navigate = useNavigate();
  const { logout } = useLogout();

  if (!user) return null;

  return (
    <Dropdown
      trigger={["click"]}
      menu={{
        items: [
          { key: "profile", icon: <User />, label: "My profile" },
          { key: "password", icon: <KeyRound />, label: "Change password" },
          { type: "divider" },
          { key: "logout", icon: <LogOut />, label: "Sign out", danger: true },
        ],
        onClick: ({ key }) => {
          if (key === "profile") navigate("/profile");
          if (key === "password") navigate("/change-password");
          if (key === "logout") void logout();
        },
      }}
    >
      <button type="button" className="flex items-center gap-2 rounded-lg px-1 py-1">
        <InitialsAvatar name={user.email} />
        <span className="hidden min-w-0 max-w-44 text-left sm:block">
          <Text size="body-sm" weight="medium" truncate>
            {user.email.split("@")[0]}
          </Text>
          <Text size="caption" tone="subtle" truncate>
            {user.email}
          </Text>
        </span>
      </button>
    </Dropdown>
  );
}
