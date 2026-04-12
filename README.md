# LegalMinds — AI-Powered Legal Analysis for Indian Law

A production-ready Next.js application that analyzes legal situations, generates court-ready legal notices, and provides structured legal guidance using AI.

**Live:** [legalminds-sepia.vercel.app](https://legalminds-sepia.vercel.app)

## Features

- **Case Analyzer** — Describe any legal situation and get detailed structured analysis with applicable laws, penalties, action steps, timelines, and estimated costs
- **Legal Notice Generator** — Generate professional, court-submittable legal notices with sender/recipient details, incident info, compensation, and formal legal language
- **AI Compensation Suggestion** — Get AI-recommended compensation ranges based on case type and Indian court precedents
- **PDF Download** — Download analysis reports and legal notices as properly formatted A4 PDFs with Indic script support
- **Bilingual Support** — Full UI in English and Hindi with translated headings, labels, buttons, and placeholders
- **Hindi AI Responses** — When Hindi is selected, AI generates analysis entirely in simple Hindustani (everyday Hindi)
- **Multi-API Key Failover** — Supports multiple Groq API keys with automatic rotation on rate limits or errors
- **Auto-Retry** — Frontend automatically retries failed requests for reliability
- **Dark UI** — Professional, accessible interface with smooth animations

## Tech Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend  | Next.js API Routes, TypeScript    |
| AI       | Groq API (Llama 3.1 8B Instant)   |
| PDF      | html2pdf.js (browser-native font rendering) |
| i18n     | React Context + TypeScript translation files (zero dependencies) |

## Folder Structure

```
legalminds/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout + metadata + LanguageProvider
│   │   ├── globals.css             # Tailwind + custom styles
│   │   ├── page.tsx                # Home / landing page
│   │   ├── analyzer/
│   │   │   └── page.tsx            # Main analyzer page
│   │   └── api/
│   │       ├── analyze/
│   │       │   └── route.ts        # POST — case analysis
│   │       ├── generate-notice/
│   │       │   └── route.ts        # POST — legal notice generation
│   │       └── suggest-compensation/
│   │           └── route.ts        # POST — AI compensation suggestion
│   ├── i18n/
│   │   ├── index.ts                # Locale registry + translation lookup
│   │   ├── LanguageContext.tsx      # React context (locale, setLocale, t())
│   │   └── locales/
│   │       ├── en.ts               # English translations (70+ keys)
│   │       └── hi.ts               # Hindi translations
│   ├── lib/
│   │   ├── gemini.ts               # Groq API integration + prompts
│   │   ├── generatePdf.ts          # Analysis PDF generator (html2pdf.js)
│   │   ├── generateNoticePdf.ts    # Legal notice PDF generator
│   │   ├── types.ts                # TypeScript interfaces
│   │   └── html2pdf.d.ts           # Type declarations for html2pdf.js
│   └── components/
│       ├── Icons.tsx               # SVG icon components
│       ├── LanguageSelector.tsx     # Language dropdown (English/Hindi)
│       ├── LoadingSkeleton.tsx      # Shimmer loading state
│       ├── NoticeModal.tsx          # Legal notice form modal
│       └── ResultCards.tsx          # Structured result display + PDF/notice buttons
├── public/
│   ├── logo.png                    # Full logo
│   ├── logo-icon.png               # Icon-only logo
│   └── favicon.png                 # Browser tab icon
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Setup & Installation

### Prerequisites

- **Node.js** 18+
- One or more **Groq API keys** (free at [console.groq.com](https://console.groq.com))

### 1. Clone & install

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
GROQ_API_KEY_3=gsk_your_third_key
```

You can add up to any number of keys. The app tries them in sequence — if one hits a rate limit, it automatically uses the next.

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Production build

```bash
npm run build
npm start
```

## API Endpoints

### `POST /api/analyze`

Analyzes a legal situation and returns structured guidance.

**Request:**
```json
{
  "input": "My landlord is refusing to return my security deposit...",
  "language": "English"
}
```

### `POST /api/generate-notice`

Generates a formal legal notice (always in English).

**Request:**
```json
{
  "details": {
    "role": "individual",
    "senderName": "...",
    "senderAddress": "...",
    "senderGender": "male",
    "recipientName": "...",
    "recipientAddress": "...",
    "recipientGender": "male",
    "noticeDate": "11/04/2026",
    "incidentDate": "01/01/2026",
    "incidentLocation": "Mumbai",
    "compensationAmount": "5,00,000",
    "specificDemand": "Return security deposit"
  },
  "analysis": { ... },
  "language": "English"
}
```

### `POST /api/suggest-compensation`

Returns AI-suggested compensation range.

**Request:**
```json
{
  "analysis": { ... },
  "language": "Hindi"
}
```

## Deployment (Vercel)

1. Push to GitHub
2. Import into Vercel
3. Add environment variables: `GROQ_API_KEY_1`, `GROQ_API_KEY_2`, etc.
4. Deploy

Also works on any Node.js hosting — set the environment variables and run `npm run build && npm start`.

## Security

- API keys stored in environment variables — never committed to version control
- User input sanitized server-side (control chars stripped, length capped at 5000)
- API keys never exposed to the frontend
- Error messages sanitized before returning to client

## Disclaimer

This application generates AI-powered analysis for **informational purposes only**. It does not constitute legal advice. Always consult a qualified lawyer for your specific situation.
