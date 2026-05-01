import type {
  AnalysisResult,
  ConfidenceLevel,
  IndianState,
  LegalDomain,
  SeverityLevel,
  StatuteSection,
  TimelineEstimate,
  CostEstimate,
  ActionStep,
} from "@/types/legal";
import { STATUTE_DATABASE } from "@/data/statutes";
import type { LegalAnalysis } from "./types";

const DOMAINS: LegalDomain[] = [
  "criminal",
  "civil",
  "family",
  "labour",
  "consumer",
  "cyber",
  "property",
];

const DOMAIN_KEYWORDS: Record<LegalDomain, string[]> = {
  criminal: ["criminal", "fir", "ipc", "crpc", "police", "arrest", "bail", "theft", "assault", "murder", "rape", "fraud", "cheating", "harassment"],
  civil: ["civil", "contract", "agreement", "breach", "cheque", "138", "negotiable", "tort", "specific relief", "injunction"],
  family: ["family", "divorce", "marriage", "maintenance", "custody", "domestic", "498a", "dowry", "alimony", "matrimonial", "hindu marriage"],
  labour: ["labour", "labor", "employment", "termination", "wages", "gratuity", "industrial", "workplace", "harassment at workplace", "posh", "retrench"],
  consumer: ["consumer", "deficiency", "service", "product", "refund", "warranty", "ecommerce", "consumer protection"],
  cyber: ["cyber", "online", "hacking", "phishing", "identity theft", "it act", "social media", "digital", "data breach", "ransomware"],
  property: ["property", "tenant", "landlord", "rent", "lease", "deposit", "eviction", "land", "real estate", "transfer of property"],
};

function detectDomains(text: string, hint?: string): LegalDomain[] {
  const lower = text.toLowerCase();
  const found = DOMAINS.filter((d) =>
    DOMAIN_KEYWORDS[d].some((kw) => lower.includes(kw))
  );
  if (hint && DOMAINS.includes(hint as LegalDomain)) {
    const h = hint as LegalDomain;
    if (!found.includes(h)) return [h, ...found];
    return [h, ...found.filter((d) => d !== h)];
  }
  return found.length > 0 ? found : ["civil"];
}

function normalizeConfidence(s: string): ConfidenceLevel {
  const v = s.toLowerCase();
  if (v.startsWith("h")) return "high";
  if (v.startsWith("l")) return "low";
  return "medium";
}

function severityFromUrgency(u: string): SeverityLevel {
  const v = (u || "").toLowerCase();
  if (v.includes("critical")) return 5;
  if (v.includes("high")) return 4;
  if (v.includes("medium")) return 3;
  if (v.includes("low")) return 2;
  if (v.includes("standard")) return 2;
  return 3;
}

function matchStatutes(la: LegalAnalysis, primaryDomain: LegalDomain): StatuteSection[] {
  const matched: StatuteSection[] = [];
  const seen = new Set<string>();

  for (const law of la.applicable_laws) {
    const actL = (law.act || "").toLowerCase();
    for (const sec of law.sections) {
      const trimmed = String(sec).replace(/section\s*/i, "").trim();
      const candidates = STATUTE_DATABASE.filter((s) => {
        const sameAct =
          actL.includes(s.act.toLowerCase().split(" ")[0]) ||
          s.act.toLowerCase().includes(actL.split(" ")[0] || "___zzz___");
        return s.section.toLowerCase() === trimmed.toLowerCase() && sameAct;
      });
      const pick = candidates[0];
      if (pick && !seen.has(pick.id)) {
        matched.push(pick);
        seen.add(pick.id);
      }
    }
  }

  if (matched.length === 0) {
    const domainStatutes = STATUTE_DATABASE.filter(
      (s) => s.domain === primaryDomain
    ).slice(0, 3);
    domainStatutes.forEach((s) => {
      if (!seen.has(s.id)) {
        matched.push(s);
        seen.add(s.id);
      }
    });
  }

  return matched.slice(0, 8);
}

