import type { CareCard } from "@/features/pets/models";

interface Line {
  text: string;
  style: "h1" | "h2" | "label" | "body";
}

const has = (value?: string) => Boolean(value && value.trim().length > 0);

function buildLines(card: CareCard): Line[] {
  const lines: Line[] = [];
  const { pet } = card;

  lines.push({ text: pet.name, style: "h1" });
  const subtitle = [pet.species, pet.breed].filter(has).join(" · ");
  if (subtitle) lines.push({ text: subtitle, style: "body" });

  const about = [
    pet.sex ? `Sex: ${pet.sex}` : "",
    pet.approximateAge ? `Age: ${pet.approximateAge}` : "",
    pet.dateOfBirth ? `Date of birth: ${pet.dateOfBirth}` : "",
    pet.weight ? `Weight: ${pet.weight}` : "",
    pet.personality ? `Personality: ${pet.personality}` : "",
    pet.thingsToKnow ? `Things to know: ${pet.thingsToKnow}` : "",
  ].filter(has);
  if (about.length) {
    lines.push({ text: "About", style: "h2" });
    about.forEach((text) => lines.push({ text, style: "body" }));
  }

  if (card.feedings.length) {
    lines.push({ text: "Feeding", style: "h2" });
    card.feedings.forEach((f, index) => {
      lines.push({ text: f.foodName || `Feeding ${index + 1}`, style: "label" });
      [
        f.amount ? `Amount: ${f.amount}` : "",
        f.times ? `Times: ${f.times}` : "",
        f.mealsPerDay ? `Meals per day: ${f.mealsPerDay}` : "",
        f.treats ? `Treats: ${f.treats}` : "",
        f.foodsToAvoid ? `Foods to avoid: ${f.foodsToAvoid}` : "",
        f.notes ? `Notes: ${f.notes}` : "",
      ]
        .filter(has)
        .forEach((text) => lines.push({ text, style: "body" }));
    });
  }

  const routine = card.routine;
  const routineRows = routine
    ? [
        routine.walkSchedule ? `Walks: ${routine.walkSchedule}` : "",
        routine.playtime ? `Playtime: ${routine.playtime}` : "",
        routine.sleepRoutine ? `Sleep: ${routine.sleepRoutine}` : "",
        routine.bathroomRoutine ? `Bathroom: ${routine.bathroomRoutine}` : "",
        routine.crateInstructions ? `Crate: ${routine.crateInstructions}` : "",
        routine.indoorOutdoorNotes ? `Indoor / outdoor: ${routine.indoorOutdoorNotes}` : "",
        routine.other ? `Other: ${routine.other}` : "",
      ].filter(has)
    : [];
  if (routineRows.length) {
    lines.push({ text: "Daily routine", style: "h2" });
    routineRows.forEach((text) => lines.push({ text, style: "body" }));
  }

  if (card.medications.length) {
    lines.push({ text: "Medication", style: "h2" });
    card.medications.forEach((m) => {
      lines.push({ text: m.name, style: "label" });
      [
        m.dosage ? `Instructions: ${m.dosage}` : "",
        m.time ? `Time: ${m.time}` : "",
        m.frequency ? `Frequency: ${m.frequency}` : "",
        m.startDate || m.endDate ? `Dates: ${m.startDate ?? "—"} to ${m.endDate ?? "ongoing"}` : "",
        m.notes ? `Notes: ${m.notes}` : "",
      ]
        .filter(has)
        .forEach((text) => lines.push({ text, style: "body" }));
    });
    lines.push({
      text: "This card only records instructions provided by the owner. It is not medical advice.",
      style: "body",
    });
  }

  const emergency = card.emergency;
  const emergencyRows = emergency
    ? [
        emergency.primaryName || emergency.primaryPhone
          ? `Primary: ${[emergency.primaryName, emergency.primaryPhone].filter(has).join(" · ")}`
          : "",
        emergency.secondaryName || emergency.secondaryPhone
          ? `Secondary: ${[emergency.secondaryName, emergency.secondaryPhone].filter(has).join(" · ")}`
          : "",
        emergency.specialInstructions ? `Instructions: ${emergency.specialInstructions}` : "",
      ].filter(has)
    : [];
  if (emergencyRows.length) {
    lines.push({ text: "Emergency", style: "h2" });
    emergencyRows.forEach((text) => lines.push({ text, style: "body" }));
  }

  const vet = card.veterinarian;
  const vetRows = vet
    ? [
        vet.vetName ? `Veterinarian: ${vet.vetName}` : "",
        vet.clinicName ? `Clinic: ${vet.clinicName}` : "",
        vet.phone ? `Phone: ${vet.phone}` : "",
        vet.address ? `Address: ${vet.address}` : "",
      ].filter(has)
    : [];
  if (vetRows.length) {
    lines.push({ text: "Veterinarian", style: "h2" });
    vetRows.forEach((text) => lines.push({ text, style: "body" }));
  }

  return lines;
}

/**
 * Generates the Care Card PDF off the critical render path (dynamic import +
 * yielding to the event loop) so the UI never freezes.
 */
export async function generateCareCardPdf(card: CareCard): Promise<Blob> {
  try {
    const { jsPDF } = await import("jspdf");
    await new Promise((resolve) => setTimeout(resolve, 0));

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 56;
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    const ensureSpace = (needed: number) => {
      if (y + needed > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    if (card.pet.photoDataUrl) {
      try {
        ensureSpace(120);
        doc.addImage(card.pet.photoDataUrl, "JPEG", margin, y, 96, 96, undefined, "FAST");
        y += 112;
      } catch {
        /* photo is optional */
      }
    }

    for (const line of buildLines(card)) {
      const config = {
        h1: { size: 26, style: "bold" as const, gap: 14, top: 0 },
        h2: { size: 14, style: "bold" as const, gap: 8, top: 18 },
        label: { size: 12, style: "bold" as const, gap: 4, top: 8 },
        body: { size: 11, style: "normal" as const, gap: 4, top: 0 },
      }[line.style];

      doc.setFont("helvetica", config.style);
      doc.setFontSize(config.size);
      const wrapped = doc.splitTextToSize(line.text, maxWidth) as string[];
      const blockHeight = wrapped.length * (config.size + 4);
      y += config.top;
      ensureSpace(blockHeight);
      doc.text(wrapped, margin, y);
      y += blockHeight + config.gap;
    }

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    ensureSpace(20);
    doc.text(
      `Pet Care Card · generated ${new Date(card.generatedAt).toLocaleDateString()}`,
      margin,
      pageHeight - 32,
    );

    return doc.output("blob");
  } catch {
    throw new Error("We couldn't build the PDF. Please try again in a moment.");
  }
}

export function pdfFileName(petName: string): string {
  const safe = petName.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "pet";
  return `${safe.toLowerCase()}-care-card.pdf`;
}
