import Can from "@/components/rbac/Can";
import AccountsByRoleChart from "./AccountsByRoleChart";
import ActivityTrendChart from "./ActivityTrendChart";
import RecentActivityCard from "@/components/card/RecentActivityCard";
import SignInSplitChart from "./SignInSplitChart";
import StaffByDesignationChart from "./StaffByDesignationChart";
import StatGrid from "./StatGrid";
import StudentList from "@/pages/students/StudentList";

/**
 * The dashboard, assembled from parts that each stand on their own: the metric
 * row, four charts, the audit feed, and the students list embedded straight
 * from its own screen rather than reimplemented here.
 *
 * Every panel is gated on the permission behind its data, so a role that cannot
 * read logs simply gets a shorter dashboard instead of a wall of failures.
 */
export default function DashboardOverview() {
  return (
    <div className="space-y-4">
      <StatGrid />

      <Can permission="log.read">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ActivityTrendChart />
          </div>
          <SignInSplitChart />
        </div>
      </Can>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Can permission="designation.read">
          <StaffByDesignationChart />
        </Can>
        <Can permission="role.read">
          <AccountsByRoleChart />
        </Can>
      </div>

      <Can permission="log.read">
        <RecentActivityCard />
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
