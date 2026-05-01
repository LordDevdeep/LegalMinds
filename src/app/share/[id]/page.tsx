"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { AnalysisResult } from "@/types/legal";
import AnalysisResultView from "@/components/AnalysisResult";
import { createClient } from "@/lib/supabase/client";

interface Props {
  params: { id: string };
}

export default function SharedAnalysisPage({ params }: Props) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      // 1) Try local storage first (instant for the original author)
      try {
        const raw = localStorage.getItem(`lm-analysis-${params.id}`);
        if (raw && !cancelled) {
          setResult(JSON.parse(raw));
          setLoading(false);
          return;
        }
      } catch {}

      // 2) Fall back to remote
      try {
        const res = await fetch(
          `/api/shared-analysis?id=${encodeURIComponent(params.id)}`
        );
        const json = await res.json();
        if (!cancelled) {
          if (json.success && json.payload) {
            setResult(json.payload as AnalysisResult);
          } else {
            setNotFound(true);
          }
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setNotFound(true);
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  function handlePrint() {
    window.print();
  }

  async function handlePdf() {
    if (!result) return;
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = `/auth/login?redirect=/share/${params.id}`;
        return;
      }
    } catch {}
    const { generateAnalysisPDF } = await import("@/lib/generateAnalysisPdf");
    generateAnalysisPDF(result);
  }

  return (
    <div className="relative min-h-screen">
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/[0.04] print:hidden">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo-icon.png" alt="LegalMinds" width={36} height={36} className="h-9 w-9" />
          <span className="font-display text-lg tracking-tight">
            <span className="text-ivory">Legal</span>
            <span className="text-gold-400">Minds</span>
          </span>
        </Link>
        <span className="text-xs text-ivory/40">Shared Analysis (Read Only)</span>
      </nav>

      <main className="relative z-10 max-w-2xl mx-auto px-5 py-10 md:py-16 print:max-w-none print:py-0">
        {loading && !result && !notFound && (
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-6 text-center">
            <p className="text-sm text-ivory/60">Loading shared analysis…</p>
          </div>
        )}
        {notFound && (
          <div className="rounded-xl bg-legal-amber/10 border border-legal-amber/25 p-6 text-center">
            <p className="text-sm text-legal-amber font-semibold mb-2">
              Analysis not found
            </p>
            <p className="text-xs text-ivory/60">
              This share link is invalid or the analysis was never saved.
            </p>
            <Link
              href="/analyzer"
              className="mt-4 inline-block px-4 py-2 rounded-lg bg-gold-500 text-midnight text-xs font-semibold"
            >
              Run a new analysis
            </Link>
          </div>
        )}
        {result && (
          <>
            <div className="mb-6 print:hidden">
              <p className="text-[11px] uppercase tracking-wider text-ivory/40">
                Original Query
              </p>
              <p className="mt-1 text-sm text-ivory/70 italic">"{result.query}"</p>
            </div>
            <AnalysisResultView
              result={result}
              readOnly
              onDownloadPdf={handlePdf}
              onPrint={handlePrint}
            />
          </>
        )}
      </main>
    </div>
  );
}
