import { useMemo } from "react";
import { useLocation } from "react-router";
import { NAV_SECTIONS, type NavItem } from "@/config/navigation";

export interface Crumb {
  label: string;
  /** Absent for the current page and for parents that only expand a submenu. */
  path?: string;
}

/**
 * The trail to the current screen, read from the same menu the sidebar renders:
 * `Dashboard / Employee management / Designations`.
 *
 * Deriving it from the nav means a new screen gets its breadcrumb by being added
 * to the menu, with nothing to keep in sync by hand.
 */
export function useBreadcrumb(fallbackLabel?: string): Crumb[] {
  const { pathname } = useLocation();

  return useMemo(() => {
    if (pathname === "/") {
      return [{ label: "Dashboard" }];
    }

    const trail: Crumb[] = [{ label: "Dashboard", path: "/" }];

    const find = (items: NavItem[], parents: NavItem[]): NavItem[] | null => {
      for (const item of items) {
        if (item.children) {
          const found = find(item.children, [...parents, item]);
          if (found) return found;
          continue;
        }

        if (item.path && item.path !== "/" && pathname.startsWith(item.path)) {
          return [...parents, item];
        }
      }

      return null;
    };

    const match = NAV_SECTIONS.flatMap((section) =>
      find(section.items, []) ? [find(section.items, [])!] : [],
    )[0];

    if (!match) {
      // A screen that is not in the menu -- the profile editor, an error page.
      return fallbackLabel ? [...trail, { label: fallbackLabel }] : trail;
    }

    // A parent only expands a submenu, so it is shown but not linked.
    match.forEach((item, index) => {
      const isLast = index === match.length - 1;
      trail.push({ label: item.label, path: isLast ? undefined : item.path });
    });

    return trail;
  }, [pathname, fallbackLabel]);
}
