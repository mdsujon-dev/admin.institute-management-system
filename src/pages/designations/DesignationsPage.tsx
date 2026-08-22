import { PageHeader } from "@/components/ui";
import PageMeta from "@/components/common/PageMeta";
import DesignationList from "@/pages/designations/DesignationList";

export default function DesignationsPage() {
  return (
    <>
      <PageMeta title="Designations" description="Job titles and the access each one carries" />
      <PageHeader
        title="Designations"
        description="Job titles staff can be assigned to. Each one decides the role its holders sign in with."
      />
      <DesignationList />
    </>
  );
}
