import Groq from "groq-sdk";
import type {
  LegalAnalysis,
  LegalNoticeContent,
  NoticeDetails,
  CompensationSuggestion,
  ApplicableLaw,
  ActionStep,
  RequiredDocuments,
  TimeSensitivity,
  PossibleOutcomes,
  FilingLink,
  Helpline,
  EstimatedCosts,
} from "./types";

/* ── Language-specific style guides for plain, conversational output ── */

const LANGUAGE_STYLE_GUIDES: Record<string, string> = {
  Hindi: `LANGUAGE & STYLE RULES FOR HINDI:
- Write in Hindustani style (everyday Hindi-Urdu mix), NOT Sanskritized formal Hindi.
- Use simple, conversational language that a common person (non-lawyer) can easily understand.
- Prefer everyday words: "जमानत राशि" (not "प्रतिभूति निधि"), "किरायेदार" (not "पट्टाधारी"), "शिकायत दर्ज करें" (not "परिवाद दायर करें"), "मकान मालिक" (not "भू-स्वामी"), "कोर्ट" (not "न्यायालय"), "वकील" (not "अधिवक्ता"), "FIR दर्ज कराएं", "पुलिस स्टेशन", "जेल", "जुर्माना".
- Avoid formal/Sanskrit-derived legal terms like "प्रतिवादी", "वादी", "अभियुक्त", "याचिका" — use "सामने वाला पक्ष", "शिकायतकर्ता", "आरोपी", "अर्ज़ी" instead.
- Keep IPC/CrPC/BNS section numbers in English (e.g. "Section 420 IPC").
- Keep sentences short and clear. Write as if explaining to a friend.
- Add English terms in brackets where helpful, e.g. "सिक्योरिटी डिपॉजिट (Security Deposit)", "कंज़्यूमर कोर्ट (Consumer Court)".
- End with disclaimer in Hindi that this is AI-generated info, not legal advice.`,

  Kannada: `LANGUAGE & STYLE RULES FOR KANNADA:
- Write in modern colloquial Kannada as spoken in everyday Karnataka.
- Use simple, conversational language that any common person can understand.
- Prefer everyday words: "ಕೋರ್ಟ್" (not "ನ್ಯಾಯಾಲಯ"), "ದೂರು ದಾಖಲಿಸಿ" (not "ದೂರು ಸಲ್ಲಿಸಿ"), "ಪೊಲೀಸ್ ಸ್ಟೇಷನ್", "ವಕೀಲ", "ಜೈಲು", "ದಂಡ", "ಬಾಡಿಗೆ ಹಣ", "ಮನೆ ಮಾಲೀಕ".
- Avoid heavy Tatsama/Sanskrit-derived legal terms that sound archaic.
- Keep IPC/CrPC/BNS section numbers in English (e.g. "Section 138 NI Act").
- Keep sentences short. Write as if explaining to a neighbor.
- Add English terms in brackets where helpful, e.g. "ಸೆಕ್ಯೂರಿಟಿ ಡಿಪಾಸಿಟ್ (Security Deposit)", "ಕನ್ಸ್ಯೂಮರ್ ಕೋರ್ಟ್ (Consumer Court)".
- End with disclaimer in Kannada that this is AI-generated info, not legal advice.`,

  Tamil: `LANGUAGE & STYLE RULES FOR TAMIL:
- Write in modern spoken Tamil, NOT classical செந்தமிழ் or government gazette Tamil.
- Use simple, conversational language that any common person can understand. This is the HIGHEST PRIORITY.
- Prefer everyday words: "வழக்கு போடலாம்" (not "வழக்கு தொடரலாம்"), "வாடகை பணம்", "கோர்ட்" (not "நீதிமன்றம்"), "போலீஸ் ஸ்டேஷன்", "வக்கீல்", "ஜெயில்", "அபராதம்", "வீட்டு ஓனர்", "புகார் கொடுங்க".
- Avoid classical Tamil legal vocabulary like "வழக்காடு மன்றம்", "மனுதாரர்", "எதிர்மனுதாரர்" — use "கோர்ட்", "புகார் கொடுத்தவர்", "எதிர் பக்கம்" instead.
- Keep IPC/CrPC/BNS section numbers in English (e.g. "Section 406 IPC").
- Keep sentences short. Write as if explaining to a family member.
- Add English terms in brackets where helpful, e.g. "செக்யூரிட்டி டெபாசிட் (Security Deposit)", "கன்சூமர் கோர்ட் (Consumer Court)".
- End with disclaimer in Tamil that this is AI-generated info, not legal advice.`,

  Malayalam: `LANGUAGE & STYLE RULES FOR MALAYALAM:
- Write in everyday Kerala Malayalam with a balanced formal-casual mix.
- Use simple, conversational language that any common person can understand.
- Prefer everyday words: "കേസ് കൊടുക്കാം" (not "വ്യവഹാരം"), "വാടക കരാർ", "കോടതി" (not "ന്യായാലയം"), "പോലീസ് സ്റ്റേഷൻ", "വക്കീൽ", "ജയിൽ", "പിഴ", "വീട്ടുടമ", "പരാതി കൊടുക്കുക".
- Avoid overly pure/archaic Malayalam that sounds literary or old-fashioned.
- Keep IPC/CrPC/BNS section numbers in English (e.g. "Section 420 IPC").
- Keep sentences short. Write as if explaining to a relative.
- Add English terms in brackets where helpful, e.g. "സെക്യൂരിറ്റി ഡെപ്പോസിറ്റ് (Security Deposit)", "കൺസ്യൂമർ കോർട്ട് (Consumer Court)".
- End with disclaimer in Malayalam that this is AI-generated info, not legal advice.`,

  Telugu: `LANGUAGE & STYLE RULES FOR TELUGU:
- Write in simple modern Telugu as spoken in everyday Andhra Pradesh/Telangana.
- Use simple, conversational language that any common person can understand.
- Prefer everyday words: "కోర్టు" (not "న్యాయస్థానము"), "కేసు వేయవచ్చు", "అద్దె డబ్బు", "పోలీస్ స్టేషన్", "లాయర్", "జైలు", "జరిమానా", "ఇంటి ఓనర్", "కంప్లయింట్ ఇవ్వండి".
- Avoid archaic formal Telugu like "న్యాయస్థానము", "వాది", "ప్రతివాది" — use "కోర్టు", "కంప్లయింట్ ఇచ్చిన వాళ్ళు", "ఎదుటి పక్షం" instead.
- Keep IPC/CrPC/BNS section numbers in English (e.g. "Section 138 NI Act").
- Keep sentences short. Write as if explaining to a friend.
- Add English terms in brackets where helpful, e.g. "సెక్యూరిటీ డిపాజిట్ (Security Deposit)", "కన్స్యూమర్ కోర్ట్ (Consumer Court)".
- End with disclaimer in Telugu that this is AI-generated info, not legal advice.`,
};

