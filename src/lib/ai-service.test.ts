import { describe, expect, it } from "vitest";
import { AIRefusalError } from "@/lib/api-error";
import {
  buildTranslationSystemPrompt,
  hasRefusal,
  requireParsed,
} from "@/lib/ai-service";
import { MEME_DICTIONARY } from "@/lib/meme-dictionary";
import { MZ_STYLE_GUIDE } from "@/lib/mz-style-guide";

describe("translation prompt", () => {
  it("includes the dictionary and MZ few-shot examples for senior-to-SNS translation", () => {
    const prompt = buildTranslationSystemPrompt({
      inputText: "사진 분위기가 참 좋구나.",
      direction: "SENIOR_TO_MZ",
    });

    expect(prompt).toContain("<mz_style_guide reviewed_at=\"2026-06-21\">");
    expect(prompt).toContain(
      `<prohibited_expressions>${MZ_STYLE_GUIDE.prohibitedExpressions.join(", ")}</prohibited_expressions>`,
    );
    expect(prompt).toContain(`<meme_dictionary>
${JSON.stringify(MEME_DICTIONARY, null, 2)}
</meme_dictionary>`);
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
    expect(prompt).toContain(
      "원문의 의미와 meme_dictionary의 meaning, tags, examples가 모두 문맥에 맞는 항목을 우선 선택한다",
    );
    expect(prompt).toContain("밈을 억지로 사용하지 않는다");
    expect(prompt).not.toContain("<approved_expressions>");
    expect(prompt).not.toContain("문장당 유행 표현은 최대");
    expect(prompt).not.toContain("격식 수준");
  });

  it("uses dictionary meanings and context for a known meme", () => {
    const prompt = buildTranslationSystemPrompt({
      inputText: "이 사진 진짜 느좋.",
      direction: "MZ_TO_SENIOR",
    });

    expect(prompt).not.toContain("격식 수준");
    expect(prompt).toContain("<mz_style_guide reviewed_at=\"2026-06-21\">");
    expect(prompt).toContain("<meme_dictionary>");
    expect(prompt).toContain('"term": "느좋"');
    expect(prompt).toContain('"meaning": "느낌이 좋다."');
    expect(prompt).toContain(
      "밈을 발견하면 meaning을 우선하고 examples로 문맥을 판단해 일반적인 표현으로 풀어 쓴다",
    );
    expect(prompt).not.toContain("<examples>");
    expect(prompt).not.toContain("<approved_expressions>");
    expect(prompt).not.toContain("MZ세대");
  });

  it("does not force a meme when translating an unrelated general sentence", () => {
    const prompt = buildTranslationSystemPrompt({
      inputText: "내일 오전 열 시에 병원에 갑니다.",
      direction: "SENIOR_TO_MZ",
    });

    expect(prompt).toContain("문맥에 맞는 사전 항목이 없으면 밈을 억지로 사용하지 않는다");
    expect(prompt).toContain("원문의 핵심 의미, 의도, 사실관계를 반드시 유지한다");
  });

  it("allows a natural out-of-dictionary meme without copying example details", () => {
    const prompt = buildTranslationSystemPrompt({
      inputText: "오늘 일이 예상보다 잘 풀렸습니다.",
      direction: "SENIOR_TO_MZ",
    });

    expect(prompt).toContain(
      "문맥상 자연스러우면 meme_dictionary에 없는 밈도 사용할 수 있다",
    );
    expect(prompt).toContain(
      "examples의 인물이나 상황을 번역 결과에 복사하지 않는다",
    );
  });

  it("prioritizes prohibited expressions over a dictionary match", () => {
    const prompt = buildTranslationSystemPrompt({
      inputText: "정말 놀랍고 훌륭합니다.",
      direction: "SENIOR_TO_MZ",
    });

    expect(prompt).toContain("prohibited_expressions는 meme_dictionary보다 우선");
    expect(prompt).toContain("어떤 경우에도 결과에 사용하지 않는다");
    expect(prompt).toContain("대박");
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
