"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { LegalAnalysis } from "@/lib/types";
import AuthButton from "@/components/AuthButton";
import LanguageSelector from "@/components/LanguageSelector";
import ResultCards from "@/components/ResultCards";

interface AnalysisRecord {
  id: string;
  query_text: string;
  response_json: LegalAnalysis;
  case_type: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/auth/login?redirect=/dashboard");
      } else {
        setAuthed(true);
      }
    });
  }, [router]);

  const fetchAnalyses = useCallback(async (searchTerm = "") => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    const res = await fetch(`/api/history?${params}`);
    const json = await res.json();
    setAnalyses(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchAnalyses();
  }, [authed, fetchAnalyses]);

  function handleSearch() {
    fetchAnalyses(search);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this analysis? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/history?id=${id}`, { method: "DELETE" });
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      if (expandedId === id) setExpandedId(null);
    } finally {
      setDeletingId(null);
    }
  }

  if (authed === null) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-ivory/30 text-sm">Loading...</p></div>;
  }

  return (
    <div className="relative min-h-screen">
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
          <AuthButton />
        </div>
      </nav>

      <main className="relative z-10 max-w-3xl mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl text-ivory mb-1">My Analyses</h1>
            <p className="text-xs text-ivory/40">Your saved case analyses</p>
          </div>
          <Link
            href="/analyzer"
            className="px-4 py-2 rounded-lg bg-gold-500/15 border border-gold-500/25 text-xs text-gold-400 font-semibold hover:bg-gold-500/25 transition-all"
          >
            New Analysis
          </Link>
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search your analyses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 rounded-lg bg-ink/60 border border-white/[0.06] hover:border-white/[0.1] px-4 py-2.5 text-sm text-ivory/90 placeholder:text-ivory/25 transition-all outline-none focus:border-gold-500/40"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-ivory/60 hover:text-ivory hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            Search
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-ivory/30 text-sm">Loading analyses...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && analyses.length === 0 && (
          <div className="text-center py-16">
            <p className="text-ivory/30 text-sm mb-4">
              {search ? "No analyses match your search." : "No analyses yet."}
            </p>
            {!search && (
              <Link
                href="/analyzer"
                className="inline-flex px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-midnight font-semibold text-sm transition-all shadow-lg shadow-gold-500/20"
              >
                Analyze your first case
              </Link>
            )}
          </div>
        )}

        {/* Analyses list */}
        {!loading && analyses.length > 0 && (
          <div className="space-y-3">
            {analyses.map((a) => (
              <div key={a.id} className="rounded-xl bg-ink/50 border border-white/[0.05] transition-colors hover:border-white/[0.08]">
                {/* Summary row */}
                <div
                  className="flex items-start gap-4 px-5 py-4 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ivory/80 line-clamp-2">{a.query_text}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {a.case_type && (
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-legal-blue/10 text-[10px] text-legal-blue font-semibold">
                          {a.case_type}
                        </span>
                      )}
                      <span className="text-[10px] text-ivory/25">
                        {new Date(a.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(a.id); }}
                      disabled={deletingId === a.id}
                      className="p-1.5 rounded-lg hover:bg-legal-red/10 text-ivory/20 hover:text-legal-red transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Delete"
                    >
                      {deletingId === a.id ? (
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" /></svg>
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      )}
                    </button>
                    <svg className={`w-4 h-4 text-ivory/20 transition-transform ${expandedId === a.id ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {/* Expanded view */}
                {expandedId === a.id && (
                  <div className="px-5 pb-5 border-t border-white/[0.04]">
                    <div className="mt-4">
                      <ResultCards data={a.response_json} query={a.query_text} isAuthenticated={true} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