const DEFAULT_TIMELINE: Record<LegalDomain, TimelineEstimate> = {
  criminal: {
    phases: [
      { name: "FIR Registration", durationDays: [1, 7] },
      { name: "Investigation", durationDays: [60, 90] },
      { name: "Chargesheet Filing", durationDays: [90, 180] },
      { name: "Trial", durationDays: [365, 730] },
    ],
    totalDaysMin: 516,
    totalDaysMax: 1007,
  },
  civil: {
    phases: [
      { name: "Plaint Filing", durationDays: [7, 14] },
      { name: "Summons", durationDays: [30, 60] },
      { name: "Pleadings & Evidence", durationDays: [60, 120] },
      { name: "Trial & Judgment", durationDays: [365, 1095] },
    ],
    totalDaysMin: 462,
    totalDaysMax: 1289,
  },
  family: {
    phases: [
      { name: "Petition Filing", durationDays: [7, 14] },
      { name: "Counselling/Mediation", durationDays: [30, 90] },
      { name: "Evidence", durationDays: [90, 180] },
      { name: "Decree", durationDays: [180, 540] },
    ],
    totalDaysMin: 307,
    totalDaysMax: 824,
  },
  labour: {
    phases: [
      { name: "Conciliation", durationDays: [30, 45] },
      { name: "Reference", durationDays: [15, 30] },
      { name: "Tribunal Hearing", durationDays: [180, 365] },
      { name: "Award", durationDays: [30, 90] },
    ],
    totalDaysMin: 255,
    totalDaysMax: 530,
  },
  consumer: {
    phases: [
      { name: "Complaint Filing", durationDays: [1, 7] },
      { name: "Notice & Reply", durationDays: [30, 45] },
      { name: "Hearing", durationDays: [60, 120] },
      { name: "Order", durationDays: [10, 30] },
    ],
    totalDaysMin: 101,
    totalDaysMax: 202,
  },
  cyber: {
    phases: [
      { name: "Cybercrime Complaint/FIR", durationDays: [1, 7] },
      { name: "Forensic Investigation", durationDays: [60, 120] },
      { name: "Chargesheet", durationDays: [90, 180] },
      { name: "Trial", durationDays: [365, 730] },
    ],
    totalDaysMin: 516,
    totalDaysMax: 1037,
  },
  property: {
    phases: [
      { name: "Notice", durationDays: [15, 30] },
      { name: "Suit Filing", durationDays: [7, 14] },
      { name: "Pleadings", durationDays: [60, 120] },
      { name: "Trial & Decree", durationDays: [365, 1095] },
    ],
    totalDaysMin: 447,
    totalDaysMax: 1259,
  },
};

const DEFAULT_COSTS: Record<LegalDomain, CostEstimate> = {
  criminal: {
    courtFeesINR: [100, 5000],
    lawyerFeesINR: [15000, 200000],
    legalAidEligible: true,
    notes: "Court fees minimal in criminal matters. Free legal aid available under Legal Services Authorities Act for those earning under Rs 3 lakh/year.",
  },
  civil: {
    courtFeesINR: [500, 50000],
    lawyerFeesINR: [10000, 300000],
    legalAidEligible: false,
    notes: "Court fee is ad valorem (typically 1-7% of suit value). Lawyer fees vary widely by complexity and seniority.",
  },
  family: {
    courtFeesINR: [100, 2500],
    lawyerFeesINR: [10000, 150000],
    legalAidEligible: true,
    notes: "Family courts have nominal fees. Mediation is encouraged before contested proceedings.",
  },
  labour: {
    courtFeesINR: [0, 1000],
    lawyerFeesINR: [5000, 100000],
    legalAidEligible: true,
    notes: "Workmen typically pay no court fees in labour disputes. Many lawyers take labour cases on contingency basis.",
  },
  consumer: {
    courtFeesINR: [100, 7500],
    lawyerFeesINR: [5000, 50000],
    legalAidEligible: false,
    notes: "Consumer courts have low fees fixed by claim slab (Rs 100-7500). Self-representation is common.",
  },
  cyber: {
    courtFeesINR: [100, 10000],
    lawyerFeesINR: [15000, 200000],
    legalAidEligible: true,
    notes: "Forensic costs may apply. Specialised cyber lawyers charge a premium.",
  },
  property: {
    courtFeesINR: [1000, 100000],
    lawyerFeesINR: [25000, 500000],
    legalAidEligible: false,
    notes: "Property suits have higher court fees based on property value. Cases tend to be lengthy and expensive.",
  },
};

function buildSteps(la: LegalAnalysis): ActionStep[] {
  if (la.action_steps.length === 0) {
    return [
      {
        order: 1,
        action: "Document everything",
        detail: "Collect all relevant evidence, communications, and proofs.",
      },
      {
        order: 2,
        action: "Consult an advocate",
        detail: "Discuss your situation with a qualified lawyer for tailored advice.",
      },
    ];
  }
  return la.action_steps
    .sort((a, b) => a.step - b.step)
    .map((s) => ({
      order: s.step,
      action: s.action,
      detail: [s.details, s.timeline].filter(Boolean).join(" \u2014 "),
    }));
}

