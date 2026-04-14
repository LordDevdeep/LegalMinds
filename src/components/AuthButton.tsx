"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
    window.location.href = "/";
  }

  if (!user) {
    return (
      <Link
        href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
        className="px-4 py-1.5 rounded-lg bg-gold-500/15 border border-gold-500/25 text-xs text-gold-400 font-semibold hover:bg-gold-500/25 transition-all duration-200"
      >
        Login
      </Link>
    );
  }

  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User";
  const initial = displayName[0].toUpperCase();
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-xs text-gold-400 font-bold cursor-pointer hover:bg-gold-500/30 transition-colors overflow-hidden"
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt={displayName} width={32} height={32} className="w-full h-full object-cover rounded-full" />
        ) : (
          initial
        )}
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-10 w-48 rounded-lg bg-ink border border-white/[0.08] shadow-xl py-1 z-[100] animate-scale-in">
          <div className="px-3 py-2 border-b border-white/[0.04]">
            <p className="text-xs text-ivory/60 font-semibold truncate">{displayName}</p>
            <p className="text-[10px] text-ivory/25 truncate">{user.email}</p>
          </div>
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-xs text-ivory/70 hover:bg-white/[0.04] hover:text-ivory transition-colors"
          >
            My Analyses
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-xs text-legal-red/70 hover:bg-legal-red/10 hover:text-legal-red transition-colors cursor-pointer"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
