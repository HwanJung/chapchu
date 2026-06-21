import { zodTextFormat } from "openai/helpers/zod";
import { AIRefusalError } from "@/lib/api-error";
import { MEME_DICTIONARY } from "@/lib/meme-dictionary";
import { MZ_STYLE_GUIDE } from "@/lib/mz-style-guide";
import { getOpenAIClient, getOpenAIModel } from "@/lib/openai";
import {
  aiTranslateResponseSchema,
  rewriteResponseSchema,
  type AiTranslateResponse,
  type RewriteRequest,
  type RewriteResponse,
  type TranslateRequest,
} from "@/lib/schemas";

const audienceDescriptions = {
  PROFESSOR: "교수님",
  BOSS: "직장 상사",
  PARTNER: "연인",
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

function buildMemeDictionaryReference(): string {
  return `<prohibited_expressions>${MZ_STYLE_GUIDE.prohibitedExpressions.join(", ")}</prohibited_expressions>
<meme_dictionary>
${JSON.stringify(MEME_DICTIONARY, null, 2)}
</meme_dictionary>
<meme_dictionary_rules>
- meme_dictionary는 우선 참고 자료다.
- examples는 의미와 사용 맥락을 판단하는 용도로만 사용하고, examples의 인물이나 상황을 번역 결과에 복사하지 않는다.
- prohibited_expressions는 meme_dictionary보다 우선하며, 포함된 표현은 어떤 경우에도 결과에 사용하지 않는다.
</meme_dictionary_rules>`;
}

function buildSeniorToMzStyleGuide(): string {
  const examples = serializeExamples(MZ_STYLE_GUIDE.seniorToMzExamples);

  return `<mz_style_guide reviewed_at="${MZ_STYLE_GUIDE.reviewedAt}">
<role>
- 너는 Papago처럼 일반어를 MZ 말투로 번역한다.
</role>
<absolute_prohibitions>
- 뜻을 설명하지 않는다.
- 단어를 설명하지 않는다.
- 괄호를 사용하지 않는다.
- '~라는 뜻', '~를 의미' 같은 표현을 사용하지 않는다.
- 해설이나 친절한 부연 설명을 덧붙이지 않는다.
- prohibited_expressions의 표현은 결과에 사용하지 않는다.
</absolute_prohibitions>
<rules>
- 원문의 사건, 감정, 원인과 결과를 빠뜨리지 않고 모두 유지한다.
- 요청, 질문, 명령, 부정 등 원문의 발화 기능을 유지한다. 요청을 서술로 바꾸지 않는다. 예를 들어 '위로해 줘'를 '위로함'으로 바꾸지 않는다.
- 밈, 감탄사, 의성어와 의태어는 핵심 내용을 보조할 때만 사용하고, 핵심 내용을 대신하게 하지 않는다.
- 자연스러운 범위에서 조사를 생략한다.
- 의미가 손실되지 않는 범위에서만 불필요한 내용을 덜어 내고 간결하게 작성한다.
- 문맥에 맞는 최신 인터넷 밈은 문장당 최대 ${MZ_STYLE_GUIDE.maxTrendExpressionsPerSentence}개만 사용한다.
- 서술문에는 문맥에 따라 '~함', '~임', '~없음' 같은 음슴체를 사용할 수 있지만, 요청문과 의문문의 기능은 유지한다.
- 한 문장을 과하게 분리하지 않는다.
- 물음, 감탄, 상대의 행동에 대한 반응에는 '~하누', '~했누', '~이누' 같은 말끝을 문맥에 맞게 섞는다.
- "ㅋㅋ", "ㄹㅇ", "ㅇㅈ", "ㄱㄱ", "ㄴㄴ" 등은 자연스럽게 사용한다.
- 딱딱한 한자어나 격식을 차린 낱말은 최대한 피하고, 같은 뜻의 쉽고 일상적인 우리말을 우선한다.
- 원문의 의미와 meme_dictionary의 meaning, tags, examples가 모두 문맥에 맞는 항목을 우선 선택한다.
- 문맥에 맞는 사전 항목이 없으면 밈을 억지로 사용하지 않는다.
- 문맥상 자연스러우면 meme_dictionary에 없는 밈도 사용할 수 있다.
</rules>
</mz_style_guide>
<examples>
${examples}
</examples>`;
}

function buildMzToSeniorStyleGuide(): string {
  return `<mz_style_guide reviewed_at="${MZ_STYLE_GUIDE.reviewedAt}">
<rules>
- 표현의 표면적인 단어만 보고 뜻을 임의로 추측하지 않는다.
- 입력에서 meme_dictionary의 밈을 발견하면 meaning을 우선하고 examples로 문맥을 판단해 일반적인 표현으로 풀어 쓴다.
- term과 정확히 일치하지 않더라도 같은 표현의 활용형이나 띄어쓰기 변형은 같은 뜻으로 해석한다.
- meme_dictionary에 없는 밈도 문맥에 따라 해석하되 결과는 일반적인 표현으로 쓴다.
- 비유나 유행 표현의 의미를 풀되 원문의 감정과 의도는 유지한다.
</rules>
</mz_style_guide>`;
}

function buildMatchedTermsRules(request: TranslateRequest): string {
  const target =
    request.direction === "MZ_TO_SENIOR"
      ? "입력 문장 inputText에서 실제로 밈 의미로 사용된 표현"
      : "번역 결과 resultText에 실제로 사용한 표현";

  return `<matched_terms_rules>
- matchedTerms에는 ${target}만 넣는다.
- matchedTerms의 값은 반드시 meme_dictionary에 있는 term 표제어와 정확히 같아야 한다.
- 실제 문맥에서 meme_dictionary의 meaning으로 쓰인 표현만 고른다.
- 햄(음식), 화석(실제 화석), 마라탕(음식)처럼 일반 단어와 표제어가 같아도 밈 의미가 아니면 제외한다.
- 대상 문장에 등장한 순서대로, 중복 없이 최대 5개를 넣는다.
- 조건에 맞는 표현이 없으면 빈 배열을 반환한다.
- meaning, examples 등의 설명 문구를 만들거나 matchedTerms에 넣지 않는다.
</matched_terms_rules>`;
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
${buildMzToSeniorStyleGuide()}`;

  return `당신은 한국어의 세대별 표현 차이를 문맥에 맞게 풀어 주는 편집자다.
${sharedRules}
${buildMemeDictionaryReference()}
${directionRules}
${buildMatchedTermsRules(request)}`;
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
): Promise<AiTranslateResponse> {
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
      format: zodTextFormat(aiTranslateResponseSchema, "generation_translation"),
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
