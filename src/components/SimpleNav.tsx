"use client";

import Link from "next/link";
import Image from "next/image";

export default function SimpleNav({ title }: { title?: string }) {
  return (
    <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/[0.04]">
      <Link href="/" className="flex items-center gap-2.5 group">
        <Image
          src="/logo-icon.png"
          alt="LegalMinds"
          width={36}
          height={36}
          className="h-9 w-9"
        />
        <span className="font-display text-lg tracking-tight">
          <span className="text-ivory group-hover:text-ivory">Legal</span>
          <span className="text-gold-400 group-hover:text-gold-500">Minds</span>
        </span>
      </Link>
      <div className="flex items-center gap-4 text-xs text-ivory/40">
        {title && <span className="hidden sm:block">{title}</span>}
        <Link href="/analyzer" className="hover:text-gold-400 transition-colors">
          Analyzer
        </Link>
        <Link href="/library" className="hover:text-gold-400 transition-colors">
          Library
        </Link>
        <Link href="/rights" className="hover:text-gold-400 transition-colors">
          Rights
        </Link>
        <Link href="/glossary" className="hover:text-gold-400 transition-colors">
          Glossary
        </Link>
        <Link href="/judgments" className="hover:text-gold-400 transition-colors">
          Judgments
        </Link>
      </div>
    </nav>
  );
}
