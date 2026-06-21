import { describe, expect, it } from "vitest";
import {
  rewriteRequestSchema,
  translateRequestSchema,
  translateResponseSchema,
} from "@/lib/schemas";

describe("translateRequestSchema", () => {
  const validRequest = {
    inputText: "점메추 부탁",
    direction: "MZ_TO_SENIOR",
    formalityLevel: 3,
  };

  it("trims and accepts a valid input", () => {
    const result = translateRequestSchema.parse({ ...validRequest, inputText: "  점메추 부탁  " });
    expect(result.inputText).toBe("점메추 부탁");
  });

  it("rejects blank input", () => {
    expect(() => translateRequestSchema.parse({ ...validRequest, inputText: "   " })).toThrow();
  });

  it("accepts 500 characters and rejects 501 characters", () => {
    expect(
      translateRequestSchema.safeParse({ ...validRequest, inputText: "가".repeat(500) }).success,
    ).toBe(true);
    expect(
      translateRequestSchema.safeParse({ ...validRequest, inputText: "가".repeat(501) }).success,
    ).toBe(false);
  });

  it.each([
    [{ ...validRequest, direction: "UNKNOWN" }],
    [{ ...validRequest, formalityLevel: 0 }],
    [{ ...validRequest, formalityLevel: 6 }],
    [{ ...validRequest, formalityLevel: 2.5 }],
  ])("rejects an invalid option: %o", (request) => {
    expect(translateRequestSchema.safeParse(request).success).toBe(false);
  });
});

describe("rewriteRequestSchema", () => {
  it("rejects an unsupported audience", () => {
    expect(
      rewriteRequestSchema.safeParse({ inputText: "안녕하세요", audience: "STRANGER" }).success,
    ).toBe(false);
  });
});

describe("translateResponseSchema", () => {
  const explanation = {
    term: "점메추",
    meaning: "점심 메뉴 추천",
    nuance: "가벼움",
    usage: "친한 사이",
    caution: "공식적인 자리",
  };

  it("limits term explanations to five", () => {
    expect(
      translateResponseSchema.safeParse({
        resultText: "결과",
        termExplanations: Array.from({ length: 5 }, () => explanation),
      }).success,
    ).toBe(true);
    expect(
      translateResponseSchema.safeParse({
        resultText: "결과",
        termExplanations: Array.from({ length: 6 }, () => explanation),
      }).success,
    ).toBe(false);
  });
});
