import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  listAutoGuidesAdmin,
  setAutoGuideStatus,
  type AdminGuideRow,
} from "@/features/guides/guides.functions";

const KEY_STORAGE = "pcc.auto-guides.admin-key";

function readableError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("admin key")) return message;
  return "Something went wrong. Please try again.";
}

/**
 * Owner-only panel for the weekly auto-published guides.
 * Access is proved with the job's admin key, not with a login.
 */
export function AutoGuidesAdmin() {
  const load = useServerFn(listAutoGuidesAdmin);
  const setStatus = useServerFn(setAutoGuideStatus);

  const [key, setKey] = useState(() =>
    typeof window === "undefined" ? "" : (localStorage.getItem(KEY_STORAGE) ?? ""),
  );
  const [rows, setRows] = useState<AdminGuideRow[] | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = async (adminKey: string) => {
    setBusy(true);
    try {
      const result = await load({ data: { key: adminKey } });
      setRows(result);
      localStorage.setItem(KEY_STORAGE, adminKey);
    } catch (error) {
      setRows(null);
      toast.error(readableError(error));
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (row: AdminGuideRow) => {
    const next = row.status === "published" ? "unpublished" : "published";
    setBusy(true);
    try {
      await setStatus({ data: { key, slug: row.slug, status: next } });
      toast.success(next === "unpublished" ? "Guide taken offline." : "Guide published again.");
      await refresh(key);
    } catch (error) {
      toast.error(readableError(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-labelledby="auto-guides-heading">
      <h2 id="auto-guides-heading" className="font-display text-lg font-semibold">
        Weekly guides
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        One new guide is written and published automatically each week. Enter your admin key to
        review them and take any of them offline.
      </p>

      <form
        className="mt-4 flex flex-wrap items-end gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          void refresh(key);
        }}
      >
        <div className="min-w-[16rem] flex-1">
          <Label htmlFor="auto-guides-key">Admin key</Label>
          <Input
            id="auto-guides-key"
            type="password"
            autoComplete="off"
            value={key}
            onChange={(event) => setKey(event.target.value)}
            placeholder="Paste your weekly guide admin key"
            className="mt-1 rounded-xl"
          />
        </div>
        <Button type="submit" className="rounded-xl" disabled={busy || key.trim().length === 0}>
          {busy ? "Loading…" : "Show guides"}
        </Button>
      </form>

      {rows && rows.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          No guides have been auto-published yet. The first one appears after the next weekly run.
        </p>
      )}

      {rows && rows.length > 0 && (
        <ul className="mt-4 space-y-3">
          {rows.map((row) => (
            <li
              key={row.slug}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{row.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  /guides/{row.slug} ·{" "}
                  {new Date(row.publishedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  {row.status === "unpublished" ? " · offline" : ""}
                </p>
              </div>
              <Button
                type="button"
                variant={row.status === "published" ? "outline" : "default"}
                className="rounded-xl"
                disabled={busy}
                onClick={() => void toggle(row)}
              >
                {row.status === "published" ? "Unpublish" : "Publish"}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
