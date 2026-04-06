# LegalMinds — AI-Powered Legal Analysis for Indian Law

A production-ready Next.js application that accepts a legal problem description and returns structured legal guidance using Groq AI.

## Features

- **Case Analyzer** — Describe any legal situation and get structured analysis
- **Structured Output** — Legal category, applicable laws, explanation, penalties, recommended actions
- **Clarification System** — If your input is vague, the AI asks targeted follow-up questions
- **Dark UI** — Professional, accessible interface with smooth animations

## Tech Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend  | Next.js API Routes, TypeScript    |
| AI       | Groq Llama 3.1 8B Instant         |

## Folder Structure

```
legalminds/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout + metadata
│   │   ├── globals.css           # Tailwind + custom styles
│   │   ├── page.tsx              # Home / landing page
│   │   ├── analyzer/
│   │   │   └── page.tsx          # Main analyzer page
│   │   └── api/
│   │       └── analyze/
│   │           └── route.ts      # POST endpoint for analysis
│   ├── lib/
│   │   ├── gemini.ts             # Gemini API integration + parsing
│   │   └── types.ts              # TypeScript interfaces
│   └── components/
│       ├── Icons.tsx             # SVG icon components
│       ├── LoadingSkeleton.tsx   # Shimmer loading state
│       └── ResultCards.tsx       # Structured result display
├── public/
├── .env.example                  # Environment variable template
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── package.json
└── README.md
```

## Setup & Installation

### Prerequisites

- **Node.js** 18+ installed
- A **Google Gemini API key** (free tier available)

### 1. Get your Gemini API key

1. Go to [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Copy the key

### 2. Clone / extract the project

```bash
cd legalminds
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment

```bash
cp .env.example .env.local
```

Open `.env.local` and replace the placeholder with your actual key:

```
GEMINI_API_KEY=your_actual_gemini_api_key
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Production build

```bash
npm run build
npm start
```

## How It Works

1. User describes their legal situation on the `/analyzer` page
2. Frontend sends a `POST` request to `/api/analyze` with the input text
3. Backend sanitizes the input (strips control characters, enforces length limit)
4. Backend calls Google Gemini with a structured legal analysis prompt
5. Gemini returns JSON with legal category, applicable laws, penalties, etc.
6. Backend validates and parses the response
7. Frontend renders the structured result in categorized cards
8. If the AI needs more info, clarification questions are shown as clickable buttons

## API Reference

### `POST /api/analyze`

**Request body:**
```json
{
  "input": "My landlord is refusing to return my security deposit..."
}
```

**Success response (200):**
```json
{
  "success": true,
  "data": {
    "legal_category": "Civil / Property Law",
    "applicable_laws": ["Transfer of Property Act, 1882 — Section 108(m)", "..."],
    "explanation": "Under Indian law, the landlord is obligated to...",
    "possible_penalties": "The landlord may be liable to...",
    "recommended_actions": ["Send a legal notice...", "File a complaint..."],
    "clarification_questions": []
  }
}
```

**Error response (400/500):**
```json
{
  "success": false,
  "error": "Please describe your legal situation."
}
```

## Security

- API key is stored in `.env.local` — never committed to version control
- User input is sanitized server-side (control chars stripped, length capped at 5000)
- API key is never exposed to the frontend
- Error messages are sanitized before returning to the client

## Deployment

Works out of the box on **Vercel**:

1. Push to GitHub
2. Import into Vercel
3. Add `GEMINI_API_KEY` as an environment variable in Vercel project settings
4. Deploy

Also works on any Node.js hosting (Railway, Render, AWS, etc.) — just set the environment variable and run `npm run build && npm start`.

## Disclaimer

This application generates AI-powered analysis for **informational purposes only**. It does not constitute legal advice. Always consult a qualified lawyer for your specific situation.
