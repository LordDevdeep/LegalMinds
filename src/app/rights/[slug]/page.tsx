import Link from "next/link";
import { notFound } from "next/navigation";
import SimpleNav from "@/components/SimpleNav";
import { RIGHTS_DATA, getRightsCard } from "@/data/rights";

export function generateStaticParams() {
  return RIGHTS_DATA.map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const card = getRightsCard(params.slug);
  return {
    title: card ? `${card.title} | LegalMinds` : "Rights | LegalMinds",
    description: card?.shortDescription,
  };
}

export default function RightsDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const card = getRightsCard(params.slug);
  if (!card) notFound();

  return (
    <div className="relative min-h-screen">
      <SimpleNav title={card.title} />
      <main className="max-w-3xl mx-auto px-5 py-10 md:py-16">
        <Link
          href="/rights"
          className="text-xs text-ivory/40 hover:text-gold-400 transition-colors"
        >
          &larr; Back to all rights
        </Link>

        <h1 className="mt-4 font-display text-2xl md:text-3xl text-ivory mb-3">
          {card.title}
        </h1>
        <p className="text-sm text-ivory/55 leading-relaxed mb-8">
          {card.shortDescription}
        </p>

        <section className="mb-8">
          <h2 className="font-display text-lg text-ivory/90 mb-3">
            Your Rights
          </h2>
          <ul className="space-y-2.5 text-sm text-ivory/80 leading-relaxed">
            {card.rights.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-legal-green mt-0.5">&#10003;</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-display text-lg text-ivory/90 mb-3">
            Relevant Statutes
          </h2>
          <div className="space-y-2">
            {card.statutes.map((s, i) => (
              <div
                key={i}
                className="rounded-xl bg-ink/50 border border-white/[0.05] p-4"
              >
                <p className="text-sm font-semibold text-ivory/90">
                  {s.act} &mdash; <span className="text-gold-400">Section {s.section}</span>
                </p>
                <p className="mt-1 text-xs text-ivory/60 leading-relaxed">
                  {s.gist}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-lg text-ivory/90 mb-3">
            What to Do
          </h2>
          <ol className="space-y-3 text-sm text-ivory/80 leading-relaxed">
            {card.whatToDo.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-10 px-4 py-3 rounded-lg border border-white/[0.04] bg-white/[0.015]">
          <p className="text-[11px] text-ivory/30 leading-relaxed text-center">
            This is general legal information for educational purposes. Consult a
            qualified advocate for advice specific to your situation.
          </p>
        </div>
      </main>
    </div>
  );
}
