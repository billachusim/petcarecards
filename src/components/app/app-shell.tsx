import { Link } from "@tanstack/react-router";
import { PawPrint, Settings } from "lucide-react";
import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  /** Hide chrome for print/share surfaces. */
  bare?: boolean | undefined;
}

export function AppShell({ children, bare = false }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      {!bare && (
        <header className="no-print border-b border-border/70 bg-card/70 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
            <Link to="/" className="flex items-center gap-2 rounded-md" aria-label="Pet Care Card home">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <PawPrint className="size-5" aria-hidden="true" />
              </span>
              <span className="font-display text-lg font-semibold">Pet Care Card</span>
            </Link>
            <Link
              to="/settings"
              className="inline-flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Settings"
            >
              <Settings className="size-5" aria-hidden="true" />
            </Link>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-6">{children}</main>
    </div>
  );
}
