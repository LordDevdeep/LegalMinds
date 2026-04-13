"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, SparkleIcon } from "@/components/Icons";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/i18n/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();

  const chips = [
    t("home.chip1"),
    t("home.chip2"),
    t("home.chip3"),
    t("home.chip4"),
  ];

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gold-500/[0.04] blur-[120px]" />
        <div className="absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full bg-legal-blue/[0.03] blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-3">
          <Image src="/logo-icon.png" alt="LegalMinds" width={40} height={40} className="h-10 w-10" />
          <span className="font-display text-xl tracking-tight">
            <span className="text-ivory">Legal</span>
            <span className="text-gold-400">Minds</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Link
            href="/analyzer"
            className="text-sm text-ivory/50 hover:text-gold-400 transition-colors duration-200"
          >
            {t("home.navLink")}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-24">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-medium tracking-wider uppercase mb-8">
            <SparkleIcon className="w-3.5 h-3.5" />
            {t("home.badge")}
          </div>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-ivory leading-[1.1] max-w-3xl mx-auto animate-slide-up">
          {t("home.heading1")}
          <br />
          <span className="text-gold-400">{t("home.heading2")}</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-ivory/45 max-w-xl mx-auto leading-relaxed animate-slide-up stagger-1 opacity-0">
          {t("home.description")}
        </p>

        <Link
          href="/analyzer"
          className="
            mt-10 inline-flex items-center gap-3
            px-8 py-4 rounded-xl
            bg-gold-500 hover:bg-gold-400
            text-midnight font-semibold text-sm tracking-wide
            transition-all duration-200
            shadow-lg shadow-gold-500/20 hover:shadow-gold-400/30
            animate-slide-up stagger-2 opacity-0
          "
        >
          {t("home.cta")}
          <ArrowRightIcon className="w-4 h-4" />
        </Link>

        {/* Feature chips */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-3 animate-slide-up stagger-3 opacity-0">
          {chips.map((label) => (
            <span
              key={label}
              className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-ivory/35"
            >
              {label}
            </span>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 space-y-2">
        <p className="text-[11px] text-ivory/20">
          This tool provides legal information, not legal advice.
        </p>
        <div className="flex items-center justify-center gap-4 text-[10px] text-ivory/15">
          <Link href="/terms" className="hover:text-ivory/40 transition-colors">Terms of Service</Link>
          <span>|</span>
          <Link href="/privacy" className="hover:text-ivory/40 transition-colors">Privacy Policy</Link>
        </div>
        <p className="text-[10px] text-ivory/10">&copy; 2025 LegalMinds. All rights reserved.</p>
      </footer>
    </div>
  );
}
