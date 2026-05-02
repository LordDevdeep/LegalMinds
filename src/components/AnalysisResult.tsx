"use client";

import { useEffect, useMemo, useState } from "react";
import type { AnalysisResult } from "@/types/legal";
import { DOMAIN_LABELS } from "@/types/legal";
import { getTranslation } from "@/i18n";
import ConfidenceBadge from "./ConfidenceBadge";
import SeverityMeter from "./SeverityMeter";

interface Props {
  result: AnalysisResult;
  readOnly?: boolean;
  showActions?: boolean;
  onDownloadPdf?: () => void;
  onShare?: () => void;
  onPrint?: () => void;
  onGenerateNotice?: () => void;
}

function inr(n: number) {
  return `\u20B9${n.toLocaleString("en-IN")}`;
}

export default function AnalysisResultView({
  result,
  readOnly,
  showActions = true,
  onDownloadPdf,
  onShare,
  onPrint,
  onGenerateNotice,
}: Props) {
  // Always render labels in the analysis's own language so a Hindi
  // analysis stays Hindi for any viewer, regardless of their UI toggle.
  const lang = result.language === "hi" ? "hi" : "en";
  const t = (key: string) => getTranslation(lang, key);
  const [openLawIds, setOpenLawIds] = useState<Record<string, boolean>>({});
  const [view, setView] = useState<"plain" | "detailed">("plain");
  const [doneSteps, setDoneSteps] = useState<Record<number, boolean>>({});

  const fmt = (key: string, vars: Record<string, string | number>) => {
    let s = t(key);
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(`{${k}}`, String(v));
    }
    return s;
  };

  const checklistKey = `lm-checklist-${result.id}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(checklistKey);
      if (raw) setDoneSteps(JSON.parse(raw));
    } catch {}
  }, [checklistKey]);

  function toggleStep(order: number) {
    if (readOnly) return;
    setDoneSteps((prev) => {
      const next = { ...prev, [order]: !prev[order] };
      try {
        localStorage.setItem(checklistKey, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  const stepsTotal = result.nextSteps.length;
  const stepsDone = useMemo(
    () => result.nextSteps.filter((s) => doneSteps[s.order]).length,
    [doneSteps, result.nextSteps]
  );

  const timelineMaxDays = Math.max(
    ...result.timeline.phases.map((p) => p.durationDays[1]),
    1
  );

  return (
    <div className="space-y-4 print:space-y-2 print:text-black">
      {/* Print-only header with logo */}
      <div className="hidden print:flex print:items-center print:gap-3 print:mb-3 print:pb-2 print:border-b print:border-gray-300">
        <img
          src="/logo-icon.png"
          alt="LegalMinds"
          className="hidden print:block print:w-9 print:h-9"
        />
        <div>
          <p className="hidden print:block font-display text-xl text-black font-bold leading-tight">
            LegalMinds
          </p>
          <p className="hidden print:block text-[10px] text-gray-600 uppercase tracking-wider">
            AI-Powered Indian Legal Analysis
          </p>
        </div>
        <p className="hidden print:block ml-auto text-[10px] text-gray-600">
          {new Date(result.createdAt).toLocaleDateString("en-IN")}
        </p>
      </div>

      {/* Card 1: Summary header */}
      <Card stagger={1}>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <SeverityMeter level={result.severity} lang={lang} />
          <ConfidenceBadge level={result.confidence} lang={lang} />
          {result.needsLawyer && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-400 text-[11px] font-semibold uppercase tracking-wider">
              {t("rx.lawyerRecommended")}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {result.domains.map((d) => (
            <span
              key={d}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                d === result.primaryDomain
                  ? "bg-legal-blue/15 border-legal-blue/35 text-legal-blue"
                  : "bg-white/[0.04] border-white/[0.08] text-ivory/60"
              }`}
            >
              {DOMAIN_LABELS[d]}
              {d === result.primaryDomain && " \u2605"}
            </span>
          ))}
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-ivory/60">
            {result.jurisdiction}
          </span>
        </div>

        {/* Plain / Detailed toggle */}
        <div className="flex items-center gap-1 mb-3 p-1 rounded-lg bg-white/[0.04] w-fit print:hidden">
          <button
            onClick={() => setView("plain")}
            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
              view === "plain"
                ? "bg-gold-500 text-midnight"
                : "text-ivory/60 hover:text-ivory"
            }`}
          >
            {t("rx.plainEnglish")}
          </button>
          <button
            onClick={() => setView("detailed")}
            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
              view === "detailed"
                ? "bg-gold-500 text-midnight"
                : "text-ivory/60 hover:text-ivory"
            }`}
          >
            {t("rx.detailedLegal")}
          </button>
        </div>
        <p className="text-sm text-ivory/80 leading-relaxed whitespace-pre-line print:text-black">
          {view === "plain" ? result.plainSummary : result.detailedAnalysis}
        </p>
        {result.needsLawyer && result.lawyerReason && (
          <p className="mt-3 text-xs text-gold-400/90">
            <strong>{t("rx.whyLawyer")}</strong> {result.lawyerReason}
          </p>
        )}
      </Card>

      {/* Helplines (high-priority, placed near top for emergencies) */}
      {result.helplines && result.helplines.length > 0 && (
        <div className="rounded-2xl bg-legal-red/5 border border-legal-red/25 p-4 md:p-5 print:bg-white print:border-gray-300 print:p-3 print:mb-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-legal-red text-lg leading-none">☎</span>
            <h3 className="font-display text-base text-ivory/95 print:text-black">
              {t("rx.emergencyHelplines")}
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {result.helplines.map((h, i) => (
              <a
                key={i}
                href={`tel:${h.number.replace(/[^0-9+]/g, "")}`}
                className="block rounded-lg bg-white/[0.03] hover:bg-legal-red/10 border border-white/[0.05] hover:border-legal-red/35 p-3 transition-colors print:bg-white print:border-gray-300"
              >
                <p className="text-xs text-ivory/45 print:text-gray-600">
                  {h.name}
                </p>
                <p className="text-base font-bold text-legal-red tracking-wide">
                  {h.number}
                </p>
                {h.whenToUse && (
                  <p className="mt-0.5 text-[11px] text-ivory/55 print:text-gray-700">
                    {h.whenToUse}
                  </p>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Card 2: Applicable Laws */}
      {result.applicableLaws.length > 0 && (
        <Card stagger={2} title={t("rx.applicableLaws")}>
          <div className="space-y-3">
            {result.applicableLaws.map((law) => {
              const open = !!openLawIds[law.id];
              return (
                <div
                  key={law.id}
                  className="rounded-xl bg-white/[0.03] border border-white/[0.05] overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setOpenLawIds((p) => ({ ...p, [law.id]: !open }))
                    }
                    className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[11px] uppercase tracking-wider text-ivory/40 bg-white/[0.04] px-2 py-0.5 rounded">
                          {law.act}
                        </span>
                        <span className="text-sm font-semibold text-ivory">
                          § {law.section}
                        </span>
                      </div>
                      <p className="text-sm text-ivory/80">{law.title}</p>
                    </div>
                    <span className="text-ivory/40 text-lg leading-none print:hidden">
                      {open ? "\u2212" : "+"}
                    </span>
                  </button>
                  <div
                    className={`px-4 pb-4 border-t border-white/[0.04] pt-3 text-sm text-ivory/70 leading-relaxed print:block ${
                      open ? "" : "hidden"
                    }`}
                  >
                    <p className="whitespace-pre-line">{law.text}</p>
                    {law.punishment && (
                      <p className="mt-2 text-xs text-legal-red/90">
                        <strong>{t("rx.punishment")}</strong> {law.punishment}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Card 3: Rights */}
      {result.rights.length > 0 && (
        <Card stagger={3} title={t("rx.yourRights")}>
          <ul className="space-y-2 text-sm text-ivory/80 leading-relaxed">
            {result.rights.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-legal-green mt-0.5">✓</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Card 4: Penalties / Outcomes */}
      {result.penalties.length > 0 && (
        <Card stagger={4} title={t("rx.possiblePenalties")}>
          <ul className="space-y-2 text-sm text-ivory/80 leading-relaxed">
            {result.penalties.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-legal-amber mt-0.5">●</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Card 5: Next Steps Checklist */}
      {result.nextSteps.length > 0 && (
        <Card stagger={5} title={t("rx.nextSteps")}>
          {stepsTotal > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] uppercase tracking-wider text-ivory/40">
                  {t("rx.progress")}
                </span>
                <span className="text-[11px] text-ivory/60">
                  {fmt("rx.completedFmt", { done: stepsDone, total: stepsTotal })}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                <div
                  className="h-full bg-legal-green transition-all duration-300"
                  style={{
                    width: `${(stepsDone / stepsTotal) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
          <ol className="space-y-3">
            {result.nextSteps.map((step) => {
              const done = !!doneSteps[step.order];
              return (
                <li key={step.order} className="flex items-start gap-3">
                  <button
                    onClick={() => toggleStep(step.order)}
                    disabled={readOnly}
                    className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center text-[10px] font-bold flex-shrink-0 cursor-pointer transition-colors ${
                      done
                        ? "bg-legal-green/20 border-legal-green/40 text-legal-green"
                        : "bg-white/[0.04] border-white/[0.1] text-transparent hover:border-white/[0.2]"
                    }`}
                    aria-label={`Mark step ${step.order}`}
                  >
                    ✓
                  </button>
                  <div
                    className={`flex-1 text-sm leading-relaxed ${
                      done ? "text-ivory/40 line-through" : "text-ivory/80"
                    }`}
                  >
                    <p className="font-semibold text-ivory">
                      {step.order}. {step.action}
                    </p>
                    {step.detail && (
                      <p className="mt-0.5 text-ivory/60">{step.detail}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>
      )}

      {/* Card 6: Timeline */}
      {result.timeline.phases.length > 0 && (
        <Card stagger={6} title={t("rx.estimatedTimeline")}>
          <p className="text-xs text-ivory/50 mb-3">
            {fmt("rx.totalFmt", {
              min: result.timeline.totalDaysMin,
              max: result.timeline.totalDaysMax,
            })}
          </p>
          <div className="space-y-3">
            {result.timeline.phases.map((p, i) => {
              const minPct = (p.durationDays[0] / timelineMaxDays) * 100;
              const maxPct = (p.durationDays[1] / timelineMaxDays) * 100;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-ivory/80 font-semibold">{p.name}</span>
                    <span className="text-ivory/50">
                      {fmt("rx.daysFmt", { min: p.durationDays[0], max: p.durationDays[1] })}
                    </span>
                  </div>
                  <div className="relative h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-legal-blue/30"
                      style={{ width: `${maxPct}%` }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 bg-legal-blue"
                      style={{ width: `${minPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Card 7: Cost Estimate */}
      <Card stagger={7} title={t("rx.costEstimate")}>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-white/[0.03] p-3 border border-white/[0.05]">
            <p className="text-[10px] uppercase tracking-wider text-ivory/40 mb-1">
              {t("rx.courtFees")}
            </p>
            <p className="text-ivory/85 font-semibold">
              {inr(result.costs.courtFeesINR[0])} –{" "}
              {inr(result.costs.courtFeesINR[1])}
            </p>
          </div>
          <div className="rounded-lg bg-white/[0.03] p-3 border border-white/[0.05]">
            <p className="text-[10px] uppercase tracking-wider text-ivory/40 mb-1">
              {t("rx.lawyerFees")}
            </p>
            <p className="text-ivory/85 font-semibold">
              {inr(result.costs.lawyerFeesINR[0])} –{" "}
              {inr(result.costs.lawyerFeesINR[1])}
            </p>
          </div>
        </div>
        {result.costs.legalAidEligible && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-legal-green/10 border border-legal-green/25">
            <p className="text-xs text-legal-green">
              {t("rx.legalAidNote")}
            </p>
          </div>
        )}
        {result.costs.notes && (
          <p className="mt-3 text-xs text-ivory/55 leading-relaxed">
            {result.costs.notes}
          </p>
        )}
      </Card>

      {/* Filing Links */}
      {result.filingLinks && result.filingLinks.length > 0 && (
        <Card stagger={8} title={t("rx.whereToFile")}>
          <div className="space-y-2.5">
            {result.filingLinks.map((l, i) => (
              <a
                key={i}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg bg-white/[0.03] hover:bg-legal-blue/10 border border-white/[0.05] hover:border-legal-blue/30 p-3 transition-colors print:bg-white print:border-gray-300"
              >
                <p className="text-sm font-semibold text-ivory print:text-black">
                  {l.name}
                </p>
                {l.purpose && (
                  <p className="mt-0.5 text-xs text-ivory/60 print:text-gray-700">
                    {l.purpose}
                  </p>
                )}
                <p className="mt-1 text-[11px] text-legal-blue break-all">
                  {l.url}
                </p>
              </a>
            ))}
          </div>
        </Card>
      )}

      {/* Free Legal Aid / Govt Lawyer footer */}
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-3 md:p-4 print:bg-white print:border-gray-300 print:p-3">
        <p className="text-[11px] text-ivory/45 print:text-gray-600 text-center mb-2.5">
          {t("rx.needLawyerFooter")}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <a
            href="https://nalsa.gov.in/"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-legal-green/10 hover:bg-legal-green/15 border border-legal-green/25 text-[11px] text-legal-green font-semibold transition-colors print:bg-white print:border-gray-300"
          >
            {t("rx.nalsaLink")}
          </a>
          <a
            href="https://www.barcouncilofindia.org/"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-[11px] text-ivory/70 font-semibold transition-colors print:bg-white print:border-gray-300 print:text-gray-700"
          >
            {t("rx.barCouncilLink")}
          </a>
          <a
            href="https://doj.gov.in/tele-law/"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-[11px] text-ivory/70 font-semibold transition-colors print:bg-white print:border-gray-300 print:text-gray-700"
          >
            {t("rx.teleLawLink")}
          </a>
        </div>
      </div>

      {/* Response time */}
      <p className="text-[11px] text-ivory/30 text-center print:hidden">
        {fmt("rx.analyzedIn", { time: (result.responseTimeMs / 1000).toFixed(1) })}
      </p>

      {/* Action buttons */}
      {showActions && !readOnly && (
        <div className="flex flex-wrap justify-center gap-3 pt-2 print:hidden">
          {onGenerateNotice && (
            <button
              onClick={onGenerateNotice}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-midnight font-semibold text-sm transition-all cursor-pointer shadow-lg shadow-gold-500/20"
            >
              {t("rx.generateNotice")}
            </button>
          )}
          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-ivory/70 hover:text-ivory font-semibold text-sm transition-all cursor-pointer"
            >
              {t("rx.downloadReport")}
            </button>
          )}
          {onShare && (
            <button
              onClick={onShare}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-ivory/70 hover:text-ivory font-semibold text-sm transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              {t("rx.share")}
            </button>
          )}
          {onPrint && (
            <button
              onClick={onPrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-ivory/70 hover:text-ivory font-semibold text-sm transition-all cursor-pointer"
            >
              {t("rx.print")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Card({
  title,
  stagger,
  children,
}: {
  title?: string;
  stagger: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl bg-ink/50 backdrop-blur-sm border border-white/[0.05] hover:border-white/[0.08] shadow-sm p-5 md:p-6 opacity-0 animate-slide-up stagger-${Math.min(
        stagger,
        15
      )} print:bg-white print:border print:border-gray-300 print:shadow-none print:opacity-100 print:animate-none print:mb-2 print:p-3`}
    >
      {title && (
        <h3 className="font-display text-base text-ivory/90 mb-3 print:text-black">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
