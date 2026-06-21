import { zodTextFormat } from "openai/helpers/zod";
import { AIRefusalError } from "@/lib/api-error";
import { MZ_STYLE_GUIDE } from "@/lib/mz-style-guide";
import { getOpenAIClient, getOpenAIModel } from "@/lib/openai";
import {
  rewriteResponseSchema,
  translateResponseSchema,
  type RewriteRequest,
  type RewriteResponse,
  type TranslateRequest,
  type TranslateResponse,
} from "@/lib/schemas";

const formalityDescriptions: Record<number, string> = {
  1: "매우 정중함: 공식적인 자리에서도 쓸 수 있는 존댓말",
  2: "정중함: 예의를 갖춘 자연스러운 존댓말",
  3: "보통: 일상에서 무난한 중립적 말투",
  4: "친근함: 가까운 사이에서 쓰는 편안한 말투",
  5: "매우 캐주얼: 아주 가까운 사이의 가볍고 자연스러운 말투",
};

const audienceDescriptions = {
  PROFESSOR: "교수님",
  BOSS: "직장 상사",
  COWORKER: "회사 동료",
  FRIEND: "친구",
  PARTNER: "연인",
  FAMILY: "가족",
} as const;

const sharedRules = `
- 원문의 핵심 의미, 의도, 사실관계를 반드시 유지한다.
- 원문에 없는 일정, 장소, 사유, 약속이나 인물 등 구체적인 사실을 만들지 않는다.
- 세대나 관계의 말투를 고정관념 또는 유일한 정답처럼 표현하지 않는다.
- 자연스러운 현대 한국어 문장으로 작성한다.
`;

function serializeExamples(
  examples: readonly { readonly input: string; readonly output: string }[],
): string {
  return examples
    .map(
      ({ input, output }) => `<example>
<input>${input}</input>
<output>${output}</output>
</example>`,
    )
    .join("\n");
}

function serializeTermDefinitions(
  definitions: readonly {
    readonly term: string;
    readonly meaning: string;
  }[],
): string {
  return definitions
    .map(
      ({ term, meaning }) => `<term>
<expression>${term}</expression>
<meaning>${meaning}</meaning>
</term>`,
    )
    .join("\n");
}

function buildSeniorToMzStyleGuide(): string {
  const examples = serializeExamples(MZ_STYLE_GUIDE.seniorToMzExamples);

  return `<mz_style_guide reviewed_at="${MZ_STYLE_GUIDE.reviewedAt}">
<prohibited_expressions>${MZ_STYLE_GUIDE.prohibitedExpressions.join(", ")}</prohibited_expressions>
<role>
- 너는 Papago처럼 일반어를 MZ 말투로 번역한다.
</role>
<absolute_prohibitions>
- 뜻을 설명하지 않는다.
- 단어를 설명하지 않는다.
- 괄호를 사용하지 않는다.
- '~라는 뜻', '~를 의미' 같은 표현을 사용하지 않는다.
- 해설이나 친절한 부연 설명을 덧붙이지 않는다.
</absolute_prohibitions>
<rules>
- prohibited_expressions의 표현은 어떤 경우에도 결과에 사용하지 않는다.
- 짧게 쓴다.
- 자연스러운 범위에서 조사를 생략한다.
- 독자가 문맥으로 이해한다고 가정하고 불필요한 내용을 덜어 낸다.
- brain rot 스타일을 허용한다.
- 문맥에 맞는 최신 인터넷 밈을 적극적으로 사용한다.
- resultText는 반드시 입력 문장보다 짧게 작성한다.
- 번역 결과인 resultText는 '~함', '~임', '~없음' 같은 음슴체를 주로 사용한다.
- 물음, 감탄, 상대의 행동에 대한 반응에는 '~하누', '~했누', '~이누' 같은 말끝을 문맥에 맞게 섞는다.
- 딱딱한 한자어나 격식을 차린 낱말은 최대한 피하고, 같은 뜻의 쉽고 일상적인 우리말을 우선한다.
- 원문에 꼭 필요한 이름이나 고유 명사를 제외하면 한자 표기는 사용하지 않는다.
- 모든 문장에 같은 말끝을 되풀이하거나 음슴체와 '~하누'를 한 문장에 억지로 함께 넣지 않는다.
</rules>
</mz_style_guide>
<examples>
${examples}
</examples>`;
}

