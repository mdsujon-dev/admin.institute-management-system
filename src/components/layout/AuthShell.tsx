import type { ReactNode } from "react";
import { Heading, Text } from "@/components/ui";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { env } from "@/config/env";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Rendered under the form, e.g. "Back to sign in". */
  footer?: ReactNode;
}

/**
 * The frame shared by sign in, password recovery and the forced password
 * change: brand panel on one side, form on the other, one theme toggle. On a
 * phone the panel drops away and the form takes the screen.
 */
export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white lg:flex-row dark:bg-gray-900">
      <div className="flex w-full flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <Heading level={1}>{title}</Heading>
            {subtitle && (
              <Text size="body-sm" tone="muted" className="mt-1.5">
                {subtitle}
              </Text>
            )}
          </div>

          {children}

          {footer && <div className="mt-6 text-center">{footer}</div>}
        </div>
      </div>

      <aside className="hidden w-full items-center justify-center bg-brand-900 lg:flex lg:w-1/2">
        <div className="max-w-sm px-8 text-center">
          <span className="mx-auto mb-6 flex size-14 items-center justify-center rounded-xl bg-white/10 text-h3 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-7">
              <path d="m12 3 9 5-9 5-9-5 9-5Z" strokeLinejoin="round" />
              <path d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" strokeLinecap="round" />
            </svg>
          </span>
          <Heading level={3} tone="inverse">
            {env.appName}
          </Heading>
          <Text size="body-sm" className="mt-3 text-white/70">
            Students, staff, roles and audit trails - managed from one place, with every
            action recorded.
          </Text>
        </div>
      </aside>

      <div className="fixed bottom-5 right-5 z-10">
        <ThemeToggle />
      </div>
    </div>
  );
}