function getLanguageInstruction(language: string): string {
  const guide = LANGUAGE_STYLE_GUIDES[language];
  if (!guide) return "";

  return `\n\nMANDATORY LANGUAGE REQUIREMENT — READ CAREFULLY:
1. The user may write their input in ANY language (English, Hindi, etc.). REGARDLESS of the input language, you MUST write your ENTIRE JSON response in ${language} using ${language} script.
2. EVERY SINGLE text value in the JSON MUST be in ${language}. This includes ALL of these fields: case_summary, case_type, related_case_types, jurisdiction_note, every description field, explanation, every action field, every details field, every timeline field, limitation_period, urgency, deadline_note, best_case, likely_case, worst_case, estimated_timeline, every item in missing_info, every item in clarifying_questions, confidence_level, confidence_reasoning, disclaimer.
3. The ONLY things that should remain in English are: act names (e.g. "Indian Penal Code"), section numbers (e.g. "Section 420"), and the JSON keys themselves.
4. Do NOT mix languages. Do NOT write some values in English and some in ${language}. ALL values must be in ${language}.
5. Provide the SAME level of detail and length as you would in English. Do NOT shorten, summarize, or simplify.
6. If the user writes in English, translate the analysis to ${language}. If the user writes in ${language}, respond in ${language}. Either way, output is ALWAYS in ${language}.

${guide}`;
}

