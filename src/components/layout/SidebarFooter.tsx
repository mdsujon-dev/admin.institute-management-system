import { LogoutOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { Button } from "@/components/ui";
import { useLogout } from "@/hooks/useLogout";

interface SidebarFooterProps {
  /** Rail mode: the icon alone, with the label moved into a tooltip. */
  collapsed?: boolean;
  onDone?: () => void;
}

/**
 * Pinned to the bottom of the sidebar, outside the scrolling area, so signing
 * out is always one click away no matter how long the menu gets.
 */
export default function SidebarFooter({ collapsed, onDone }: SidebarFooterProps) {
  const { logout, isLoggingOut } = useLogout();

  const handleClick = async () => {
    await logout();
    onDone?.();
  };

  return (
    <div className="shrink-0 border-t border-gray-200 px-3 py-2 dark:border-gray-800">
      <Tooltip title={collapsed ? "Sign out" : undefined} placement="right">
        <Button
          block
          variant="danger-outline"
          loading={isLoggingOut}
          icon={<LogoutOutlined />}
          onClick={handleClick}
          className={collapsed ? "justify-center" : "justify-start"}
        >
          {collapsed ? null : "Sign out"}
        </Button>
      </Tooltip>
    </div>
  );
}
