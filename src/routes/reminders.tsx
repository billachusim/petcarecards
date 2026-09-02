import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bell, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/app-shell";
import { EmptyState } from "@/components/app/empty-state";
import { TextField } from "@/components/app/form-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCareStore } from "@/features/pets/hooks/use-care-store";
import type { ReminderType, RepeatSchedule } from "@/features/pets/models";
import { PaywallDialog } from "@/features/premium/components/paywall-dialog";
import {
  NOTIFICATION_EXPLAINER,
  NOTIFICATION_WEB_LIMITS,
  currentPermission,
  formatTime,
  nextOccurrence,
  requestNotificationPermission,
} from "@/features/reminders/reminder-service";
import { firstError, reminderSchema } from "@/lib/validation";

export const Route = createFileRoute("/reminders")({
  head: () => ({
    meta: [
      { title: "Reminders — Pet Care Card" },
      {
        name: "description",
        content:
          "Set feeding, medication, walking, bathroom and custom care reminders while the app is open.",
      },
      { property: "og:title", content: "Reminders — Pet Care Card" },
      { property: "og:description", content: "Gentle nudges for feeding, medication and walks." },
    ],
  }),
  component: RemindersPage,
});

const TYPES: ReminderType[] = ["feeding", "medication", "walk", "bathroom", "custom"];
const REPEATS: { value: RepeatSchedule; label: string }[] = [
  { value: "once", label: "Once" },
  { value: "daily", label: "Every day" },
  { value: "weekdays", label: "Weekdays" },
  { value: "weekly", label: "Weekly" },
];

function RemindersPage() {
  const navigate = useNavigate();
  const { ready, pets, reminders, saveReminder, deleteReminder, toggleReminder, isPremium } =
    useCareStore();
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [permission, setPermission] = useState(currentPermission());

  const [petId, setPetId] = useState("");
  const [type, setType] = useState<ReminderType>("feeding");
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("08:00");
  const [repeat, setRepeat] = useState<RepeatSchedule>("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string>();

  const openForm = () => {
    if (!isPremium && reminders.length >= 2) {
      setPaywallOpen(true);
      return;
    }
    setPetId(pets[0]?.id ?? "");
    setAdding(true);
  };

  const submit = async () => {
    try {
      reminderSchema.parse({ title, time, startDate, endDate });
      if (!petId) throw new Error("Please choose which pet this reminder is for.");

      if (permission !== "granted") {
        const outcome = await requestNotificationPermission();
        setPermission(currentPermission());
        if (outcome === "denied") {
          toast.error(
            "Notifications are blocked in your browser, so we'll show reminders in the app only.",
          );
        } else if (outcome === "unsupported") {
          toast.error("This browser doesn't support notifications. Your reminder is still saved.");
        }
      }

      saveReminder({
        petId,
        type,
        title: title.trim(),
        time,
        repeat,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        enabled: true,
      });
      toast.success("Reminder added.");
      setAdding(false);
      setTitle("");
      setError(undefined);
    } catch (err) {
      const message = firstError(err);
      setError(message);
      toast.error(message);
    }
  };

  return (
    <AppShell>
      <PaywallDialog open={paywallOpen} onOpenChange={setPaywallOpen} />

      <Button
        variant="ghost"
        className="mb-4 -ml-2 rounded-xl"
        onClick={() => void navigate({ to: "/" })}
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Back
      </Button>

      <h1 className="font-display text-3xl font-semibold">Reminders</h1>
      <p className="mt-1 text-sm text-muted-foreground">{NOTIFICATION_EXPLAINER}</p>
      <p className="mt-3 rounded-2xl bg-secondary/70 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        {NOTIFICATION_WEB_LIMITS}
      </p>

      {ready && pets.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Add a pet first"
            description="Reminders are attached to a pet's care card."
            action={
              <Button className="h-11 rounded-xl" onClick={() => void navigate({ to: "/pets/new" })}>
                Add Pet
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {reminders.length === 0 && !adding && (
            <EmptyState
              icon={<Bell className="size-6" aria-hidden="true" />}
              title="No reminders yet"
              description="Add feeding, medication, walking, or custom care reminders."
              action={
                <Button className="h-11 rounded-xl" onClick={openForm}>
                  <Plus className="size-4" aria-hidden="true" /> Add reminder
                </Button>
              }
            />
          )}

          {reminders.map((reminder) => {
            const pet = pets.find((p) => p.id === reminder.petId);
            const next = nextOccurrence(reminder);
            return (
              <div
                key={reminder.id}
                className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg font-semibold">{reminder.title}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {[
                      pet?.name,
                      formatTime(reminder.time),
                      REPEATS.find((r) => r.value === reminder.repeat)?.label,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {reminder.enabled && next && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Next: {next.toLocaleString(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" })}
                    </p>
                  )}
                </div>
                <Switch
                  checked={reminder.enabled}
                  onCheckedChange={(checked) => toggleReminder(reminder.id, checked)}
                  aria-label={`Enable ${reminder.title}`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl text-muted-foreground"
                  aria-label={`Delete ${reminder.title}`}
                  onClick={() => deleteReminder(reminder.id)}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              </div>
            );
          })}

          {adding ? (
            <div className="space-y-5 rounded-3xl border border-border bg-card p-5">
              <h2 className="font-display text-xl font-semibold">New reminder</h2>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Pet</Label>
                <Select value={petId} onValueChange={setPetId}>
                  <SelectTrigger className="h-12 w-full rounded-xl">
                    <SelectValue placeholder="Choose a pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as ReminderType)}>
                  <SelectTrigger className="h-12 w-full rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="capitalize">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <TextField
                label="Title"
                value={title}
                onChange={setTitle}
                placeholder="e.g. Morning feeding"
                error={error}
              />
              <TextField label="Time" type="time" value={time} onChange={setTime} />

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Repeat</Label>
                <Select value={repeat} onValueChange={(v) => setRepeat(v as RepeatSchedule)}>
                  <SelectTrigger className="h-12 w-full rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REPEATS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Start date"
                  optional
                  type="date"
                  value={startDate}
                  onChange={setStartDate}
                />
                <TextField
                  label="End date"
                  optional
                  type="date"
                  value={endDate}
                  onChange={setEndDate}
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="h-12 flex-1 rounded-xl" onClick={() => setAdding(false)}>
                  Cancel
                </Button>
                <Button className="h-12 flex-1 rounded-xl" onClick={() => void submit()}>
                  Save reminder
                </Button>
              </div>
            </div>
          ) : (
            reminders.length > 0 && (
              <Button variant="outline" className="h-12 w-full rounded-xl" onClick={openForm}>
                <Plus className="size-4" aria-hidden="true" /> Add reminder
              </Button>
            )
          )}
        </div>
      )}
    </AppShell>
  );
}
