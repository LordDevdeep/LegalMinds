export type LegalDomain =
  | "criminal"
  | "civil"
  | "family"
  | "labour"
  | "consumer"
  | "cyber"
  | "property";

export type ConfidenceLevel = "high" | "medium" | "low";

export type SeverityLevel = 1 | 2 | 3 | 4 | 5;

export type IndianState =
  | "Andhra Pradesh"
  | "Karnataka"
  | "Maharashtra"
  | "Tamil Nadu"
  | "Delhi"
  | "Uttar Pradesh"
  | "West Bengal"
  | "Gujarat"
  | "Rajasthan"
  | "Kerala"
  | "Telangana"
  | "Madhya Pradesh"
  | "Haryana"
  | "Punjab"
  | "Bihar"
  | "Other";

export const INDIAN_STATES: IndianState[] = [
  "Andhra Pradesh",
  "Bihar",
  "Delhi",
  "Gujarat",
  "Haryana",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
  "Other",
];

export const DOMAIN_LABELS: Record<LegalDomain, string> = {
  criminal: "Criminal",
  civil: "Civil",
  family: "Family",
  labour: "Labour",
  consumer: "Consumer",
  cyber: "Cyber",
  property: "Property",
};

export interface StatuteSection {
  id: string;
  act: string;
  section: string;
  title: string;
  text: string;
  punishment?: string;
  domain: LegalDomain;
}

export interface ActionStep {
  order: number;
  action: string;
  detail: string;
  done?: boolean;
}

export interface TimelineEstimate {
  phases: { name: string; durationDays: [number, number] }[];
  totalDaysMin: number;
  totalDaysMax: number;
}

export interface CostEstimate {
  courtFeesINR: [number, number];
  lawyerFeesINR: [number, number];
  legalAidEligible: boolean;
  notes: string;
}

export interface FilingLinkRef {
  name: string;
  url: string;
  purpose: string;
}

export interface HelplineRef {
  name: string;
  number: string;
  whenToUse: string;
}

export interface AnalysisResult {
  id: string;
  query: string;
  language: "en" | "hi";
  domains: LegalDomain[];
  primaryDomain: LegalDomain;
  jurisdiction: IndianState;
  applicableLaws: StatuteSection[];
  rights: string[];
  penalties: string[];
  nextSteps: ActionStep[];
  timeline: TimelineEstimate;
  costs: CostEstimate;
  confidence: ConfidenceLevel;
  severity: SeverityLevel;
  needsLawyer: boolean;
  lawyerReason?: string;
  plainSummary: string;
  detailedAnalysis: string;
  createdAt: string;
  responseTimeMs: number;
  filingLinks?: FilingLinkRef[];
  helplines?: HelplineRef[];
}
