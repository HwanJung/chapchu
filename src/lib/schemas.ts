import { z } from "zod";

export const directionSchema = z.enum(["MZ_TO_SENIOR", "SENIOR_TO_MZ"]);
export const audienceSchema = z.enum([
  "PROFESSOR",
  "BOSS",
  "COWORKER",
  "FRIEND",
  "PARTNER",
  "FAMILY",
]);

const inputTextSchema = z
  .string()
  .trim()
  .min(1, "내용을 입력해 주세요.")
  .max(500, "500자 이하로 입력해 주세요.");

export const translateRequestSchema = z.object({
  inputText: inputTextSchema,
  direction: directionSchema,
});

export const rewriteRequestSchema = z.object({
  inputText: inputTextSchema,
  audience: audienceSchema,
});

export const termExplanationSchema = z.object({
  term: z.string().min(1),
  meaning: z.string().min(1),
  example: z.string().min(1),
});

export const aiTranslateResponseSchema = z.object({
  resultText: z.string().min(1),
  matchedTerms: z.array(z.string().min(1)).max(5),
});

export const translateResponseSchema = z.object({
  resultText: z.string().min(1),
  termExplanations: z.array(termExplanationSchema).max(5),
});

export const rewriteResponseSchema = z.object({
  resultText: z.string().min(1),
});

export type Direction = z.infer<typeof directionSchema>;
export type Audience = z.infer<typeof audienceSchema>;
export type TranslateRequest = z.infer<typeof translateRequestSchema>;
export type RewriteRequest = z.infer<typeof rewriteRequestSchema>;
export type TermExplanation = z.infer<typeof termExplanationSchema>;
export type AiTranslateResponse = z.infer<typeof aiTranslateResponseSchema>;
export type TranslateResponse = z.infer<typeof translateResponseSchema>;
export type RewriteResponse = z.infer<typeof rewriteResponseSchema>;

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "AI_REFUSAL"
  | "UPSTREAM_ERROR";

export interface ApiErrorResponse {
  code: ApiErrorCode;
  message: string;
}
