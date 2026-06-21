import { errorResponse } from "@/lib/api-error";
import { translateText } from "@/lib/ai-service";
import { translateRequestSchema } from "@/lib/schemas";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => null);
    const input = translateRequestSchema.parse(body);
    return Response.json(await translateText(input));
  } catch (error) {
    return errorResponse(error);
  }
}
