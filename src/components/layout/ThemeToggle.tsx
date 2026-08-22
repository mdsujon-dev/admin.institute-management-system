import { Moon, Sun } from "lucide-react";
import { Tooltip } from "antd";
import { Button } from "@/components/ui";
import { useTheme } from "@/providers/ThemeProvider";

/** Light and dark, in one button. Reads and writes the app-wide theme. */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Tooltip title={isDark ? "Switch to light" : "Switch to dark"}>
      <Button
        variant="secondary"
        shape="circle"
        aria-label="Toggle theme"
        icon={isDark ? <Sun /> : <Moon />}
        onClick={toggleTheme}
      />
    </Tooltip>
  );
}
