import { defineTool } from "@lovable.dev/mcp-js";

import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_pets",
  title: "List pets",
  description:
    "List the pets backed up to the signed-in Pet Care Card account, with id, name, species and breed.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("backup_pets")
      .select("id, name, species, breed, sex, approximate_age, weight, updated_at")
      .order("name");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const pets = data ?? [];
    if (pets.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No pets found. Backup may be turned off in the Pet Care Card app, so this account has no saved pets yet.",
          },
        ],
        structuredContent: { pets: [] },
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(pets, null, 2) }],
      structuredContent: { pets },
    };
  },
});
