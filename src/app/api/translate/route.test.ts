import { beforeEach, describe, expect, it, vi } from "vitest";

const { translateText } = vi.hoisted(() => ({ translateText: vi.fn() }));

vi.mock("@/lib/ai-service", () => ({ translateText }));

import { POST } from "@/app/api/translate/route";

function request(body: unknown) {
  return new Request("http://localhost/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/translate", () => {
  beforeEach(() => translateText.mockReset());

  it("returns dictionary-backed explanations for registered matched terms", async () => {
    translateText.mockResolvedValue({
      resultText: "이 사진은 느낌이 정말 좋습니다.",
      matchedTerms: ["느좋"],
    });

    const response = await POST(
      request({ inputText: "이 사진 진짜 느좋.", direction: "MZ_TO_SENIOR" }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      resultText: "이 사진은 느낌이 정말 좋습니다.",
      termExplanations: [
        {
          term: "느좋",
          meaning: "느낌이 좋다.",
          example: "오늘 올린 사진 완전 느좋.",
        },
      ],
    });
    expect(translateText).toHaveBeenCalledWith({
      inputText: "이 사진 진짜 느좋.",
      direction: "MZ_TO_SENIOR",
    });
  });

  it("removes unknown and duplicate terms while preserving dictionary order", async () => {
    translateText.mockResolvedValue({
      resultText: "사진 느좋이고 선곡도 감다살임.",
      matchedTerms: ["느좋", "미등록 표현", "느좋", "감다살"],
    });

    const response = await POST(
      request({ inputText: "사진과 선곡이 좋습니다.", direction: "SENIOR_TO_MZ" }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      resultText: "사진 느좋이고 선곡도 감다살임.",
      termExplanations: [
        {
          term: "느좋",
          meaning: "느낌이 좋다.",
          example: "오늘 올린 사진 완전 느좋.",
        },
        {
          term: "감다살",
          meaning: "감각이 살아 있어 분위기나 상황을 잘 살렸다.",
          example: "선곡 진짜 감다살이다.",
        },
      ],
    });
  });

  it("returns no explanations when the AI matched no dictionary terms", async () => {
    translateText.mockResolvedValue({
      resultText: "마라탕 먹자.",
      matchedTerms: [],
    });

    const response = await POST(
      request({ inputText: "마라탕 먹자.", direction: "MZ_TO_SENIOR" }),
    );

    expect(await response.json()).toEqual({
      resultText: "마라탕 먹자.",
      termExplanations: [],
    });
  });

  it("returns a common validation error", async () => {
    const response = await POST(
      request({ inputText: " ", direction: "INVALID" }),
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      code: "VALIDATION_ERROR",
      message: "입력 내용을 확인해 주세요.",
    });
    expect(translateText).not.toHaveBeenCalled();
  });
});
