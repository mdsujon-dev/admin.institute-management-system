import { Link } from "react-router";
import { Button, PageHeader } from "@/components/ui";
import PageMeta from "@/components/common/PageMeta";
import PermissionSummary from "@/pages/profile/PermissionSummary";
import ProfileCard from "@/pages/profile/ProfileCard";

export default function ProfilePage() {
  return (
    <>
      <PageMeta title="My profile" description="Your account and permissions" />
      <PageHeader
        title="My profile"
        description="Your account, your role, and everything it allows."
        actions={
          <Link to="/change-password">
            <Button>Change password</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ProfileCard />
        <div className="xl:col-span-2">
          <PermissionSummary />
        </div>
      </div>
    </>
  );
}
