import { PageHeader } from "@/components/ui";
import PageMeta from "@/components/common/PageMeta";
import UserList from "@/pages/users/UserList";

export default function UsersPage() {
  return (
    <>
      <PageMeta title="Users" description="Login accounts and their roles" />
      <PageHeader
        title="Users"
        description="Every account that can sign in, and the role that decides what it may do."
      />
      <UserList />
    </>
  );
}
