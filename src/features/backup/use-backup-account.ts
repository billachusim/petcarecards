import type { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { readJson, writeJson } from "@/lib/storage/local-store";

const BACKUP_PREF_KEY = "pcc.backupEnabled";

export function readBackupPreference(): boolean {
  return readJson<boolean>(BACKUP_PREF_KEY, false);
}

export function writeBackupPreference(enabled: boolean): void {
  writeJson(BACKUP_PREF_KEY, enabled);
}

export interface BackupAccount {
  ready: boolean;
  user: User | null;
  email: string | null;
  backupEnabled: boolean;
  setBackupEnabled: (enabled: boolean) => void;
  signOut: () => Promise<void>;
}

/** Tracks the signed-in account plus the local "back up my cards" preference. */
export function useBackupAccount(): BackupAccount {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [backupEnabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(readBackupPreference());
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const setBackupEnabled = useCallback((enabled: boolean) => {
    writeBackupPreference(enabled);
    setEnabled(enabled);
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return {
    ready,
    user,
    email: user?.email ?? null,
    backupEnabled,
    setBackupEnabled,
    signOut,
  };
}
