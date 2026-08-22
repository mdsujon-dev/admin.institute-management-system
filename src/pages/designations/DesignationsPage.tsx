import { PageHeader } from "@/components/ui";
import PageMeta from "@/components/common/PageMeta";
import DesignationList from "@/pages/designations/DesignationList";

export default function DesignationsPage() {
  return (
    <>
      <PageMeta title="Designations" description="Staff designations and departments" />
      <PageHeader
        title="Designations"
        description="Job titles staff can be assigned to, grouped by department."
      />
      <DesignationList />
    </>
  );
}
