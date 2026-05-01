"use client";

import type { ConfidenceLevel } from "@/types/legal";

interface Props {
  level: ConfidenceLevel;
}

const STYLES: Record<ConfidenceLevel, { bg: string; text: string; label: string }> = {
  high: {
    bg: "bg-legal-green/15 border-legal-green/30",
    text: "text-legal-green",
    label: "High Confidence",
  },
  medium: {
    bg: "bg-legal-amber/15 border-legal-amber/30",
    text: "text-legal-amber",
    label: "Medium Confidence",
  },
  low: {
    bg: "bg-legal-red/15 border-legal-red/30",
    text: "text-legal-red",
    label: "Low Confidence",
  },
};

export default function ConfidenceBadge({ level }: Props) {
  const s = STYLES[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${s.bg} ${s.text} text-[11px] font-semibold uppercase tracking-wider`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}
