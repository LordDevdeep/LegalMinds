"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { LOCALES, type Locale } from "@/i18n";

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      className="
        bg-white/[0.04] border border-white/[0.08] rounded-lg
        px-2.5 py-1.5 text-xs text-ivory/70
        outline-none focus:border-gold-500/40
        cursor-pointer appearance-none
        hover:bg-white/[0.06] transition-colors
      "
      aria-label="Select language"
    >
      {(Object.keys(LOCALES) as Locale[]).map((code) => (
        <option key={code} value={code} className="bg-ink text-ivory">
          {LOCALES[code].nativeName}
        </option>
      ))}
    </select>
  );
}
