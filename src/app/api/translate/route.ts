import { errorResponse } from "@/lib/api-error";
import { translateText } from "@/lib/ai-service";
import { resolveTermExplanations } from "@/lib/meme-dictionary";
import { translateRequestSchema, translateResponseSchema } from "@/lib/schemas";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => null);
    const input = translateRequestSchema.parse(body);
    const { resultText, matchedTerms } = await translateText(input);
    const response = translateResponseSchema.parse({
      resultText,
      termExplanations: resolveTermExplanations(matchedTerms),
    });
    return Response.json(response);
  } catch (error) {
    return errorResponse(error);
  }
}
