import { useBackupAccount } from "./use-backup-account";
import { useBackupSync } from "./use-backup-sync";

/** Mounted once at the app root: syncs to the account only when backup is on. */
export function BackupRunner() {
  const { user, backupEnabled } = useBackupAccount();
  useBackupSync(Boolean(user) && backupEnabled);
  return null;
}
