"use client";

import type { LegalDomain } from "@/types/legal";
import { DOMAIN_LABELS } from "@/types/legal";

interface Props {
  value: LegalDomain | "all";
  onChange: (v: LegalDomain | "all") => void;
  disabled?: boolean;
}

const DOMAINS: (LegalDomain | "all")[] = [
  "all",
  "criminal",
  "civil",
  "family",
  "labour",
  "consumer",
  "cyber",
  "property",
];

function labelFor(d: LegalDomain | "all"): string {
  return d === "all" ? "All Domains" : DOMAIN_LABELS[d];
}

export default function CategorySelector({ value, onChange, disabled }: Props) {
  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
      <label className="text-[10px] uppercase tracking-wider text-ivory/40">
        Legal Domain
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as LegalDomain | "all")}
        disabled={disabled}
        className="
          w-full rounded-lg bg-ink/60 backdrop-blur-sm
          border border-white/[0.06] hover:border-white/[0.1]
          px-3 py-2.5 text-sm text-ivory/90
          transition-all duration-200
          disabled:opacity-50 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-gold-500/40
        "
      >
        {DOMAINS.map((d) => (
          <option key={d} value={d} className="bg-ink text-ivory">
            {labelFor(d)}
          </option>
        ))}
      </select>
    </div>
  );
}
