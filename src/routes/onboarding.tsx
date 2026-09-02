import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HeartHandshake, LayoutList, Share2 } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { STORAGE_KEYS } from "@/features/pets/data/care-data-repository";
import { writeJson } from "@/lib/storage/local-store";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome to Pet Care Card" },
      {
        name: "description",
        content:
          "Three quick steps to a care card your pet sitter can follow: what to know, what's inside, and how to share it.",
      },
      { property: "og:title", content: "Welcome to Pet Care Card" },
      {
        property: "og:description",
        content: "Create a simple care card with everything your sitter needs to know.",
      },
    ],
  }),
  component: Onboarding,
});

const SLIDES = [
  {
    icon: HeartHandshake,
    title: "Leaving your pet with someone?",
    body: "Create a simple care card with everything they need to know.",
    bullets: [] as string[],
  },
  {
    icon: LayoutList,
    title: "Everything in one place.",
    body: "One card holds the details a caregiver actually asks for.",
    bullets: ["Feeding", "Medication", "Routine", "Emergency contacts", "Vet information"],
  },
  {
    icon: Share2,
    title: "Share it in seconds.",
    body: "Send a link, print a copy, or let your sitter scan a QR code at the door.",
    bullets: [],
  },
];

function Onboarding() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index]!;
  const Icon = slide.icon;
  const isLast = index === SLIDES.length - 1;

  const finish = () => {
    writeJson(STORAGE_KEYS.onboarded, true);
    void navigate({ to: "/pets/new" });
  };

  return (
    <AppShell bare>
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-between py-10">
        <div>
          <div className="flex size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <Icon className="size-8" aria-hidden="true" />
          </div>
          <h1 className="mt-8 font-display text-4xl leading-tight font-semibold">{slide.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{slide.body}</p>
          {slide.bullets.length > 0 && (
            <ul className="mt-6 space-y-2">
              {slide.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="rounded-2xl border border-border bg-card px-4 py-3 text-base font-medium"
                >
                  {bullet}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-12 space-y-5">
          <div className="flex justify-center gap-2" aria-hidden="true">
            {SLIDES.map((s, i) => (
              <span
                key={s.title}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-primary" : "w-2 bg-border"
                }`}
              />
            ))}
          </div>
          <Button
            size="lg"
            className="h-14 w-full rounded-2xl text-base"
            onClick={() => (isLast ? finish() : setIndex(index + 1))}
          >
            {isLast ? "Create My Pet Care Card" : "Continue"}
          </Button>
          {!isLast && (
            <Button variant="ghost" className="w-full rounded-xl" onClick={finish}>
              Skip
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
