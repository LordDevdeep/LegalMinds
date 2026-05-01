"use client";

export type ErrorKind =
  | "network"
  | "timeout"
  | "validation"
  | "rate_limit"
  | "generic";

interface Props {
  kind: ErrorKind;
  message?: string;
  onRetry?: () => void;
}

const PRESETS: Record<ErrorKind, { title: string; body: string; icon: string }> = {
  network: {
    title: "Connection lost",
    body: "Connection lost. Please check your internet.",
    icon: "\u26A0",
  },
  timeout: {
    title: "Taking too long",
    body: "Analysis is taking longer than expected. Try again or simplify your query.",
    icon: "\u23F1",
  },
  validation: {
    title: "More detail needed",
    body: "Please describe your situation in at least 30 characters.",
    icon: "\u270E",
  },
  rate_limit: {
    title: "Slow down",
    body: "Too many requests. Please wait 60 seconds.",
    icon: "\u29D7",
  },
  generic: {
    title: "Something went wrong",
    body: "We couldn't analyze your case. Please try again.",
    icon: "\u26A0",
  },
};

export default function ErrorState({ kind, message, onRetry }: Props) {
  const p = PRESETS[kind];
  return (
    <div className="mt-6 rounded-xl bg-legal-red/10 border border-legal-red/25 p-5 animate-scale-in">
      <div className="flex items-start gap-3">
        <span className="text-2xl text-legal-red leading-none">{p.icon}</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-legal-red mb-1">{p.title}</p>
          <p className="text-sm text-ivory/70">{message || p.body}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 rounded-lg bg-legal-red/15 hover:bg-legal-red/25 border border-legal-red/30 text-xs font-semibold text-legal-red transition-colors cursor-pointer"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
