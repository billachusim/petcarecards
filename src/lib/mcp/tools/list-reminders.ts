import { defineTool } from "@lovable.dev/mcp-js";

import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_reminders",
  title: "List reminders",
  description:
    "List the care reminders saved on the signed-in Pet Care Card account, such as medication or feeding reminders.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.from("backup_reminders").select("*");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const reminders = data ?? [];
    return {
      content: [{ type: "text", text: JSON.stringify(reminders, null, 2) }],
      structuredContent: { reminders },
    };
  },
});
