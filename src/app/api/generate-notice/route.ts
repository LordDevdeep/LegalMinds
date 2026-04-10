import { NextRequest, NextResponse } from "next/server";
import { generateLegalNotice } from "@/lib/gemini";
import type { NoticeApiResponse } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

function toSafeMessage(message: string): string {
  if (message.includes("GROQ_API_KEY")) {
    return "The server is not properly configured. Please set the GROQ_API_KEY environment variable.";
  }
  if (message.includes("Invalid API Key") || message.includes("invalid_api_key")) {
    return "The API key is invalid. Please check your server configuration.";
  }
  if (message.includes("rate limit") || message.includes("Rate limit")) {
    return "Too many requests. Please wait a moment and try again.";
  }
  if (message.includes("empty response")) {
    return "The AI model returned an empty response. Please try again.";
  }
  return "Something went wrong while generating the legal notice. Please try again.";
}

export async function POST(req: NextRequest): Promise<NextResponse<NoticeApiResponse>> {
  try {
    const body = await req.json();
    const { sender, recipient, analysis } = body ?? {};

    // Validate sender
    if (
      !sender ||
      typeof sender.name !== "string" || !sender.name.trim() ||
      typeof sender.address !== "string" || !sender.address.trim()
    ) {
      return NextResponse.json(
        { success: false, error: "Please provide complete sender details (name and address)." },
        { status: 400 }
      );
    }

    // Validate recipient
    if (
      !recipient ||
      typeof recipient.name !== "string" || !recipient.name.trim() ||
      typeof recipient.address !== "string" || !recipient.address.trim()
    ) {
      return NextResponse.json(
        { success: false, error: "Please provide complete recipient details (name and address)." },
        { status: 400 }
      );
    }

    // Validate analysis has essential fields
    if (!analysis || !analysis.case_summary || !Array.isArray(analysis.applicable_laws)) {
      return NextResponse.json(
        { success: false, error: "Invalid analysis data. Please run the case analysis first." },
        { status: 400 }
      );
    }

    const notice = await generateLegalNotice(sender, recipient, analysis);

    return NextResponse.json({ success: true, data: notice });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";

    console.error("[/api/generate-notice] Error:", message);

    return NextResponse.json(
      { success: false, error: toSafeMessage(message) },
      { status: 500 }
    );
  }
}
