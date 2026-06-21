import { zodTextFormat } from "openai/helpers/zod";
import { AIRefusalError } from "@/lib/api-error";
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
  const direction =
    request.direction === "MZ_TO_SENIOR"
      ? "MZ세대에게 익숙한 표현을 중장년·노년층도 자연스럽게 이해할 표현으로"
      : "중장년·노년층에게 익숙한 표현을 MZ세대도 자연스럽게 이해할 표현으로";

  const response = await getOpenAIClient().responses.parse({
    model: getOpenAIModel(),
    input: [
      {
        role: "system",
        content: `당신은 한국어의 세대별 표현 차이를 문맥에 맞게 풀어 주는 편집자다.
${sharedRules}
- 입력 문장을 ${direction} 번역한다.
- 격식 수준은 '${formalityDescriptions[request.formalityLevel]}'이다.
- 주요 세대 표현만 최대 5개 골라 뜻, 뉘앙스, 사용 상황, 주의 상황을 설명한다.
- 설명할 세대 표현이 없다면 termExplanations는 빈 배열로 반환한다.`,
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
