/**
 * Every environment dependent value the app reads, in one place.
 *
 * `VITE_API_URL` must point at the versioned API root, e.g.
 * `http://localhost:3000/api/v1`. Create `.env.local` to override it.
 */
const rawApiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

export const env = {
  /** Versioned API root, never with a trailing slash. */
  apiUrl: rawApiUrl.replace(/\/+$/, ""),
  appName: import.meta.env.VITE_APP_NAME ?? "Institute Management System",
} as const;
