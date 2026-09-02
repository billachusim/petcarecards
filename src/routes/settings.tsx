import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/app-shell";
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
import { Separator } from "@/components/ui/separator";
import { useCareStore } from "@/features/pets/hooks/use-care-store";
import { restorePurchase } from "@/features/premium/premium-service";
import {
  NOTIFICATION_WEB_LIMITS,
  currentPermission,
  requestNotificationPermission,
} from "@/features/reminders/reminder-service";
import { downloadDataUrl } from "@/features/sharing/care-card-sharing-service";
import { firstError } from "@/lib/validation";

export const APP_VERSION = "1.0.0";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Pet Care Card" },
      {
        name: "description",
        content:
          "Manage premium status, notifications, data export and local data for Pet Care Card.",
      },
      { property: "og:title", content: "Settings — Pet Care Card" },
      { property: "og:description", content: "Premium status, notifications and your data." },
    ],
  }),
  component: SettingsPage,
});

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-4 py-4">{children}</div>;
}

function SettingsPage() {
  const navigate = useNavigate();
  const { isPremium, exportData, deleteAllData } = useCareStore();
  const [permission, setPermission] = useState(currentPermission());
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <AppShell>
      <Button
        variant="ghost"
        className="mb-4 -ml-2 rounded-xl"
        onClick={() => void navigate({ to: "/" })}
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Back
      </Button>

      <h1 className="font-display text-3xl font-semibold">Settings</h1>

      <div className="mt-6 divide-y divide-border rounded-3xl border border-border bg-card px-5">
        <Row>
          <div>
            <p className="font-medium">Premium status</p>
            <p className="text-sm text-muted-foreground">
              {isPremium ? "Lifetime access active" : "Free plan — one pet"}
            </p>
          </div>
          {!isPremium && (
            <Button asChild className="rounded-xl">
              <Link to="/premium">Unlock</Link>
            </Button>
          )}
        </Row>

        <Row>
          <div className="w-full">
            <p className="font-medium">Restore Purchase</p>
            <p className="text-sm text-muted-foreground">
              Enter the email you used at checkout to unlock on this device.
            </p>
            <div className="mt-3 flex gap-2">
              <Input
                type="email"
                inputMode="email"
                autoComplete="email"
                aria-label="Purchase email"
                placeholder="you@example.com"
                className="h-11 rounded-xl"
                value={restoreEmail}
                onChange={(event) => setRestoreEmail(event.target.value)}
              />
              <Button
                variant="secondary"
                className="h-11 rounded-xl"
                disabled={restoring}
                onClick={async () => {
                  setRestoring(true);
                  try {
                    setEntitlement(await restorePurchase(restoreEmail));
                    toast.success("Lifetime access restored.");
                  } catch (error) {
                    toast.error(firstError(error));
                  } finally {
                    setRestoring(false);
                  }
                }}
              >
                Restore
              </Button>
            </div>
          </div>
        </Row>


        <Row>
          <div>
            <p className="font-medium">Notifications</p>
            <p className="text-sm text-muted-foreground">
              {permission === "granted"
                ? "Allowed"
                : permission === "denied"
                  ? "Blocked in your browser settings"
                  : permission === "unsupported"
                    ? "Not supported in this browser"
                    : "Not enabled yet"}
            </p>
          </div>
          {permission === "default" && (
            <Button
              variant="secondary"
              className="rounded-xl"
              onClick={async () => {
                await requestNotificationPermission();
                setPermission(currentPermission());
              }}
            >
              Enable
            </Button>
          )}
        </Row>

        <Row>
          <div>
            <p className="font-medium">Data export</p>
            <p className="text-sm text-muted-foreground">Download a JSON backup of your cards.</p>
          </div>
          <Button
            variant="secondary"
            className="rounded-xl"
            onClick={() => {
              try {
                const blob = new Blob([exportData()], { type: "application/json" });
                downloadDataUrl(URL.createObjectURL(blob), "pet-care-card-backup.json");
                toast.success("Backup downloaded.");
              } catch (error) {
                toast.error(firstError(error));
              }
            }}
          >
            Export
          </Button>
        </Row>

        <Row>
          <div>
            <p className="font-medium">Delete all local data</p>
            <p className="text-sm text-muted-foreground">Removes every pet and care card here.</p>
          </div>
          <Button variant="destructive" className="rounded-xl" onClick={() => setConfirmOpen(true)}>
            Delete
          </Button>
        </Row>
      </div>

      <p className="mt-4 px-1 text-xs leading-relaxed text-muted-foreground">
        {NOTIFICATION_WEB_LIMITS}
      </p>

      <div className="mt-6 divide-y divide-border rounded-3xl border border-border bg-card px-5">
        <Row>
          <Link to="/privacy" className="font-medium underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
        </Row>
        <Row>
          <Link to="/terms" className="font-medium underline-offset-4 hover:underline">
            Terms of Use
          </Link>
        </Row>
        <Row>
          <div>
            <p className="font-medium">About</p>
            <p className="text-sm text-muted-foreground">
              Pet Care Card helps you hand over everything a caregiver needs. Your data stays on
              this device.
            </p>
          </div>
        </Row>
        <Row>
          <p className="font-medium">App version</p>
          <p className="text-sm text-muted-foreground">{APP_VERSION}</p>
        </Row>
      </div>

      <Separator className="my-8" />

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete all pet data?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                deleteAllData();
                toast.success("All pet data deleted.");
                void navigate({ to: "/" });
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
