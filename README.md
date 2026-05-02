# LegalMinds — AI-Powered Legal Analysis for Indian Law

A production Next.js application that turns a plain-English (or Hindi) description of a legal situation into a structured, citation-grounded analysis — with applicable laws, your rights, possible penalties, action steps, timelines, costs, helplines, and filing portals. Generates court-submittable legal notices and downloadable PDF reports.

**Live:** https://legalminds-sepia.vercel.app

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4)

---

## Why LegalMinds

Most "legal AI" tools hallucinate Indian sections that don't exist. LegalMinds doesn't.

- **Citation-grounded.** Every cited statute is matched against a curated, in-repo database of 60+ real Indian sections (IPC, CrPC, CPC, Consumer Protection Act 2019, IT Act, Hindu Marriage Act, DV Act, Industrial Disputes Act, Transfer of Property Act, and more). The model is constrained to choose from this list — no fabricated section numbers.
- **Domain-aware.** The case is auto-classified into Criminal / Civil / Family / Labour / Consumer / Cyber / Property, and the prompt is filtered to the relevant statutes for higher precision.
- **Bilingual.** Full English ↔ Hindi UI plus Hindi-language analysis when selected (everyday Hindustani, not literary Hindi).
- **Tangible outputs.** Every analysis can be exported as a PDF report, shared via a cross-device link, or used as the foundation for a formal legal notice.

---

## Features

### Core analysis
- **Case Analyzer** with category and jurisdiction (16 Indian states) selectors
- **Citation grounding** — laws referenced are pulled from a 60-section curated database, not invented
- **Multi-domain detection** — flags every applicable area of law, not just the primary
- **Severity meter (1-5)** + **confidence badge** (high / medium / low)
- **Plain English ↔ Detailed Legal toggle** so the same analysis works for laypeople and lawyers
- **Tickable next-steps checklist** with progress saved per-analysis in localStorage
- **Phase-by-phase timeline estimator** (FIR → investigation → chargesheet → trial, etc.)
- **Cost estimator** with court fees, lawyer fees, and **legal aid eligibility flag** (Section 12, Legal Services Authorities Act)
- **Voice input** (Web Speech API, en-IN / hi-IN)
- **Guided 5-step questionnaire mode** for users who don't know where to start
- **4-step progress indicator** during analysis with typed error states (network / timeout / validation / rate-limit)

### Tangible outputs
- **PDF Download** — multi-page formatted A4 report with header, full statute text, rights, penalties, steps, timeline, costs, and disclaimer (auth-gated)
- **Cross-device shareable links** — saved to Supabase, openable from any device
- **Native share sheet** — tapping Share opens the OS share menu (WhatsApp, Email, Telegram, etc.) on mobile
- **Print-friendly view** — clean black-on-white layout with logo header (no login required)
- **Legal Notice Generator** — formal, court-submittable legal notices in proper Indian format with sender/recipient details, gendered pronouns, statute references, compensation amount, and compliance period (auth-gated)
- **AI Compensation Suggestion** — case-type-aware compensation ranges grounded in Indian benchmarks (Sarla Verma multiplier for MV claims, Section 138 NI cap, defamation tiers, DV Act Section 22, POSH Act, etc.) using `llama-3.3-70b-versatile`

