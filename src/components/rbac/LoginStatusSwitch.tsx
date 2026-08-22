import { StatusSwitch, StatusTag } from "@/components/ui";
import Can from "@/components/rbac/Can";
import type { UserStatus } from "@/types/models";

interface LoginStatusSwitchProps {
  /** The account's status, or undefined when the row has no login at all. */
  status?: UserStatus;
  loading?: boolean;
  /** True when this row is the signed in account, which may not disable itself. */
  isSelf?: boolean;
  onChange: (next: boolean) => void;
  /** What somebody needs before the switch is theirs to flip. */
  permission?: string;
}

/**
 * Whether one account can sign in, changed from the row you are looking at.
 *
 * Employees and students both have a login, and both tables show it this way --
 * there is no separate users screen to go to for it.
 *
 * A blocked account is not the other half of "active", it is a deliberate third
 * state, so it is shown rather than offered as a toggle: turning a switch on
 * should never be how somebody gets un-blocked by accident.
 */
export default function LoginStatusSwitch({
  status,
  loading,
  isSelf,
  onChange,
  permission = "user.update",
}: LoginStatusSwitchProps) {
  if (!status) {
    return <span className="text-gray-400">&mdash;</span>;
  }

  if (status === "BLOCKED") {
    return <StatusTag status={status} />;
  }

  return (
    <Can permission={permission} fallback={<StatusTag status={status} />}>
      <StatusSwitch
        checked={status === "ACTIVE"}
        loading={loading}
        disabled={isSelf}
        disabledReason={isSelf ? "You cannot disable your own account" : undefined}
        checkedLabel="Yes"
        uncheckedLabel="No"
        onChange={onChange}
      />
    </Can>
  );
}
