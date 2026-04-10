import Groq from "groq-sdk";
import type {
  LegalAnalysis,
  LegalNoticeContent,
  NoticeParty,
  ApplicableLaw,
  ActionStep,
  RequiredDocuments,
  TimeSensitivity,
  PossibleOutcomes,
  FilingLink,
  Helpline,
  EstimatedCosts,
} from "./types";

const SYSTEM_PROMPT = `You are LegalMinds AI, an Indian law assistant.
Analyze the user's legal problem and return ONLY valid JSON.
Do not include markdown fences, explanations outside JSON, or any other text.
If the information is incomplete, include clear entries in "missing_info" and "clarifying_questions".
Use BNS/BNSS for incidents after July 1, 2024 and refer only to applicable Indian law.

The JSON must exactly match this schema:
{
  "case_summary": "string",
  "case_type": "Primary type",
  "related_case_types": ["string"],
  "jurisdiction_note": "State-specific note or general",
  "applicable_laws": [
    {
      "act": "Act name",
      "sections": ["X", "Y"],
      "description": "What it covers",
      "confidence": "High|Medium|Low"
    }
  ],
  "explanation": "Plain language explanation under 200 words",
  "action_steps": [
    {
      "step": 1,
      "action": "What to do",
      "details": "How to do it",
      "timeline": "When"
    }
  ],
  "required_documents": {
    "essential": ["string"],
    "supporting": ["string"],
    "identity_proof": "Aadhaar/PAN/Passport/Voter ID"
  },
  "time_sensitivity": {
    "limitation_period": "Specific period",
    "urgency": "Critical|High|Medium|Standard",
    "deadline_note": "Key deadline"
  },
  "possible_outcomes": {
    "best_case": "string",
    "likely_case": "string",
    "worst_case": "string",
    "estimated_timeline": "string"
  },
  "filing_links": [
    {
      "name": "Portal name",
      "url": "https://...",
      "purpose": "What to do here"
    }
  ],
  "helplines": [
    {
      "name": "",
      "number": "",
      "when_to_use": ""
    }
  ],
  "estimated_costs": {
    "court_fees": "",
    "lawyer_fees": "",
    "other": ""
  },
  "missing_info": ["string"],
  "clarifying_questions": ["string"],
  "confidence_level": "High|Medium|Low",
  "confidence_reasoning": "Why this confidence level",
  "disclaimer": "⚠️ This is AI-generated legal information for educational purposes only. NOT legal advice. Consult a qualified advocate before taking action."
}`;

function sanitizeInput(raw: string): string {
  return raw
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 5000);
}

function normalizeApplicableLaws(raw: unknown): ApplicableLaw[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.map((item) => {
    if (typeof item === "string") {
      return {
        act: item,
        sections: [],
        description: "",
        confidence: "Medium",
      };
    }

    if (typeof item === "object" && item !== null) {
      return {
        act: String((item as any).act ?? ""),
        sections: Array.isArray((item as any).sections)
          ? (item as any).sections.map(String)
          : [],
        description: String((item as any).description ?? ""),
        confidence: String((item as any).confidence ?? "Medium"),
      };
    }

    return {
      act: "",
      sections: [],
      description: "",
      confidence: "Medium",
    };
  });
}

function normalizeActionSteps(raw: unknown): ActionStep[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.map((item, index) => {
    if (typeof item === "object" && item !== null) {
      return {
        step: Number((item as any).step ?? index + 1),
        action: String((item as any).action ?? ""),
        details: String((item as any).details ?? ""),
        timeline: String((item as any).timeline ?? ""),
      };
    }

    return {
      step: index + 1,
      action: String(item ?? ""),
      details: "",
      timeline: "",
    };
  });
}

function normalizeStrings(raw: unknown): string[] {
  return Array.isArray(raw) ? raw.map(String) : [];
}

function normalizeObject<T>(raw: unknown, defaults: T): T {
  if (typeof raw !== "object" || raw === null) {
    return defaults;
  }
  return { ...defaults, ...(raw as object) } as T;
}

function normalizeFilingLinks(raw: unknown): FilingLink[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.map((item) => {
    if (typeof item === "object" && item !== null) {
      return {
        name: String((item as any).name ?? ""),
        url: String((item as any).url ?? ""),
        purpose: String((item as any).purpose ?? ""),
      };
    }
    return { name: String(item ?? ""), url: "", purpose: "" };
  });
}

function normalizeHelplines(raw: unknown): Helpline[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.map((item) => {
    if (typeof item === "object" && item !== null) {
      return {
        name: String((item as any).name ?? ""),
        number: String((item as any).number ?? ""),
        when_to_use: String((item as any).when_to_use ?? ""),
      };
    }
    return { name: String(item ?? ""), number: "", when_to_use: "" };
  });
}

