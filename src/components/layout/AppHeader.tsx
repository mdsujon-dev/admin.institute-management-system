import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui";
import FullscreenToggle from "./FullscreenToggle";
import HeaderClock from "./HeaderClock";
import NotificationMenu from "./NotificationMenu";
import ProfileMenu from "./ProfileMenu";
import ThemeToggle from "./ThemeToggle";
import { sidebarToggled, mobileNavToggled } from "@/redux/features/ui/uiSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

/** Menu control, theme switch, and who is signed in. Nothing decorative. */
export default function AppHeader() {
  const dispatch = useAppDispatch();
  const isCollapsed = useAppSelector((state) => state.ui.isSidebarCollapsed);

  // The height sits on the same box as the border, so the divider under the
  // header lands on exactly the same line as the one under the sidebar's brand
  // block -- with the border outside the measured box they were 1px apart,
  // which is enough to see.
  return (
    <header className="sticky top-0 z-30 h-[var(--layout-header-height)] border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {/* One button per breakpoint: the drawer on mobile, the rail on desktop. */}
          <Button
            variant="secondary"
            aria-label="Open menu"
            className="lg:hidden"
            icon={<Menu />}
            onClick={() => dispatch(mobileNavToggled())}
          />
          <Button
            variant="secondary"
            aria-label="Toggle sidebar"
            className="hidden lg:inline-flex"
            icon={isCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            onClick={() => dispatch(sidebarToggled())}
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <HeaderClock />
          <NotificationMenu />
          <FullscreenToggle />
          <ThemeToggle />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
