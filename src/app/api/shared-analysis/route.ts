import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// POST — save an analysis as publicly shareable
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { id, payload } = body || {};

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing analysis id" },
        { status: 400 }
      );
    }
    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { success: false, error: "Missing payload" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("shared_analyses")
      .upsert({ id, payload }, { onConflict: "id" });

    if (error) {
      console.error("[/api/shared-analysis] insert error:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// GET — fetch a shared analysis by id (?id=xxx)
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("shared_analyses")
      .select("payload")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("[/api/shared-analysis] fetch error:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    if (!data) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, payload: data.payload });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
