import { useCallback, useState } from "react";

/**
 * The three dialogs every resource screen needs: create, edit and delete. One
 * hook, so the open/close wiring is written once instead of once per feature.
 */
export function useCrudDialogs<T>() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);

  return {
    isCreateOpen,
    editing,
    deleting,
    openCreate: useCallback(() => setIsCreateOpen(true), []),
    closeCreate: useCallback(() => setIsCreateOpen(false), []),
    openEdit: useCallback((record: T) => setEditing(record), []),
    closeEdit: useCallback(() => setEditing(null), []),
    openDelete: useCallback((record: T) => setDeleting(record), []),
    closeDelete: useCallback(() => setDeleting(null), []),
  };
}
