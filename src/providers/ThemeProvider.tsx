import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const STORAGE_KEY = "ims.theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch {
    /* Storage unavailable -- fall through to the system preference. */
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Owns the light/dark decision for both halves of the UI: it toggles the `dark`
 * class Tailwind reads, and `AntdProvider` picks its algorithm from the same
 * value, so the two can never disagree.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(readStoredTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* Not being able to remember the choice is not worth failing over. */
    }
  }, [theme]);

  const setTheme = useCallback((mode: ThemeMode) => setThemeState(mode), []);
  const toggleTheme = useCallback(
    () => setThemeState((current) => (current === "dark" ? "light" : "dark")),
    [],
  );

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }

  return context;
}
