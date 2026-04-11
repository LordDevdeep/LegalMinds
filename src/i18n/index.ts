import en from "./locales/en";
import hi from "./locales/hi";
import kn from "./locales/kn";
import ta from "./locales/ta";
import ml from "./locales/ml";
import te from "./locales/te";

export type Locale = "en" | "hi" | "kn" | "ta" | "ml" | "te";

export const LOCALES: Record<Locale, { name: string; nativeName: string }> = {
  en: { name: "English", nativeName: "English" },
  hi: { name: "Hindi", nativeName: "हिन्दी" },
  kn: { name: "Kannada", nativeName: "ಕನ್ನಡ" },
  ta: { name: "Tamil", nativeName: "தமிழ்" },
  ml: { name: "Malayalam", nativeName: "മലയാളം" },
  te: { name: "Telugu", nativeName: "తెలుగు" },
};

export const LANGUAGE_NAMES: Record<Locale, string> = {
  en: "English",
  hi: "Hindi",
  kn: "Kannada",
  ta: "Tamil",
  ml: "Malayalam",
  te: "Telugu",
};

const translations: Record<Locale, Record<string, string>> = {
  en,
  hi,
  kn,
  ta,
  ml,
  te,
};

export function getTranslation(locale: Locale, key: string): string {
  return translations[locale]?.[key] ?? translations.en[key] ?? key;
}

export default translations;
