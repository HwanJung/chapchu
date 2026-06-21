import { NextResponse } from "next/server";
import { z } from "zod";
import type { ApiErrorResponse } from "@/lib/schemas";

export class AIRefusalError extends Error {
  constructor() {
    super("The model refused the request.");
    this.name = "AIRefusalError";
  }
}

export interface ClassifiedApiError extends ApiErrorResponse {
  status: 400 | 422 | 502;
}

export function classifyApiError(error: unknown): ClassifiedApiError {
  if (error instanceof z.ZodError) {
    return {
      status: 400,
      code: "VALIDATION_ERROR",
      message: "입력 내용을 확인해 주세요.",
    };
  }

  if (error instanceof AIRefusalError) {
    return {
      status: 422,
      code: "AI_REFUSAL",
      message: "안전 정책상 이 요청은 처리할 수 없어요.",
    };
  }

  return {
    status: 502,
    code: "UPSTREAM_ERROR",
    message: "AI 응답을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
  };
}

export function errorResponse(error: unknown) {
  const { status, code, message } = classifyApiError(error);

  if (status === 502) {
    const details = error as { name?: string; status?: number };
    // 입력 문장이나 생성 결과는 로그에 남기지 않는다.
    console.error("OpenAI request failed", {
      name: details?.name ?? "UnknownError",
      status: details?.status,
    });
  }

  return NextResponse.json<ApiErrorResponse>({ code, message }, { status });
}
