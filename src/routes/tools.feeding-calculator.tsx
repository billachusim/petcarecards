import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SITE_NAME, absoluteUrl, breadcrumbLd, publicHead } from "@/lib/seo";

const TITLE = "Pet Feeding Calculator";
const DESCRIPTION =
  "Free feeding calculator for dogs and cats: enter weight, life stage and your food's calories per cup to estimate daily calories and portions per meal, then write it into a care card for your sitter.";

export const Route = createFileRoute("/tools/feeding-calculator")({
  head: () =>
    publicHead({
      title: `${TITLE} — Daily Calories and Portions for Dogs and Cats | ${SITE_NAME}`,
      description: DESCRIPTION,
      path: "/tools/feeding-calculator",
    }),
  component: FeedingCalculator,
});

type Species = "dog" | "cat";
type Stage = keyof typeof STAGE_FACTORS.dog;

const STAGE_FACTORS = {
  dog: {
    "Puppy (under 4 months)": 3,
    "Puppy (4–12 months)": 2,
    "Adult, neutered": 1.6,
    "Adult, intact": 1.8,
    "Adult, very active or working": 2.5,
    "Adult, weight loss plan": 1,
    "Senior, less active": 1.4,
  },
  cat: {
    "Kitten (under 4 months)": 2.5,
    "Kitten (4–12 months)": 2,
    "Adult, neutered": 1.2,
    "Adult, intact": 1.4,
    "Adult, very active": 1.6,
    "Adult, weight loss plan": 0.8,
    "Senior, less active": 1.1,
  },
} as const;

