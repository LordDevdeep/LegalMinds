"use client";

export default function LoadingSkeleton() {
  const cards = [
    { w: "w-32", lines: 1 },
    { w: "w-48", lines: 3 },
    { w: "w-full", lines: 5 },
    { w: "w-44", lines: 2 },
    { w: "w-40", lines: 3 },
    { w: "w-36", lines: 2 },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-5 h-5 rounded-full shimmer-line" />
        <div className="h-5 w-48 rounded shimmer-line" />
      </div>
      {cards.map((c, i) => (
        <div
          key={i}
          className="bg-ink/60 border border-white/[0.04] rounded-xl p-5 space-y-3"
        >
          <div className={`h-4 ${c.w} rounded shimmer-line`} />
          {Array.from({ length: c.lines }).map((_, j) => (
            <div
              key={j}
              className={`h-3 rounded shimmer-line ${
                j === c.lines - 1 ? "w-3/4" : "w-full"
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
