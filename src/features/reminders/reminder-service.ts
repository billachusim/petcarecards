import type { Reminder } from "@/features/pets/models";

export const NOTIFICATION_EXPLAINER =
  "Care Card uses notifications to remind you or your caregiver about scheduled care.";

export const NOTIFICATION_WEB_LIMITS =
  "Browser reminders only fire while Pet Care Card is open in a tab or window. For anything critical, keep a backup alarm on your phone.";

export type PermissionOutcome = "granted" | "denied" | "unsupported";

export function notificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function currentPermission(): NotificationPermission | "unsupported" {
  if (!notificationSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<PermissionOutcome> {
  if (!notificationSupported()) return "unsupported";
  try {
    const result = await Notification.requestPermission();
    return result === "granted" ? "granted" : "denied";
  } catch {
    return "denied";
  }
}

function matchesToday(reminder: Reminder, date: Date): boolean {
  const iso = date.toISOString().slice(0, 10);
  if (reminder.startDate && iso < reminder.startDate) return false;
  if (reminder.endDate && iso > reminder.endDate) return false;
  const day = date.getDay();
  switch (reminder.repeat) {
    case "daily":
      return true;
    case "weekdays":
      return day >= 1 && day <= 5;
    case "weekly":
      return reminder.startDate ? new Date(reminder.startDate).getDay() === day : true;
    case "once":
      return reminder.startDate ? reminder.startDate === iso : true;
    default:
      return true;
  }
}

export function nextOccurrence(reminder: Reminder, from = new Date()): Date | null {
  const [hoursRaw, minutesRaw] = reminder.time.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

  for (let offset = 0; offset < 8; offset += 1) {
    const candidate = new Date(from);
    candidate.setDate(from.getDate() + offset);
    candidate.setHours(hours, minutes, 0, 0);
    if (candidate <= from) continue;
    if (matchesToday(reminder, candidate)) return candidate;
  }
  return null;
}

export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function showReminderNotification(reminder: Reminder, petName: string): void {
  if (!notificationSupported() || Notification.permission !== "granted") return;
  try {
    new Notification(reminder.title, {
      body: `${petName} · ${formatTime(reminder.time)}`,
      tag: `pcc-${reminder.id}-${new Date().toDateString()}-${reminder.time}`,
      icon: "/favicon.ico",
    });
  } catch {
    /* notifications are best-effort */
  }
}
