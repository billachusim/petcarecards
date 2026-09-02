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
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
