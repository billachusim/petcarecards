export interface TemplateField {
  id: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
}

export interface TemplateGroup {
  heading: string;
  fields: TemplateField[];
  /** Printed in the emergency colour so a caregiver finds it fast. */
  urgent?: boolean;
}

export interface TemplateLog {
  heading: string;
  columns: string[];
  rows: number;
}

export interface TemplateTool {
  slug: string;
  /** Short name used in lists and links. */
  name: string;
  h1: string;
  metaTitle: string;
  description: string;
  intro: string[];
  groups: TemplateGroup[];
  log?: TemplateLog;
  tips: string[];
  faqs: { question: string; answer: string }[];
  relatedGuides: string[];
}

const petBasics: TemplateGroup = {
  heading: "The pet",
  fields: [
    { id: "petName", label: "Pet name", placeholder: "Biscuit" },
    {
      id: "petDetails",
      label: "Species, breed, age, weight",
      placeholder: "Dog, golden retriever, 4 years, 30 kg",
    },
    { id: "microchip", label: "Microchip number", placeholder: "985 112 003 456 789" },
  ],
};

const contacts: TemplateGroup = {
  heading: "Emergency contacts",
  urgent: true,
  fields: [
    { id: "owner", label: "Owner name and phone", placeholder: "Sam Rivera, 555-0142" },
    {
      id: "backup",
      label: "Backup contact (can make decisions)",
      placeholder: "Alex, neighbour with a key, 555-0178",
    },
    {
      id: "vet",
      label: "Vet clinic, phone and address",
      placeholder: "Riverside Animal Clinic, 555-0110, 24 Mill Road",
    },
    {
      id: "emergencyVet",
      label: "24-hour emergency clinic",
      placeholder: "City Pet ER, 555-0199, open all night",
    },
  ],
};

