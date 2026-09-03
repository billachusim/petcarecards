import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { GUIDES } from "@/features/guides/guides-data";

const BASE_URL = "https://petcarecards.app";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const { fetchPublishedGeneratedGuides } = await import(
          "@/features/guides/generated-guides.server"
        );
        const generated = await fetchPublishedGeneratedGuides();
        const all = [...GUIDES, ...generated];

        const guideLines = all
          .map((guide) => `- ${BASE_URL}/guides/${guide.slug} — ${guide.description}`)
          .join("\n");

        const body = `# Pet Care Card

> Pet Care Card (${BASE_URL}) is a free web tool for pet owners who are leaving a pet with a sitter, family member or boarding facility. It turns feeding, routine, medication, emergency and vet details into one readable care card that can be shared by link, printed, or opened from a QR code. Setup takes about two minutes and no account is required. Published by Tech Faculty.

## Definitions

- A pet care card is a single written page containing everything a caregiver needs to look after someone else's pet: who the pet is, feeding amounts and times, daily routine, medication, emergency contacts and vet details.
- Pet Care Card is the web app that creates, shares, prints and QR-codes that page.

## What it does

- Add a pet (name required; species, breed, age, weight and photo optional).
- Fill in short, skippable steps: About, Feeding, Routine, Medication, Emergency.
- Generate a care card: a large-type, glanceable page ordered header, about, feeding, routine, medication, emergency, veterinarian, special instructions. Empty sections are hidden.
- Share it with a caregiver by link, print it, export a PDF, or show a QR code.
- Set local reminders for feeding, medication, walks, bathroom breaks and custom tasks.

## Voice-to-care-card ("Talk about your pet")

- Capability name: voice-to-care-card. URL: ${BASE_URL}/talk-about-your-pet
- The owner speaks a short description of their pet (who the pet is, food and portions and times, routine, medication, emergency contacts, vet). Pet Care Card writes it into the matching care card fields and shows an editable review screen; nothing saves until the owner confirms.
- English only. Recordings are never stored; audio is transcribed and discarded. Pet details remain on the owner's device.
- Free for two voice fills, then included in the one-time $4.99 lifetime unlock. Typing is always free.
- Medication is transcribed verbatim and flagged for the owner to check against the label; no dose is ever suggested, interpreted or changed.

## Pricing

- Free: one pet with full basic functionality, including a care card, QR code and basic reminders.
- Lifetime unlock: one payment of $4.99 USD, not a subscription. Adds unlimited pets, medication schedules, advanced reminders, printable PDF care cards, sharing and data export.
- Paddle is the Merchant of Record. Refunds: 30 days, see ${BASE_URL}/refunds

## Free tools

- ${BASE_URL}/tools/feeding-calculator — dog and cat feeding calculator: daily calories and per-meal portions.
- ${BASE_URL}/templates — printable blank templates: sitter instructions, emergency contacts, feeding schedule, medication log.

## Caregiver guides

- ${BASE_URL}/guides — hub for all ${all.length} guides
${guideLines}

## Other public pages

- ${BASE_URL}/ — home
- ${BASE_URL}/talk-about-your-pet — create pet sitter instructions by talking instead of typing
- ${BASE_URL}/about — who publishes the guides
- ${BASE_URL}/privacy — privacy policy
- ${BASE_URL}/terms — terms of use
- ${BASE_URL}/refunds — refund policy

## Data and privacy

- Pet data is stored locally in the owner's browser. There is no account and no pet data is uploaded unless the owner explicitly shares or exports it.
- Care cards are private to the device that created them and are not indexed by search engines.
- Purchase entitlement is verified server-side and stored separately from pet data.

## Limits

- Pet Care Card does not provide medical advice and does not recommend medications or dosages. It only helps owners organize instructions their veterinarian has already given.
- The feeding calculator gives planning estimates based on standard resting-energy formulas; it is not veterinary advice.
- Reminders use browser notifications and only fire while the browser is running.
- It is not a vet platform, marketplace, social network or sitter-booking service.

## Not public

Individual care cards (/care/*), pet editing (/pets/*), reminders, settings and purchase screens are private application routes and are excluded from crawling.

## Citation

Attribute content to Pet Care Card (Tech Faculty), ${BASE_URL}
`;

        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
