"use client";

import { useState } from "react";
import type { IndianState, LegalDomain } from "@/types/legal";
import { DOMAIN_LABELS, INDIAN_STATES } from "@/types/legal";

interface Props {
  onComplete: (compiled: {
    text: string;
    domain: LegalDomain | "all";
    jurisdiction: IndianState;
  }) => void;
  onCancel: () => void;
}

const DOMAINS: LegalDomain[] = [
  "criminal",
  "civil",
  "family",
  "labour",
  "consumer",
  "cyber",
  "property",
];

export default function GuidedQuestionnaire({ onComplete, onCancel }: Props) {
  const [step, setStep] = useState(0);
  const [domain, setDomain] = useState<LegalDomain | "all">("all");
  const [happened, setHappened] = useState("");
  const [date, setDate] = useState("");
  const [state, setState] = useState<IndianState>("Other");
  const [role, setRole] = useState<"affected" | "representing">("affected");

  const totalSteps = 5;

  function next() {
    if (step < totalSteps - 1) setStep(step + 1);
    else compile();
  }
  function back() {
    if (step > 0) setStep(step - 1);
    else onCancel();
  }

  function compile() {
    const parts: string[] = [];
    if (domain !== "all") parts.push(`Legal domain: ${DOMAIN_LABELS[domain]}.`);
    parts.push(`What happened: ${happened.trim()}`);
    if (date) parts.push(`Date of incident: ${date}.`);
    if (state) parts.push(`Location/State: ${state}.`);
    parts.push(
      role === "affected"
        ? "I am the affected party seeking advice for my own situation."
        : "I am representing/asking on behalf of someone else."
    );
    onComplete({
      text: parts.join("\n\n"),
      domain,
      jurisdiction: state,
    });
  }

  const canNext =
    (step === 0) ||
    (step === 1 && happened.trim().length >= 20) ||
    (step === 2) ||
    (step === 3) ||
    (step === 4);

  return (
    <div className="rounded-2xl bg-ink/60 border border-white/[0.08] p-5 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[11px] uppercase tracking-wider text-ivory/40">
          Guided Mode &middot; Step {step + 1} of {totalSteps}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className={`h-1 w-6 rounded-full ${
                i <= step ? "bg-gold-500" : "bg-white/[0.08]"
              }`}
            />
          ))}
        </div>
      </div>

      {step === 0 && (
        <div>
          <h3 className="font-display text-lg text-ivory mb-3">
            What kind of legal matter is this?
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              onClick={() => setDomain("all")}
              className={`px-3 py-3 rounded-lg border text-sm transition-colors cursor-pointer ${
                domain === "all"
                  ? "bg-gold-500/15 border-gold-500/40 text-gold-400"
                  : "bg-white/[0.03] border-white/[0.06] text-ivory/70 hover:border-white/[0.12]"
              }`}
            >
              Not Sure / Mixed
            </button>
            {DOMAINS.map((d) => (
              <button
                key={d}
                onClick={() => setDomain(d)}
                className={`px-3 py-3 rounded-lg border text-sm transition-colors cursor-pointer ${
                  domain === d
                    ? "bg-gold-500/15 border-gold-500/40 text-gold-400"
                    : "bg-white/[0.03] border-white/[0.06] text-ivory/70 hover:border-white/[0.12]"
                }`}
              >
                {DOMAIN_LABELS[d]}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <h3 className="font-display text-lg text-ivory mb-3">
            What happened?
          </h3>
          <p className="text-xs text-ivory/50 mb-2">
            Describe the situation in your own words. At least 20 characters.
          </p>
          <textarea
            value={happened}
            onChange={(e) => setHappened(e.target.value)}
            rows={5}
            maxLength={4000}
            placeholder="Example: My landlord refused to refund my Rs 50,000 deposit even though I gave proper notice and the flat was in good condition..."
            className="w-full rounded-xl bg-ink/60 border border-white/[0.06] hover:border-white/[0.1] px-4 py-3 text-sm text-ivory/90 placeholder:text-ivory/25 focus:outline-none focus:ring-2 focus:ring-gold-500/40 resize-y"
          />
          <p className="mt-2 text-[11px] text-ivory/30">
            {happened.length} characters
          </p>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="font-display text-lg text-ivory mb-3">
            When did it happen?
          </h3>
          <p className="text-xs text-ivory/50 mb-2">
            Approximate date is fine. Leave blank if unsure or ongoing.
          </p>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl bg-ink/60 border border-white/[0.06] hover:border-white/[0.1] px-4 py-3 text-sm text-ivory/90 focus:outline-none focus:ring-2 focus:ring-gold-500/40"
          />
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="font-display text-lg text-ivory mb-3">
            Where did this happen?
          </h3>
          <p className="text-xs text-ivory/50 mb-2">
            State helps determine jurisdiction.
          </p>
          <select
            value={state}
            onChange={(e) => setState(e.target.value as IndianState)}
            className="w-full rounded-xl bg-ink/60 border border-white/[0.06] hover:border-white/[0.1] px-4 py-3 text-sm text-ivory/90 focus:outline-none focus:ring-2 focus:ring-gold-500/40 cursor-pointer"
          >
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s} className="bg-ink text-ivory">
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {step === 4 && (
        <div>
          <h3 className="font-display text-lg text-ivory mb-3">
            Are you the affected party?
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => setRole("affected")}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors cursor-pointer ${
                role === "affected"
                  ? "bg-gold-500/15 border-gold-500/40 text-gold-400"
                  : "bg-white/[0.03] border-white/[0.06] text-ivory/70 hover:border-white/[0.12]"
              }`}
            >
              Yes, this is my own situation
            </button>
            <button
              onClick={() => setRole("representing")}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors cursor-pointer ${
                role === "representing"
                  ? "bg-gold-500/15 border-gold-500/40 text-gold-400"
                  : "bg-white/[0.03] border-white/[0.06] text-ivory/70 hover:border-white/[0.12]"
              }`}
            >
              No, I am asking on behalf of someone else
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={back}
          className="text-xs text-ivory/50 hover:text-gold-400 transition-colors cursor-pointer"
        >
          {step === 0 ? "Cancel" : "\u2190 Back"}
        </button>
        <button
          onClick={next}
          disabled={!canNext}
          className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:bg-gold-500/30 disabled:cursor-not-allowed text-midnight font-semibold text-sm cursor-pointer"
        >
          {step === totalSteps - 1 ? "Submit for Analysis" : "Next \u2192"}
        </button>
      </div>
    </div>
  );
}
