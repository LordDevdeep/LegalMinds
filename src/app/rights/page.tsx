import Link from "next/link";
import SimpleNav from "@/components/SimpleNav";
import { RIGHTS_DATA } from "@/data/rights";

export const metadata = {
  title: "Know Your Rights | LegalMinds",
  description: "Indian legal rights organised by topic — arrest, women, tenant, employee, consumer.",
};

export default function RightsPage() {
  return (
    <div className="relative min-h-screen">
      <SimpleNav title="Know Your Rights" />
      <main className="max-w-5xl mx-auto px-5 py-10 md:py-16">
        <div className="mb-10 animate-fade-in">
          <h1 className="font-display text-2xl md:text-3xl text-ivory mb-2">
            Know Your Rights
          </h1>
          <p className="text-sm text-ivory/50 max-w-2xl">
            Curated, citation-grounded explanations of your rights in some of
            the most common legal situations Indians encounter.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RIGHTS_DATA.map((card, i) => (
            <Link
              key={card.slug}
              href={`/rights/${card.slug}`}
              className={`block rounded-2xl bg-ink/50 border border-white/[0.05] hover:border-gold-500/30 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold-500/10 animate-slide-up stagger-${
                (i % 6) + 1
              }`}
            >
              <h3 className="font-display text-lg text-ivory/90 mb-2">
                {card.title}
              </h3>
              <p className="text-xs text-ivory/50 leading-relaxed mb-4 line-clamp-3">
                {card.shortDescription}
              </p>
              <span className="text-[11px] uppercase tracking-wider text-gold-400 font-semibold">
                {card.rights.length} rights &middot; {card.statutes.length} statutes &rarr;
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
