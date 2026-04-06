import { NextRequest, NextResponse } from "next/server";
import { analyzeLegalCase } from "@/lib/gemini";
import type { ApiResponse } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Map known error messages to user-friendly responses.
 * Unknown errors get a generic message to avoid leaking internals.
 */
function toSafeMessage(message: string): string {
  if (message.includes("GROQ_API_KEY is not configured")) {
    return "The server is not properly configured. Please set the GROQ_API_KEY environment variable in your Vercel project settings.";
  }
  if (message.includes("Invalid API Key") || message.includes("invalid_api_key")) {
    return "The API key is invalid. Please check your GROQ_API_KEY in Vercel project settings.";
  }
  if (message.includes("rate limit") || message.includes("Rate limit")) {
    return "Too many requests. Please wait a moment and try again.";
  }
  if (message.includes("empty response")) {
    return "The AI model returned an empty response. Please try again.";
  }
  if (message.includes("at least 10 characters") || message.includes("more detail")) {
    return message; // User-facing validation — pass through
  }
  // Generic fallback for truly unexpected errors
  return "Something went wrong while analyzing your case. Please try again.";
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json();
    const input: string | undefined = body?.input;

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Please describe your legal situation." },
        { status: 400 }
      );
    }

    const analysis = await analyzeLegalCase(input);

    return NextResponse.json({ success: true, data: analysis });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";

    console.error("[/api/analyze] Error:", message);

    return NextResponse.json(
      { success: false, error: toSafeMessage(message) },
      { status: 500 }
    );
  }
}
