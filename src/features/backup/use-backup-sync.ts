import { useEffect, useRef } from "react";

import { useCareStore } from "@/features/pets/hooks/use-care-store";

import { toBackupPayload } from "./backup-mapping";
import { pushBackup } from "./backup.functions";

/**
 * Pushes the local care database to the account backup after each change,
 * debounced so rapid typing produces a single upload. No-op when backup is off.
 */
export function useBackupSync(enabled: boolean): void {
  const { db, ready } = useCareStore();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!enabled || !ready) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void pushBackup({ data: toBackupPayload(db) }).catch(() => {
        // Offline or transient failure: the next change retries.
      });
    }, 2500);
    return () => clearTimeout(timer.current);
  }, [db, ready, enabled]);
}
