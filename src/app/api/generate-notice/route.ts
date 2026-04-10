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
    const { details, analysis } = body ?? {};

    // Validate details
    if (!details) {
      return NextResponse.json(
        { success: false, error: "Notice details are required." },
        { status: 400 }
      );
    }

    const requiredFields = ["senderName", "senderAddress", "recipientName", "recipientAddress", "noticeDate", "incidentDate", "incidentLocation", "specificDemand"] as const;
    for (const field of requiredFields) {
      if (!details[field] || typeof details[field] !== "string" || !details[field].trim()) {
        return NextResponse.json(
          { success: false, error: `Please provide ${field.replace(/([A-Z])/g, " $1").toLowerCase()}.` },
          { status: 400 }
        );
      }
    }

    // Validate analysis
    if (!analysis || !analysis.case_summary || !Array.isArray(analysis.applicable_laws)) {
      return NextResponse.json(
        { success: false, error: "Invalid analysis data. Please run the case analysis first." },
        { status: 400 }
      );
    }

    const notice = await generateLegalNotice(details, analysis);

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
