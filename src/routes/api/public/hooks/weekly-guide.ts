import { createFileRoute } from "@tanstack/react-router";

/**
 * Weekly guide generator, called by the scheduler.
 * Public prefix, so the shared secret is the only authentication.
 */
export const Route = createFileRoute("/api/public/hooks/weekly-guide")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["WEEKLY_GUIDE_SECRET"];
        if (!secret) {
          return Response.json({ error: "Job secret is not configured" }, { status: 500 });
        }

        const provided =
          request.headers.get("x-weekly-guide-secret") ??
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
          "";

        if (provided !== secret) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        let force = false;
        try {
          const body = (await request.json()) as { force?: boolean } | null;
          force = Boolean(body?.force);
        } catch {
          /* empty body is fine */
        }

        const { runWeeklyGuideJob } = await import("@/features/guides/guide-generator.server");
        const result = await runWeeklyGuideJob(force);

        return Response.json(result, {
          status: result.status === "failed" || result.status === "paused" ? 500 : 200,
        });
      },
    },
  },
});