function FeedingCalculator() {
  const [species, setSpecies] = useState<Species>("dog");
  const [weight, setWeight] = useState("12");
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [stage, setStage] = useState<string>("Adult, neutered");
  const [meals, setMeals] = useState("2");
  const [kcalPerCup, setKcalPerCup] = useState("");

  const stages = Object.keys(STAGE_FACTORS[species]);
  const factor =
    (STAGE_FACTORS[species] as Record<string, number>)[stage] ??
    (species === "dog" ? 1.6 : 1.2);

  const result = useMemo(() => {
    const raw = Number(weight);
    if (!raw || raw <= 0) return null;
    const kg = unit === "kg" ? raw : raw * 0.4536;
    if (kg > 120) return null;
    const rer = 70 * Math.pow(kg, 0.75);
    const daily = Math.round(rer * factor);
    const mealCount = Math.max(1, Math.min(6, Number(meals) || 2));
    const perMeal = Math.round(daily / mealCount);
    const kcalCup = Number(kcalPerCup);
    const cupsPerDay = kcalCup > 0 ? daily / kcalCup : null;
    return {
      rer: Math.round(rer),
      daily,
      mealCount,
      perMeal,
      cupsPerDay,
      cupsPerMeal: cupsPerDay === null ? null : cupsPerDay / mealCount,
    };
  }, [weight, unit, factor, meals, kcalPerCup]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: TITLE,
        url: absoluteUrl("/tools/feeding-calculator"),
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any modern web browser",
        description: DESCRIPTION,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How is a pet's daily calorie need calculated?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Resting energy requirement is 70 multiplied by body weight in kilograms to the power of 0.75. That figure is then multiplied by a life-stage factor for age, neuter status and activity level to estimate maintenance energy needs per day.",
            },
          },
          {
            "@type": "Question",
            name: "Is a feeding calculator accurate for every pet?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "It gives a starting estimate only. Individual needs vary with metabolism, health conditions and food formulation, so adjust based on body condition over several weeks and follow your veterinarian's advice.",
            },
          },
          {
            "@type": "Question",
            name: "How many meals a day should a pet get?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Most adult dogs and cats eat two measured meals a day. Puppies and kittens need three to four smaller meals, reducing as they grow.",
            },
          },
        ],
      },
    ],
  };

  return (
    <AppShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Feeding calculator", path: "/tools/feeding-calculator" },
            ]),
          ),
        }}
      />

      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-foreground">Feeding calculator</span>
      </nav>

      <h1 className="font-display text-3xl leading-tight font-semibold sm:text-4xl">
        Pet feeding calculator
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
        Estimate how many calories a dog or cat needs per day, and how much that is per meal. Use it
        as a starting point, then write the final amount on your pet&apos;s care card so whoever
        feeds them gets it right.
      </p>

      <form className="mt-6 space-y-5 rounded-3xl border border-border bg-card p-5" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend className="text-sm font-medium">Species</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["dog", "cat"] as Species[]).map((option) => (
              <Button
                key={option}
                type="button"
                variant={species === option ? "default" : "secondary"}
                className="h-11 rounded-xl capitalize"
                aria-pressed={species === option}
                onClick={() => {
                  setSpecies(option);
                  setStage("Adult, neutered");
                }}
              >
                {option}
              </Button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="weight">Weight</Label>
            <Input
              id="weight"
              type="number"
              inputMode="decimal"
              min="0.2"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-2 h-11 rounded-xl"
            />
          </div>
          <fieldset>
            <legend className="text-sm font-medium">Unit</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["kg", "lb"] as const).map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={unit === option ? "default" : "secondary"}
                  className="h-11 rounded-xl"
                  aria-pressed={unit === option}
                  onClick={() => setUnit(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </fieldset>
        </div>

        <div>
          <Label htmlFor="stage">Life stage and activity</Label>
          <select
            id="stage"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-base"
          >
            {stages.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="meals">Meals per day</Label>
            <Input
              id="meals"
              type="number"
              inputMode="numeric"
              min="1"
              max="6"
              value={meals}
              onChange={(e) => setMeals(e.target.value)}
              className="mt-2 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="kcal">Calories per cup (optional)</Label>
            <Input
              id="kcal"
              type="number"
              inputMode="numeric"
              min="1"
              placeholder="e.g. 380"
              value={kcalPerCup}
              onChange={(e) => setKcalPerCup(e.target.value)}
              className="mt-2 h-11 rounded-xl"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Printed on the food packaging, often as &ldquo;kcal/cup&rdquo;.
            </p>
          </div>
        </div>
      </form>

      <section className="mt-6 rounded-3xl border border-primary/25 bg-primary/5 p-5" aria-live="polite">
        <h2 className="text-sm font-semibold tracking-wide text-primary uppercase">Estimate</h2>
        {result ? (
          <div className="mt-3 space-y-2 text-base">
            <p>
              <span className="font-display text-3xl font-semibold">{result.daily}</span> kcal per day
            </p>
            <p className="text-muted-foreground">
              About {result.perMeal} kcal per meal across {result.mealCount}{" "}
              {result.mealCount === 1 ? "meal" : "meals"}. Resting energy requirement: {result.rer} kcal.
            </p>
            {result.cupsPerDay !== null && (
              <p>
                Roughly <strong>{result.cupsPerDay.toFixed(2)} cups a day</strong> —{" "}
                {result.cupsPerMeal?.toFixed(2)} cups per meal with your food.
              </p>
            )}
          </div>
        ) : (
          <p className="mt-3 text-base text-muted-foreground">Enter a realistic weight to see an estimate.</p>
        )}
      </section>

      <p className="mt-4 flex gap-3 rounded-2xl border border-border bg-secondary/60 p-4 text-sm leading-relaxed text-muted-foreground">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>
          This is an estimate for planning, not veterinary advice. Individual needs vary with health,
          metabolism and food formulation. Confirm amounts with your veterinarian, especially for
          puppies, kittens, pregnant pets, seniors and any pet on a prescription diet.
        </span>
      </p>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold">How the calculation works</h2>
        <p className="mt-3 text-base leading-relaxed">
          Resting energy requirement (RER) is 70 × (body weight in kg)<sup>0.75</sup>. That is
          multiplied by a life-stage factor — higher for growing, intact or very active animals, lower
          for neutered, senior or weight-loss cases — to give the maintenance energy requirement, the
          calories a pet needs over a normal day.
        </p>
      </section>

      <aside className="mt-10 rounded-3xl border border-border bg-card p-6">
        <h2 className="font-display text-2xl font-semibold">Put the number where it is needed</h2>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          A portion size only helps if the person feeding can see it. Add it to a care card with meal
          times, treat limits and forbidden foods, then share, print or scan it.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild size="lg" className="h-12 rounded-xl px-6">
            <Link to="/pets/new">Create a care card</Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="h-12 rounded-xl px-6">
            <Link to="/guides/$slug" params={{ slug: "dog-feeding-chart-by-weight" }}>
              Read the feeding guide
            </Link>
          </Button>
        </div>
      </aside>
    </AppShell>
  );
}