function getNoticeLanguageInstruction(language: string): string {
  const guide = LANGUAGE_STYLE_GUIDES[language];
  if (!guide) return "";

  return `\n\nMANDATORY LANGUAGE REQUIREMENT — READ CAREFULLY:
1. The user may provide details in ANY language. REGARDLESS of input language, you MUST write ALL text values in ${language} using ${language} script.
2. EVERY field must be in ${language}: subject_line, under_reference, ALL facts_paragraphs, grievance, demand, compliance_period, consequences, closing_statement.
3. ONLY act names and section numbers stay in English.
4. Do NOT mix languages. ALL values must be in ${language}.
5. Provide the SAME level of detail as English. Do NOT shorten.

${guide}`;
}

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
  userInput: string,
  language: string = "English"
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
          { role: "system", content: SYSTEM_PROMPT + getLanguageInstruction(language) },
          { role: "user", content: language !== "English" ? `RESPOND IN ${language.toUpperCase()} using simple, everyday ${language} that common people understand.\n\nUser's legal situation:\n${sanitized}` : `User's legal situation:\n${sanitized}` },
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
        max_tokens: language !== "English" ? 4096 : 2048,
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

function getPronouns(gender: string, role: string) {
  const isLawyer = role === "lawyer";
  if (gender === "female") {
    return { subject: isLawyer ? "my client" : "I", possessive: isLawyer ? "my client's" : "my", object: isLawyer ? "her" : "me", pronoun: "she", honorific: "Smt." };
  }
  if (gender === "male") {
    return { subject: isLawyer ? "my client" : "I", possessive: isLawyer ? "my client's" : "my", object: isLawyer ? "him" : "me", pronoun: "he", honorific: "Shri" };
  }
  return { subject: isLawyer ? "my client" : "I", possessive: isLawyer ? "my client's" : "my", object: isLawyer ? "them" : "me", pronoun: "they", honorific: "" };
}

function buildNoticePrompt(details: NoticeDetails) {
  const sp = getPronouns(details.senderGender, details.role);
  const isLawyer = details.role === "lawyer";

  return `You are an expert Indian legal notice drafter.
Given party details and a legal analysis, draft a formal Indian legal notice.
Return ONLY valid JSON matching the schema below. No markdown fences or extra text.

IMPORTANT INSTRUCTIONS:
- ${isLawyer ? "The notice is being sent BY A LAWYER on behalf of their client. Use third-person: \"my client\", \"" + sp.pronoun + "\", \"" + sp.possessive + "\"." : "The notice is being sent BY THE INDIVIDUAL themselves. Use first-person: \"I\", \"my\", \"me\"."}
- Sender gender: ${details.senderGender} — use correct pronouns (${sp.pronoun}/${sp.possessive}/${sp.object})
- Recipient gender: ${details.recipientGender} — use correct honorific and pronouns
- The incident occurred on ${details.incidentDate} at ${details.incidentLocation}
- Compensation demanded: Rs. ${details.compensationAmount}
- Specific demand from sender: ${details.specificDemand}
- Use formal legal English appropriate for Indian courts
- Reference specific sections and acts from the analysis
- State facts in 3 to 6 numbered paragraphs
- ${isLawyer ? "Begin fact paragraphs with \"That my client...\" or \"That the Noticee...\"" : "Begin fact paragraphs with \"That I, the undersigned...\" or \"That the Noticee...\""}
- Include the exact compensation amount (Rs. ${details.compensationAmount}) in the demand
- Set a reasonable compliance period (15 or 30 days)

JSON schema:
{
  "subject_line": "Legal Notice under [specific acts/sections]",
  "under_reference": "Under [Section X of Act Y]",
  "facts_paragraphs": ["paragraph1", "paragraph2", "..."],
  "grievance": "Specific legal wrong",
  "demand": "Specific relief with Rs. amount",
  "compliance_period": "15 days from receipt of this notice",
  "consequences": "Consequences of non-compliance including filing proceedings",
  "closing_statement": "Without prejudice closing"
}`;
}

function parseLegalNoticeResponse(text: string): Omit<LegalNoticeContent, "date" | "senderName" | "senderAddress" | "recipientName" | "recipientAddress"> {
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
        "appropriate civil/criminal proceedings shall be initiated at your risk, cost and consequences."
    ),
    closing_statement: String(
      parsed.closing_statement ??
        "This notice is issued without prejudice to any other legal rights and remedies available under the law, all of which are expressly reserved."
    ),
  };
}

