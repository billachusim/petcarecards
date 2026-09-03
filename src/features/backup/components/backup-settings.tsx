import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCareStore } from "@/features/pets/hooks/use-care-store";
import { firstError } from "@/lib/validation";

import { fromBackupPayload, toBackupPayload } from "../backup-mapping";
import { deleteBackup, pullBackup, pushBackup } from "../backup.functions";
import { useBackupAccount } from "../use-backup-account";

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-4 py-4">{children}</div>;
}

export function BackupSettings() {
  const navigate = useNavigate();
  const { db, replaceAll } = useCareStore();
  const { user, email, backupEnabled, setBackupEnabled, signOut } = useBackupAccount();
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!user) {
    return (
      <div className="mt-6 rounded-3xl border border-border bg-card p-5">
        <p className="font-medium">Back up and sync</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Optional. Sign in to back up your care cards so you can open them on a new phone. Without
          an account, everything stays on this device only.
        </p>
        <Button className="mt-4 h-11 rounded-xl" onClick={() => void navigate({ to: "/auth" })}>
          Sign in to back up
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          See what we store in the{" "}
          <Link to="/privacy" className="underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 divide-y divide-border rounded-3xl border border-border bg-card px-5">
      <Row>
        <div>
          <p className="font-medium">Back up and sync</p>
          <p className="text-sm text-muted-foreground">
            {backupEnabled ? "On" : "Off"} — signed in as {email ?? "your account"}
          </p>
        </div>
        <Switch
          checked={backupEnabled}
          aria-label="Back up my care cards"
          onCheckedChange={async (checked) => {
            setBackupEnabled(checked);
            if (!checked) return;
            try {
              await pushBackup({ data: toBackupPayload(db) });
              toast.success("Backup on. Your cards are saved to your account.");
            } catch (error) {
              toast.error(firstError(error));
            }
          }}
        />
      </Row>

      <Row>
        <div>
          <p className="font-medium">Restore from backup</p>
          <p className="text-sm text-muted-foreground">
            Replaces the cards on this device with your saved copy.
          </p>
        </div>
        <Button
          variant="secondary"
          className="rounded-xl"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const payload = await pullBackup();
              replaceAll(fromBackupPayload(payload));
              toast.success("Cards restored from your backup.");
            } catch (error) {
              toast.error(firstError(error));
            } finally {
              setBusy(false);
            }
          }}
        >
          Restore
        </Button>
      </Row>

      <Row>
        <div>
          <p className="font-medium">Delete my backup</p>
          <p className="text-sm text-muted-foreground">
            Removes everything stored in your account. Local cards stay.
          </p>
        </div>
        <Button
          variant="destructive"
          className="rounded-xl"
          onClick={() => setConfirmDelete(true)}
        >
          Delete
        </Button>
      </Row>

      <Row>
        <div>
          <p className="font-medium">Signed in</p>
          <p className="text-sm text-muted-foreground">{email ?? "Account"}</p>
        </div>
        <Button
          variant="ghost"
          className="rounded-xl"
          onClick={async () => {
            setBackupEnabled(false);
            await signOut();
            toast.success("Signed out. Your cards remain on this device.");
          }}
        >
          Sign out
        </Button>
      </Row>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your backup?</AlertDialogTitle>
            <AlertDialogDescription>
              Every care record stored in your account is permanently removed. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                try {
                  await deleteBackup();
                  setBackupEnabled(false);
                  toast.success("Backup deleted.");
                } catch (error) {
                  toast.error(firstError(error));
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
