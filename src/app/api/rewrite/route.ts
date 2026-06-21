import { errorResponse } from "@/lib/api-error";
import { rewriteText } from "@/lib/ai-service";
import { rewriteRequestSchema } from "@/lib/schemas";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => null);
    const input = rewriteRequestSchema.parse(body);
    return Response.json(await rewriteText(input));
  } catch (error) {
    return errorResponse(error);
  }
}