function parseModelResponse(text: string): LegalAnalysis {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  }

  const parsed = JSON.parse(cleaned || "{}") as Record<string, unknown>;

  const defaultRequiredDocuments: RequiredDocuments = {
    essential: [],
    supporting: [],
    identity_proof: "Aadhaar/PAN/Passport/Voter ID",
  };

  const defaultTimeSensitivity: TimeSensitivity = {
    limitation_period: "",
    urgency: "Standard",
    deadline_note: "",
  };

  const defaultPossibleOutcomes: PossibleOutcomes = {
    best_case: "",
    likely_case: "",
    worst_case: "",
    estimated_timeline: "",
  };

  const defaultEstimatedCosts: EstimatedCosts = {
    court_fees: "",
    lawyer_fees: "",
    other: "",
  };

  return {
    case_summary: String(parsed.case_summary ?? parsed.summary ?? ""),
    case_type: String(parsed.case_type ?? parsed.legal_category ?? "Unknown"),
    related_case_types: normalizeStrings(parsed.related_case_types),
    jurisdiction_note: String(parsed.jurisdiction_note ?? "General Indian jurisdiction"),
    applicable_laws: normalizeApplicableLaws(parsed.applicable_laws),
    explanation: String(parsed.explanation ?? ""),
    action_steps: normalizeActionSteps(parsed.action_steps),
    required_documents: normalizeObject(parsed.required_documents, defaultRequiredDocuments),
    time_sensitivity: normalizeObject(parsed.time_sensitivity, defaultTimeSensitivity),
    possible_outcomes: normalizeObject(parsed.possible_outcomes, defaultPossibleOutcomes),
    filing_links: normalizeFilingLinks(parsed.filing_links),
    helplines: normalizeHelplines(parsed.helplines),
    estimated_costs: normalizeObject(parsed.estimated_costs, defaultEstimatedCosts),
    missing_info: normalizeStrings(parsed.missing_info),
    clarifying_questions: normalizeStrings(parsed.clarifying_questions),
    confidence_level: String(parsed.confidence_level ?? "Medium"),
    confidence_reasoning: String(parsed.confidence_reasoning ?? ""),
    disclaimer: String(
      parsed.disclaimer ??
        "⚠️ This is AI-generated legal information for educational purposes only. NOT legal advice. Consult a qualified advocate before taking action."
    ),
  };
}

export async function analyzeLegalCase(
  userInput: string
): Promise<LegalAnalysis> {
  // Collect all available API keys
  const apiKeys: string[] = [];
  for (let i = 1; ; i++) {
    const key = process.env[`GROQ_API_KEY_${i}`] || (i === 1 ? process.env.GROQ_API_KEY : undefined);
    if (!key) break;
    apiKeys.push(key);
  }

  if (apiKeys.length === 0) {
    throw new Error("No GROQ_API_KEY configured on the server.");
  }

  const sanitized = sanitizeInput(userInput);
  if (sanitized.length < 10) {
    throw new Error(
      "Please provide more detail about your legal situation (at least 10 characters)."
    );
  }

  let lastError: Error | null = null;

  // Try each API key in sequence
  for (const apiKey of apiKeys) {
    try {
      const groq = new Groq({ apiKey });

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `User's legal situation:\n${sanitized}` },
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
        max_tokens: 2048,
        response_format: { type: "json_object" },
      });

      const response = chatCompletion.choices[0]?.message?.content;
      if (!response) {
        throw new Error("The AI model returned an empty response. Please retry.");
      }

      return parseModelResponse(response);
    } catch (error) {
      const err = error as Error;
      lastError = err;

      // Check if this is a rate limit or token exhaustion error
      const isRateLimitOrTokenError =
        err.message.includes("rate limit") ||
        err.message.includes("Rate limit") ||
        err.message.includes("quota") ||
        err.message.includes("tokens") ||
        err.message.includes("insufficient") ||
        err.message.includes("exceeded");

      // If it's not a rate limit/token error, don't try next key
      if (!isRateLimitOrTokenError) {
        break;
      }

      // Continue to next key if this was a rate limit/token error
      console.warn(`API key failed with rate limit/token error: ${err.message}. Trying next key...`);
    }
  }

  // If we get here, all keys failed
  if (lastError) {
    throw lastError;
  }

  throw new Error("All API keys failed. Please try again later.");
}

/* ── Legal Notice Generation ──────────────────────────── */

