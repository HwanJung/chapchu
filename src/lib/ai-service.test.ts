import { describe, expect, it } from "vitest";
import { AIRefusalError } from "@/lib/api-error";
import { hasRefusal, requireParsed } from "@/lib/ai-service";

describe("structured output handling", () => {
  it("returns parsed structured output", () => {
    const parsed = { resultText: "안녕하세요." };
    expect(requireParsed(parsed, [])).toBe(parsed);
  });

  it("detects a refusal content item", () => {
    const output = [
      {
        type: "message",
        content: [{ type: "refusal", refusal: "처리할 수 없습니다." }],
      },
    ];
    expect(hasRefusal(output)).toBe(true);
    expect(() => requireParsed(null, output)).toThrow(AIRefusalError);
  });

  it("rejects an empty structured response", () => {
    expect(() => requireParsed(null, [])).toThrow("no structured output");
  });
});