### Knowledge layer
- **Statute Library** (`/library`) — browse all 60+ sections grouped by domain, search by act/section/keyword, "Use this in analysis" prefill button
- **Know Your Rights** (`/rights`) — 5 detailed cards (Arrest, Women's Rights, Tenant, Employee, Consumer) with rights list + statutes + what-to-do
- **Glossary** (`/glossary`) — 35+ legal terms with definitions and examples, fuzzy search
- **Landmark Judgments** (`/judgments`) — 10 Supreme Court cases (Kesavananda, Maneka Gandhi, Puttaswamy, Vishaka, Navtej Singh Johar, etc.) with key issue, holding, and why-it-matters

### Reliability & UX
- **Multi-API key failover** — supports unlimited Groq keys; rotates automatically on rate limit / error
- **Auto-retry** on server errors
- **Helpline cards** at the top of each analysis (tap-to-call)
- **Government portal links** (eCourts, IndiaCode, NALSA, Bar Council, Tele-Law) integrated into every analysis
- **Auth-gated downloads** with email/Google login (Supabase Auth)
- **Personal history** — saved analyses on `/dashboard` for logged-in users
- **Disclaimer modal** + per-result warnings (legal compliance)

---

## Tech Stack

| Layer    | Technology                                                                |
| -------- | ------------------------------------------------------------------------- |
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS                         |
| Backend  | Next.js API Routes (Node runtime)                                         |
| AI       | Groq SDK — `llama-3.1-8b-instant` (analysis) + `llama-3.3-70b-versatile` (compensation) |
| Auth/DB  | Supabase (Auth + Postgres + RLS)                                          |
| PDF      | jsPDF (analysis report, manual layout) + html2pdf.js (legal notice with Indic script) |
| i18n     | React Context + zero-dependency TypeScript translation files              |

---

## Quick start

### Prerequisites
- Node.js 18+
- One or more **Groq API keys** (free at [console.groq.com](https://console.groq.com))
- A **Supabase project** (free tier is enough)

### 1. Clone and install
```bash
git clone https://github.com/LordDevdeep/LegalMinds.git
cd LegalMinds
npm install
```

### 2. Configure environment
Create `.env.local`:
```
GROQ_API_KEY_1=gsk_your_first_key
GROQ_API_KEY_2=gsk_your_second_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```
You can add unlimited Groq keys (`GROQ_API_KEY_1`, `_2`, `_3`, …). The app rotates them automatically on rate limit / error.

### 3. Set up Supabase tables
Open the Supabase SQL Editor and run [`src/lib/supabase/schema.sql`](src/lib/supabase/schema.sql). It creates three tables with RLS policies:
- `profiles` — user display names (auto-populated on signup)
- `analyses` — per-user analysis history
- `shared_analyses` — public table for cross-device shareable links

### 4. Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 5. Production build
```bash
npm run build
npm start
```

---

## Routes

### Pages
| Route | Purpose |
| ----- | ------- |
| `/` | Landing page |
| `/analyzer` | Main case analyzer (free + guided + voice modes) |
| `/library` | Browse 60+ statute sections (the citation source) |
| `/rights` | Know-your-rights cards |
| `/rights/[slug]` | Detailed rights pages |
| `/glossary` | 35+ legal terms with search |
| `/judgments` | Landmark Supreme Court cases |
| `/share/[id]` | Read-only public view of a shared analysis |
| `/dashboard` | User's saved analyses (auth required) |
| `/auth/login` · `/auth/signup` | Authentication |
| `/terms` · `/privacy` | Legal pages |

### API
| Route | Method | Purpose |
| ----- | ------ | ------- |
| `/api/analyze` | POST | Citation-grounded legal analysis |
| `/api/generate-notice` | POST | Formal legal notice generation |
| `/api/suggest-compensation` | POST | Benchmark-anchored compensation range |
| `/api/shared-analysis` | POST/GET | Cross-device share storage |
| `/api/history` | GET/POST/DELETE | Per-user analysis history (auth) |

---

## Folder structure

```
legalminds/
├── src/
│   ├── app/                       # Next.js app router pages + API routes
│   │   ├── analyzer/              # Main analyzer
│   │   ├── library/               # Statute browser
│   │   ├── rights/                # Rights cards
│   │   ├── glossary/              # Legal terms
│   │   ├── judgments/             # Landmark cases
│   │   ├── share/[id]/            # Cross-device share viewer
│   │   ├── dashboard/             # User history
│   │   ├── auth/                  # Login / signup / callback
│   │   └── api/                   # /analyze, /generate-notice, /suggest-compensation, /shared-analysis, /history
│   ├── components/                # React components
│   │   ├── AnalysisResult.tsx     # Main result renderer (cards)
│   │   ├── AnalysisProgress.tsx   # 4-step progress UI
│   │   ├── CategorySelector.tsx
│   │   ├── JurisdictionSelector.tsx
│   │   ├── ConfidenceBadge.tsx
│   │   ├── SeverityMeter.tsx
│   │   ├── ErrorState.tsx
│   │   ├── VoiceInput.tsx
│   │   ├── GuidedQuestionnaire.tsx
│   │   ├── NoticeModal.tsx
│   │   └── ResultCards.tsx        # Legacy renderer (used in /dashboard)
│   ├── data/
│   │   ├── statutes.ts            # ★ 60+ section citation-grounding database
│   │   ├── rights.ts              # 5 rights cards content
│   │   ├── glossary.ts            # 35+ legal terms
│   │   └── judgments.ts           # 10 landmark judgments
│   ├── types/
│   │   └── legal.ts               # AnalysisResult, StatuteSection, IndianState, etc.
│   ├── lib/
│   │   ├── gemini.ts              # Groq integration + prompts (analysis, notice, compensation)
│   │   ├── toAnalysisResult.ts    # Mapper from raw LLM JSON → AnalysisResult (with statute lookup)
│   │   ├── generateAnalysisPdf.ts # Multi-page jsPDF report
│   │   ├── generateNoticePdf.ts   # html2pdf legal notice
│   │   ├── filingLinks.ts         # Verified govt portals + helplines
│   │   └── supabase/
│   │       ├── client.ts          # Browser Supabase client
│   │       ├── server.ts          # Server Supabase client
│   │       └── schema.sql         # Database migration
│   └── i18n/                      # English + Hindi translations
└── public/                        # Logos, favicon
```

---

## How citation grounding works

1. The user submits a query and (optionally) picks a domain.
2. [`src/data/statutes.ts`](src/data/statutes.ts) holds a typed list of 60+ real Indian sections, each with `act`, `section`, `title`, `text`, `punishment`, and `domain`.
3. The system prompt is dynamically built with a filtered subset of this list (filtered by domain hint when provided) and the model is instructed: *"Cite ONLY sections from the provided list. If no exact match exists, return the closest applicable section."*
4. The model returns acts + sections; [`toAnalysisResult.ts`](src/lib/toAnalysisResult.ts) looks them up against `STATUTE_DATABASE` and attaches the **full statute text and punishment** to each citation for display.
5. Every section the user sees in the UI is one that demonstrably exists in the database — no hallucinated references.

Adding a new section is one entry in [`src/data/statutes.ts`](src/data/statutes.ts):
```ts
{
  id: "BNS-103",
  act: "Bharatiya Nyaya Sanhita",
  section: "103",
  title: "Punishment for murder",
  text: "...paraphrased section text...",
  punishment: "...",
  domain: "criminal",
},
```

---

## Compensation grounding

`suggestCompensation` uses a richer prompt with **explicit per-case benchmarks** rather than free-form generation:
- Consumer disputes (CPA 2019)
- Cheque dishonour (NI Act § 138 — capped at 2x cheque amount)
- Defamation tiers (private vs public figure)
- Wrongful termination + statutory dues
- Domestic Violence Act § 20 / § 22 reliefs
- Motor accidents (Sarla Verma multiplier method)
- Cybercrime & identity theft (IT Act § 43, § 66C)
- Property unlawful possession
- Medical negligence
- Stridhan recovery + maintenance under § 125 CrPC

The model is asked to cite the specific benchmark category it applied, so the reasoning is auditable.

---

## Deployment (Vercel)

1. Push to GitHub
2. Import into Vercel
3. Add environment variables:
   - `GROQ_API_KEY_1`, `GROQ_API_KEY_2`, …
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy
5. In Supabase SQL Editor run [`src/lib/supabase/schema.sql`](src/lib/supabase/schema.sql) once

Also runs on any Node host: set the env vars and run `npm run build && npm start`.

---

## Security

- API keys stored only as environment variables; never sent to the client
- User input sanitized server-side (control chars stripped, length capped at 5000)
- Supabase Row Level Security on all user tables (`profiles`, `analyses`)
- Error messages mapped through `toSafeMessage` before reaching the client
- Auth-gated: PDF download and Notice generation require a logged-in user

---

## Disclaimer

This application generates AI-powered legal information for **educational purposes only**. It does **not** constitute legal advice. Citations are matched against a curated database of Indian statutes for accuracy, but the analysis is not a substitute for consultation with a qualified advocate. Always verify important citations with official sources (https://www.indiacode.nic.in) and consult a lawyer before acting on the output.

---

## License

[MIT](LICENSE)
