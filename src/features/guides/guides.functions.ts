import { createServerFn } from "@tanstack/react-start";

import type { Guide } from "./guides-data";

/** Public: published auto-written guides, merged into the static list by callers. */
export const getGeneratedGuides = createServerFn({ method: "GET" }).handler(async (): Promise<Guide[]> => {
  const { fetchPublishedGeneratedGuides } = await import("./generated-guides.server");
  return fetchPublishedGeneratedGuides();
});
