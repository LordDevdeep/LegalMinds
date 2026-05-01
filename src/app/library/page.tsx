"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import SimpleNav from "@/components/SimpleNav";
import { STATUTE_DATABASE, searchStatutes } from "@/data/statutes";
import { DOMAIN_LABELS, type LegalDomain, type StatuteSection } from "@/types/legal";

const DOMAINS: LegalDomain[] = [
  "criminal",
  "civil",
  "family",
  "labour",
  "consumer",
  "cyber",
  "property",
];

function highlight(text: string, q: string) {
  if (!q) return text;
  const lower = text.toLowerCase();
  const ql = q.toLowerCase();
  const idx = lower.indexOf(ql);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-gold-500/30 text-gold-200 rounded px-0.5">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export default function LibraryPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [openDomain, setOpenDomain] = useState<LegalDomain | null>(null);
  const [selected, setSelected] = useState<StatuteSection | null>(null);

  const filtered = useMemo(() => {
    return q.trim() ? searchStatutes(q.trim()) : STATUTE_DATABASE;
  }, [q]);

  const grouped = useMemo(() => {
    const map: Record<string, StatuteSection[]> = {};
    for (const d of DOMAINS) map[d] = [];
    for (const s of filtered) {
      if (map[s.domain]) map[s.domain].push(s);
    }
    return map;
  }, [filtered]);

  function useInAnalyzer(s: StatuteSection) {
    const template = `I want a legal analysis specifically considering ${s.act}, Section ${s.section} (${s.title}).\n\nMy situation: `;
    try {
      sessionStorage.setItem("lm-analyzer-prefill", template);
    } catch {}
    router.push("/analyzer");
  }

  return (
    <div className="relative min-h-screen">
      <SimpleNav title="Statute Library" />
      <main className="max-w-4xl mx-auto px-5 py-10 md:py-16">
        <div className="mb-6 animate-fade-in">
          <h1 className="font-display text-2xl md:text-3xl text-ivory mb-2">
            Statute Library
          </h1>
          <p className="text-sm text-ivory/50">
            Browse {STATUTE_DATABASE.length} curated sections from Indian
            statutes. All AI citations on this site are grounded against this
            list.
          </p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by act, section, or keyword (e.g. 420, FIR, bail, lease)..."
            className="w-full rounded-xl bg-ink/60 border border-white/[0.06] hover:border-white/[0.1] px-4 py-3 text-sm text-ivory/90 placeholder:text-ivory/25 focus:outline-none focus:ring-2 focus:ring-gold-500/40"
          />
          <p className="mt-2 text-[11px] text-ivory/30">
            {filtered.length} of {STATUTE_DATABASE.length} sections shown
          </p>
        </div>

        <div className="space-y-3">
          {DOMAINS.map((d) => {
            const items = grouped[d];
            if (q.trim() && items.length === 0) return null;
            const isOpen = openDomain === d || !!q.trim();
            return (
              <div
                key={d}
                className="rounded-xl bg-ink/50 border border-white/[0.05] overflow-hidden"
              >
                <button
                  onClick={() => setOpenDomain(isOpen && !q.trim() ? null : d)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <span className="font-display text-base text-ivory/90">
                    {DOMAIN_LABELS[d]}
                  </span>
                  <span className="text-xs text-ivory/40">
                    {items.length} {items.length === 1 ? "section" : "sections"}{" "}
                    <span className="ml-2">{isOpen ? "\u2212" : "+"}</span>
                  </span>
                </button>
                {isOpen && (
                  <ul className="border-t border-white/[0.04] divide-y divide-white/[0.04]">
                    {items.map((s) => (
                      <li key={s.id}>
                        <button
                          onClick={() => setSelected(s)}
                          className="w-full text-left px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
                        >
                          <div className="flex items-baseline justify-between gap-3">
                            <div>
                              <span className="text-[11px] uppercase tracking-wider text-ivory/40 mr-2">
                                {highlight(s.act, q)}
                              </span>
                              <span className="text-sm font-semibold text-ivory">
                                {highlight(`\u00A7${s.section}`, q)}
                              </span>
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-ivory/65">
                            {highlight(s.title, q)}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Detail modal */}
        {selected && (
          <div
            className="fixed inset-0 z-50 bg-midnight/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-ink rounded-2xl border border-white/[0.08] max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-ivory/40 mb-1">
                    {selected.act}
                  </p>
                  <h2 className="font-display text-xl text-ivory mb-1">
                    Section {selected.section}
                  </h2>
                  <p className="text-sm text-gold-400">{selected.title}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-ivory/40 hover:text-ivory cursor-pointer text-2xl leading-none"
                >
                  &times;
                </button>
              </div>
              <p className="text-sm text-ivory/80 leading-relaxed whitespace-pre-line">
                {selected.text}
              </p>
              {selected.punishment && (
                <p className="mt-3 text-xs text-legal-red">
                  <strong>Punishment:</strong> {selected.punishment}
                </p>
              )}
              <button
                onClick={() => useInAnalyzer(selected)}
                className="mt-5 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-midnight text-sm font-semibold cursor-pointer"
              >
                Use this in analysis &rarr;
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
