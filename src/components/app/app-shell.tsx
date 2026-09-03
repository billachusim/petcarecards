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
    <div className="flex min-h-screen flex-col bg-background">
      {!bare && (
        <header className="no-print border-b border-border/70 bg-card/70 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
            <Link to="/" className="flex items-center gap-2 rounded-md" aria-label="Pet Care Card home">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <PawPrint className="size-5" aria-hidden="true" />
              </span>
              <span className="font-display text-lg font-semibold">Pet Care Card</span>
            </Link>
            <nav className="flex items-center gap-1" aria-label="Main">
              <Link
                to="/guides"
                className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Guides
              </Link>
              <Link
                to="/templates"
                className="hidden rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
              >
                Templates
              </Link>
              <Link
                to="/tools/feeding-calculator"
                className="hidden rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
              >
                Calculator
              </Link>
              <Link
                to="/settings"
                className="inline-flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Settings"
              >
                <Settings className="size-5" aria-hidden="true" />
              </Link>
            </nav>
          </div>
        </header>
      )}
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-20 pt-6">{children}</main>
      {!bare && (
        <footer className="no-print border-t border-border/70 bg-card/50">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <img src="/favicon.svg" alt="" width={20} height={20} className="size-5 rounded-md" aria-hidden="true" />
              © {new Date().getFullYear()} Pet Care Card
            </p>
            <nav className="flex flex-wrap gap-4" aria-label="Footer">
              <Link to="/guides" className="hover:text-foreground">
                Caregiver Guides
              </Link>
              <Link to="/templates" className="hover:text-foreground">
                Templates
              </Link>
              <Link to="/tools/feeding-calculator" className="hover:text-foreground">
                Feeding calculator
              </Link>
              <Link to="/about" className="hover:text-foreground">
                About
              </Link>
              <Link to="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-foreground">
                Terms
              </Link>
              <Link to="/refunds" className="hover:text-foreground">
                Refunds
              </Link>
            </nav>
          </div>
        </footer>
      )}
    </div>
  );
}
