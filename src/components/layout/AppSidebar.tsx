import { Drawer } from "antd";
import BrandMark from "./BrandMark";
import SidebarFooter from "./SidebarFooter";
import SidebarNav from "./SidebarNav";
import { mobileNavSet } from "@/redux/features/ui/uiSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { cn } from "@/utils/cn";

/**
 * Two presentations of one menu: a fixed rail on desktop that collapses to
 * icons, and a drawer on mobile. Both are a three part column -- brand, the menu
 * that scrolls, and a pinned sign out -- and both render the same `SidebarNav`,
 * so the navigation is defined once.
 *
 * The scrolling middle uses `no-scrollbar`: a scrollbar track sitting against
 * the divider is visual noise, and the menu is short enough to scroll by wheel
 * or touch.
 */
export default function AppSidebar() {
  const dispatch = useAppDispatch();
  const isCollapsed = useAppSelector((state) => state.ui.isSidebarCollapsed);
  const isMobileOpen = useAppSelector((state) => state.ui.isMobileNavOpen);

  const closeDrawer = () => dispatch(mobileNavSet(false));

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden shrink-0 flex-col border-r border-gray-200 bg-white transition-[width] duration-200 lg:flex dark:border-gray-800 dark:bg-gray-900",
          isCollapsed ? "w-20" : "w-64",
        )}
      >
        {/* Same height as AppHeader, so the two divider lines meet. */}
        <div className="flex h-[var(--layout-header-height)] shrink-0 items-center border-b border-gray-200 px-4 dark:border-gray-800">
          <BrandMark collapsed={isCollapsed} />
        </div>

        {/* A collapsed rail hands the full width to antd, which centres its own
            80px menu in it; any padding here would push the icons off centre. */}
        <div
          className={cn(
            "no-scrollbar flex-1 overflow-y-auto py-3",
            isCollapsed ? "px-0" : "px-2",
          )}
        >
          <SidebarNav collapsed={isCollapsed} />
        </div>

        <SidebarFooter collapsed={isCollapsed} />
      </aside>

      <Drawer
        placement="left"
        width={264}
        open={isMobileOpen}
        onClose={closeDrawer}
        title={<BrandMark />}
        styles={{ body: { padding: 0, display: "flex", flexDirection: "column" } }}
      >
        <div className="no-scrollbar flex-1 overflow-y-auto px-2 py-3">
          <SidebarNav onNavigate={closeDrawer} />
        </div>

        <SidebarFooter onDone={closeDrawer} />
      </Drawer>
    </>
  );
}