function buildMzToSeniorStyleGuide(): string {
  const examples = serializeExamples(MZ_STYLE_GUIDE.mzToSeniorExamples);
  const termDefinitions = serializeTermDefinitions(
    MZ_STYLE_GUIDE.termDefinitions,
  );

  return `<mz_style_guide reviewed_at="${MZ_STYLE_GUIDE.reviewedAt}">
<term_definitions>
${termDefinitions}
</term_definitions>
<rules>
- term_definitions의 의미를 우선 기준으로 삼아 문맥에 맞게 풀어 쓴다.
- 표현의 표면적인 단어만 보고 뜻을 임의로 추측하지 않는다.
- 예시의 입력 표현이 문장에 포함되면 문맥과 격식 수준에 맞는 일반적인 표현으로 풀어 쓴다.
- 예시와 정확히 일치하지 않더라도 같은 표현의 활용형이나 띄어쓰기 변형은 같은 뜻으로 해석한다.
- 비유나 유행 표현의 의미를 풀되 원문의 감정과 의도는 유지한다.
</rules>
<examples>
${examples}
</examples>
</mz_style_guide>`;
}

export function buildTranslationSystemPrompt(request: TranslateRequest): string {
  const direction =
    request.direction === "MZ_TO_SENIOR"
      ? "최근 한국 SNS의 짧고 캐주얼한 표현을 중장년·노년층도 자연스럽게 이해할 표현으로"
      : "중장년·노년층에게 익숙한 표현을 최근 한국 SNS의 짧고 캐주얼한 문체로";

  const directionRules =
    request.direction === "SENIOR_TO_MZ"
      ? `- 입력 문장을 ${direction} 번역한다.
${buildSeniorToMzStyleGuide()}`
      : `- 입력 문장을 ${direction} 번역한다.
- 격식 수준은 '${formalityDescriptions[request.formalityLevel]}'이다.
${buildMzToSeniorStyleGuide()}`;

  return `당신은 한국어의 세대별 표현 차이를 문맥에 맞게 풀어 주는 편집자다.
${sharedRules}
${directionRules}`;
}

export function hasRefusal(output: unknown): boolean {
  if (!Array.isArray(output)) return false;

  return output.some((item) => {
    if (!item || typeof item !== "object" || !("content" in item)) return false;
    const content = (item as { content?: unknown }).content;
    return (
      Array.isArray(content) &&
      content.some(
        (part) =>
          part !== null &&
          typeof part === "object" &&
          "type" in part &&
          (part as { type: unknown }).type === "refusal",
      )
    );
  });
}

export function requireParsed<T>(parsed: T | null, output: unknown): T {
  if (hasRefusal(output)) throw new AIRefusalError();
  if (parsed === null) throw new Error("OpenAI returned no structured output.");
  return parsed;
}

export async function translateText(
  request: TranslateRequest,
): Promise<TranslateResponse> {
  const response = await getOpenAIClient().responses.parse({
    model: getOpenAIModel(),
    input: [
      {
        role: "system",
        content: buildTranslationSystemPrompt(request),
      },
      { role: "user", content: request.inputText },
    ],
    text: {
      format: zodTextFormat(translateResponseSchema, "generation_translation"),
    },
  });

  return requireParsed(response.output_parsed, response.output);
}

export async function rewriteText(
  request: RewriteRequest,
): Promise<RewriteResponse> {
  const response = await getOpenAIClient().responses.parse({
    model: getOpenAIModel(),
    input: [
      {
        role: "system",
        content: `당신은 사용자의 문장을 상대와의 관계에 맞게 다듬는 한국어 편집자다.
${sharedRules}
- 상대는 '${audienceDescriptions[request.audience]}'이다.
- 관계에 맞는 호칭, 인사, 어휘, 문장 구조를 사용한다.
- 필요한 경우에만 완곡한 표현과 자연스러운 맺음말을 보완한다.
- 가장 적합한 결과 문장 하나만 반환한다.`,
      },
      { role: "user", content: request.inputText },
    ],
    text: {
      format: zodTextFormat(rewriteResponseSchema, "audience_rewrite"),
    },
  });

  return requireParsed(response.output_parsed, response.output);
}
