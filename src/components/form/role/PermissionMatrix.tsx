import { Checkbox } from "antd";
import { Button, Text } from "@/components/ui";
import {
  ACTION_LABELS,
  ALL_PERMISSIONS,
  PERMISSIONS_BY_SUBJECT,
  SUBJECT_LABELS,
  type PermissionAction,
} from "@/constants/permissions";

interface PermissionMatrixProps {
  /** Supplied by `Form.Item`, which is why both props are optional. */
  value?: string[];
  onChange?: (codes: string[]) => void;
  disabled?: boolean;
}

/**
 * Reads first, because everything else implies one. `readAll` is last and only
 * applies to the audit trail, where it turns "my own entries" into "everyone's".
 */
const ACTION_ORDER: PermissionAction[] = [
  "read",
  "create",
  "update",
  "delete",
  "readAll",
];
const ALL_CODES = ALL_PERMISSIONS.map((permission) => permission.code);

/**
 * The grid a role is actually built from: one row per subject, one checkbox per
 * action, reads first because everything else implies one.
 *
 * The catalogue comes from local constants rather than `GET /permissions`, which
 * itself needs a permission ADMIN does not hold. Codes are still validated
 * server side, so nothing here can grant something the API does not know about.
 */
export default function PermissionMatrix({
  value = [],
  onChange,
  disabled = false,
}: PermissionMatrixProps) {
  const granted = new Set(value);
  const allSelected = ALL_CODES.every((code) => granted.has(code));

  const emit = (next: Set<string>) => onChange?.([...next]);

  const toggle = (code: string) => {
    const next = new Set(granted);

    if (next.has(code)) {
      next.delete(code);
    } else {
      next.add(code);
    }

    emit(next);
  };

  const toggleSubject = (codes: string[], allOn: boolean) => {
    const next = new Set(granted);
    codes.forEach((code) => (allOn ? next.delete(code) : next.add(code)));
    emit(next);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
        <Text size="body-sm" weight="medium">
          {granted.size} of {ALL_CODES.length} granted
        </Text>
        <Button
          variant="link"
          size="sm"
          disabled={disabled}
          onClick={() => onChange?.(allSelected ? [] : ALL_CODES)}
        >
          {allSelected ? "Clear all" : "Select all"}
        </Button>
      </div>

      <div className="max-h-72 overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10 [&_th]:bg-white dark:[&_th]:bg-gray-900">
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="px-4 py-2 text-left text-caption font-medium uppercase tracking-wide text-gray-500">
                Area
              </th>
              {ACTION_ORDER.map((action) => (
                <th
                  key={action}
                  className="px-2 py-2 text-center text-caption font-medium uppercase tracking-wide text-gray-500"
                >
                  {ACTION_LABELS[action]}
                </th>
              ))}
              <th className="px-4 py-2 text-right text-caption font-medium uppercase tracking-wide text-gray-500">
                All
              </th>
            </tr>
          </thead>

          <tbody>
            {PERMISSIONS_BY_SUBJECT.map(({ subject, permissions }) => {
              const codes = permissions.map((permission) => permission.code);
              const allOn = codes.every((code) => granted.has(code));

              return (
                <tr
                  key={subject}
                  className="border-b border-gray-100 last:border-0 dark:border-gray-800/70"
                >
                  <td className="px-4 py-2.5 text-body-sm font-medium text-gray-700 dark:text-gray-300">
                    {SUBJECT_LABELS[subject]}
                  </td>

                  {ACTION_ORDER.map((action) => {
                    const permission = permissions.find((entry) => entry.action === action);

                    return (
                      <td key={action} className="px-2 py-2.5 text-center">
                        {permission ? (
                          <Checkbox
                            disabled={disabled}
                            checked={granted.has(permission.code)}
                            onChange={() => toggle(permission.code)}
                            aria-label={`${ACTION_LABELS[action]} ${SUBJECT_LABELS[subject]}`}
                          />
                        ) : (
                          <span className="text-gray-300 dark:text-gray-700">&ndash;</span>
                        )}
                      </td>
                    );
                  })}

                  <td className="px-4 py-2.5 text-right">
                    <Button
                      variant="link"
                      size="sm"
                      disabled={disabled}
                      onClick={() => toggleSubject(codes, allOn)}
                    >
                      {allOn ? "None" : "All"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
