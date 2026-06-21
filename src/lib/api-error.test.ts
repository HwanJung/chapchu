import { describe, expect, it } from "vitest";
import { z } from "zod";
import { AIRefusalError, classifyApiError } from "@/lib/api-error";

describe("classifyApiError", () => {
  it("maps validation errors to 400", () => {
    const error = z.object({ value: z.string() }).safeParse({ value: 1 }).error;
    expect(classifyApiError(error)).toMatchObject({
      status: 400,
      code: "VALIDATION_ERROR",
    });
  });

  it("maps model refusals to 422", () => {
    expect(classifyApiError(new AIRefusalError())).toMatchObject({
      status: 422,
      code: "AI_REFUSAL",
    });
  });

  it("maps timeout, authentication, rate limit and unknown failures to 502", () => {
    for (const error of [
      Object.assign(new Error("timeout"), { name: "APIConnectionTimeoutError" }),
      Object.assign(new Error("auth"), { status: 401 }),
      Object.assign(new Error("rate limit"), { status: 429 }),
      Object.assign(new Error("server"), { status: 500 }),
    ]) {
      expect(classifyApiError(error)).toMatchObject({ status: 502, code: "UPSTREAM_ERROR" });
    }
  });
});
