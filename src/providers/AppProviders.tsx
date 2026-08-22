import type { ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";
import AntdProvider from "./AntdProvider";
import StoreProvider from "./StoreProvider";
import { ThemeProvider } from "./ThemeProvider";

/**
 * Every provider the app needs, composed once and in the order they depend on
 * each other: the store first, then the theme, then Ant Design (which reads the
 * theme), then document metadata. `main.tsx` renders this and nothing else.
 */
export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <ThemeProvider>
        <AntdProvider>
          <HelmetProvider>{children}</HelmetProvider>
        </AntdProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}
