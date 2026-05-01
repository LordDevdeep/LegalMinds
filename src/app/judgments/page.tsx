import SimpleNav from "@/components/SimpleNav";
import { JUDGMENTS } from "@/data/judgments";

export const metadata = {
  title: "Landmark Judgments | LegalMinds",
  description: "Ten landmark Supreme Court of India judgments that shaped Indian constitutional and rights jurisprudence.",
};

export default function JudgmentsPage() {
  return (
    <div className="relative min-h-screen">
      <SimpleNav title="Landmark Judgments" />
      <main className="max-w-3xl mx-auto px-5 py-10 md:py-16">
        <div className="mb-10 animate-fade-in">
          <h1 className="font-display text-2xl md:text-3xl text-ivory mb-2">
            Landmark Judgments
          </h1>
          <p className="text-sm text-ivory/50 max-w-2xl">
            Ten Supreme Court decisions that shaped constitutional rights,
            criminal law, and personal liberty in India.
          </p>
        </div>

        <div className="space-y-4">
          {JUDGMENTS.map((j, i) => (
            <article
              key={j.id}
              className={`rounded-2xl bg-ink/50 border border-white/[0.05] hover:border-white/[0.08] p-5 md:p-6 animate-slide-up stagger-${
                (i % 6) + 1
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <h2 className="font-display text-lg md:text-xl text-ivory">
                  {j.caseName}
                </h2>
                <span className="text-xs text-gold-400 font-semibold">
                  {j.year}
                </span>
              </div>
              <p className="text-[11px] uppercase tracking-wider text-ivory/40 mb-4">
                {j.court} &middot; {j.citation}
              </p>

              <div className="space-y-3 text-sm text-ivory/75 leading-relaxed">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-ivory/45 mb-1">
                    Key Issue
                  </p>
                  <p>{j.keyIssue}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-ivory/45 mb-1">
                    Holding
                  </p>
                  <p>{j.holding}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-ivory/45 mb-1">
                    Why It Matters
                  </p>
                  <p>{j.whyItMatters}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 px-4 py-3 rounded-lg border border-white/[0.04] bg-white/[0.015]">
          <p className="text-[11px] text-ivory/30 leading-relaxed text-center">
            Summaries are paraphrased for accessibility and are not authoritative.
            For binding text refer to official law reporters or the Supreme Court of India website.
          </p>
        </div>
      </main>
    </div>
  );
}
