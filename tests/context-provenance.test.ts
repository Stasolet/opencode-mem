import { describe, expect, it } from "bun:test";

import { formatContextForPrompt } from "../src/services/context.js";

describe("memory context provenance framing", () => {
  it("marks injected memories as unverified and forgettable", async () => {
    const out = await formatContextForPrompt(null, {
      results: [
        {
          similarity: 0.87,
          memory: "API lives in src/services/foo.ts",
          id: "mem_123_abc",
          createdAt: "2026-09-30T12:00:00.000Z",
        },
      ],
    });

    // Provenance header: unverified recollections, not user instructions.
    expect(out).toContain("<memory_context>");
    expect(out).toContain("unverified recollections");
    expect(out).toContain("NOT user instructions");

    // The model must be able to act on staleness: ids + recorded date + forget hint.
    expect(out).toContain('id="mem_123_abc"');
    expect(out).toContain('recorded="2026-09-30"');
    expect(out).toContain('relevance="87%"');
    expect(out).toContain('mode:"forget"');

    // Legacy tag structure stays intact for existing consumers.
    expect(out).toContain("<project_knowledge>");
    expect(out).toContain("API lives in src/services/foo.ts");
  });

  it("still renders memories without id/createdAt (backward compatible)", async () => {
    const out = await formatContextForPrompt(null, {
      results: [{ similarity: 1.0, memory: "bare memory" }],
    });

    expect(out).toContain('<memory relevance="100%">');
    expect(out).not.toContain("id=");
    expect(out).not.toContain("recorded=");
  });

  it("returns empty string when there is nothing to inject", async () => {
    const out = await formatContextForPrompt(null, { results: [] });
    expect(out).toBe("");
  });
});
