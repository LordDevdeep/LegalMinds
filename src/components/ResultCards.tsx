"use client";

import type { LegalAnalysis } from "@/lib/types";
import { downloadLegalNoticePdf } from "@/lib/generatePdf";
import {
  ScaleIcon,
  BookIcon,
  FileTextIcon,
  AlertIcon,
  CheckCircleIcon,
  HelpCircleIcon,
} from "./Icons";

interface Props {
  data: LegalAnalysis;
  onClarify?: (question: string) => void;
}

export default function ResultCards({ data, onClarify }: Props) {
  const hasClarifications =
    data.clarifying_questions && data.clarifying_questions.length > 0;
  const hasMissingInfo = data.missing_info && data.missing_info.length > 0;

  return (
    <div className="space-y-4">
      <Card
        icon={<ScaleIcon className="w-5 h-5 text-gold-400" />}
        title="Case Summary"
        stagger={1}
        accent="gold"
      >
        <p className="text-sm text-ivory/75 leading-[1.75] whitespace-pre-line">
          {data.case_summary}
        </p>
      </Card>

      <Card
        icon={<BookIcon className="w-5 h-5 text-legal-blue" />}
        title="Case Type"
        stagger={2}
        accent="blue"
      >
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full bg-legal-blue/10 px-3 py-1 text-xs text-legal-blue font-semibold">
            {data.case_type}
          </span>
          {data.related_case_types.map((type, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full bg-white/[0.04] px-3 py-1 text-xs text-ivory/60"
            >
              {type}
            </span>
          ))}
        </div>
      </Card>

      <Card
        icon={<FileTextIcon className="w-5 h-5 text-ivory/60" />}
        title="Jurisdiction Note"
        stagger={3}
        accent="default"
      >
        <p className="text-sm text-ivory/75 leading-[1.75] whitespace-pre-line">
          {data.jurisdiction_note}
        </p>
      </Card>

      {data.applicable_laws.length > 0 && (
        <Card
          icon={<BookIcon className="w-5 h-5 text-legal-blue" />}
          title="Applicable Laws"
          stagger={4}
          accent="blue"
        >
          <div className="space-y-4">
            {data.applicable_laws.map((law, i) => (
              <div key={i} className="rounded-2xl bg-white/[0.03] p-4 border border-white/[0.05]">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-ivory">{law.act}</span>
                  {law.sections.length > 0 && (
                    <span className="text-[11px] uppercase tracking-[0.18em] text-ivory/40 bg-white/[0.04] px-2 py-1 rounded-full">
                      {law.sections.join(", ")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-ivory/70 leading-relaxed mb-2">
                  {law.description}
                </p>
                <p className="text-[11px] uppercase text-ivory/40">Confidence: {law.confidence}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {data.action_steps.length > 0 && (
        <Card
          icon={<CheckCircleIcon className="w-5 h-5 text-legal-green" />}
          title="Action Steps"
          stagger={5}
          accent="green"
        >
          <ol className="space-y-3">
            {data.action_steps.map((step) => (
              <li key={step.step} className="space-y-2 text-sm text-ivory/80 leading-relaxed">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-legal-green/10 text-legal-green flex items-center justify-center text-xs font-bold border border-legal-green/20">
                    {step.step}
                  </span>
                  <span className="font-semibold text-ivory">{step.action}</span>
                </div>
                <p>{step.details}</p>
                {step.timeline && <p className="text-[13px] text-ivory/50">Timeline: {step.timeline}</p>}
              </li>
            ))}
          </ol>
        </Card>
      )}

      <Card
        icon={<AlertIcon className="w-5 h-5 text-legal-red" />}
        title="Time Sensitivity"
        stagger={6}
        accent="red"
      >
        <div className="space-y-2 text-sm text-ivory/75 leading-relaxed">
          <p>
            <strong>Limitation period:</strong> {data.time_sensitivity.limitation_period || "Not specified"}
          </p>
          <p>
            <strong>Urgency:</strong> {data.time_sensitivity.urgency}
          </p>
          <p>{data.time_sensitivity.deadline_note}</p>
        </div>
      </Card>

      <Card
        icon={<FileTextIcon className="w-5 h-5 text-ivory/60" />}
        title="Possible Outcomes"
        stagger={7}
        accent="default"
      >
        <div className="space-y-3 text-sm text-ivory/75 leading-relaxed">
          <p>
            <strong>Best case:</strong> {data.possible_outcomes.best_case || "—"}
          </p>
          <p>
            <strong>Likely case:</strong> {data.possible_outcomes.likely_case || "—"}
          </p>
          <p>
            <strong>Worst case:</strong> {data.possible_outcomes.worst_case || "—"}
          </p>
          <p>
            <strong>Estimated timeline:</strong> {data.possible_outcomes.estimated_timeline || "—"}
          </p>
        </div>
      </Card>

      <Card
        icon={<BookIcon className="w-5 h-5 text-legal-blue" />}
        title="Required Documents"
        stagger={8}
        accent="blue"
      >
        <div className="grid gap-4 sm:grid-cols-3 text-sm text-ivory/80">
          <div>
            <p className="font-semibold text-ivory mb-2">Essential</p>
            <ul className="space-y-2">
              {data.required_documents.essential.map((item, index) => (
                <li key={index} className="list-disc list-inside">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-ivory mb-2">Supporting</p>
            <ul className="space-y-2">
              {data.required_documents.supporting.map((item, index) => (
                <li key={index} className="list-disc list-inside">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-ivory mb-2">ID Proof</p>
            <p>{data.required_documents.identity_proof}</p>
          </div>
        </div>
      </Card>

      {data.filing_links.length > 0 && (
        <Card
          icon={<HelpCircleIcon className="w-5 h-5 text-legal-amber" />}
          title="Filing Links"
          stagger={9}
          accent="amber"
        >
          <div className="space-y-3 text-sm text-ivory/80 leading-relaxed">
            {data.filing_links.map((link, index) => (
              <div key={index} className="space-y-1">
                <p className="font-semibold text-ivory">{link.name}</p>
                <a href={link.url} target="_blank" rel="noreferrer" className="text-legal-blue hover:text-gold-300 underline">
                  {link.url}
                </a>
                <p>{link.purpose}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {data.helplines.length > 0 && (
        <Card
          icon={<HelpCircleIcon className="w-5 h-5 text-legal-amber" />}
          title="Helplines"
          stagger={10}
          accent="amber"
        >
          <div className="space-y-3 text-sm text-ivory/80 leading-relaxed">
            {data.helplines.map((line, index) => (
              <div key={index}>
                <p className="font-semibold text-ivory">{line.name || "Helpline"}</p>
                <p>{line.number}</p>
                <p>{line.when_to_use}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card
        icon={<AlertIcon className="w-5 h-5 text-legal-red" />}
        title="Estimated Costs"
        stagger={11}
        accent="red"
      >
        <div className="space-y-2 text-sm text-ivory/75 leading-relaxed">
          <p>
            <strong>Court fees:</strong> {data.estimated_costs.court_fees || "—"}
          </p>
          <p>
            <strong>Lawyer fees:</strong> {data.estimated_costs.lawyer_fees || "—"}
          </p>
          <p>
            <strong>Other:</strong> {data.estimated_costs.other || "—"}
          </p>
        </div>
      </Card>

      {hasMissingInfo && (
        <Card
          icon={<HelpCircleIcon className="w-5 h-5 text-legal-amber" />}
          title="Missing Information"
          stagger={12}
          accent="amber"
        >
          <ul className="space-y-2 text-sm text-ivory/80 leading-relaxed list-disc list-inside">
            {data.missing_info.map((info, index) => (
              <li key={index}>{info}</li>
            ))}
          </ul>
        </Card>
      )}

      <Card
        icon={<FileTextIcon className="w-5 h-5 text-ivory/60" />}
        title="Confidence"
        stagger={13}
        accent="default"
      >
        <p className="text-sm text-ivory/75 leading-relaxed">
          <strong>{data.confidence_level}</strong> — {data.confidence_reasoning}
        </p>
      </Card>

      {hasClarifications && (
        <Card
          icon={<HelpCircleIcon className="w-5 h-5 text-legal-amber" />}
          title="Need More Information"
          stagger={14}
          accent="amber"
        >
          <p className="text-xs text-ivory/50 mb-3">
            Click a question to refine your query with additional details.
          </p>
          <div className="space-y-2">
            {data.clarifying_questions.map((q, i) => (
              <button
                key={i}
                onClick={() => onClarify?.(q)}
                className="w-full text-left px-4 py-3 rounded-lg bg-white/[0.03] hover:bg-legal-amber/10 border border-white/[0.05] hover:border-legal-amber/30 text-sm text-ivory/70 hover:text-ivory transition-all duration-200 cursor-pointer"
              >
                <span className="text-legal-amber mr-2">?</span>
                {q}
              </button>
            ))}
          </div>
        </Card>
      )}

      <div className="mt-6 px-4 py-3 rounded-lg border border-white/[0.04] bg-white/[0.015] animate-slide-up stagger-15">
        <p className="text-[11px] text-ivory/30 leading-relaxed text-center">
          <strong className="text-ivory/40">Disclaimer:</strong> This analysis
          is AI-generated and for informational purposes only. It does not
          constitute legal advice. Consult a qualified lawyer for your specific
          situation.
        </p>
      </div>

      {/* Download as PDF */}
      <div className="mt-4 flex justify-center animate-slide-up stagger-15">
        <button
          onClick={() => downloadLegalNoticePdf(data)}
          className="
            flex items-center gap-2.5 px-6 py-3 rounded-xl
            bg-gold-500 hover:bg-gold-400
            text-midnight font-semibold text-sm tracking-wide
            transition-all duration-200
            shadow-lg shadow-gold-500/20 hover:shadow-gold-400/30
            cursor-pointer
          "
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download as PDF
        </button>
      </div>
    </div>
  );
}

/* ── Reusable Card shell ── */

type Accent = "gold" | "blue" | "red" | "green" | "amber" | "default";

const accentMap: Record<Accent, string> = {
  gold: "border-gold-500/10 hover:border-gold-500/20",
  blue: "border-legal-blue/10 hover:border-legal-blue/20",
  red: "border-legal-red/10 hover:border-legal-red/20",
  green: "border-legal-green/10 hover:border-legal-green/20",
  amber: "border-legal-amber/10 hover:border-legal-amber/20",
  default: "border-white/[0.05] hover:border-white/[0.08]",
};

function Card({
  icon,
  title,
  stagger,
  accent = "default",
  children,
}: {
  icon: React.ReactNode;
  title: string;
  stagger: number;
  accent?: Accent;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`
        rounded-xl bg-ink/50 backdrop-blur-sm border p-5 
        transition-colors duration-300
        opacity-0 animate-slide-up stagger-${stagger}
        ${accentMap[accent]}
      `}
    >
      <div className="flex items-center gap-2.5 mb-3">
        {icon}
        <h3 className="font-display text-base text-ivory/90">{title}</h3>
      </div>
      {children}
    </div>
  );
}
