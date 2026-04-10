import { NextRequest, NextResponse } from "next/server";
import { suggestCompensation } from "@/lib/gemini";
import type { CompensationApiResponse } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 15;

export async function POST(req: NextRequest): Promise<NextResponse<CompensationApiResponse>> {
  try {
    const body = await req.json();
    const { analysis } = body ?? {};

    if (!analysis || !analysis.case_summary) {
      return NextResponse.json(
        { success: false, error: "Analysis data is required." },
        { status: 400 }
      );
    }

    const suggestion = await suggestCompensation(analysis);

    return NextResponse.json({ success: true, data: suggestion });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";

    console.error("[/api/suggest-compensation] Error:", message);

    return NextResponse.json(
      { success: false, error: "Could not generate compensation suggestion. Please try again." },
      { status: 500 }
    );
  }
}
