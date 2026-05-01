"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { LegalAnalysis } from "@/lib/types";
import type { AnalysisResult, IndianState, LegalDomain } from "@/types/legal";
import Image from "next/image";
import { ArrowRightIcon, LoaderIcon } from "@/components/Icons";
import LanguageSelector from "@/components/LanguageSelector";
import AuthButton from "@/components/AuthButton";
import AnalysisProgress from "@/components/AnalysisProgress";
import ErrorState, { type ErrorKind } from "@/components/ErrorState";
import AnalysisResultView from "@/components/AnalysisResult";
import CategorySelector from "@/components/CategorySelector";
import JurisdictionSelector from "@/components/JurisdictionSelector";
import VoiceInput from "@/components/VoiceInput";
import GuidedQuestionnaire from "@/components/GuidedQuestionnaire";
import NoticeModal from "@/components/NoticeModal";
import { downloadLegalNoticeDocument } from "@/lib/generateNoticePdf";
import type { NoticeDetails } from "@/lib/types";
import { useLanguage } from "@/i18n/LanguageContext";
import { LANGUAGE_NAMES } from "@/i18n";
import { createClient } from "@/lib/supabase/client";

interface ApiSuccess {
  success: true;
  data: LegalAnalysis;
  analysis: AnalysisResult;
}
interface ApiFailure {
  success: false;
  error: string;
  errorKind?: ErrorKind;
}
type ApiResp = ApiSuccess | ApiFailure;

