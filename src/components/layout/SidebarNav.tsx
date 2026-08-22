import { Menu } from "antd";
import type { MenuProps } from "antd";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { NAV_SECTIONS } from "@/config/navigation";
import { usePermissions } from "@/hooks/usePermissions";

interface SidebarNavProps {
  /** Rail mode hides the labels and shows icons only. */
  collapsed?: boolean;
  onNavigate?: () => void;
}

/**
 * The navigation itself, filtered by what the signed in role may open. Sections
 * with nothing left in them disappear, so a teacher gets a short menu rather
 * than a long one full of locked doors.
 */
export default function SidebarNav({ collapsed, onNavigate }: SidebarNavProps) {
  const { can } = usePermissions();
  const location = useLocation();
  const navigate = useNavigate();

  const { items, pathByKey } = useMemo(() => {
    const paths = new Map<string, string>();

    const menuItems: MenuProps["items"] = NAV_SECTIONS.flatMap((section) => {
      const allowed = section.items.filter((item) => can(item.permission));

      if (allowed.length === 0) return [];

      allowed.forEach((item) => paths.set(item.key, item.path));

      const children: MenuProps["items"] = allowed.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: item.label,
      }));

      // A collapsed rail has no room for group headings, so the items go flat.
      return section.title && !collapsed
        ? [{ key: section.key, type: "group" as const, label: section.title, children }]
        : children;
    });

    return { items: menuItems, pathByKey: paths };
  }, [can, collapsed]);

  // The deepest match wins, so /students stays lit on any /students/... route.
  const selectedKey =
    [...pathByKey.entries()]
      .filter(([, path]) =>
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path),
      )
      .sort(([, a], [, b]) => b.length - a.length)[0]?.[0] ?? "dashboard";

  return (
    <Menu
      mode="inline"
      items={items}
      selectedKeys={[selectedKey]}
      inlineCollapsed={collapsed}
      className="border-0 bg-transparent"
      onClick={({ key }) => {
        const path = pathByKey.get(key);

        if (path) {
          navigate(path);
          onNavigate?.();
        }
      }}
    />
  );
}
