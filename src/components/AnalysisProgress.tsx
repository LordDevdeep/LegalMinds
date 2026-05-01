"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Understanding your situation...",
  "Matching applicable laws...",
  "Analyzing rights and penalties...",
  "Drafting structured response...",
];

interface Props {
  active: boolean;
}

export default function AnalysisProgress({ active }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) {
      setStep(0);
      return;
    }
    setStep(0);
    const intervals: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i < STEPS.length; i++) {
      intervals.push(setTimeout(() => setStep(i), i * 1500));
    }
    return () => intervals.forEach(clearTimeout);
  }, [active]);

  if (!active) return null;

  return (
    <div className="mt-8 rounded-xl bg-ink/50 border border-white/[0.05] p-5 animate-fade-in">
      <ul className="space-y-3">
        {STEPS.map((label, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li key={i} className="flex items-center gap-3 text-sm">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                  done
                    ? "bg-legal-green/20 border-legal-green/40 text-legal-green"
                    : current
                    ? "bg-gold-500/20 border-gold-500/50 text-gold-400 animate-pulse"
                    : "bg-white/[0.04] border-white/[0.08] text-ivory/30"
                }`}
              >
                {done ? "\u2713" : i + 1}
              </span>
              <span
                className={
                  done
                    ? "text-ivory/50 line-through"
                    : current
                    ? "text-ivory/90"
                    : "text-ivory/30"
                }
              >
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