export default function AnalyzerPage() {
  const { t, locale } = useLanguage();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ kind: ErrorKind; message?: string } | null>(
    null
  );
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [legacyData, setLegacyData] = useState<LegalAnalysis | null>(null);
  const [domain, setDomain] = useState<LegalDomain | "all">("all");
  const [jurisdiction, setJurisdiction] = useState<IndianState>("Other");
  const [mode, setMode] = useState<"free" | "guided">("free");
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeLoading, setNoticeLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const examples = [
    t("analyzer.example1"),
    t("analyzer.example2"),
    t("analyzer.example3"),
  ];

  useEffect(() => {
    try {
      const prefill = sessionStorage.getItem("lm-analyzer-prefill");
      if (prefill) {
        setInput(prefill);
        sessionStorage.removeItem("lm-analyzer-prefill");
        textareaRef.current?.focus();
      }
    } catch {}
  }, []);

  async function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    if (trimmed.length < 30) {
      setError({ kind: "validation" });
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setLegacyData(null);

    const maxRetries = 2;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: trimmed,
            language: LANGUAGE_NAMES[locale],
            domainHint: domain === "all" ? undefined : domain,
            jurisdiction,
          }),
        });

        const json: ApiResp = await res.json();

        if (!json.success) {
          if (attempt < maxRetries - 1 && res.status >= 500) continue;
          setError({
            kind: json.errorKind || "generic",
            message: json.error,
          });
        } else {
          setResult(json.analysis);
          setLegacyData(json.data);
          try {
            localStorage.setItem(
              `lm-analysis-${json.analysis.id}`,
              JSON.stringify(json.analysis)
            );
          } catch {}
          setTimeout(() => {
            resultsRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 100);
          try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              fetch("/api/history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  query_text: trimmed,
                  response_json: json.data,
                  case_type: json.data.case_type,
                }),
              }).catch(() => {});
            }
          } catch {}
        }
        break;
      } catch {
        if (attempt < maxRetries - 1) continue;
        setError({ kind: "network" });
      }
    }
    setLoading(false);
  }

  function handleExample(ex: string) {
    setInput(ex);
    setResult(null);
    setLegacyData(null);
    setError(null);
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }

  async function handleShare() {
    if (!result) return;
    const url = `${window.location.origin}/share/${result.id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert(`Share link copied!\n${url}\n\nNote: shareable only on this browser (link reads from your local storage).`);
    } catch {
      prompt("Copy this share link:", url);
    }
  }

  function handlePrint() {
    window.print();
  }

  async function handleGenerateNotice() {
    if (!legacyData) return;
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/auth/login?redirect=/analyzer";
        return;
      }
    } catch {}
    setShowNoticeModal(true);
  }

  async function submitNotice(details: NoticeDetails) {
    if (!legacyData) return;
    setNoticeLoading(true);
    try {
      const res = await fetch("/api/generate-notice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ details, analysis: legacyData, language: "English" }),
      });
      const json = await res.json();
      if (json.success) {
        await downloadLegalNoticeDocument(json.data);
        setShowNoticeModal(false);
      } else {
        alert(json.error || "Failed to generate notice. Please try again.");
      }
    } catch {
      alert("Network error while generating notice. Please try again.");
    } finally {
      setNoticeLoading(false);
    }
  }

  async function handlePdf() {
    if (!result) return;
    const { generateAnalysisPDF } = await import("@/lib/generateAnalysisPdf");
    generateAnalysisPDF(result);
  }

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden print:hidden">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-gold-500/[0.03] blur-[100px]" />
      </div>

      <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/[0.04] print:hidden">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image src="/logo-icon.png" alt="LegalMinds" width={36} height={36} className="h-9 w-9" />
          <span className="font-display text-lg tracking-tight">
            <span className="text-ivory">Legal</span>
            <span className="text-gold-400">Minds</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <span className="text-xs text-ivory/25 hidden sm:block">
            {t("analyzer.tagline")}
          </span>
          <AuthButton />
        </div>
      </nav>

      <main className="relative z-10 max-w-2xl mx-auto px-5 py-10 md:py-16 print:max-w-none print:py-0">
        <div className="mb-8 animate-fade-in print:hidden">
          <h1 className="font-display text-2xl md:text-3xl text-ivory mb-2">
            {t("analyzer.heading")}
          </h1>
          <p className="text-sm text-ivory/40">
            {t("analyzer.description")}
          </p>
        </div>

        <div className="animate-slide-up print:hidden">
          {/* Mode toggle */}
          <div className="flex items-center gap-1 mb-3 p-1 rounded-lg bg-white/[0.04] w-fit">
            <button
              onClick={() => setMode("free")}
              disabled={loading}
              className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                mode === "free"
                  ? "bg-gold-500 text-midnight"
                  : "text-ivory/60 hover:text-ivory"
              }`}
            >
              Free Text
            </button>
            <button
              onClick={() => setMode("guided")}
              disabled={loading}
              className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                mode === "guided"
                  ? "bg-gold-500 text-midnight"
                  : "text-ivory/60 hover:text-ivory"
              }`}
            >
              Guided Mode
            </button>
          </div>

          {mode === "guided" ? (
            <GuidedQuestionnaire
              onComplete={(c) => {
                setInput(c.text);
                setDomain(c.domain);
                setJurisdiction(c.jurisdiction);
                setMode("free");
                setTimeout(() => handleSubmit(), 50);
              }}
              onCancel={() => setMode("free")}
            />
          ) : (
            <>
          {/* Filters: domain + jurisdiction */}
          <div className="flex flex-wrap gap-3 mb-3">
            <CategorySelector
              value={domain}
              onChange={setDomain}
              disabled={loading}
            />
            <JurisdictionSelector
              value={jurisdiction}
              onChange={setJurisdiction}
              disabled={loading}
            />
          </div>

          <div className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("analyzer.placeholder")}
              rows={5}
              maxLength={5000}
              disabled={loading}
              className="
                w-full rounded-xl bg-ink/60 backdrop-blur-sm
                border border-white/[0.06] hover:border-white/[0.1]
                px-5 py-4 text-sm text-ivory/90 placeholder:text-ivory/25
                resize-y min-h-[120px] max-h-[300px]
                transition-all duration-200
                disabled:opacity-50
              "
            />
            <span className="absolute bottom-3 right-4 text-[10px] text-ivory/20">
              {input.length} {t("analyzer.charCount")}
            </span>
          </div>

          <div className="flex items-center justify-between mt-4 gap-4">
            <div className="flex items-center gap-2">
              <VoiceInput
                language={locale}
                currentValue={input}
                onTranscript={(text) => setInput(text)}
                disabled={loading}
              />
              <span className="text-[11px] text-ivory/20 hidden sm:block">
                {t("analyzer.keyHint")}
              </span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              className="
                flex items-center gap-2.5 px-6 py-3 rounded-xl
                bg-gold-500 hover:bg-gold-400 disabled:bg-gold-500/30
                text-midnight font-semibold text-sm tracking-wide
                transition-all duration-200
                shadow-lg shadow-gold-500/20 hover:shadow-gold-400/30
                disabled:shadow-none disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <>
                  <LoaderIcon className="w-4 h-4" />
                  {t("analyzer.analyzing")}
                </>
              ) : (
                <>
                  {t("analyzer.submit")}
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
            </>
          )}
        </div>

        {!result && !loading && !error && (
          <div className="mt-8 animate-fade-in print:hidden">
            <p className="text-xs text-ivory/25 mb-3 uppercase tracking-wider">
              {t("analyzer.tryExample")}
            </p>
            <div className="space-y-2">
              {examples.map((ex) => (
                <button
                  key={ex}
                  onClick={() => handleExample(ex)}
                  className="
                    w-full text-left px-4 py-3 rounded-lg
                    bg-white/[0.02] hover:bg-white/[0.04]
                    border border-white/[0.04] hover:border-white/[0.08]
                    text-xs text-ivory/40 hover:text-ivory/60
                    transition-all duration-200 cursor-pointer
                    line-clamp-2
                  "
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && !loading && (
          <ErrorState
            kind={error.kind}
            message={error.message}
            onRetry={() => {
              setError(null);
              if (input.trim().length >= 30) handleSubmit();
            }}
          />
        )}

        <AnalysisProgress active={loading} />

        {result && !loading && (
          <div ref={resultsRef} className="mt-8">
            <AnalysisResultView
              result={result}
              onDownloadPdf={handlePdf}
              onShare={handleShare}
              onPrint={handlePrint}
              onGenerateNotice={legacyData ? handleGenerateNotice : undefined}
            />

            <div className="mt-8 text-center print:hidden">
              <button
                onClick={() => {
                  setInput("");
                  setResult(null);
                  setLegacyData(null);
                  setError(null);
                  textareaRef.current?.focus();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-xs text-ivory/30 hover:text-gold-400 transition-colors underline underline-offset-4 cursor-pointer"
              >
                {t("analyzer.analyzeAnother")}
              </button>
            </div>

          </div>
        )}
      </main>

      {legacyData && (
        <NoticeModal
          open={showNoticeModal}
          onClose={() => setShowNoticeModal(false)}
          onGenerate={submitNotice}
          loading={noticeLoading}
          analysis={legacyData}
        />
      )}
    </div>
  );
}
