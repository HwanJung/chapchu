import { describe, expect, it } from "vitest";
import {
  aiTranslateResponseSchema,
  rewriteRequestSchema,
  translateRequestSchema,
  translateResponseSchema,
} from "@/lib/schemas";

describe("translateRequestSchema", () => {
  const validRequest = {
    inputText: "점메추 부탁",
    direction: "MZ_TO_SENIOR",
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

  it.each([[{ ...validRequest, direction: "UNKNOWN" }]])(
    "rejects an invalid option: %o",
    (request) => {
      expect(translateRequestSchema.safeParse(request).success).toBe(false);
    },
  );
});

describe("rewriteRequestSchema", () => {
  it("rejects an unsupported audience", () => {
    expect(
      rewriteRequestSchema.safeParse({ inputText: "안녕하세요", audience: "STRANGER" }).success,
    ).toBe(false);
  });

  it.each(["COWORKER", "FRIEND", "FAMILY"])(
    "rejects removed audience %s",
    (audience) => {
      expect(
        rewriteRequestSchema.safeParse({ inputText: "안녕하세요", audience }).success,
      ).toBe(false);
    },
  );
});

describe("translateResponseSchema", () => {
  const explanation = {
    term: "느좋",
    meaning: "느낌이 좋다.",
    example: "오늘 올린 사진 완전 느좋.",
  };

  it("accepts zero through five term explanations", () => {
    expect(
      translateResponseSchema.safeParse({
        resultText: "결과",
        termExplanations: [],
      }).success,
    ).toBe(true);
    expect(
      translateResponseSchema.safeParse({
        resultText: "결과",
        termExplanations: Array.from({ length: 5 }, (_, index) => ({
          ...explanation,
          term: `${explanation.term}${index}`,
        })),
      }).success,
    ).toBe(true);
  });

  it("rejects six term explanations", () => {
    expect(
      translateResponseSchema.safeParse({
        resultText: "결과",
        termExplanations: Array.from({ length: 6 }, () => explanation),
      }).success,
    ).toBe(false);
  });
});

describe("aiTranslateResponseSchema", () => {
  it("accepts an empty matched term list and rejects more than five terms", () => {
    expect(
      aiTranslateResponseSchema.safeParse({
        resultText: "결과",
        matchedTerms: [],
      }).success,
    ).toBe(true);
    expect(
      aiTranslateResponseSchema.safeParse({
        resultText: "결과",
        matchedTerms: ["1", "2", "3", "4", "5", "6"],
      }).success,
    ).toBe(false);
  });
});
