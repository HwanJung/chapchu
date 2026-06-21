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

  it("returns structured translation data", async () => {
    const result = { resultText: "점심 메뉴를 추천해 주세요." };
    translateText.mockResolvedValue(result);

    const response = await POST(
      request({ inputText: "점메추 부탁", direction: "MZ_TO_SENIOR", formalityLevel: 2 }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(result);
    expect(translateText).toHaveBeenCalledWith({
      inputText: "점메추 부탁",
      direction: "MZ_TO_SENIOR",
      formalityLevel: 2,
    });
  });

  it("returns a common validation error", async () => {
    const response = await POST(
      request({ inputText: " ", direction: "INVALID", formalityLevel: 7 }),
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      code: "VALIDATION_ERROR",
      message: "입력 내용을 확인해 주세요.",
    });
    expect(translateText).not.toHaveBeenCalled();
  });
});
