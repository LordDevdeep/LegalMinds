"use client";

import { useState, useMemo } from "react";
import SimpleNav from "@/components/SimpleNav";
import { GLOSSARY, searchGlossary } from "@/data/glossary";

export default function GlossaryPage() {
  const [q, setQ] = useState("");
  const items = useMemo(() => searchGlossary(q), [q]);

  return (
    <div className="relative min-h-screen">
      <SimpleNav title="Legal Glossary" />
      <main className="max-w-3xl mx-auto px-5 py-10 md:py-16">
        <div className="mb-6 animate-fade-in">
          <h1 className="font-display text-2xl md:text-3xl text-ivory mb-2">
            Legal Glossary
          </h1>
          <p className="text-sm text-ivory/50">
            Plain-English definitions of {GLOSSARY.length} commonly used Indian
            legal terms.
          </p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search terms (e.g. bail, FIR, injunction)..."
            className="w-full rounded-xl bg-ink/60 border border-white/[0.06] hover:border-white/[0.1] px-4 py-3 text-sm text-ivory/90 placeholder:text-ivory/25 focus:outline-none focus:ring-2 focus:ring-gold-500/40"
          />
          <p className="mt-2 text-[11px] text-ivory/30">
            {items.length} of {GLOSSARY.length} terms shown
          </p>
        </div>

        <div className="space-y-3">
          {items.map((t) => (
            <div
              key={t.term}
              className="rounded-xl bg-ink/50 border border-white/[0.05] p-4 hover:border-white/[0.08] transition-colors"
            >
              <h3 className="font-display text-base text-gold-400 mb-1.5">
                {t.term}
              </h3>
              <p className="text-sm text-ivory/75 leading-relaxed">
                {t.definition}
              </p>
              {t.example && (
                <p className="mt-2 text-xs text-ivory/50 italic leading-relaxed">
                  Example: {t.example}
                </p>
              )}
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-12 text-sm text-ivory/40">
              No terms match &quot;{q}&quot;. Try a shorter search.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
