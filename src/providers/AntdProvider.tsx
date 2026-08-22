import { StyleProvider } from "@ant-design/cssinjs";
import { App as AntApp, ConfigProvider, theme as antdTheme } from "antd";
import type { ReactNode } from "react";
import { useTheme } from "./ThemeProvider";

/**
 * Ant Design reads the same design decisions the stylesheet does: one primary
 * colour, one radius scale, one type size. Anything that would otherwise arrive
 * as a component default -- elevation in particular -- is set here rather than
 * being fought with CSS afterwards.
 *
 * Elevation is switched off (`boxShadow*: none`): surfaces are separated by a
 * border, never by a shadow or a gradient. Focus rings are a different token and
 * deliberately stay, because they are how a keyboard user sees where they are.
 */
/** One radius for every control, applied to each component that draws one. */
const CONTROL_RADIUS = {
  borderRadius: 9,
  borderRadiusLG: 9,
  borderRadiusSM: 9,
} as const;

export default function AntdProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <StyleProvider layer>
      <ConfigProvider
        theme={{
          algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: "#0e7490",
            colorInfo: "#0e7490",
            colorSuccess: "#12b76a",
            colorWarning: "#f79009",
            colorError: "#f04438",
            colorLink: "#0e7490",

            fontFamily:
              'Outfit, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
            fontSize: 14,

            // Matches --radius-* in styles/theme.css.
            borderRadiusXS: 4,
            borderRadiusSM: 6,
            borderRadius: 8,
            borderRadiusLG: 12,

            controlHeightSM: 32,
            controlHeight: 40,
            controlHeightLG: 48,

            boxShadow: "none",
            boxShadowSecondary: "none",
            boxShadowTertiary: "none",

            colorBgLayout: isDark ? "#0c111d" : "#f9fafb",
            colorBorder: isDark ? "#1d2939" : "#e4e7ec",
            colorBorderSecondary: isDark ? "#1d2939" : "#f2f4f7",
          },
          components: {
            // Controls are 7px on every size, so an input and the button beside it
            // are never a pixel apart. Containers keep the larger radii above.
            Button: {
              fontWeight: 500,
              primaryShadow: "none",
              defaultShadow: "none",
              ...CONTROL_RADIUS,
            },
            Input: CONTROL_RADIUS,
            InputNumber: CONTROL_RADIUS,
            Select: CONTROL_RADIUS,
            DatePicker: CONTROL_RADIUS,
            Table: {
              headerBg: isDark ? "#101828" : "#f9fafb",
              headerColor: isDark ? "#98a2b3" : "#667085",
              rowHoverBg: isDark ? "#101828" : "#f9fafb",
              borderColor: isDark ? "#1d2939" : "#e4e7ec",
            },
            Modal: { titleFontSize: 18 },
            // A menu row is 38px: two pixels tighter than the default control
          // height, which fits one more item on a short laptop screen. The
          // label sits 15px from its icon and one step above body size, which
          // is what stops the row reading as one blob at a glance.
          Menu: {
            itemBorderRadius: 8,
            itemMarginInline: 0,
            itemHeight: 38,
            itemPaddingInline: 12,
            iconMarginInlineEnd: 15,
            fontSize: 15,
            subMenuItemBg: "transparent",
          },
            Card: { paddingLG: 20 },
          },
        }}
      >
          {/* Gives every component access to message/modal/notification through
              `App.useApp()`, instead of the static calls that miss the theme. */}
          <AntApp>{children}</AntApp>
      </ConfigProvider>
    </StyleProvider>
  );
}