export const TEMPLATE_TOOLS: TemplateTool[] = [
  {
    slug: "dog-sitter-instructions",
    name: "Dog sitter instructions template",
    h1: "Dog sitter instructions template",
    metaTitle: "Dog Sitter Instructions Template (Free, Printable) — Pet Care Card",
    description:
      "Free dog sitter instructions template. Fill it in on screen with feeding, walks, house rules and emergency contacts, then print it or save it as a PDF. No sign-up.",
    intro: [
      "A dog sitter needs to know more than how much food goes in the bowl. They need the walk routine, the quirks that are normal for your dog, the house rules, and exactly who to call when something goes wrong.",
      "Type your details into the form below and the sheet builds itself underneath. Print it for the kitchen counter, or use your browser's Save as PDF to send it. Your answers stay in this browser and are never uploaded.",
    ],
    groups: [
      petBasics,
      {
        heading: "Feeding",
        fields: [
          {
            id: "food",
            label: "Food and where it is stored",
            placeholder: "Dry kibble in the blue tub under the sink",
          },
          {
            id: "amount",
            label: "Amount per meal and meal times",
            placeholder: "1 cup at 7:00 and 18:00",
          },
          {
            id: "treats",
            label: "Treats allowed",
            placeholder: "2 dental chews a day, no table scraps",
          },
          {
            id: "avoid",
            label: "Foods to avoid",
            placeholder: "Grapes, chocolate, cooked chicken bones",
          },
        ],
      },
      {
        heading: "Walks and routine",
        fields: [
          {
            id: "walks",
            label: "Walk times, length and route",
            placeholder: "30 min at 8:00 and 17:30, park loop",
          },
          {
            id: "leash",
            label: "Lead and behaviour on walks",
            placeholder: "Pulls toward squirrels, reactive to big dogs",
          },
          {
            id: "bathroom",
            label: "Bathroom routine",
            placeholder: "Garden first thing and before bed",
          },
          {
            id: "sleep",
            label: "Sleep and crate",
            placeholder: "Sleeps in crate in the kitchen, door open",
          },
        ],
      },
      {
        heading: "House rules",
        fields: [
          {
            id: "rules",
            label: "Off-limits areas and furniture",
            placeholder: "Not allowed upstairs or on the sofa",
            multiline: true,
          },
          {
            id: "quirks",
            label: "Normal quirks and warnings",
            placeholder: "Barks at the post, bolts at open doors",
            multiline: true,
          },
        ],
      },
      {
        heading: "Medication",
        fields: [
          {
            id: "meds",
            label: "Medication, as written on the vet's label",
            placeholder: "See the label on the box in the fridge door",
            multiline: true,
          },
        ],
      },
      contacts,
    ],
    tips: [
      'Write amounts in cups or grams. "One scoop" means nothing to someone who has never seen your scoop.',
      "Describe what normal looks like, so the sitter can tell when something is wrong.",
      "Say how much the vet may spend without calling you, so treatment is never delayed.",
      "Leave the lead, poo bags, food and medication together in one spot.",
    ],
    faqs: [
      {
        question: "What should I write in dog sitter instructions?",
        answer:
          "Cover your dog's basics and microchip number, feeding amounts and times, walks and bathroom routine, house rules, any medication exactly as your vet wrote it, and emergency contacts including your vet and a 24-hour clinic.",
      },
      {
        question: "Is this template really free?",
        answer:
          "Yes. Fill it in, print it, or save it as a PDF as often as you like. There is no account and nothing to download.",
      },
      {
        question: "Can I share it as a link instead of printing?",
        answer:
          "Yes. Pet Care Card turns the same details into a care card you can share by link or QR code and update after you have left.",
      },
    ],
    relatedGuides: [
      "what-to-leave-with-a-dog-sitter",
      "dog-sitter-checklist",
      "pet-sitter-care-card-checklist",
      "printable-pet-care-card-template",
    ],
  },
  {
    slug: "cat-sitter-instructions",
    name: "Cat sitter instructions template",
    h1: "Cat sitter instructions template",
    metaTitle: "Cat Sitter Instructions Template (Free, Printable) — Pet Care Card",
    description:
      "Free cat sitter instructions template for drop-in visits: feeding, litter, hiding spots, medication and emergency contacts. Fill it in, then print or save as PDF.",
    intro: [
      "Cat sitting usually means short drop-in visits, so the sitter has only a few minutes to check that everything is normal. Clear instructions about food, litter and where your cat hides make those minutes count.",
      "Fill in the form and the printable sheet updates as you type. Nothing is uploaded: your answers stay in this browser.",
    ],
    groups: [
      petBasics,
      {
        heading: "Feeding and water",
        fields: [
          {
            id: "food",
            label: "Wet and dry food, and where it is stored",
            placeholder: "Half a pouch wet, dry biscuits in the cupboard",
          },
          {
            id: "amount",
            label: "Amount and times",
            placeholder: "Half a pouch at 7:00 and 19:00, dry topped up once",
          },
          {
            id: "water",
            label: "Water and fountain",
            placeholder: "Refill the fountain daily, rinse every 2 days",
          },
        ],
      },
      {
        heading: "Litter",
        fields: [
          {
            id: "litter",
            label: "Where the trays are and how to clean them",
            placeholder: "Two trays in the utility room, scoop daily",
          },
          {
            id: "litterNormal",
            label: "What normal looks like",
            placeholder: "Two to three clumps a day",
          },
        ],
      },
      {
        heading: "Behaviour",
        fields: [
          {
            id: "hiding",
            label: "Hiding spots to check",
            placeholder: "Under the spare bed, top of the wardrobe",
            multiline: true,
          },
          {
            id: "indoor",
            label: "Indoor or outdoor, cat flap rules",
            placeholder: "Indoor only. Keep windows closed.",
          },
          {
            id: "warning",
            label: "Signs something is wrong",
            placeholder: "Not eating for a day, straining in the litter tray",
            multiline: true,
          },
        ],
      },
      {
        heading: "Medication",
        fields: [
          {
            id: "meds",
            label: "Medication, as written on the vet's label",
            placeholder: "Tablet in a treat each morning, see the label",
            multiline: true,
          },
        ],
      },
      contacts,
    ],
    tips: [
      "Ask the sitter to physically see your cat on every visit, not just notice that food has gone.",
      'List the hiding spots. A cat that hides from strangers can look "missing" on day one.',
      "A cat that stops eating needs a call to the vet sooner than a dog would. Say so on the sheet.",
    ],
    faqs: [
      {
        question: "What should a cat sitter know?",
        answer:
          "Feeding amounts and times, how to clean the litter trays, where your cat hides, whether it is allowed outside, any medication as your vet wrote it, and who to call in an emergency.",
      },
      {
        question: "How often should a cat sitter visit?",
        answer:
          "Most cats need at least one visit a day, and many owners book two. Write the agreed visit times on the sheet so the sitter and any backup know the plan.",
      },
      {
        question: "Can I update the instructions after I leave?",
        answer:
          "A printed sheet cannot change, but a Pet Care Card shared by link can. Edit it from your phone and the sitter sees the new version.",
      },
    ],
    relatedGuides: [
      "cat-sitter-instructions",
      "cat-feeding-schedule",
      "pet-sitter-care-card-checklist",
      "printable-pet-care-card-template",
    ],
  },
  {
    slug: "pet-emergency-contact-card",
    name: "Pet emergency contact card",
    h1: "Pet emergency contact card template",
    metaTitle: "Pet Emergency Contact Card Template (Free, Printable) — Pet Care Card",
    description:
      "Free printable pet emergency contact card: owner and backup contacts, vet and 24-hour clinic, medical notes and the spending limit you authorise. Fill in and print.",
    intro: [
      "In an emergency nobody has time to search through messages for a vet's number. An emergency contact card puts every number and decision in large type on one page that lives on the fridge.",
      "Fill in the fields below and print the card. Keep a photo of it on your phone, and give a copy to whoever has your spare key.",
    ],
    groups: [
      petBasics,
      contacts,
      {
        heading: "Medical notes",
        urgent: true,
        fields: [
          {
            id: "conditions",
            label: "Known conditions and allergies",
            placeholder: "Allergic to chicken. Heart murmur, grade 2.",
            multiline: true,
          },
          {
            id: "meds",
            label: "Current medication (from the vet's label)",
            placeholder: "See the label on the box in the fridge door",
            multiline: true,
          },
          {
            id: "limit",
            label: "Treatment spending limit you authorise",
            placeholder: "Up to $1,000 without calling me",
          },
          {
            id: "insurance",
            label: "Insurance provider and policy number",
            placeholder: "PetCover, policy 44-1029",
          },
        ],
      },
    ],
    tips: [
      "Write the vet's full address, not just the name, so a sitter can type it into a map.",
      "Name a backup who is allowed to make decisions if you cannot be reached.",
      "A spending limit stops treatment being delayed while someone tries to call you.",
    ],
    faqs: [
      {
        question: "What goes on a pet emergency contact card?",
        answer:
          "Your number and a backup contact, your vet's name, phone and address, the nearest 24-hour emergency clinic, known conditions and allergies, current medication, your insurance details and how much treatment you authorise without being called.",
      },
      {
        question: "Where should I keep it?",
        answer:
          "On the fridge or inside the front door, with a copy in your wallet and a photo on your phone. Give one to anyone who has a key to your home.",
      },
      {
        question: "Can a QR code replace the paper card?",
        answer:
          "It can sit beside it. Pet Care Card gives you a QR code that opens your pet's full care card, while the paper card still works if a phone battery is flat.",
      },
    ],
    relatedGuides: [
      "pet-emergency-contact-sheet",
      "pet-first-aid-basics-for-sitters",
      "pet-sitter-care-card-checklist",
    ],
  },
  {
    slug: "pet-medication-log",
    name: "Pet medication log",
    h1: "Pet medication log template",
    metaTitle: "Pet Medication Log Template (Free, Printable) — Pet Care Card",
    description:
      "Free printable pet medication log for caregivers: medication details copied from the vet's label, plus a dose-by-dose tick sheet so no dose is missed or doubled.",
    intro: [
      "When more than one person looks after a pet, the most common medication mistake is a dose given twice or not at all. A simple log, initialled after each dose, solves that.",
      "Copy the details exactly from your vet's label into the form, then print the sheet with the tick log underneath. This template organises your vet's instructions. It does not give medical advice.",
    ],
    groups: [
      { heading: "The pet", fields: petBasics.fields.slice(0, 2) },
      {
        heading: "Medication",
        fields: [
          {
            id: "medName",
            label: "Medication name (as printed on the label)",
            placeholder: "As printed on the vet's label",
          },
          {
            id: "dose",
            label: "Dose and how it is given",
            placeholder: "Copy exactly from the label",
          },
          {
            id: "times",
            label: "Time(s) of day and with or without food",
            placeholder: "8:00 with breakfast",
          },
          { id: "storage", label: "Where it is stored", placeholder: "Fridge door, top shelf" },
          {
            id: "method",
            label: "Method that works for this pet",
            placeholder: "Hidden in a small piece of cheese",
            multiline: true,
          },
          {
            id: "refused",
            label: "If a dose is refused or missed, call",
            placeholder: "Riverside Animal Clinic, 555-0110",
          },
        ],
      },
    ],
    log: {
      heading: "Dose log",
      columns: ["Date", "Time given", "Given by (initials)", "Notes"],
      rows: 14,
    },
    tips: [
      "Copy the dose word for word from the vet's label. Never round or guess.",
      "Ask the caregiver to initial each dose straight away, not at the end of the day.",
      "Write who to call if a dose is refused, vomited or missed, so nobody improvises.",
    ],
    faqs: [
      {
        question: "Why use a medication log for my pet?",
        answer:
          "It shows at a glance whether today's dose has been given and by whom, which prevents missed and doubled doses when several people are helping.",
      },
      {
        question: "Does this template tell me what dose to give?",
        answer:
          "No. It only records the instructions your vet has already given you. Always follow the label and ask your vet if anything is unclear.",
      },
      {
        question: "Can I get reminders instead?",
        answer:
          "Pet Care Card can remind you or your caregiver when a dose is due, alongside the full care card.",
      },
    ],
    relatedGuides: [
      "pet-medication-instructions-for-caregivers",
      "how-to-give-a-dog-a-pill",
      "pet-emergency-contact-sheet",
    ],
  },
  {
    slug: "pet-feeding-schedule",
    name: "Pet feeding schedule",
    h1: "Pet feeding schedule template",
    metaTitle: "Pet Feeding Schedule Template (Free, Printable) — Pet Care Card",
    description:
      "Free printable pet feeding schedule: food, exact amounts, meal times, treats and foods to avoid, plus a daily tick grid so nobody double-feeds. Fill in and print.",
    intro: [
      "Overfeeding while you are away is more common than underfeeding. Every visitor assumes nobody else has fed the pet. A feeding schedule with a tick grid fixes that in one glance.",
      "Fill in your pet's food and amounts below, then print the schedule and stick it near the food.",
    ],
    groups: [
      { heading: "The pet", fields: petBasics.fields.slice(0, 2) },
      {
        heading: "Food",
        fields: [
          {
            id: "food",
            label: "Food and where it is stored",
            placeholder: "Dry kibble in the blue tub under the sink",
          },
          { id: "amount", label: "Amount per meal (cups or grams)", placeholder: "1 cup (120 g)" },
          { id: "times", label: "Meal times", placeholder: "7:00 and 18:00" },
          { id: "treats", label: "Treats allowed per day", placeholder: "2 dental chews" },
          { id: "avoid", label: "Foods to avoid", placeholder: "Grapes, onions, chocolate" },
          {
            id: "refuse",
            label: "If they will not eat",
            placeholder: "Normal to skip one meal. Call me after two.",
          },
        ],
      },
    ],
    log: {
      heading: "Daily feeding log",
      columns: ["Day", "Meal 1", "Meal 2", "Treats", "Water", "Notes"],
      rows: 7,
    },
    tips: [
      "Write amounts in cups or grams and leave the measuring cup in the food tub.",
      "Note what counts as a normal appetite so a sitter knows when to worry.",
      "Use our feeding calculator if you are unsure how much your pet needs, then confirm with your vet.",
    ],
    faqs: [
      {
        question: "How do I make a feeding schedule for my pet sitter?",
        answer:
          "Write the food, where it is kept, the exact amount per meal, the meal times, treats allowed and foods to avoid, then add a tick grid so each meal is marked off.",
      },
      {
        question: "How much should I feed my dog or cat?",
        answer:
          "Start from the guidance on the food packet and your vet's advice. Our free feeding calculator gives a starting estimate from weight and life stage.",
      },
      {
        question: "Can feeding times trigger reminders?",
        answer:
          "Yes. In Pet Care Card you can set feeding reminders for yourself or your caregiver alongside the full care card.",
      },
    ],
    relatedGuides: [
      "pet-feeding-schedule-template",
      "dog-feeding-chart-by-weight",
      "cat-feeding-schedule",
    ],
  },
];

export const getTemplateTool = (slug: string) => TEMPLATE_TOOLS.find((t) => t.slug === slug);
