import { auth, defineMcp } from "@lovable.dev/mcp-js";

import getCareCardTool from "./tools/get-care-card";
import listPetsTool from "./tools/list-pets";
import listRemindersTool from "./tools/list-reminders";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "pet-care-cards",
  title: "Pet Care Cards",
  version: "0.1.0",
  instructions:
    "Read the signed-in user's pet care cards from Pet Care Card. Use `list_pets` to find a pet, `get_care_card` for that pet's feeding, routine, medication, emergency and vet details, and `list_reminders` for saved care reminders. Only pets the user has backed up to their account are visible; if nothing is returned, backup is likely turned off in the app.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listPetsTool, getCareCardTool, listRemindersTool],
});
