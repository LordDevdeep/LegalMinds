import { NextRequest, NextResponse } from "next/server";
import { analyzeLegalCase } from "@/lib/gemini";
import type { LegalAnalysis } from "@/lib/types";
import type { AnalysisResult, IndianState } from "@/types/legal";
import { INDIAN_STATES } from "@/types/legal";
import { toAnalysisResult } from "@/lib/toAnalysisResult";

export const runtime = "nodejs";
export const maxDuration = 30;

type ApiSuccess = { success: true; data: LegalAnalysis; analysis: AnalysisResult };
type ApiFailure = {
  success: false;
  error: string;
  errorKind?: "network" | "timeout" | "validation" | "rate_limit" | "generic";
};
type AnalyzeResponse = ApiSuccess | ApiFailure;

function toSafeMessage(message: string): {
  text: string;
  kind: ApiFailure["errorKind"];
} {
  if (message.includes("GROQ_API_KEY is not configured")) {
    return {
      text: "The server is not properly configured. Please set the GROQ_API_KEY environment variable.",
      kind: "generic",
    };
  }
  if (message.includes("Invalid API Key") || message.includes("invalid_api_key")) {
    return {
      text: "The API key is invalid. Please check your GROQ_API_KEY.",
      kind: "generic",
    };
  }
  if (message.includes("rate limit") || message.includes("Rate limit")) {
    return {
      text: "Too many requests. Please wait 60 seconds.",
      kind: "rate_limit",
    };
  }
  if (message.includes("empty response")) {
    return { text: "The AI returned an empty response. Please retry.", kind: "generic" };
  }
  if (message.includes("timeout") || message.includes("Timeout")) {
    return {
      text: "Analysis is taking longer than expected. Try again or simplify your query.",
      kind: "timeout",
    };
  }
  if (
    message.includes("at least 10 characters") ||
    message.includes("more detail")
  ) {
    return { text: message, kind: "validation" };
  }
  return {
    text: "Something went wrong while analyzing your case. Please try again.",
    kind: "generic",
  };
}

export async function POST(req: NextRequest): Promise<NextResponse<AnalyzeResponse>> {
  const start = Date.now();
  try {
    const body = await req.json();
    const input: string | undefined = body?.input;
    const language: string = body?.language || "English";
    const domainHint: string | undefined = body?.domainHint;
    const jurisdictionRaw: string | undefined = body?.jurisdiction;
    const jurisdiction: IndianState =
      jurisdictionRaw && (INDIAN_STATES as string[]).includes(jurisdictionRaw)
        ? (jurisdictionRaw as IndianState)
        : "Other";

    if (!input || typeof input !== "string" || input.trim().length < 30) {
      return NextResponse.json(
        {
          success: false,
          error: "Please describe your situation in at least 30 characters.",
          errorKind: "validation",
        },
        { status: 400 }
      );
    }

    const data = await analyzeLegalCase(input, language, domainHint);

    const responseTimeMs = Date.now() - start;
    const analysis = toAnalysisResult(data, {
      query: input.trim(),
      language: language === "Hindi" ? "hi" : "en",
      jurisdiction,
      domainHint,
      responseTimeMs,
    });

    return NextResponse.json({ success: true, data, analysis });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";

    console.error("[/api/analyze] Error:", message);

    const safe = toSafeMessage(message);
    return NextResponse.json(
      { success: false, error: safe.text, errorKind: safe.kind },
      { status: 500 }
    );
  }
}
