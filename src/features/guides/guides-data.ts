export interface GuideSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  checklist?: string[];
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface Guide {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  /** Short, citation-friendly answer shown at the top of the page. */
  answer: string;
  published: string;
  updated: string;
  readMinutes: number;
  medicalDisclaimer?: boolean;
  intro: string[];
  sections: GuideSection[];
  faqs: GuideFaq[];
  related: string[];
  /** True for guides written by the weekly automatic publisher. */
  generated?: boolean;
}

export const AUTHOR = "The Pet Care Card team";

export const GUIDES: Guide[] = [
  {
    slug: "pet-sitter-care-card-checklist",
    title: "The pet sitter care card checklist",
    metaTitle: "Pet Sitter Care Card Checklist (What to Include) — Pet Care Card",
    description:
      "A complete checklist of what to write down for a pet sitter: feeding, routine, medication, emergency contacts and vet details, in the order a sitter needs them.",
    answer:
      "A pet sitter care card should cover seven things: who the pet is, feeding, daily routine, bathroom habits, medication, emergency contacts, and the vet's name, phone and address. Write it in that order so a sitter can find what they need in seconds, and leave one copy visible in the home plus a shareable digital copy.",
    published: "2026-08-24",
    updated: "2026-09-02",
    readMinutes: 6,
    intro: [
      "Most sitter problems are not caused by bad sitters. They are caused by missing information: nobody wrote down that the back gate does not latch, that the food scoop is half full, or that the vet closes at noon on Saturdays.",
      "This checklist is the same structure Pet Care Card uses, and you can work through it in about two minutes per pet.",
    ],
    sections: [
      {
        heading: "1. Who the pet is",
        paragraphs: [
          "Start with the basics a stranger cannot guess: name, species, breed, rough age, weight and temperament. Weight matters because it is the first thing a vet asks. Temperament matters because it tells the sitter what normal looks like.",
        ],
        checklist: [
          "Name and a recent photo",
          "Species, breed and approximate age",
          "Weight (approximate is fine)",
          "Personality notes: shy with men, bolts at doors, hates the vacuum",
          "Microchip number, if you have it",
        ],
      },
      {
        heading: "2. Feeding",
        paragraphs: [
          "Be specific about amounts and containers. \"One scoop\" means nothing to someone who has never seen your scoop.",
        ],
        checklist: [
          "Food brand and type, and where it is stored",
          "Amount per meal, in cups or grams",
          "Number of meals and the times",
          "Treats: which ones, how many per day",
          "Foods to avoid, including anything that upsets their stomach",
          "Water bowl location and how often to refresh it",
        ],
      },
      {
        heading: "3. Daily routine",
        paragraphs: [
          "Routine is what keeps an anxious pet calm while you are away. Write the shape of the day rather than an exact schedule.",
        ],
        checklist: [
          "Walk times and typical length",
          "Bathroom routine, litter box location and cleaning frequency",
          "Playtime and what they actually enjoy",
          "Sleep arrangements and crate instructions",
          "Indoor/outdoor rules and door safety",
        ],
      },
      {
        heading: "4. Medication",
        paragraphs: [
          "List only what your vet has already prescribed: the name, the dose exactly as written on the label, when it is given, and how. Note where the medication is stored and what to do if a dose is missed.",
        ],
      },
      {
        heading: "5. Emergency information",
        paragraphs: [
          "This section should be visually separate from everything else so it can be found under stress.",
        ],
        checklist: [
          "Your phone number, plus a second contact who can make decisions",
          "Vet clinic name, phone number and full address",
          "Nearest 24-hour emergency vet",
          "Any spending authorisation you want to give in writing",
          "Known conditions, allergies and reactions",
        ],
      },
      {
        heading: "6. House details the sitter will need",
        bullets: [
          "Where leads, harnesses, towels and cleaning supplies live",
          "Bin day, alarm codes and parking rules",
          "Anything that is off limits",
        ],
      },
      {
        heading: "7. Leave it in two places",
        paragraphs: [
          "Print one copy and leave it on the fridge or by the food bowls, and share a digital copy so the sitter has it on their phone when they are out on a walk. A QR code taped near the door covers both.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much detail is too much for a pet sitter?",
        answer:
          "If a detail changes what the sitter does, include it. If it only explains why, leave it out. One page per pet is a good target, with the emergency section always visible.",
      },
      {
        question: "Should I give the sitter permission to spend money at the vet?",
        answer:
          "Yes, in writing. State a limit you are comfortable with and confirm it with your clinic, so treatment is not delayed while someone tries to reach you.",
      },
      {
        question: "What if I have more than one pet?",
        answer:
          "Make a separate card for each pet. Shared instructions get skimmed, and feeding mistakes between pets are one of the most common sitter errors.",
      },
    ],
    related: ["what-to-leave-with-a-dog-sitter", "pet-emergency-contact-sheet", "printable-pet-care-card-template"],
  },
  {
    slug: "what-to-leave-with-a-dog-sitter",
    title: "What to leave with a dog sitter",
    metaTitle: "What to Leave With a Dog Sitter: Info, Supplies, Access — Pet Care Card",
    description:
      "Exactly what a dog sitter needs from you: written care instructions, supplies laid out, house access, vet authorisation and the details owners usually forget.",
    answer:
      "Leave a dog sitter three things: written care instructions (feeding, walks, medication, emergencies), the supplies they need laid out in one place, and access details for your home. Add your vet's contact information and written permission to authorise treatment up to an amount you choose.",
    published: "2026-08-24",
    updated: "2026-09-02",
    readMinutes: 5,
    intro: [
      "A good handover takes ten minutes and prevents almost every awkward text message while you are away.",
    ],
    sections: [
      {
        heading: "Written instructions come first",
        paragraphs: [
          "Verbal handovers are forgotten within an hour. Give the sitter something they can re-read: feeding amounts and times, walk schedule, bathroom habits, medication, house rules and emergency contacts.",
        ],
      },
      {
        heading: "Supplies to lay out",
        checklist: [
          "Enough food for the full stay, plus two extra days",
          "Measuring scoop or a pre-portioned set of meals",
          "Lead, harness, poop bags and a spare",
          "Treats, separated from training treats if you use them",
          "Towels for wet or muddy days",
          "Cleaning supplies for accidents",
          "Bed, crate and a familiar toy",
        ],
      },
      {
        heading: "Access and house details",
        checklist: [
          "Keys or door code, and how the lock behaves if it sticks",
          "Alarm code and what to do if it goes off",
          "Wi-Fi password",
          "Which doors and gates must stay shut",
          "Neighbour's number as a backup",
        ],
      },
      {
        heading: "Vet and emergency authorisation",
        paragraphs: [
          "Give the clinic name, phone number and address, the nearest 24-hour emergency hospital, and a written note authorising treatment up to a set amount. Tell your clinic who is caring for the dog so they will accept the sitter's instructions.",
        ],
      },
      {
        heading: "The details owners forget",
        bullets: [
          "Which foods cause an upset stomach",
          "Reaction to other dogs, cyclists or delivery drivers",
          "Whether the dog can be left alone, and for how long",
          "Where the dog hides during storms or fireworks",
          "How much barking is normal",
        ],
      },
      {
        heading: "Do a short walkthrough",
        paragraphs: [
          "Walk the sitter through one feeding and one walk before you leave if you can. It surfaces the things you would never think to write down.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much dog food should I leave for a sitter?",
        answer:
          "Leave the full amount for the stay plus two extra days, in case of travel delays. Pre-portioning meals into bags removes any guesswork about amounts.",
      },
      {
        question: "Should the sitter have my vet's details even for a short stay?",
        answer:
          "Yes. Emergencies are not proportional to trip length, and a clinic will move faster when the caller already has the clinic name, your name and the dog's details.",
      },
    ],
    related: ["pet-sitter-care-card-checklist", "pet-feeding-schedule-template", "pet-emergency-contact-sheet"],
  },
  {
    slug: "cat-sitter-instructions",
    title: "Cat sitter instructions that actually help",
    metaTitle: "Cat Sitter Instructions: What to Write Down — Pet Care Card",
    description:
      "How to write cat sitter instructions covering feeding, litter, hiding spots, medication and warning signs, so a drop-in visit does not turn into guesswork.",
    answer:
      "Cat sitter instructions should cover feeding amounts and times, litter box location and cleaning, where the cat hides, indoor-only rules, medication, and the warning signs that need a vet call — especially a male cat not urinating, which is an emergency.",
    published: "2026-08-24",
    updated: "2026-09-02",
    readMinutes: 5,
    intro: [
      "Cats are usually cared for by drop-in visits, so the sitter has less time and fewer chances to notice a problem. Written instructions do most of the work.",
    ],
    sections: [
      {
        heading: "Feeding",
        checklist: [
          "Wet and dry amounts, per meal, with times",
          "Where food is stored and how long opened wet food keeps",
          "Whether bowls are shared between cats",
          "Water: bowl, fountain, or both, and how to clean it",
        ],
      },
      {
        heading: "Litter",
        paragraphs: [
          "Note the number of boxes, the location of each, the litter type, and how often to scoop. Ask the sitter to tell you what they find: changes in urine clumps or stool are often the first sign of illness.",
        ],
      },
      {
        heading: "Hiding spots and behaviour",
        paragraphs: [
          "Write down where your cat hides so a sitter never leaves worried that the cat is missing. Include how the cat normally greets people, and whether they should be coaxed out or left alone.",
        ],
      },
      {
        heading: "Doors, windows and escape risk",
        bullets: [
          "Whether the cat is indoor-only",
          "Which windows must stay closed",
          "How to enter and leave without a door dash",
        ],
      },
      {
        heading: "Medication",
        paragraphs: [
          "If your cat takes prescribed medication, write the name, the dose exactly as labelled, the time, and the method that works for your cat, such as hidden in wet food. Note what to do if the cat spits it out.",
        ],
      },
      {
        heading: "When to call a vet",
        paragraphs: [
          "Give the sitter a short, plain list of things that need a call rather than a wait: a male cat straining without producing urine, no food for 24 hours, repeated vomiting, laboured breathing, or hiding combined with not eating. Add your vet's number next to it.",
        ],
      },
    ],
    faqs: [
      {
        question: "How often should a cat sitter visit?",
        answer:
          "Most cats need at least one visit a day, and two is better for cats on medication, kittens, seniors or cats who eat wet food. A visit should include feeding, fresh water, litter and time with the cat.",
      },
      {
        question: "What should a cat sitter report back after each visit?",
        answer:
          "Ask for a short message covering how much was eaten, what was in the litter box, and how the cat behaved. That is enough to spot most problems early.",
      },
    ],
    related: ["pet-sitter-care-card-checklist", "pet-feeding-schedule-template", "pet-emergency-contact-sheet"],
  },
  {
    slug: "pet-emergency-contact-sheet",
    title: "How to make a pet emergency contact sheet",
    metaTitle: "Pet Emergency Contact Sheet: What to Include — Pet Care Card",
    description:
      "Build a one-page pet emergency contact sheet with owner and backup contacts, vet and 24-hour hospital details, medical history and written treatment authorisation.",
    answer:
      "A pet emergency contact sheet needs the owner's number, a backup decision-maker, the regular vet's name, phone and address, the nearest 24-hour emergency hospital, the pet's known conditions and medications, and written authorisation for treatment up to a stated amount. Keep it to one page and post it where a caregiver can see it.",
    published: "2026-08-24",
    updated: "2026-09-02",
    readMinutes: 4,
    intro: [
      "Emergency information is only useful if it can be read by a stressed person in ten seconds. That means one page, big type, and no searching.",
    ],
    sections: [
      {
        heading: "People",
        checklist: [
          "Owner name and mobile number",
          "Second contact who can make decisions if you cannot be reached",
          "Neighbour or key holder",
        ],
      },
      {
        heading: "Veterinary care",
        checklist: [
          "Regular clinic: name, phone, full address, opening hours",
          "Nearest 24-hour emergency hospital: name, phone, address",
          "Pet insurance provider and policy number, if you have one",
          "Microchip number and registry",
        ],
      },
      {
        heading: "Medical context",
        paragraphs: [
          "List diagnosed conditions, current prescribed medications, known allergies and past reactions, exactly as your vet has recorded them. This is context for the clinic, not instructions to act on.",
        ],
      },
      {
        heading: "Written authorisation",
        paragraphs: [
          "Add a line such as: \"I authorise [caregiver name] to seek veterinary treatment for [pet name] and approve costs up to [amount].\" Sign and date it, and give your clinic a copy before you travel.",
        ],
      },
      {
        heading: "Where to keep it",
        bullets: [
          "Printed on the fridge or by the front door",
          "On the caregiver's phone as a shared link",
          "A QR code near the pet's food, so anyone in the home can open it",
        ],
      },
    ],
    faqs: [
      {
        question: "What information does an emergency vet ask for first?",
        answer:
          "Your pet's species, breed, approximate age and weight, what happened and when, and any medications or known conditions. Having those written down saves several minutes at intake.",
      },
      {
        question: "Should I include a spending limit?",
        answer:
          "Yes. A stated limit lets a clinic begin stabilising care immediately instead of waiting for you, and it protects the caregiver from making a financial decision on your behalf.",
      },
    ],
    related: ["pet-sitter-care-card-checklist", "pet-medication-instructions-for-caregivers", "printable-pet-care-card-template"],
  },
  {
    slug: "pet-medication-instructions-for-caregivers",
    title: "Writing pet medication instructions for a caregiver",
    metaTitle: "Pet Medication Instructions for Caregivers — Pet Care Card",
    description:
      "How to write down your pet's prescribed medication for a sitter: name, dose as labelled, timing, method, storage, missed doses and when to call the vet.",
    answer:
      "Copy each medication exactly as your vet labelled it: medication name, dose, how often, how it is given, and start and end dates. Add where it is stored, what to do about a missed or spat-out dose, and the vet number to call with questions. Never ask a caregiver to judge a dose.",
    published: "2026-08-24",
    updated: "2026-09-02",
    readMinutes: 5,
    medicalDisclaimer: true,
    intro: [
      "Medication is the part of pet care where vague notes cause real harm. The goal is a caregiver who never has to interpret anything.",
    ],
    sections: [
      {
        heading: "Copy the label, do not paraphrase",
        paragraphs: [
          "Write the medication name, strength and dose exactly as printed on your vet's label, including the units. If the label says half a tablet, say half a tablet and note whether it is scored.",
        ],
      },
      {
        heading: "One line per medication",
        checklist: [
          "Medication name and strength",
          "Dose, exactly as labelled",
          "Times of day, written as clock times",
          "With food or without",
          "How it is given: tablet, liquid, ear drops, injection",
          "Start and end date, if the course ends",
          "Where it is stored, including anything refrigerated",
        ],
      },
      {
        heading: "Make the timing unmissable",
        paragraphs: [
          "Attach medication to something the caregiver already does, such as the morning feed. A reminder on their phone plus a written schedule works better than either alone.",
        ],
      },
      {
        heading: "Missed and refused doses",
        paragraphs: [
          "Ask your vet in advance what to do if a dose is missed or the pet spits it out, and write down their answer. Then the caregiver follows your vet's instruction rather than guessing.",
        ],
      },
      {
        heading: "When to call",
        bullets: [
          "Two or more missed doses",
          "Vomiting shortly after a dose",
          "Any new symptom after a medication change",
          "Anything the caregiver is unsure about",
        ],
      },
      {
        heading: "Hand over the actual packaging",
        paragraphs: [
          "Leave the medication in its original labelled container. It confirms your written notes and gives a vet everything they need if something goes wrong.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I ask a pet sitter to give injections?",
        answer:
          "Only if they have agreed and are comfortable doing it, and only for a medication your vet has already prescribed and demonstrated. Confirm it before booking rather than on the day.",
      },
      {
        question: "What should I do if the caregiver is unsure about a dose?",
        answer:
          "They should not give it and should call your vet clinic, which is why the clinic number belongs on the same page as the medication list.",
      },
    ],
    related: ["pet-sitter-care-card-checklist", "pet-emergency-contact-sheet", "pet-feeding-schedule-template"],
  },
  {
    slug: "pet-feeding-schedule-template",
    title: "A pet feeding schedule template you can hand over",
    metaTitle: "Pet Feeding Schedule Template for Sitters — Pet Care Card",
    description:
      "A simple feeding schedule template for pet sitters: meal times, exact amounts, treats, foods to avoid and what to do when a pet refuses food.",
    answer:
      "A usable feeding schedule lists each meal by clock time with an exact amount in cups or grams, names the food and where it is stored, states the treat allowance, lists foods to avoid, and says what to do if the pet does not eat. Amounts should never be described in scoops or handfuls.",
    published: "2026-08-24",
    updated: "2026-09-02",
    readMinutes: 4,
    intro: [
      "Feeding is the instruction a caregiver follows most often, so it is worth making it precise.",
    ],
    sections: [
      {
        heading: "The template",
        bullets: [
          "Meal 1 — time — food — amount — with or without medication",
          "Meal 2 — time — food — amount",
          "Treats — which ones — maximum per day",
          "Water — bowl location — refresh frequency",
          "Foods to avoid — including anything that upsets their stomach",
          "If they do not eat — what to try, and when to call you",
        ],
      },
      {
        heading: "Use measurable amounts",
        paragraphs: [
          "Grams are best, cups are fine, scoops are not. If you use a scoop, leave that exact scoop out and say whether it is level or heaped.",
        ],
      },
      {
        heading: "Pre-portion for short stays",
        paragraphs: [
          "For a weekend, bagging each meal removes every possible mistake and lets you see at a glance whether meals were given.",
        ],
      },
      {
        heading: "Multi-pet households",
        paragraphs: [
          "Say where each pet eats and whether they need separating. Note which pet steals food, because that is usually the cause of a mystery upset stomach.",
        ],
      },
      {
        heading: "When a pet will not eat",
        paragraphs: [
          "Give one simple fallback, such as adding a spoon of the usual wet food, and a clear threshold for calling you or the vet. A cat that has not eaten for 24 hours needs a call.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I change my pet's food before a trip?",
        answer:
          "No. Keep the diet identical while you are away. A food change plus your absence is a common cause of stomach upset during a stay.",
      },
      {
        question: "How do I handle free-feeding with a sitter?",
        answer:
          "Give a daily total and ask the sitter to top up to that amount and report what is left, so you still know how much was eaten.",
      },
    ],
    related: ["what-to-leave-with-a-dog-sitter", "cat-sitter-instructions", "pet-sitter-care-card-checklist"],
  },
  {
    slug: "printable-pet-care-card-template",
    title: "Printable pet care card template",
    metaTitle: "Printable Pet Care Card Template (Free) — Pet Care Card",
    description:
      "The structure of a printable one-page pet care card, how to lay it out for readability, and how to make a digital and QR version for your caregiver.",
    answer:
      "A printable pet care card fits on one page in this order: pet header with photo, about, feeding, routine, medication, emergency contacts and vet. Use large type, keep the emergency block visually distinct, and pair the printed copy with a shareable link or QR code so the caregiver has it on their phone.",
    published: "2026-08-24",
    updated: "2026-09-02",
    readMinutes: 4,
    intro: [
      "A printed card on the fridge is still the most reliable format, because it works with no phone, no battery and no signal.",
    ],
    sections: [
      {
        heading: "The layout that works",
        bullets: [
          "Header: photo, name, species, breed, age, weight",
          "About: personality and things to know",
          "Feeding: times and exact amounts",
          "Routine: walks, bathroom, sleep, crate",
          "Medication: name, dose as labelled, times",
          "Emergency: your number, backup contact, vet, 24-hour hospital",
        ],
      },
      {
        heading: "Formatting rules",
        bullets: [
          "One pet per page",
          "Body text no smaller than 11pt",
          "Emergency block bordered or shaded so it is found instantly",
          "No colour-only meaning, so it still reads when printed in black and white",
          "Leave the sections you do not need out entirely rather than writing N/A",
        ],
      },
      {
        heading: "Print and digital together",
        paragraphs: [
          "Print one copy for the fridge and one for the pet's travel bag if they are being boarded, then share a link so the caregiver has the same information on a walk or at the clinic. A QR code near the door lets anyone in the home open it without asking you.",
        ],
      },
      {
        heading: "Keep it current",
        paragraphs: [
          "Re-check the card before every stay. Doses, vet numbers and feeding amounts change more often than people expect.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does Pet Care Card produce a printable version?",
        answer:
          "Yes. Every care card has a print-optimised layout, and a PDF export sized for A4 and Letter is available with the lifetime unlock.",
      },
      {
        question: "How many copies should I leave?",
        answer:
          "Two printed copies is a sensible default: one on the fridge and one with the pet's supplies, plus the shared digital link.",
      },
    ],
    related: ["pet-sitter-care-card-checklist", "pet-emergency-contact-sheet", "pet-feeding-schedule-template"],
  },
  {
    slug: "puppy-feeding-schedule-by-age",
    title: "Puppy feeding schedule by age",
    metaTitle: "Puppy Feeding Schedule by Age (8 Weeks to 1 Year) — Pet Care Card",
    description:
      "How often to feed a puppy at 8 weeks, 3 months, 6 months and a year, how to split meals across the day, and how to write the schedule down so a sitter can follow it exactly.",
    answer:
      "Most puppies eat four meals a day from weaning to about 12 weeks, three meals from 3 to 6 months, and two meals a day from around 6 months onward. Keep meal times consistent, measure portions rather than free-feeding, and follow the amount your vet or the food packaging gives for your puppy's current weight and expected adult size.",
    published: "2026-09-03",
    updated: "2026-09-03",
    readMinutes: 6,
    medicalDisclaimer: true,
    intro: [
      "Puppies eat more often than adult dogs because they burn energy quickly and cannot hold much at once. The number of meals drops as they grow, but the total daily amount usually rises until they approach adult weight.",
      "This page gives the usual pattern by age, then shows how to write it down so whoever is feeding your puppy while you are out gets it right without texting you.",
    ],
    sections: [
      {
        heading: "The usual schedule by age",
        bullets: [
          "6 to 12 weeks: four meals a day, evenly spaced from morning to early evening.",
          "3 to 6 months: three meals a day — typically breakfast, midday and early evening.",
          "6 to 12 months: two meals a day, morning and evening, once growth slows.",
          "12 months and older: two meals a day for most breeds; large and giant breeds may stay on a growth food for longer on your vet's advice.",
        ],
        paragraphs: [
          "Small and toy breeds mature faster, so they often move to two meals earlier. Large breeds mature slower and may need a growth-formula food for 12 to 18 months. Your vet's advice always overrides a generic table.",
        ],
      },
      {
        heading: "How much per meal",
        paragraphs: [
          "Start from the feeding guide on your puppy's food, which is given by current weight and expected adult weight, then divide that daily total by the number of meals. Weigh or measure with the same cup or scale every time — eyeballing a scoop is the single most common cause of a puppy gaining or losing too fast.",
          "Adjust based on body condition rather than the chart. You should be able to feel ribs easily without pressing hard, and see a waist from above.",
        ],
      },
      {
        heading: "Keep the times consistent",
        paragraphs: [
          "Regular meal times make house-training far more predictable: most puppies need to go out within 15 to 30 minutes of eating. If you are handing over to a sitter, write the actual clock times, not \"morning and evening\".",
        ],
        checklist: [
          "Meal times as clock times: 7:00, 12:00, 17:00",
          "Amount per meal in cups or grams",
          "Food brand, formula and where it is stored",
          "Whether water is added, and how long to soak",
          "Treats allowed per day, including training treats",
          "Foods that must never be given",
        ],
      },
      {
        heading: "Common mistakes when someone else feeds your puppy",
        bullets: [
          "Free-feeding while you are away, which undoes house-training progress",
          "Using a different scoop or a mug instead of the measure you use",
          "Switching foods suddenly, which usually causes loose stools",
          "Doubling up because nobody wrote down that the puppy already ate",
          "Handing out extra treats to a puppy that seems hungry between meals",
        ],
      },
      {
        heading: "Write it into a care card",
        paragraphs: [
          "A feeding schedule only works if the person feeding can see it. Put the times, amounts and forbidden foods on one card, leave a printed copy near the bowls, and share a link or QR code so it is on the sitter's phone too.",
        ],
      },
    ],
    faqs: [
      {
        question: "How many times a day should a 3-month-old puppy eat?",
        answer:
          "Three meals a day is typical at 3 months, spaced evenly through the day with the last meal a few hours before bedtime so the puppy can toilet before sleeping.",
      },
      {
        question: "When can a puppy go to two meals a day?",
        answer:
          "Most puppies move to two meals a day between 6 and 12 months, once growth slows. Small breeds often move earlier and large breeds later; confirm the timing with your vet.",
      },
      {
        question: "Should I leave food down all day?",
        answer:
          "Measured meals are generally preferred over free-feeding for puppies. Scheduled meals make toilet training predictable and make it obvious when a puppy is off their food, which is an early sign of illness.",
      },
      {
        question: "What do I tell a sitter about puppy feeding?",
        answer:
          "The exact meal times, the amount per meal with the measuring tool named, the food brand and location, treat limits, and what to do if a meal is refused — including when to call you.",
      },
    ],
    related: [
      "pet-feeding-schedule-template",
      "dog-feeding-chart-by-weight",
      "pet-sitter-care-card-checklist",
    ],
  },
  {
    slug: "how-to-give-a-dog-a-pill",
    title: "How to give a dog a pill without the fight",
    metaTitle: "How to Give a Dog a Pill: 6 Methods That Work — Pet Care Card",
    description:
      "Practical ways to give a dog a tablet or capsule — in food, in a pill pocket, or by hand — plus how to tell whether it was swallowed and how to write the instructions down for a sitter.",
    answer:
      "The easiest way to give a dog a pill is to hide it in a small, high-value food such as a pill pocket, a piece of cheese or a spoon of wet food, given as one of three quick treats so the dog swallows without inspecting it. If food hiding fails, give it by hand: tilt the head up, place the pill at the back of the tongue, close the mouth and stroke the throat until the dog licks and swallows. Never crush or split a tablet without asking your vet first.",
    published: "2026-09-03",
    updated: "2026-09-03",
    readMinutes: 6,
    medicalDisclaimer: true,
    intro: [
      "Giving medication is the step most likely to go wrong when someone else is looking after a dog. The dose gets spat out, hidden under a rug, or given twice because nobody recorded the first attempt.",
      "Below are the methods that usually work, in the order most owners find easiest, and how to write your dog's method down so a caregiver can repeat it.",
    ],
    sections: [
      {
        heading: "Before you start: check with your vet",
        paragraphs: [
          "Ask two things when the medication is prescribed: can it be given with food, and can it be split or crushed. Some tablets are coated for a reason, and some are absorbed differently with food. This page explains technique only — never change a dose, a schedule or a formulation on your own.",
        ],
      },
      {
        heading: "Method 1 — the three-treat trick",
        paragraphs: [
          "Prepare three small treats: one plain, one with the pill inside, one plain. Give them quickly in that order. Most dogs swallow the middle one without checking because they are focused on the next treat.",
        ],
      },
      {
        heading: "Method 2 — pill pockets and soft food",
        bullets: [
          "Commercial pill pockets, moulded around the tablet",
          "A small ball of wet food, pâté or plain cooked meat",
          "A spoon of plain yoghurt or a lick mat for capsules that can be given with food",
          "Cheese, if your dog tolerates dairy and is not on a restricted diet",
        ],
        paragraphs: [
          "Use the smallest amount of food that hides the pill. A big portion gives the dog room to chew around the tablet.",
        ],
      },
      {
        heading: "Method 3 — by hand",
        checklist: [
          "Sit the dog with their back to a wall or corner so they cannot reverse away",
          "Hold the pill between thumb and forefinger of one hand",
          "With the other hand over the muzzle, tilt the nose gently upward",
          "Open the lower jaw and place the pill as far back on the tongue as you can reach",
          "Close the mouth, keep the nose slightly raised, and stroke the throat",
          "Wait for a lick or swallow, then offer water or a treat",
        ],
      },
      {
        heading: "How to tell it was actually swallowed",
        paragraphs: [
          "Watch for a clear swallow and a lip lick. Then watch the dog for a minute or two — a dog who has pouched a tablet will usually walk off and spit it out somewhere quiet. Check the bed, the rug and under furniture if you are unsure.",
        ],
      },
      {
        heading: "Writing the instructions for a caregiver",
        checklist: [
          "Medication name exactly as printed on the label",
          "Dose and time, copied from the label rather than memory",
          "The method that works for your dog, described step by step",
          "Which food may be used to hide it, and which must be avoided",
          "Where the medication is stored",
          "What to do if a dose is refused or spat out, and who to call",
          "A place to tick off each dose so nobody doubles up",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I crush my dog's tablet into food?",
        answer:
          "Only if your vet says the tablet may be crushed. Some tablets are coated to control how they are absorbed or to protect the stomach, and crushing them can change how the medication works.",
      },
      {
        question: "What if my dog spits the pill out?",
        answer:
          "Do not automatically give another one. Re-offer the same tablet if it is intact and clean; if it is lost or damaged, contact your vet or the clinic's out-of-hours line before repeating a dose.",
      },
      {
        question: "How do I stop a sitter giving two doses?",
        answer:
          "Use a written medication log with a tick box per dose and per day, kept next to the medication. Every person giving a dose initials it. This is the simplest way to prevent accidental double dosing.",
      },
      {
        question: "Is it safe to hide a pill in cheese?",
        answer:
          "For many dogs yes, in a very small amount, but only if the medication may be given with food and the dog has no dairy intolerance or dietary restriction. Check with your vet if you are unsure.",
      },
    ],
    related: [
      "pet-medication-instructions-for-caregivers",
      "pet-sitter-care-card-checklist",
      "pet-emergency-contact-sheet",
    ],
  },
  {
    slug: "cat-feeding-schedule",
    title: "Cat feeding schedule: how often and how much",
    metaTitle: "Cat Feeding Schedule: How Often and How Much to Feed — Pet Care Card",
    description:
      "How many meals a day a cat needs, portion sizes for wet and dry food, kitten versus adult schedules, and how to write feeding instructions a cat sitter can follow exactly.",
    answer:
      "Most adult cats do well on two measured meals a day, roughly 12 hours apart, though many owners split the same daily amount into three or four smaller portions because cats naturally eat little and often. Kittens under six months usually need three to four meals a day. Measure the daily amount from the food's guide for your cat's weight, and keep the times consistent.",
    published: "2026-09-03",
    updated: "2026-09-03",
    readMinutes: 5,
    medicalDisclaimer: true,
    intro: [
      "Cats are grazers by instinct, but free-feeding dry food all day is one of the main reasons indoor cats gain weight. A measured schedule keeps portions honest and makes it obvious when a cat stops eating — which in cats is an urgent sign, not a minor one.",
    ],
    sections: [
      {
        heading: "How often to feed",
        bullets: [
          "Kittens up to 6 months: three to four small meals a day",
          "6 to 12 months: three meals a day, moving to two as growth slows",
          "Adult cats: two meals a day, about 12 hours apart, or the same amount split into three or four portions",
          "Senior cats: two to four smaller meals, following any vet advice for kidney, thyroid or dental conditions",
        ],
      },
      {
        heading: "How much per day",
        paragraphs: [
          "Start with the feeding guide on the packaging for your cat's weight, then adjust to body condition. A cat at a healthy weight has ribs you can feel under a thin fat layer and a visible waist from above. Wet and dry food have very different calorie densities, so if you feed both, split the daily guide proportionally rather than giving a full portion of each.",
        ],
      },
      {
        heading: "Water, bowls and placement",
        checklist: [
          "Fresh water daily, in a bowl away from the food",
          "Wide, shallow bowls — many cats dislike whiskers touching the sides",
          "Separate bowls and separate feeding spots in multi-cat homes",
          "Food away from the litter tray",
          "Wet food removed after 30 to 60 minutes if uneaten",
        ],
      },
      {
        heading: "What a cat sitter needs in writing",
        checklist: [
          "Exact meal times and the amount per meal",
          "Brand and flavour, and where the food is kept",
          "Which bowl belongs to which cat",
          "Treats allowed per day",
          "Litter tray locations and cleaning frequency",
          "When to worry: a cat that has not eaten for 24 hours needs a vet call",
        ],
      },
      {
        heading: "A cat that stops eating is not just fussy",
        paragraphs: [
          "Cats can develop serious liver problems if they go without food for a day or two, so a missed meal matters more than it would in a dog. Tell your sitter explicitly how long to wait before calling you and before calling the vet, and put both numbers on the card.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should cats eat twice a day or free-feed?",
        answer:
          "Measured meals are usually better for weight control and for spotting a loss of appetite early. Two meals a day suits most adult cats, and the same daily amount can be split into more, smaller portions if your cat prefers grazing.",
      },
      {
        question: "How much wet food does a cat need per day?",
        answer:
          "Follow the feeding guide on the specific product for your cat's weight, since calorie content varies widely between brands and flavours, then adjust based on body condition and your vet's advice.",
      },
      {
        question: "Can I leave a cat alone for a weekend with a full bowl?",
        answer:
          "It is not recommended. Cats need fresh water, a clean tray and someone checking that they are eating and behaving normally. Arrange a sitter or a daily visit and leave written instructions.",
      },
      {
        question: "How long can a cat go without eating before it is an emergency?",
        answer:
          "Contact your vet if a cat has not eaten for around 24 hours, sooner if they are also lethargic, vomiting or hiding. Prolonged fasting in cats can lead to serious liver complications.",
      },
    ],
    related: ["cat-sitter-instructions", "pet-feeding-schedule-template", "pet-sitter-care-card-checklist"],
  },
  {
    slug: "dog-feeding-chart-by-weight",
    title: "Dog feeding chart by weight",
    metaTitle: "Dog Feeding Chart by Weight: How Much to Feed Your Dog — Pet Care Card",
    description:
      "How to work out how much to feed a dog based on weight, activity and life stage, why packaging charts vary between foods, and how to record the final amount so a sitter feeds correctly.",
    answer:
      "Feeding amounts are based on your dog's weight, age and activity level, and every food has a different calorie density — so the chart printed on your bag is the correct starting point, not a generic table. Weigh your dog, read the guide for that weight on your specific food, divide the daily amount across meals, then adjust up or down based on body condition over a few weeks.",
    published: "2026-09-03",
    updated: "2026-09-03",
    readMinutes: 5,
    medicalDisclaimer: true,
    intro: [
      "\"How much should I feed my dog?\" has no single answer, because two foods at the same weight can differ by hundreds of calories per cup. What is consistent is the method: start from your food's own chart, measure properly, and adjust to the dog in front of you.",
    ],
    sections: [
      {
        heading: "Step 1 — get an accurate weight",
        paragraphs: [
          "Weigh your dog on a pet scale, or weigh yourself holding them and subtract your own weight. Most vet clinics will let you use their scale for free. Re-check monthly for puppies and every few months for adults.",
        ],
      },
      {
        heading: "Step 2 — read the chart on your food",
        paragraphs: [
          "Find the row for your dog's current weight on the packaging and note the daily amount, then check whether the figure is per day or per meal — this is a common and costly misreading. Puppy foods are usually charted by current weight and expected adult weight.",
        ],
      },
      {
        heading: "Step 3 — adjust for activity and life stage",
        bullets: [
          "Very active or working dogs may need more than the chart suggests",
          "Neutered, senior or largely indoor dogs often need less",
          "Dogs on prescription diets follow the vet's instruction, not the general chart",
          "Treats, chews and training rewards count toward the daily total — keep them under roughly 10% of it",
        ],
      },
      {
        heading: "Step 4 — check body condition, not the number",
        paragraphs: [
          "After two to four weeks, run your hands over your dog's ribs. You should feel them easily under a thin layer, with a visible waist from above and a tuck-up from the side. If not, adjust the daily amount by about 10% and reassess. Ask your vet before making bigger changes or if weight is dropping unexpectedly.",
        ],
      },
      {
        heading: "Step 5 — write the final amount down",
        checklist: [
          "Grams or cups per meal, with the measuring tool named",
          "Number of meals and the clock times",
          "Food brand and exact formula",
          "Treat allowance per day",
          "Any food that must be avoided, and why",
          "The date the amount was last reviewed",
        ],
      },
    ],
    faqs: [
      {
        question: "How much should I feed a 20kg dog?",
        answer:
          "It depends entirely on the food's calorie density, your dog's age and activity level. Use the chart on your specific food for a 20kg dog as the starting point, then adjust to body condition over a few weeks.",
      },
      {
        question: "Is it better to measure in cups or grams?",
        answer:
          "Grams on a kitchen scale are far more accurate. Cup volumes vary with kibble size and how tightly the cup is packed, which is why two people using the same cup can feed noticeably different amounts.",
      },
      {
        question: "Do treats count toward the daily amount?",
        answer:
          "Yes. Treats, chews and training rewards should stay within roughly 10% of daily calories, with meal portions reduced slightly if you use a lot of them.",
      },
      {
        question: "How do I stop a sitter from overfeeding?",
        answer:
          "Give an exact number in grams or a named measuring scoop, pre-portion meals into labelled bags or containers, and write the treat limit on the same card as the meal times.",
      },
    ],
    related: [
      "pet-feeding-schedule-template",
      "puppy-feeding-schedule-by-age",
      "what-to-leave-with-a-dog-sitter",
    ],
  },
  {
    slug: "pet-first-aid-basics-for-sitters",
    title: "Pet first aid basics for sitters",
    metaTitle: "Pet First Aid Basics for Sitters: What to Do First — Pet Care Card",
    description:
      "What a pet sitter should do in the first minutes of an emergency, what belongs in a pet first aid kit, and the information to leave so a caregiver can get help fast.",
    answer:
      "In a pet emergency the first three steps are always the same: keep yourself safe, call the vet or the nearest 24-hour emergency clinic and follow their instructions, and transport the pet calmly if told to. A sitter cannot make good decisions without the clinic's number, the address, the owner's number and written permission to authorise treatment — leave all four somewhere obvious before you travel.",
    published: "2026-09-03",
    updated: "2026-09-03",
    readMinutes: 6,
    medicalDisclaimer: true,
    intro: [
      "This is general preparation guidance, not veterinary instruction. Nothing here replaces a call to a vet — the goal is to make sure the person looking after your pet knows who to call and can act in the first few minutes without hunting for details.",
    ],
    sections: [
      {
        heading: "The first three minutes",
        checklist: [
          "Stay safe — a frightened or injured animal may bite, even a gentle one",
          "Call the vet clinic; outside opening hours call the 24-hour emergency clinic",
          "Describe what happened, when, and what the pet is doing right now",
          "Follow their instructions exactly; do not give any medication unless told to",
          "If asked to bring the pet in, use a carrier or a blanket to move them calmly",
          "Message the owner as soon as the pet is on the way to help",
        ],
      },
      {
        heading: "Signs that mean call now, not later",
        bullets: [
          "Difficulty breathing, choking or continuous coughing",
          "Collapse, seizures or unresponsiveness",
          "Bleeding that does not slow with gentle pressure",
          "Suspected poisoning, including chocolate, grapes, xylitol, medication or antifreeze",
          "Repeated vomiting or retching without producing anything, especially in a large-breed dog",
          "Straining to urinate, particularly in male cats",
          "A cat that has not eaten for around 24 hours",
        ],
      },
      {
        heading: "What belongs in a pet first aid kit",
        checklist: [
          "Vet and emergency clinic numbers printed on the lid",
          "Gauze, non-stick pads and self-adhesive bandage",
          "Blunt-ended scissors and tweezers",
          "Digital thermometer and disposable gloves",
          "Saline for flushing eyes and wounds",
          "A spare lead, a muzzle that fits, and a towel or blanket",
          "A copy of the pet's care card, including medications and known conditions",
        ],
      },
      {
        heading: "What to leave in writing before you go",
        paragraphs: [
          "Emergency information should be on its own, in large type, not buried in a paragraph. It should be findable by someone stressed and unfamiliar with your home.",
        ],
        checklist: [
          "Vet clinic name, phone number and full address",
          "Nearest 24-hour emergency clinic, with address",
          "Your number plus a second decision-maker",
          "Written spending authorisation with a limit, confirmed with your clinic",
          "Known conditions, allergies, previous reactions and current medications",
          "Microchip number and insurance policy details",
        ],
      },
      {
        heading: "Prepare the route, not just the number",
        paragraphs: [
          "Tell the sitter how far the emergency clinic is and how they would get there without a car if they do not have one. A number is useless at 2am if nobody can reach the building.",
        ],
      },
    ],
    faqs: [
      {
        question: "What should a pet sitter do first in an emergency?",
        answer:
          "Stay safe, then call the vet or emergency clinic immediately and follow their instructions. Contact the owner as soon as help is underway rather than delaying the call while trying to reach them.",
      },
      {
        question: "Should a sitter give medication in an emergency?",
        answer:
          "No, not unless a vet instructs them to. Human painkillers in particular can be dangerous or fatal to dogs and cats.",
      },
      {
        question: "How do I authorise a sitter to approve treatment?",
        answer:
          "Leave a written note with a spending limit, your signature and the date, and tell your clinic in advance that the named person may authorise treatment for your pet.",
      },
      {
        question: "What information does the vet ask for?",
        answer:
          "The pet's name, species, breed, age and weight, current medications and conditions, what happened and when, and the owner's contact details. Having all of this on one card saves several minutes.",
      },
    ],
    related: [
      "pet-emergency-contact-sheet",
      "pet-sitter-care-card-checklist",
      "pet-medication-instructions-for-caregivers",
    ],
  },
  {
    slug: "dog-sitter-checklist",
    title: "Dog sitter checklist before you leave",
    metaTitle: "Dog Sitter Checklist: Everything to Do Before You Leave — Pet Care Card",
    description:
      "A do-this-before-you-travel checklist for leaving a dog with a sitter: the walkthrough, the written instructions, supplies, house access, and the questions to agree in advance.",
    answer:
      "Before leaving a dog with a sitter, do four things: walk them through the routine in person, leave written feeding, routine, medication and emergency instructions, lay out enough supplies plus a little spare, and agree in advance how often they will update you and what they should do in an emergency. A single written care card covers the second point and prevents most of the questions that follow.",
    published: "2026-09-03",
    updated: "2026-09-03",
    readMinutes: 5,
    intro: [
      "Sitters rarely fail because they do not care. They fail because they were told twenty things in one doorway conversation and remembered twelve.",
      "Work through this the day before you travel, not on the way to the airport.",
    ],
    sections: [
      {
        heading: "A week before",
        checklist: [
          "Confirm dates, times and payment with the sitter in writing",
          "Book a meet-and-greet if the sitter has not met your dog",
          "Check you have enough food and medication for the whole stay plus two extra days",
          "Tell your vet who will be caring for your dog and what they may authorise",
          "Check the microchip details and ID tag are current",
        ],
      },
      {
        heading: "The day before",
        checklist: [
          "Write or update the care card: feeding, routine, medication, emergency, vet",
          "Pre-portion meals if amounts are easy to get wrong",
          "Lay out lead, harness, poo bags, towels and cleaning supplies in one place",
          "Wash bedding and leave a worn t-shirt with your scent",
          "Charge and test anything the sitter needs: key safe code, camera, alarm",
        ],
      },
      {
        heading: "The handover walkthrough",
        bullets: [
          "Show where food, treats, medication and supplies are stored",
          "Walk the actual route you take, including any road or gate to be careful with",
          "Demonstrate the lead, harness and any door routine",
          "Point out the emergency section of the card and where the printed copy lives",
          "Show bins, parking, the thermostat and anything that is off limits",
        ],
      },
      {
        heading: "Agree the rules up front",
        checklist: [
          "How often you want updates, and by what method",
          "Whether other people may enter the home",
          "Whether the dog may meet other dogs, go off-lead, or travel by car",
          "What to do if the dog is unwell — call threshold and spending limit",
          "What to do if the sitter cannot continue: a named backup person",
        ],
      },
      {
        heading: "Leave it where they will actually find it",
        paragraphs: [
          "Print one copy for the fridge or the food bowls, share a digital copy so it is on the sitter's phone during walks, and tape a QR code near the door. Whoever is standing in your kitchen at 7am should not need to scroll a message thread.",
        ],
      },
    ],
    faqs: [
      {
        question: "What should I leave for a dog sitter?",
        answer:
          "Written feeding, routine, medication and emergency instructions, enough food and medication for the stay plus a couple of spare days, walking gear, cleaning supplies, house access details, and your vet's contact information.",
      },
      {
        question: "How far in advance should I brief a dog sitter?",
        answer:
          "Send the written instructions a few days ahead so they can read them properly, then do a short in-person walkthrough on handover day to cover the house and the walking route.",
      },
      {
        question: "How often should a sitter send updates?",
        answer:
          "Agree it explicitly — once a day with a photo suits most owners, with an immediate message for anything unusual such as a refused meal, loose stools or limping.",
      },
      {
        question: "Do I need a written agreement with a pet sitter?",
        answer:
          "For paid sitters, a short written agreement covering dates, duties, payment, emergency authority and a backup contact avoids most disputes and makes expectations clear on both sides.",
      },
    ],
    related: [
      "what-to-leave-with-a-dog-sitter",
      "pet-sitter-care-card-checklist",
      "pet-first-aid-basics-for-sitters",
    ],
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
