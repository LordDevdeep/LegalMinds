"use client";

import type { SeverityLevel } from "@/types/legal";

interface Props {
  level: SeverityLevel;
}

const LABELS: Record<SeverityLevel, string> = {
  1: "Minor",
  2: "Low",
  3: "Moderate",
  4: "Serious",
  5: "Critical",
};

const COLORS: Record<SeverityLevel, string> = {
  1: "bg-legal-green",
  2: "bg-legal-green/80",
  3: "bg-legal-amber",
  4: "bg-orange-500",
  5: "bg-legal-red",
};

export default function SeverityMeter({ level }: Props) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-[11px] uppercase tracking-wider text-ivory/40">
        Severity
      </span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${
              i <= level ? COLORS[level] : "bg-white/[0.08]"
            }`}
          />
        ))}
      </div>
      <span className="text-[11px] font-semibold text-ivory/70">{LABELS[level]}</span>
    </div>
  );
}
