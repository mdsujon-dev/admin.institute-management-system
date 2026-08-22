# Institute Management System — Admin

React admin console for the Institute Management System API. Ant Design for the
components, Tailwind for layout, Redux Toolkit / RTK Query for data, and a
permission layer that mirrors the backend guards.

## Running it

```bash
npm install
cp .env.example .env      # point VITE_API_URL at the backend
npm run dev
```

| variable | meaning |
|---|---|
| `VITE_API_URL` | versioned API root, e.g. `http://localhost:3000/api/v1` |
| `VITE_APP_NAME` | shown in the sidebar, the auth screens and the tab title |

The backend must allow this origin (`CORS_ORIGIN`) and run with credentials
enabled — the refresh token arrives as an httpOnly cookie.

```bash
npm run build   # tsc -b && vite build
npm run lint
```

## Folder structure

```
src/
  app entry            App.tsx, main.tsx
  providers/           store, theme, antd config -- composed in AppProviders
  redux/
    api/               baseApi (cache, tags) + baseQuery (auth + silent refresh)
    features/<domain>/  <domain>.api.ts, and the slice where there is one
    store.ts, hooks.ts
  routes/              AppRoutes + guards (SessionGate, Protected, PublicOnly)
  pages/<domain>/      the screen and the parts only that screen uses:
                       <Domain>Page.tsx   title + the list
                       <Domain>List.tsx   query, filters, table, dialogs
                       auth/ and common/ hold the sign in and error screens
  components/
    ui/                the design system -- Button, Input, DataTable, Modal, ...
    form/<domain>/     the fields of one form, no dialog around them
    modal/<domain>/    the dialog + its mutation, wrapping a form
    card/              cards used by more than one screen (StatCard, ...)
    chart/             Chart (ApexCharts + the app theme) and ChartCard
    layout/            sidebar, header, profile menu, theme toggle, AuthShell
    rbac/              <Can>
    common/            PageMeta, ScrollToTop, MessagePage
  hooks/               every hook in the app, one per file -- useListQuery,
                       useCrudDialogs, usePermissions, useToast, useRoleOptions,
                       use<Domain>Columns, ...
  utils/               cn, debounce, format, apiError, payload
  constants/           permission catalogue, select options
  styles/theme.css     every design token
```

Things are grouped by what they are, not by which screen happens to use them:
every form is under `components/form/`, every dialog under `components/modal/`,
every hook in `hooks/`. There is exactly one place to look for any of them, and
no folder name repeats itself down the tree.

### Design system

Screens import from `@/components/ui`, never from `antd` directly. That is what
keeps sizes, radii and intents identical everywhere, and what makes a change to
a control a one file change.

- **Type scale** — `Heading` (levels 1–6) and `Text` (`body-lg`, `body`,
  `body-sm`, `caption`). Sizes come from `--text-*` in `styles/theme.css`;
  changing one there changes every screen. Nothing sets a font size directly.
- **Controls** — one `sm | md | lg` scale across Button, Input, Select, TextArea
  and DataTable. Controls are 7px; containers use the `rounded-md/lg/xl` steps.
- **Flat by rule** — no shadows and no gradients. Elevation is switched off
  through antd's own tokens; surfaces are separated by a border. Focus rings are
  a different token and stay, because they are how a keyboard user navigates.
- **Colour** — `--color-brand-*`. Change `brand-500` and both Tailwind and antd
  follow, because `AntdProvider` is handed the same value.
- **Charts** — ApexCharts, wrapped in `components/chart/Chart.tsx`. A screen
  passes a type and a series; the font, the brand ramp, the flat fills and the
  grid come from `hooks/useChartTheme.ts`, so restyling every chart is one edit.
  Each dashboard chart is built from data the API already returns — there is no
  reporting endpoint, and nothing on a chart is estimated.

Ant Design's styles are wrapped in a CSS layer (`<StyleProvider layer>` plus the
`@layer` order in `index.css`), so a Tailwind utility on an antd component
actually wins. Without it, `className="lg:hidden"` on a Button silently does
nothing.

### Sessions and the silent refresh

The access token lives in `localStorage`; the refresh token is an httpOnly
cookie the browser sends on its own. The exchange lives in
`redux/api/baseQuery.ts` as `baseQueryWithReauth` — not in `baseApi.ts`, which
only says which query to use:

1. A request comes back `401`.
2. `baseQueryWithReauth` calls `POST /auth/refresh` once — a module level
   promise makes concurrent 401s share a single refresh instead of racing the
   cookie rotation.
3. The new access token is stored and the original request is replayed.
4. If the refresh fails, the session ends. Only a `401`/`403` does that: a `429`,
   a `500` or an unreachable API leaves the token alone so a reload recovers.

`SessionGate` restores the session on start-up, and `needsPasswordChange` pins an
admin-created account on `/change-password` until it sets its own password.

### Access model

Three things decide what somebody can do, and they are read in this order:

1. **Designation → role.** A designation carries the role its holders sign in
   with, so adding an employee is one decision, not two: pick the designation
   and the login gets the right role. `Designation.roleId` is where that lives.
2. **Role → permissions.** The role is the baseline for everybody who holds it,
   edited on `/roles/:id/permissions`.
3. **Account → extra permissions.** One person can be granted more than their
   role gives, on `/users/:id/permissions`. Extras are additive only -- they can
   widen what somebody may do, never narrow it, so "what does this role allow"
   keeps a single answer.

Roles and designations both have a **status**. Switching one off leaves the
people who already hold it alone, but stops it being handed to anybody new --
the API refuses it, so it is not merely hidden in the UI.

Audit logs are scoped to the viewer: `log.read` shows an operator their own
trail, and `log.readAll` widens it to everybody's.

### Permissions

`usePermissions()` is the only place the frontend decides what may be done, and
it mirrors `PermissionsGuard` on the backend exactly:

```tsx
<Can permission="student.create">
  <Button onClick={open}>Admit student</Button>
</Can>
```

- **SUPER_ADMIN passes every check** without holding a single permission row.
- The sidebar hides any screen whose permission is missing, and
  `ProtectedRoute` sends a direct URL for one to `/forbidden`.
- Hiding a control is a courtesy. The API is what enforces access.

### Adding a screen

1. Add the endpoints in `redux/features/<domain>/<domain>.api.ts`.
2. Add the pieces where their kind lives: `components/form/<domain>/<Domain>Form.tsx`
   for the fields, `components/modal/<domain>/<Domain>FormModal.tsx` for the
   dialog and its mutation, and `hooks/use<Domain>Columns.tsx` for the columns.
3. Add `pages/<domain>/<Domain>List.tsx` (from `useListQuery` + `DataTable` +
   `FilterBar`) and `pages/<domain>/<Domain>Page.tsx` beside it.
4. Register it in `config/navigation.tsx` and `routes/AppRoutes.tsx`, both naming
   the permission the API route requires.

A list component takes `embedded`, so the same one that fills a screen also
drops into the dashboard as a short panel.
