import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_care_card",
  title: "Get care card",
  description:
    "Read one pet's full care card: feeding, routine, medications, emergency contacts and vet details. Accepts a pet id or name.",
  inputSchema: {
    pet: z.string().trim().min(1).describe("Pet id or pet name as saved in Pet Care Card."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ pet }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);

    const byId = await supabase.from("backup_pets").select("*").eq("id", pet).maybeSingle();
    if (byId.error && byId.error.code !== "22P02") {
      throw new ToolError(byId.error.message);
    }
    let record = byId.data ?? null;
    if (!record) {
      const byName = await supabase
        .from("backup_pets")
        .select("*")
        .ilike("name", pet)
        .limit(1)
        .maybeSingle();
      if (byName.error) throw new ToolError(byName.error.message);
      record = byName.data ?? null;
    }
    if (!record) {
      throw new ToolError(`No saved pet matches "${pet}". Use list_pets to see available pets.`);
    }

    const petId = String((record as { id: string }).id);
    const related = async (table: string) => {
      const { data, error } = await supabase.from(table).select("*").eq("pet_id", petId);
      if (error) throw new ToolError(error.message);
      return data ?? [];
    };

    const [feeding, routine, medications, emergency, vets] = await Promise.all([
      related("backup_feedings"),
      related("backup_routines"),
      related("backup_medications"),
      related("backup_emergency_contacts"),
      related("backup_vets"),
    ]);

    const { photo_data_url: _photo, ...petFields } = record as Record<string, unknown>;
    const card = {
      pet: petFields,
      feeding: feeding[0] ?? null,
      routine: routine[0] ?? null,
      medications,
      emergencyContacts: emergency,
      vets,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(card, null, 2) }],
      structuredContent: card,
    };
  },
});
