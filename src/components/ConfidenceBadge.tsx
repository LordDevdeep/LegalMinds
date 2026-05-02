"use client";

import type { ConfidenceLevel } from "@/types/legal";
import { getTranslation } from "@/i18n";

interface Props {
  level: ConfidenceLevel;
  lang?: "en" | "hi";
}

const STYLES: Record<ConfidenceLevel, { bg: string; text: string; key: string }> = {
  high: {
    bg: "bg-legal-green/15 border-legal-green/30",
    text: "text-legal-green",
    key: "rx.confidenceHigh",
  },
  medium: {
    bg: "bg-legal-amber/15 border-legal-amber/30",
    text: "text-legal-amber",
    key: "rx.confidenceMedium",
  },
  low: {
    bg: "bg-legal-red/15 border-legal-red/30",
    text: "text-legal-red",
    key: "rx.confidenceLow",
  },
};

export default function ConfidenceBadge({ level, lang = "en" }: Props) {
  const t = (key: string) => getTranslation(lang, key);
  const s = STYLES[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${s.bg} ${s.text} text-[11px] font-semibold uppercase tracking-wider`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {t(s.key)}
    </span>
  );
}
