import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { firstError } from "@/lib/validation";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Back up your care cards — Pet Care Card" },
      {
        name: "description",
        content:
          "Optional sign-in so your pet care cards can be restored on a new phone or tablet.",
      },
      { property: "og:title", content: "Back up your care cards — Pet Care Card" },
      {
        property: "og:description",
        content: "Optional backup and sync for your pet care cards.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const signInWithGoogle = async () => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error.message || "Google sign-in failed. Please try again.");
        return;
      }
      if (result.redirected) return;
      toast.success("Signed in. Backup is ready to turn on.");
      void navigate({ to: "/settings" });
    } catch (error) {
      toast.error(firstError(error));
    } finally {
      setBusy(false);
    }
  };


  const submit = async () => {
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/settings` },
        });
        if (error) throw error;
        toast.success("Check your inbox to confirm your email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in. Backup is ready to turn on.");
        void navigate({ to: "/settings" });
      }
    } catch (error) {
      toast.error(firstError(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <Button
        variant="ghost"
        className="mb-4 -ml-2 rounded-xl"
        onClick={() => void navigate({ to: "/settings" })}
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Back
      </Button>

      <h1 className="font-display text-3xl font-semibold">Back up and sync</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Back up your care cards so you can open them on a new phone, and help us improve Pet Care
        Card. This is optional — the app works fully without an account, and your cards stay on this
        device until you turn backup on.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        When backup is on we store your pets, feeding, routine, medication, emergency and vet
        details, reminders, photos and notes against your account. You can turn it off or delete the
        backup at any time in Settings.
      </p>

      <div className="mt-6 space-y-4 rounded-3xl border border-border bg-card p-5">
        <Button
          variant="secondary"
          className="h-12 w-full rounded-xl"
          disabled={busy}
          onClick={() => void signInWithGoogle()}
        >
          Continue with Google
        </Button>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or use email
          <span className="h-px flex-1 bg-border" />
        </div>


        <div className="space-y-1.5">
          <Label htmlFor="auth-email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="auth-email"
            type="email"
            autoComplete="email"
            className="h-12 rounded-xl"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="auth-password" className="text-sm font-medium">
            Password
          </Label>
          <Input
            id="auth-password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            className="h-12 rounded-xl"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <Button
          className="h-12 w-full rounded-xl"
          disabled={busy || !email || !password}
          onClick={() => void submit()}
        >
          {mode === "signup" ? "Create account" : "Sign in"}
        </Button>

        <button
          type="button"
          className="w-full text-sm text-muted-foreground underline-offset-4 hover:underline"
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
        >
          {mode === "signup" ? "I already have an account" : "Create an account instead"}
        </button>
      </div>
    </AppShell>
  );
}
