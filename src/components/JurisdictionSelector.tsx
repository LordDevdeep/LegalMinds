"use client";

import type { IndianState } from "@/types/legal";
import { INDIAN_STATES } from "@/types/legal";

interface Props {
  value: IndianState;
  onChange: (v: IndianState) => void;
  disabled?: boolean;
}

export default function JurisdictionSelector({ value, onChange, disabled }: Props) {
  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
      <label className="text-[10px] uppercase tracking-wider text-ivory/40">
        Jurisdiction (State)
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as IndianState)}
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
        {INDIAN_STATES.map((s) => (
          <option key={s} value={s} className="bg-ink text-ivory">
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
