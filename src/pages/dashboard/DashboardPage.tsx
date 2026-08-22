import { Tag } from "antd";
import { PageHeader } from "@/components/ui";
import PageMeta from "@/components/common/PageMeta";
import DashboardOverview from "@/pages/dashboard/DashboardOverview";
import { usePermissions } from "@/hooks/usePermissions";
import { humanise } from "@/utils/format";

export default function DashboardPage() {
  const { user, isSuperAdmin } = usePermissions();

  return (
    <>
      <PageMeta title="Dashboard" description="Institute Management System overview" />
      <PageHeader
        title={`Welcome back, ${user?.email.split("@")[0] ?? "there"}`}
        description="A snapshot of the institute, limited to what your role can see."
        actions={
          <Tag bordered={false} color={isSuperAdmin ? "cyan" : "default"}>
            {humanise(user?.role.name ?? "")}
          </Tag>
        }
      />
      <DashboardOverview />
    </>
  );
}