export async function generateLegalNotice(
  details: NoticeDetails,
  analysis: LegalAnalysis,
  language: string = "English"
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

  const lawsSummary = analysis.applicable_laws
    .slice(0, 5)
    .map((l) => `- ${l.act} [Sections ${l.sections.join(", ")}]: ${l.description}`)
    .join("\n");

  const systemPrompt = buildNoticePrompt(details) + getNoticeLanguageInstruction(language);

  const userMessage = (language !== "English" ? `RESPOND IN ${language.toUpperCase()} using simple, everyday ${language} that common people understand.\n\n` : "") + `Draft a formal Indian legal notice:

Sender: ${details.senderName}, ${details.senderAddress}
Recipient: ${details.recipientName}, ${details.recipientAddress}

Case Type: ${analysis.case_type}
Case Summary: ${analysis.case_summary}
Jurisdiction: ${analysis.jurisdiction_note}
Incident Date: ${details.incidentDate}
Incident Location: ${details.incidentLocation}
Compensation Amount: Rs. ${details.compensationAmount}
Specific Demand: ${details.specificDemand}

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
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.2,
        max_tokens: language !== "English" ? 4096 : 2048,
        response_format: { type: "json_object" },
      });

      const response = chatCompletion.choices[0]?.message?.content;
      if (!response) {
        throw new Error("The AI model returned an empty response. Please retry.");
      }

      const notice = parseLegalNoticeResponse(response);

      return {
        ...notice,
        date: details.noticeDate,
        senderName: details.senderName,
        senderAddress: details.senderAddress,
        recipientName: details.recipientName,
        recipientAddress: details.recipientAddress,
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

/* ── Compensation Suggestion ──────────────────────────── */

const COMPENSATION_PROMPT = `You are an Indian legal compensation advisor.
Based on the legal analysis provided, suggest a reasonable compensation range.
Consider the case type, applicable laws, severity, and Indian court precedents.
Return ONLY valid JSON. No markdown fences or extra text.

JSON schema:
{
  "min": "amount in INR (e.g. 50,000)",
  "max": "amount in INR (e.g. 5,00,000)",
  "reasoning": "Brief explanation of why this range is appropriate (2-3 sentences)"
}`;

export async function suggestCompensation(
  analysis: LegalAnalysis
): Promise<CompensationSuggestion> {
  const apiKeys: string[] = [];
  for (let i = 1; ; i++) {
    const key = process.env[`GROQ_API_KEY_${i}`] || (i === 1 ? process.env.GROQ_API_KEY : undefined);
    if (!key) break;
    apiKeys.push(key);
  }

  if (apiKeys.length === 0) {
    throw new Error("No GROQ_API_KEY configured on the server.");
  }

  const userMessage = `Suggest a compensation range for this Indian legal case:

Case Type: ${analysis.case_type}
Summary: ${analysis.case_summary}
Applicable Laws: ${analysis.applicable_laws.slice(0, 3).map((l) => l.act).join(", ")}
Estimated Costs - Court Fees: ${analysis.estimated_costs.court_fees}, Lawyer Fees: ${analysis.estimated_costs.lawyer_fees}
Urgency: ${analysis.time_sensitivity.urgency}`;

  let lastError: Error | null = null;

  for (const apiKey of apiKeys) {
    try {
      const groq = new Groq({ apiKey });

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: COMPENSATION_PROMPT },
          { role: "user", content: userMessage },
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
        max_tokens: 512,
        response_format: { type: "json_object" },
      });

      const response = chatCompletion.choices[0]?.message?.content;
      if (!response) throw new Error("Empty response from AI.");

      let cleaned = response.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
      }
      const parsed = JSON.parse(cleaned || "{}") as Record<string, unknown>;

      return {
        min: String(parsed.min ?? "10,000"),
        max: String(parsed.max ?? "1,00,000"),
        reasoning: String(parsed.reasoning ?? "Based on the case type and applicable laws."),
      };
    } catch (error) {
      const err = error as Error;
      lastError = err;

      const isRateLimitOrTokenError =
        err.message.includes("rate limit") || err.message.includes("Rate limit") ||
        err.message.includes("quota") || err.message.includes("tokens");

      if (!isRateLimitOrTokenError) break;
      console.warn(`API key failed: ${err.message}. Trying next key...`);
    }
  }

  if (lastError) throw lastError;
  throw new Error("All API keys failed. Please try again later.");
}
