export interface ApplicableLaw {
  act: string;
  sections: string[];
  description: string;
  confidence: "High" | "Medium" | "Low" | string;
}

export interface ActionStep {
  step: number;
  action: string;
  details: string;
  timeline: string;
}

export interface RequiredDocuments {
  essential: string[];
  supporting: string[];
  identity_proof: string;
}

export interface TimeSensitivity {
  limitation_period: string;
  urgency: "Critical" | "High" | "Medium" | "Standard" | string;
  deadline_note: string;
}

export interface PossibleOutcomes {
  best_case: string;
  likely_case: string;
  worst_case: string;
  estimated_timeline: string;
}

export interface FilingLink {
  name: string;
  url: string;
  purpose: string;
}

export interface Helpline {
  name: string;
  number: string;
  when_to_use: string;
}

export interface EstimatedCosts {
  court_fees: string;
  lawyer_fees: string;
  other: string;
}

export interface LegalAnalysis {
  case_summary: string;
  case_type: string;
  related_case_types: string[];
  jurisdiction_note: string;
  applicable_laws: ApplicableLaw[];
  explanation: string;
  action_steps: ActionStep[];
  required_documents: RequiredDocuments;
  time_sensitivity: TimeSensitivity;
  possible_outcomes: PossibleOutcomes;
  filing_links: FilingLink[];
  helplines: Helpline[];
  estimated_costs: EstimatedCosts;
  missing_info: string[];
  clarifying_questions: string[];
  confidence_level: string;
  confidence_reasoning: string;
  disclaimer: string;
}

export interface AnalyzeRequest {
  input: string;
}

export interface AnalyzeResponse {
  success: true;
  data: LegalAnalysis;
}

export interface AnalyzeError {
  success: false;
  error: string;
}

export type ApiResponse = AnalyzeResponse | AnalyzeError;

/* ── Legal Notice types ── */

export interface NoticeParty {
  name: string;
  address: string;
}

export interface LegalNoticeContent {
  date: string;
  sender: NoticeParty;
  recipient: NoticeParty;
  subject_line: string;
  under_reference: string;
  facts_paragraphs: string[];
  grievance: string;
  demand: string;
  compliance_period: string;
  consequences: string;
  closing_statement: string;
}

export interface LegalNoticeRequest {
  sender: NoticeParty;
  recipient: NoticeParty;
  analysis: LegalAnalysis;
}

export interface GenerateNoticeResponse {
  success: true;
  data: LegalNoticeContent;
}

export interface GenerateNoticeError {
  success: false;
  error: string;
}

export type NoticeApiResponse = GenerateNoticeResponse | GenerateNoticeError;
