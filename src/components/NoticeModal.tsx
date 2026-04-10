"use client";

import { useState, useEffect, useRef } from "react";
import type { NoticeParty } from "@/lib/types";
import { LoaderIcon } from "./Icons";

interface NoticeModalProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (sender: NoticeParty, recipient: NoticeParty) => void;
  loading: boolean;
}

export default function NoticeModal({ open, onClose, onGenerate, loading }: NoticeModalProps) {
  const [senderName, setSenderName] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [open, loading, onClose]);

  if (!open) return null;

  function handleSubmit() {
    const newErrors: Record<string, boolean> = {};
    if (!senderName.trim()) newErrors.senderName = true;
    if (!senderAddress.trim()) newErrors.senderAddress = true;
    if (!recipientName.trim()) newErrors.recipientName = true;
    if (!recipientAddress.trim()) newErrors.recipientAddress = true;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onGenerate(
      { name: senderName.trim(), address: senderAddress.trim() },
      { name: recipientName.trim(), address: recipientAddress.trim() }
    );
  }

  const inputClass = (field: string) => `
    w-full rounded-lg bg-midnight/60 border
    ${errors[field] ? "border-legal-red/50" : "border-white/[0.06] hover:border-white/[0.1]"}
    px-4 py-2.5 text-sm text-ivory/90 placeholder:text-ivory/25
    transition-all duration-200 outline-none focus:border-gold-500/40
    disabled:opacity-50
  `;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm px-4 pt-[8vh] overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
    >
      <div className="w-full max-w-lg rounded-xl bg-ink border border-white/[0.06] p-6 shadow-2xl animate-scale-in mb-10">
        {/* Header */}
        <h2 className="font-display text-xl text-ivory mb-1">Generate Legal Notice</h2>
        <p className="text-xs text-ivory/40 mb-6">
          Enter the sender and recipient details for the legal notice.
        </p>

        {/* Sender Section */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-gold-400 mb-3">Sender Details (Your Client / You)</p>
          <div className="space-y-3">
            <div>
              <input
                ref={firstInputRef}
                type="text"
                placeholder="Full Name"
                value={senderName}
                onChange={(e) => { setSenderName(e.target.value); setErrors((p) => ({ ...p, senderName: false })); }}
                disabled={loading}
                className={inputClass("senderName")}
              />
              {errors.senderName && <p className="text-[11px] text-legal-red mt-1">Name is required</p>}
            </div>
            <div>
              <textarea
                rows={2}
                placeholder="Full Address (including city, state, PIN)"
                value={senderAddress}
                onChange={(e) => { setSenderAddress(e.target.value); setErrors((p) => ({ ...p, senderAddress: false })); }}
                disabled={loading}
                className={inputClass("senderAddress") + " resize-none"}
              />
              {errors.senderAddress && <p className="text-[11px] text-legal-red mt-1">Address is required</p>}
            </div>
          </div>
        </div>

        {/* Recipient Section */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gold-400 mb-3">Recipient Details (Noticee)</p>
          <div className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={recipientName}
                onChange={(e) => { setRecipientName(e.target.value); setErrors((p) => ({ ...p, recipientName: false })); }}
                disabled={loading}
                className={inputClass("recipientName")}
              />
              {errors.recipientName && <p className="text-[11px] text-legal-red mt-1">Name is required</p>}
            </div>
            <div>
              <textarea
                rows={2}
                placeholder="Full Address (including city, state, PIN)"
                value={recipientAddress}
                onChange={(e) => { setRecipientAddress(e.target.value); setErrors((p) => ({ ...p, recipientAddress: false })); }}
                disabled={loading}
                className={inputClass("recipientAddress") + " resize-none"}
              />
              {errors.recipientAddress && <p className="text-[11px] text-legal-red mt-1">Address is required</p>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg text-sm text-ivory/40 hover:text-ivory/60 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              flex items-center gap-2.5 px-6 py-2.5 rounded-xl
              bg-gold-500 hover:bg-gold-400 disabled:bg-gold-500/30
              text-midnight font-semibold text-sm tracking-wide
              transition-all duration-200
              shadow-lg shadow-gold-500/20 hover:shadow-gold-400/30
              disabled:shadow-none disabled:cursor-not-allowed
              cursor-pointer
            "
          >
            {loading ? (
              <>
                <LoaderIcon className="w-4 h-4" />
                Generating…
              </>
            ) : (
              "Generate Notice"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
