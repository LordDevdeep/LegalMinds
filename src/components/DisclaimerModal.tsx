"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "lm-disclaimer-accepted";

export default function DisclaimerModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== "true") {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  function handleAccept() {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-xl bg-ink border border-white/[0.08] p-6 shadow-2xl animate-scale-in">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-2xl">&#9878;</span>
          <h2 className="font-display text-xl text-ivory">Important Disclaimer</h2>
        </div>

        <div className="space-y-3 text-sm text-ivory/70 leading-relaxed mb-6">
          <div className="flex gap-3 items-start">
            <span className="text-legal-red text-lg mt-0.5 shrink-0">1.</span>
            <p>This tool provides legal <strong className="text-ivory">information</strong>, NOT legal <strong className="text-ivory">advice</strong>. No attorney-client relationship is created.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-legal-amber text-lg mt-0.5 shrink-0">2.</span>
            <p>AI-generated content <strong className="text-ivory">may contain errors</strong> or outdated information. Laws change frequently.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-legal-blue text-lg mt-0.5 shrink-0">3.</span>
            <p>Always verify information with official sources like <a href="https://www.indiacode.nic.in/" target="_blank" rel="noreferrer" className="text-legal-blue hover:underline">India Code</a> and <a href="https://ecourts.gov.in/" target="_blank" rel="noreferrer" className="text-legal-blue hover:underline">eCourts</a>.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-legal-green text-lg mt-0.5 shrink-0">4.</span>
            <p><strong className="text-ivory">Consult a qualified advocate</strong> before taking any legal action based on this information.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-ivory/40 text-lg mt-0.5 shrink-0">5.</span>
            <p>This platform covers <strong className="text-ivory">Indian law only</strong>.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleAccept}
            className="
              w-full px-6 py-3 rounded-xl
              bg-gold-500 hover:bg-gold-400
              text-midnight font-semibold text-sm tracking-wide
              transition-all duration-200
              shadow-lg shadow-gold-500/20 hover:shadow-gold-400/30
              cursor-pointer
            "
          >
            I Understand and Accept
          </button>
          <p className="text-[10px] text-ivory/25 text-center">
            By clicking above, you acknowledge that this is an AI tool providing legal information, not legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
