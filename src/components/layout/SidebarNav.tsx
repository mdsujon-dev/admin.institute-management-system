import { Menu } from "antd";
import type { MenuProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { NAV_SECTIONS, type NavItem } from "@/config/navigation";
import { usePermissions } from "@/hooks/usePermissions";

interface SidebarNavProps {
  /** Rail mode hides the labels; antd turns submenus into flyouts. */
  collapsed?: boolean;
  onNavigate?: () => void;
}

/** One antd menu entry, with the nulls antd allows stripped out. */
type MenuEntry = NonNullable<NonNullable<MenuProps["items"]>[number]>;

interface BuiltNav {
  items: MenuEntry[];
  /** Leaf key -> the path it opens. */
  pathByKey: Map<string, string>;
  /** Leaf key -> the parent submenu that has to open for it to be visible. */
  parentByKey: Map<string, string>;
}

/**
 * The navigation, filtered by what the signed in role may open.
 *
 * A parent is kept only while it still has a child the role can reach, and
 * sections with nothing left in them disappear -- so a teacher gets a short
 * menu rather than a long one full of locked doors.
 */
export default function SidebarNav({ collapsed, onNavigate }: SidebarNavProps) {
  const { can } = usePermissions();
  const location = useLocation();
  const navigate = useNavigate();

  const { items, pathByKey, parentByKey }: BuiltNav = useMemo(() => {
    const paths = new Map<string, string>();
    const parents = new Map<string, string>();

    const toMenuItem = (item: NavItem, parentKey?: string): MenuEntry[] => {
      if (item.children) {
        const children = item.children.flatMap((child) => toMenuItem(child, item.key));

        return children.length > 0
          ? [{ key: item.key, icon: item.icon, label: item.label, children }]
          : [];
      }

      if (!can(item.permission)) return [];

      if (item.path) {
        paths.set(item.key, item.path);
        if (parentKey) parents.set(item.key, parentKey);
      }

      return [{ key: item.key, icon: item.icon, label: item.label }];
    };

    const menuItems: MenuEntry[] = NAV_SECTIONS.flatMap((section) => {
      const entries = section.items.flatMap((item) => toMenuItem(item));

      if (entries.length === 0) return [];

      // A collapsed rail has no room for group headings.
      return section.title && !collapsed
        ? [
            {
              key: section.key,
              type: "group" as const,
              label: section.title,
              children: entries,
            },
          ]
        : entries;
    });

    return { items: menuItems, pathByKey: paths, parentByKey: parents };
  }, [can, collapsed]);

  // The deepest match wins, so /students stays lit on any /students/... route.
  const selectedKey =
    [...pathByKey.entries()]
      .filter(([, path]) =>
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path),
      )
      .sort(([, a], [, b]) => b.length - a.length)[0]?.[0] ?? "dashboard";

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // Opening a child's page opens the submenu it lives in, without closing
  // anything the operator opened by hand.
  useEffect(() => {
    const parent = parentByKey.get(selectedKey);

    if (parent) {
      setOpenKeys((current) => (current.includes(parent) ? current : [...current, parent]));
    }
  }, [parentByKey, selectedKey]);

  return (
    <Menu
      mode="inline"
      items={items}
      selectedKeys={[selectedKey]}
      openKeys={collapsed ? undefined : openKeys}
      onOpenChange={(keys) => setOpenKeys(keys as string[])}
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