function deriveRights(la: LegalAnalysis, domain: LegalDomain): string[] {
  const r: string[] = [];
  if (domain === "criminal") {
    r.push("Right to be informed of grounds of arrest (Article 22, CrPC 50).");
    r.push("Right to consult and be defended by a legal practitioner of your choice.");
    r.push("Right to be produced before a Magistrate within 24 hours of arrest.");
    r.push("Right to inform a relative or friend of your arrest (CrPC 50A).");
  }
  if (domain === "consumer") {
    r.push("Right to file complaint at District Forum without lawyer (Consumer Protection Act 2019).");
    r.push("Right to compensation, replacement, or refund for deficient goods/services.");
    r.push("Right to be heard within prescribed timeframes (90 days statutory disposal target).");
  }
  if (domain === "labour") {
    r.push("Right to wages, gratuity, and statutory dues on termination.");
    r.push("Right to retrenchment compensation if continuously employed for 1+ year (IDA 25F).");
    r.push("Right to safe and harassment-free workplace (POSH Act 2013).");
  }
  if (domain === "family") {
    r.push("Right to maintenance under Section 125 CrPC and personal laws.");
    r.push("Right to seek protection orders against domestic violence (DV Act 2005).");
    r.push("Right to share in marital property and matrimonial home.");
  }
  if (domain === "property") {
    r.push("Right to peaceful enjoyment of leased premises (TPA Section 108).");
    r.push("Right to refund of security deposit minus actual damages.");
    r.push("Right to be evicted only by due process under Rent Control law.");
  }
  if (domain === "cyber") {
    r.push("Right to file FIR at any cybercrime cell or via cybercrime.gov.in.");
    r.push("Right to compensation under IT Act Section 43 for damage to your data.");
    r.push("Right to privacy of your personal information (IT Act Section 66E, Article 21).");
  }
  if (domain === "civil") {
    r.push("Right to access civil courts to enforce contractual and other civil claims (CPC Section 9).");
    r.push("Right to seek injunction to prevent ongoing wrongs (Specific Relief Act).");
    r.push("Right to compensation for proven loss and damage.");
  }
  if (la.required_documents?.identity_proof) {
    r.push("Right to legal aid if you meet the income criteria under Legal Services Authorities Act.");
  }
  return r.slice(0, 6);
}

function derivePenalties(la: LegalAnalysis, statutes: StatuteSection[]): string[] {
  const out: string[] = [];
  for (const s of statutes) {
    if (s.punishment) out.push(`${s.act} \u00A7${s.section}: ${s.punishment}`);
  }
  if (la.possible_outcomes?.worst_case) {
    out.push(`Worst case: ${la.possible_outcomes.worst_case}`);
  }
  if (la.possible_outcomes?.likely_case) {
    out.push(`Likely outcome: ${la.possible_outcomes.likely_case}`);
  }
  if (out.length === 0 && la.explanation) {
    out.push("Outcomes vary by facts and evidence. See detailed analysis for context.");
  }
  return out.slice(0, 6);
}

function severityNeedsLawyer(severity: SeverityLevel): boolean {
  return severity >= 3;
}

export function toAnalysisResult(
  la: LegalAnalysis,
  opts: {
    query: string;
    language: "en" | "hi";
    jurisdiction: IndianState;
    domainHint?: string;
    responseTimeMs: number;
    id?: string;
  }
): AnalysisResult {
  const text = `${la.case_summary} ${la.case_type} ${la.explanation} ${opts.query}`;
  const domains = detectDomains(text, opts.domainHint);
  const primaryDomain = domains[0];

  const statutes = matchStatutes(la, primaryDomain);
  const confidence = normalizeConfidence(la.confidence_level);
  const severity = severityFromUrgency(la.time_sensitivity?.urgency || "");
  const needsLawyer = severityNeedsLawyer(severity) || confidence === "low";

  const timeline = DEFAULT_TIMELINE[primaryDomain];
  const baseCost = DEFAULT_COSTS[primaryDomain];
  const costs: CostEstimate = {
    courtFeesINR: baseCost.courtFeesINR,
    lawyerFeesINR: baseCost.lawyerFeesINR,
    legalAidEligible: baseCost.legalAidEligible,
    notes: la.estimated_costs?.other
      ? `${baseCost.notes} ${la.estimated_costs.other}`
      : baseCost.notes,
  };

  const id =
    opts.id ||
    (typeof crypto !== "undefined" && "randomUUID" in crypto
      ? (crypto as { randomUUID: () => string }).randomUUID()
      : `lm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

  const filingLinks = (la.filing_links || [])
    .filter((l) => l.url && l.name)
    .map((l) => ({ name: l.name, url: l.url, purpose: l.purpose }));

  const helplines = (la.helplines || [])
    .filter((h) => h.number)
    .map((h) => ({
      name: h.name || "Helpline",
      number: h.number,
      whenToUse: h.when_to_use,
    }));

  return {
    id,
    query: opts.query,
    language: opts.language,
    domains,
    primaryDomain,
    jurisdiction: opts.jurisdiction,
    applicableLaws: statutes,
    rights: deriveRights(la, primaryDomain),
    penalties: derivePenalties(la, statutes),
    nextSteps: buildSteps(la),
    timeline,
    costs,
    confidence,
    severity,
    needsLawyer,
    lawyerReason: needsLawyer
      ? severity >= 4
        ? "This case has serious legal consequences and benefits significantly from professional representation."
        : "Some legal complexity here; a lawyer can help you avoid procedural pitfalls."
      : undefined,
    plainSummary: la.case_summary || la.explanation || "",
    detailedAnalysis: la.explanation || la.case_summary || "",
    createdAt: new Date().toISOString(),
    responseTimeMs: opts.responseTimeMs,
    filingLinks,
    helplines,
  };
}