const LEGAL_NOTICE_PROMPT = `You are an expert Indian legal notice drafter.
Given a legal analysis and party details, draft a formal Indian legal notice.
Return ONLY valid JSON matching this schema exactly.
Do not include markdown fences or any text outside the JSON.

The notice must follow Indian legal notice conventions:
- Use formal, legal English appropriate for Indian courts
- Reference specific sections and acts from the analysis
- State facts clearly in numbered paragraphs (3 to 6 paragraphs)
- Begin fact paragraphs with "That my client..." or "That the Noticee..."
- Make a specific, actionable demand
- Set a reasonable compliance period (typically 15 or 30 days)
- State consequences of non-compliance (filing civil/criminal proceedings as appropriate)
- Include the standard "without prejudice" closing

JSON schema:
{
  "subject_line": "Legal Notice under [specific acts/sections from analysis]",
  "under_reference": "Under [Section X of Act Y, Section Z of Act W]",
  "facts_paragraphs": [
    "That my client ...",
    "That the Noticee ...",
    "That despite repeated requests..."
  ],
  "grievance": "Specific legal wrong committed by the Noticee",
  "demand": "Specific relief sought with amount/action",
  "compliance_period": "15 days from receipt of this notice",
  "consequences": "My client shall be constrained to initiate appropriate civil/criminal proceedings under the aforementioned provisions of law, at your risk, cost and consequences, which please note.",
  "closing_statement": "This notice is issued without prejudice to any other legal rights and remedies available to my client under the law, all of which are expressly reserved."
}`;

function parseLegalNoticeResponse(text: string): Omit<LegalNoticeContent, "date" | "sender" | "recipient"> {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  }
  const parsed = JSON.parse(cleaned || "{}") as Record<string, unknown>;

  return {
    subject_line: String(parsed.subject_line ?? "Legal Notice"),
    under_reference: String(parsed.under_reference ?? ""),
    facts_paragraphs: Array.isArray(parsed.facts_paragraphs)
      ? parsed.facts_paragraphs.map(String)
      : [String(parsed.facts_paragraphs ?? "")],
    grievance: String(parsed.grievance ?? ""),
    demand: String(parsed.demand ?? ""),
    compliance_period: String(parsed.compliance_period ?? "15 days from receipt of this notice"),
    consequences: String(
      parsed.consequences ??
        "My client shall be constrained to initiate appropriate civil/criminal proceedings at your risk, cost and consequences."
    ),
    closing_statement: String(
      parsed.closing_statement ??
        "This notice is issued without prejudice to any other legal rights and remedies available to my client under the law, all of which are expressly reserved."
    ),
  };
}

export async function generateLegalNotice(
  sender: NoticeParty,
  recipient: NoticeParty,
  analysis: LegalAnalysis
): Promise<LegalNoticeContent> {
  const apiKeys: string[] = [];
  for (let i = 1; ; i++) {
    const key = process.env[`GROQ_API_KEY_${i}`] || (i === 1 ? process.env.GROQ_API_KEY : undefined);
    if (!key) break;
    apiKeys.push(key);
  }

  if (apiKeys.length === 0) {
    throw new Error("No GROQ_API_KEY configured on the server.");
  }

  // Build condensed analysis context for the AI
  const lawsSummary = analysis.applicable_laws
    .slice(0, 5)
    .map((l) => `- ${l.act} [Sections ${l.sections.join(", ")}]: ${l.description}`)
    .join("\n");

  const userMessage = `Draft a formal Indian legal notice based on this analysis:

Sender: ${sender.name}, ${sender.address}
Recipient: ${recipient.name}, ${recipient.address}

Case Type: ${analysis.case_type}
Case Summary: ${analysis.case_summary}
Jurisdiction: ${analysis.jurisdiction_note}

Applicable Laws:
${lawsSummary}

Urgency: ${analysis.time_sensitivity.urgency}
Limitation Period: ${analysis.time_sensitivity.limitation_period}`;

  let lastError: Error | null = null;

  for (const apiKey of apiKeys) {
    try {
      const groq = new Groq({ apiKey });

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: LEGAL_NOTICE_PROMPT },
          { role: "user", content: userMessage },
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.2,
        max_tokens: 2048,
        response_format: { type: "json_object" },
      });

      const response = chatCompletion.choices[0]?.message?.content;
      if (!response) {
        throw new Error("The AI model returned an empty response. Please retry.");
      }

      const notice = parseLegalNoticeResponse(response);

      const today = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      return {
        ...notice,
        date: today,
        sender,
        recipient,
      };
    } catch (error) {
      const err = error as Error;
      lastError = err;

      const isRateLimitOrTokenError =
        err.message.includes("rate limit") ||
        err.message.includes("Rate limit") ||
        err.message.includes("quota") ||
        err.message.includes("tokens") ||
        err.message.includes("insufficient") ||
        err.message.includes("exceeded");

      if (!isRateLimitOrTokenError) break;
      console.warn(`API key failed: ${err.message}. Trying next key...`);
    }
  }

  if (lastError) throw lastError;
  throw new Error("All API keys failed. Please try again later.");
}
