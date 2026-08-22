import Can from "@/components/rbac/Can";
import RecentActivityCard from "@/components/card/RecentActivityCard";
import LogSummaryCard from "@/components/card/LogSummaryCard";
import StatGrid from "./StatGrid";
import StudentList from "@/pages/students/StudentList";

/**
 * The dashboard, assembled from parts that each stand on their own: the metric
 * row, the audit panels, and the students list embedded straight from its own
 * feature rather than reimplemented here.
 */
export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <StatGrid />

      <Can permission="log.read">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RecentActivityCard />
          </div>
          <LogSummaryCard />
        </div>
      </Can>

      <Can permission="student.read">
        <StudentList
          embedded
          limit={5}
          title="Newest students"
          description="The five most recent admissions"
        />
      </Can>
    </div>
  );
}
