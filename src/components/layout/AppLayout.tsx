import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { useAppSelector } from "@/redux/hooks";
import { cn } from "@/utils/cn";

/**
 * The signed in shell: sidebar, header, and the page itself. The main column is
 * pushed by the rail on desktop and takes the full width everywhere else.
 */
export default function AppLayout() {
  const isCollapsed = useAppSelector((state) => state.ui.isSidebarCollapsed);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AppSidebar />

      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-200",
          isCollapsed ? "lg:pl-20" : "lg:pl-64",
        )}
      >
        <AppHeader />

        <main className="mx-auto w-full max-w-[1600px] flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
