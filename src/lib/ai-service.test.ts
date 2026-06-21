import { describe, expect, it } from "vitest";
import { AIRefusalError } from "@/lib/api-error";
import {
  buildTranslationSystemPrompt,
  hasRefusal,
  requireParsed,
} from "@/lib/ai-service";
import { MZ_STYLE_GUIDE } from "@/lib/mz-style-guide";

describe("translation prompt", () => {
  it("includes the MZ translation contract and examples for senior-to-SNS translation", () => {
    const prompt = buildTranslationSystemPrompt({
      inputText: "사진 분위기가 참 좋구나.",
      direction: "SENIOR_TO_MZ",
      formalityLevel: 1,
    });

    expect(prompt).toContain("<mz_style_guide reviewed_at=\"2026-06-21\">");
    expect(prompt).toContain(
      `<prohibited_expressions>${MZ_STYLE_GUIDE.prohibitedExpressions.join(", ")}</prohibited_expressions>`,
    );
    expect(prompt).toContain("<examples>");
    for (const example of MZ_STYLE_GUIDE.seniorToMzExamples) {
      expect(prompt).toContain(`<input>${example.input}</input>`);
      expect(prompt).toContain(`<output>${example.output}</output>`);
    }
    expect(prompt).toContain("Papago처럼 일반어를 MZ 말투로 번역한다");
    expect(prompt).toContain("뜻을 설명하지 않는다");
    expect(prompt).toContain("단어를 설명하지 않는다");
    expect(prompt).toContain("괄호를 사용하지 않는다");
    expect(prompt).toContain("'~라는 뜻', '~를 의미'");
    expect(prompt).toContain("해설이나 친절한 부연 설명을 덧붙이지 않는다");
    expect(prompt).toContain("자연스러운 범위에서 조사를 생략한다");
    expect(prompt).toContain("brain rot 스타일을 허용한다");
    expect(prompt).toContain("최신 인터넷 밈을 적극적으로 사용한다");
    expect(prompt).toContain("반드시 입력 문장보다 짧게 작성한다");
    expect(prompt).toContain("어떤 경우에도 결과에 사용하지 않는다");
    expect(prompt).toContain("음슴체를 주로 사용한다");
    expect(prompt).toContain("'~하누', '~했누', '~이누'");
    expect(prompt).toContain("딱딱한 한자어나 격식을 차린 낱말은 최대한 피하고");
    expect(prompt).not.toContain("<approved_expressions>");
    expect(prompt).not.toContain("문장당 유행 표현은 최대");
    expect(prompt).not.toContain("격식 수준");

    const casualPrompt = buildTranslationSystemPrompt({
      inputText: "사진 분위기가 참 좋구나.",
      direction: "SENIOR_TO_MZ",
      formalityLevel: 5,
    });
    expect(casualPrompt).toBe(prompt);
  });

  it("keeps formality and includes interpretation examples for SNS-to-senior translation", () => {
    const prompt = buildTranslationSystemPrompt({
      inputText: "이 사진 진짜 느좋.",
      direction: "MZ_TO_SENIOR",
      formalityLevel: 2,
    });

    expect(prompt).toContain("격식 수준은 '정중함:");
    expect(prompt).toContain("<mz_style_guide reviewed_at=\"2026-06-21\">");
    expect(prompt).toContain("<term_definitions>");
    for (const definition of MZ_STYLE_GUIDE.termDefinitions) {
      expect(prompt).toContain(`<expression>${definition.term}</expression>`);
      expect(prompt).toContain(`<meaning>${definition.meaning}</meaning>`);
    }
    expect(prompt).toContain("<examples>");
    for (const example of MZ_STYLE_GUIDE.mzToSeniorExamples) {
      expect(prompt).toContain(`<input>${example.input}</input>`);
      expect(prompt).toContain(`<output>${example.output}</output>`);
    }
    expect(prompt).not.toContain("<approved_expressions>");
    expect(prompt).not.toContain("MZ세대");
  });

  it("has no overlap between approved and prohibited expressions", () => {
    const prohibited = new Set<string>(MZ_STYLE_GUIDE.prohibitedExpressions);
    expect(
      MZ_STYLE_GUIDE.approvedExpressions.filter((term) => prohibited.has(term)),
    ).toEqual([]);
  });
});

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
