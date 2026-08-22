import { DownOutlined, KeyOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { useNavigate } from "react-router";
import { InitialsAvatar, Text } from "@/components/ui";
import { useLogout } from "@/hooks/useLogout";
import { usePermissions } from "@/hooks/usePermissions";
import { humanise } from "@/utils/format";

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
          { key: "profile", icon: <UserOutlined />, label: "My profile" },
          { key: "password", icon: <KeyOutlined />, label: "Change password" },
          { type: "divider" },
          { key: "logout", icon: <LogoutOutlined />, label: "Sign out", danger: true },
        ],
        onClick: ({ key }) => {
          if (key === "profile") navigate("/profile");
          if (key === "password") navigate("/change-password");
          if (key === "logout") void logout();
        },
      }}
    >
      <button type="button" className="flex items-center gap-2 rounded-lg px-1 py-1">
        <InitialsAvatar name={user.email} size="sm" />
        <span className="hidden min-w-0 text-left sm:block">
          <Text size="body-sm" weight="medium" truncate>
            {user.email.split("@")[0]}
          </Text>
          <Text size="caption" tone="subtle">
            {humanise(user.role.name)}
          </Text>
        </span>
        <DownOutlined className="text-caption text-gray-400" />
      </button>
    </Dropdown>
  );
}
