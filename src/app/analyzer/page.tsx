"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import type { LegalAnalysis, ApiResponse } from "@/lib/types";
import Image from "next/image";
import { ArrowRightIcon, LoaderIcon } from "@/components/Icons";
import LanguageSelector from "@/components/LanguageSelector";
import AuthButton from "@/components/AuthButton";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ResultCards from "@/components/ResultCards";
import { useLanguage } from "@/i18n/LanguageContext";
import { LANGUAGE_NAMES } from "@/i18n";
import { createClient } from "@/lib/supabase/client";

export default function AnalyzerPage() {
  const { t, locale } = useLanguage();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LegalAnalysis | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const examples = [
    t("analyzer.example1"),
    t("analyzer.example2"),
    t("analyzer.example3"),
  ];

  async function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const maxRetries = 2;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: trimmed, language: LANGUAGE_NAMES[locale] }),
        });

        const json: ApiResponse = await res.json();

        if (!json.success) {
          // On server error, retry once
          if (attempt < maxRetries - 1 && res.status >= 500) continue;
          setError(json.error);
        } else {
          setResult(json.data);
          setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
          // Auto-save to history if logged in
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
              }).catch(() => {}); // silently fail
            }
          } catch {}
        }
        break;
      } catch {
        if (attempt < maxRetries - 1) continue;
        setError(t("common.networkError"));
      }
    }
    setLoading(false);
  }

  function handleClarify(question: string) {
    setInput((prev) => `${prev}\n\nAdditional context: ${question}`);
    textareaRef.current?.focus();
    textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleExample(ex: string) {
    setInput(ex);
    setResult(null);
    setError(null);
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-gold-500/[0.03] blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/[0.04]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image src="/logo-icon.png" alt="LegalMinds" width={36} height={36} className="h-9 w-9" />
          <span className="font-display text-lg tracking-tight">
            <span className="text-ivory group-hover:text-ivory transition-colors">Legal</span>
            <span className="text-gold-400 group-hover:text-gold-500 transition-colors">Minds</span>
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

      {/* Main */}
      <main className="relative z-10 max-w-2xl mx-auto px-5 py-10 md:py-16">
        {/* Heading */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-2xl md:text-3xl text-ivory mb-2">
            {t("analyzer.heading")}
          </h1>
          <p className="text-sm text-ivory/40">
            {t("analyzer.description")}
          </p>
        </div>

        {/* Input area */}
        <div className="animate-slide-up">
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

          {/* Submit */}
          <div className="flex items-center justify-between mt-4 gap-4">
            <span className="text-[11px] text-ivory/20 hidden sm:block">
              {t("analyzer.keyHint")}
            </span>
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
        </div>

        {/* Example prompts */}
        {!result && !loading && (
          <div className="mt-8 animate-fade-in">
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

        {/* Error */}
        {error && (
          <div className="mt-6 px-5 py-4 rounded-xl bg-legal-red/10 border border-legal-red/20 animate-scale-in">
            <p className="text-sm text-legal-red">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-8">
            <LoadingSkeleton />
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div ref={resultsRef} className="mt-8">
            <ResultCards data={result} onClarify={handleClarify} query={input} />

            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setInput("");
                  setResult(null);
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
    </div>
  );
}
