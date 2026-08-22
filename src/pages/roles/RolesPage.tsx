import { PageHeader } from "@/components/ui";
import PageMeta from "@/components/common/PageMeta";
import RoleList from "@/pages/roles/RoleList";

/**
 * A page is deliberately thin: metadata, a title, and the feature component.
 * Everything that could be reused lives in `components/`, not here.
 */
export default function RolesPage() {
  return (
    <>
      <PageMeta title="Roles" description="Roles and the permissions they carry" />
      <PageHeader
        title="Roles"
        description="Bundles of permissions. Change what a role may do and every account with it follows immediately."
      />
      <RoleList />
    </>
  );
}
