import en from "./locales/en";
import hi from "./locales/hi";

export type Locale = "en" | "hi";

export const LOCALES: Record<Locale, { name: string; nativeName: string }> = {
  en: { name: "English", nativeName: "English" },
  hi: { name: "Hindi", nativeName: "हिन्दी" },
};

export const LANGUAGE_NAMES: Record<Locale, string> = {
  en: "English",
  hi: "Hindi",
};

const translations: Record<Locale, Record<string, string>> = {
  en,
  hi,
};

export function getTranslation(locale: Locale, key: string): string {
  return translations[locale]?.[key] ?? translations.en[key] ?? key;
}

export default translations;
