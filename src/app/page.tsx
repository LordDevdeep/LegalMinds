"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, SparkleIcon } from "@/components/Icons";
import LanguageSelector from "@/components/LanguageSelector";
import AuthButton from "@/components/AuthButton";
import { useLanguage } from "@/i18n/LanguageContext";

const FEATURES = [
  {
    title: "Citation-grounded",
    body: "Every cited statute is matched against a curated database of 60+ real Indian sections (IPC, CrPC, Consumer Protection, IT Act, DV Act, more). No hallucinated references.",
    accent: "gold",
  },
  {
    title: "Structured analysis",
    body: "Severity meter, confidence badge, applicable laws with full text, your rights, possible penalties, tickable next steps, timeline phases, and cost estimate — all in one report.",
    accent: "blue",
  },
  {
    title: "Legal Notice Generator",
    body: "Generate court-submittable legal notices in proper Indian format with sender/recipient details, statute references, compensation amount, and compliance period.",
    accent: "amber",
  },
  {
    title: "AI Compensation Suggestion",
    body: "Get realistic compensation ranges grounded in Indian benchmarks — Sarla Verma multipliers for MV claims, Section 138 NI caps, defamation tiers, DV Act reliefs, POSH awards.",
    accent: "green",
  },
  {
    title: "PDF, Print & Cross-device Share",
    body: "Download a multi-page A4 report, print a clean black-on-white version, or share a link that opens on any device with native share sheet integration.",
    accent: "blue",
  },
  {
    title: "Knowledge Library",
    body: "Browse the full statute database, 35+ glossary terms, 5 know-your-rights cards (arrest, women, tenant, employee, consumer), and 10 landmark Supreme Court judgments.",
    accent: "gold",
  },
  {
    title: "Voice + Guided Input",
    body: "Speak your query in English or Hindi (Web Speech API), or step through a 5-question wizard if you don't know where to start.",
    accent: "amber",
  },
  {
    title: "Bilingual",
    body: "Full English ↔ Hindi UI plus everyday-Hindustani analysis when Hindi is selected. Helplines, filing portals, and govt lawyer links built in.",
    accent: "green",
  },
];

const ACCENTS: Record<string, string> = {
  gold: "border-gold-500/15 hover:border-gold-500/40 hover:shadow-gold-500/10",
  blue: "border-legal-blue/15 hover:border-legal-blue/40 hover:shadow-legal-blue/10",
  amber: "border-legal-amber/15 hover:border-legal-amber/40 hover:shadow-legal-amber/10",
  green: "border-legal-green/15 hover:border-legal-green/40 hover:shadow-legal-green/10",
};

const ACCENT_TEXT: Record<string, string> = {
  gold: "text-gold-400",
  blue: "text-legal-blue",
  amber: "text-legal-amber",
  green: "text-legal-green",
};

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
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-5">
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
          <AuthButton />
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center text-center px-6 pb-24">
        <div className="flex-1 flex flex-col items-center justify-center">
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
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 animate-slide-up stagger-3 opacity-0">
            {chips.map((label) => (
              <span
                key={label}
                className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-ivory/35"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Trust bar — citation grounding callout */}
        <div className="mt-20 max-w-3xl w-full text-left">
          <div className="rounded-2xl bg-gold-500/[0.04] border border-gold-500/20 px-5 py-4 md:px-7 md:py-5 backdrop-blur-sm">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gold-400 font-semibold mb-2">
              ★ The credibility difference
            </p>
            <p className="text-sm md:text-base text-ivory/80 leading-relaxed">
              Most "legal AI" tools hallucinate Indian sections that don't exist.{" "}
              <span className="text-ivory">LegalMinds doesn't.</span> Every citation is matched against a curated, in-repo database of <span className="text-gold-400 font-semibold">60+ real Indian statute sections</span> across IPC, CrPC, CPC, Consumer Protection Act 2019, IT Act, DV Act, Industrial Disputes Act, and more. The model is constrained to choose from this list — no fabricated references.
            </p>
            <Link
              href="/library"
              className="mt-3 inline-flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 font-semibold transition-colors"
            >
              Browse the statute library →
            </Link>
          </div>
        </div>

        {/* Features grid */}
        <div className="mt-20 max-w-5xl w-full">
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.2em] text-ivory/40 mb-2">
              What's inside
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-ivory">
              Everything you need from input to filing
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`rounded-2xl bg-ink/40 border ${ACCENTS[f.accent]} p-5 md:p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg`}
              >
                <h3
                  className={`font-display text-lg md:text-xl mb-2 ${ACCENT_TEXT[f.accent]}`}
                >
                  {f.title}
                </h3>
                <p className="text-sm text-ivory/65 leading-relaxed">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Knowledge layer quick links */}
        <div className="mt-16 max-w-5xl w-full">
          <p className="text-center text-[11px] uppercase tracking-[0.2em] text-ivory/40 mb-5">
            Free knowledge layer — no signup needed
          </p>
          <div className="flex flex-wrap items-stretch justify-center gap-3">
            <KnowledgeLink href="/library" label="Statute Library" sub="60+ sections" />
            <KnowledgeLink href="/rights" label="Know Your Rights" sub="5 detailed cards" />
            <KnowledgeLink href="/glossary" label="Legal Glossary" sub="35+ terms" />
            <KnowledgeLink href="/judgments" label="Landmark Judgments" sub="10 SC cases" />
          </div>
        </div>

        {/* Secondary CTA */}
        <div className="mt-16 text-center">
          <p className="text-sm text-ivory/55 mb-4">
            Ready to analyze your situation?
          </p>
          <Link
            href="/analyzer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-gold-500/15 border border-white/[0.08] hover:border-gold-500/40 text-ivory/80 hover:text-gold-400 font-semibold text-sm transition-all"
          >
            Open the Analyzer
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 space-y-2 border-t border-white/[0.04]">
        <p className="text-[11px] text-ivory/20">
          This tool provides legal information, not legal advice.
        </p>
        <div className="flex items-center justify-center gap-4 text-[10px] text-ivory/15">
          <Link href="/terms" className="hover:text-ivory/40 transition-colors">Terms of Service</Link>
          <span>|</span>
          <Link href="/privacy" className="hover:text-ivory/40 transition-colors">Privacy Policy</Link>
          <span>|</span>
          <a
            href="https://github.com/LordDevdeep/LegalMinds"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ivory/40 transition-colors"
          >
            GitHub (MIT)
          </a>
        </div>
        <p className="text-[10px] text-ivory/10">&copy; {new Date().getFullYear()} LegalMinds. All rights reserved.</p>
      </footer>
    </div>
  );
}

function KnowledgeLink({
  href,
  label,
  sub,
}: {
  href: string;
  label: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-0.5 px-5 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-gold-500/30 transition-all duration-200 min-w-[150px]"
    >
      <span className="text-sm font-semibold text-ivory/85">{label}</span>
      <span className="text-[11px] text-ivory/40">{sub}</span>
    </Link>
  );
}
