"use client";

import { useState, useEffect, useRef } from "react";
import type { NoticeDetails, Gender, NoticeRole, LegalAnalysis, CompensationSuggestion } from "@/lib/types";
import { LoaderIcon } from "./Icons";
import { useLanguage } from "@/i18n/LanguageContext";
import { LANGUAGE_NAMES } from "@/i18n";

interface NoticeModalProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (details: NoticeDetails) => void;
  loading: boolean;
  analysis: LegalAnalysis;
}

function todayStr() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export default function NoticeModal({ open, onClose, onGenerate, loading, analysis }: NoticeModalProps) {
  const { t, locale } = useLanguage();

  const [role, setRole] = useState<NoticeRole>("individual");
  const [senderName, setSenderName] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [senderGender, setSenderGender] = useState<Gender>("male");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [recipientGender, setRecipientGender] = useState<Gender>("male");
  const [noticeDate, setNoticeDate] = useState(todayStr());
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentLocation, setIncidentLocation] = useState("");
  const [compensationAmount, setCompensationAmount] = useState("");
  const [specificDemand, setSpecificDemand] = useState("");
  const [suggestion, setSuggestion] = useState<CompensationSuggestion | null>(null);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => firstInputRef.current?.focus(), 100);
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

  async function handleSuggestCompensation() {
    setSuggestionLoading(true);
    try {
      const res = await fetch("/api/suggest-compensation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis, language: LANGUAGE_NAMES[locale] }),
      });
      const json = await res.json();
      if (json.success) setSuggestion(json.data);
    } catch {
      // silently fail
    } finally {
      setSuggestionLoading(false);
    }
  }

  function handleSubmit() {
    const newErrors: Record<string, boolean> = {};
    if (!senderName.trim()) newErrors.senderName = true;
    if (!senderAddress.trim()) newErrors.senderAddress = true;
    if (!recipientName.trim()) newErrors.recipientName = true;
    if (!recipientAddress.trim()) newErrors.recipientAddress = true;
    if (!noticeDate.trim()) newErrors.noticeDate = true;
    if (!incidentDate.trim()) newErrors.incidentDate = true;
    if (!incidentLocation.trim()) newErrors.incidentLocation = true;
    if (!specificDemand.trim()) newErrors.specificDemand = true;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onGenerate({
      role,
      senderName: senderName.trim(),
      senderAddress: senderAddress.trim(),
      senderGender,
      recipientName: recipientName.trim(),
      recipientAddress: recipientAddress.trim(),
      recipientGender,
      noticeDate: noticeDate.trim(),
      incidentDate: incidentDate.trim(),
      incidentLocation: incidentLocation.trim(),
      compensationAmount: compensationAmount.trim() || "as deemed appropriate by the Hon'ble Court",
      specificDemand: specificDemand.trim(),
    });
  }

  const inputCls = (field: string) => `
    w-full rounded-lg bg-midnight/60 border
    ${errors[field] ? "border-legal-red/50" : "border-white/[0.06] hover:border-white/[0.1]"}
    px-4 py-2.5 text-sm text-ivory/90 placeholder:text-ivory/25
    transition-all duration-200 outline-none focus:border-gold-500/40
    disabled:opacity-50
  `;

  const selectCls = (field: string) => `
    w-full rounded-lg bg-midnight/60 border
    ${errors[field] ? "border-legal-red/50" : "border-white/[0.06] hover:border-white/[0.1]"}
    px-4 py-2.5 text-sm text-ivory/90
    transition-all duration-200 outline-none focus:border-gold-500/40
    disabled:opacity-50 appearance-none cursor-pointer
  `;

  const labelCls = "text-xs text-ivory/40 mb-1 block";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm px-4 pt-[4vh] overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
    >
      <div className="w-full max-w-xl rounded-xl bg-ink border border-white/[0.06] p-6 shadow-2xl animate-scale-in mb-10">
        <h2 className="font-display text-xl text-ivory mb-1">{t("notice.title")}</h2>
        <p className="text-xs text-ivory/40 mb-5">{t("notice.instruction")}</p>

        {/* ── Role ── */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-gold-400 mb-3">{t("notice.whoSending")}</p>
          <div className="flex gap-3">
            {([
              { value: "individual" as NoticeRole, label: t("notice.roleIndividual") },
              { value: "lawyer" as NoticeRole, label: t("notice.roleLawyer") },
            ]).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value)}
                disabled={loading}
                className={`
                  flex-1 px-4 py-2.5 rounded-lg text-sm text-center transition-all duration-200 cursor-pointer border
                  ${role === opt.value
                    ? "bg-gold-500/15 border-gold-500/30 text-gold-400 font-semibold"
                    : "bg-white/[0.02] border-white/[0.06] text-ivory/50 hover:border-white/[0.1]"
                  }
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Sender ── */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-gold-400 mb-3">
            {role === "lawyer" ? t("notice.senderClient") : t("notice.senderYou")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className={labelCls}>{t("notice.fullName")}</label>
              <input ref={firstInputRef} type="text" placeholder={t("notice.namePlaceholder")} value={senderName} onChange={(e) => { setSenderName(e.target.value); setErrors((p) => ({ ...p, senderName: false })); }} disabled={loading} className={inputCls("senderName")} />
              {errors.senderName && <p className="text-[11px] text-legal-red mt-1">{t("common.required")}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>{t("notice.fullAddress")}</label>
              <textarea rows={2} placeholder={t("notice.addressPlaceholder")} value={senderAddress} onChange={(e) => { setSenderAddress(e.target.value); setErrors((p) => ({ ...p, senderAddress: false })); }} disabled={loading} className={inputCls("senderAddress") + " resize-none"} />
              {errors.senderAddress && <p className="text-[11px] text-legal-red mt-1">{t("common.required")}</p>}
            </div>
            <div>
              <label className={labelCls}>{t("notice.gender")}</label>
              <select value={senderGender} onChange={(e) => setSenderGender(e.target.value as Gender)} disabled={loading} className={selectCls("senderGender")}>
                <option value="male">{t("notice.male")}</option>
                <option value="female">{t("notice.female")}</option>
                <option value="other">{t("notice.other")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Recipient ── */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-gold-400 mb-3">{t("notice.recipientDetails")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className={labelCls}>{t("notice.fullName")}</label>
              <input type="text" placeholder={t("notice.namePlaceholder")} value={recipientName} onChange={(e) => { setRecipientName(e.target.value); setErrors((p) => ({ ...p, recipientName: false })); }} disabled={loading} className={inputCls("recipientName")} />
              {errors.recipientName && <p className="text-[11px] text-legal-red mt-1">{t("common.required")}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>{t("notice.fullAddress")}</label>
              <textarea rows={2} placeholder={t("notice.addressPlaceholder")} value={recipientAddress} onChange={(e) => { setRecipientAddress(e.target.value); setErrors((p) => ({ ...p, recipientAddress: false })); }} disabled={loading} className={inputCls("recipientAddress") + " resize-none"} />
              {errors.recipientAddress && <p className="text-[11px] text-legal-red mt-1">{t("common.required")}</p>}
            </div>
            <div>
              <label className={labelCls}>{t("notice.gender")}</label>
              <select value={recipientGender} onChange={(e) => setRecipientGender(e.target.value as Gender)} disabled={loading} className={selectCls("recipientGender")}>
                <option value="male">{t("notice.male")}</option>
                <option value="female">{t("notice.female")}</option>
                <option value="other">{t("notice.other")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Notice Details ── */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-gold-400 mb-3">{t("notice.incidentDetails")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{t("notice.noticeDate")}</label>
              <input type="text" placeholder={t("notice.datePlaceholder")} value={noticeDate} onChange={(e) => { setNoticeDate(e.target.value); setErrors((p) => ({ ...p, noticeDate: false })); }} disabled={loading} className={inputCls("noticeDate")} />
              {errors.noticeDate && <p className="text-[11px] text-legal-red mt-1">{t("common.required")}</p>}
            </div>
            <div>
              <label className={labelCls}>{t("notice.incidentDate")}</label>
              <input type="text" placeholder={t("notice.datePlaceholder")} value={incidentDate} onChange={(e) => { setIncidentDate(e.target.value); setErrors((p) => ({ ...p, incidentDate: false })); }} disabled={loading} className={inputCls("incidentDate")} />
              {errors.incidentDate && <p className="text-[11px] text-legal-red mt-1">{t("common.required")}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>{t("notice.incidentLocation")}</label>
              <input type="text" placeholder={t("notice.locationPlaceholder")} value={incidentLocation} onChange={(e) => { setIncidentLocation(e.target.value); setErrors((p) => ({ ...p, incidentLocation: false })); }} disabled={loading} className={inputCls("incidentLocation")} />
              {errors.incidentLocation && <p className="text-[11px] text-legal-red mt-1">{t("common.required")}</p>}
            </div>
          </div>
        </div>

        {/* ── Compensation & Demand ── */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gold-400 mb-3">{t("notice.compensation")}</p>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>{t("notice.compAmount")}</label>
              <div className="flex gap-2">
                <input type="text" placeholder={t("notice.compPlaceholder")} value={compensationAmount} onChange={(e) => setCompensationAmount(e.target.value)} disabled={loading} className={inputCls("compensationAmount")} />
                <button type="button" onClick={handleSuggestCompensation} disabled={loading || suggestionLoading} className="shrink-0 px-3 py-2.5 rounded-lg text-xs font-semibold bg-legal-blue/15 border border-legal-blue/25 text-legal-blue hover:bg-legal-blue/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap">
                  {suggestionLoading ? "..." : t("notice.aiSuggest")}
                </button>
              </div>
              {suggestion && (
                <div className="mt-2 px-3 py-2 rounded-lg bg-legal-blue/10 border border-legal-blue/20 text-xs">
                  <p className="text-legal-blue font-semibold mb-1">
                    {t("notice.suggestedRange")} {suggestion.min} — ₹ {suggestion.max}
                  </p>
                  <p className="text-ivory/50">{suggestion.reasoning}</p>
                </div>
              )}
            </div>
            <div>
              <label className={labelCls}>{t("notice.specificDemand")}</label>
              <textarea rows={3} placeholder={t("notice.demandPlaceholder")} value={specificDemand} onChange={(e) => { setSpecificDemand(e.target.value); setErrors((p) => ({ ...p, specificDemand: false })); }} disabled={loading} className={inputCls("specificDemand") + " resize-none"} />
              {errors.specificDemand && <p className="text-[11px] text-legal-red mt-1">{t("common.required")}</p>}
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} disabled={loading} className="px-5 py-2.5 rounded-lg text-sm text-ivory/40 hover:text-ivory/60 transition-colors disabled:opacity-50 cursor-pointer">
            {t("common.cancel")}
          </button>
          <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2.5 px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:bg-gold-500/30 text-midnight font-semibold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-gold-500/20 hover:shadow-gold-400/30 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer">
            {loading ? (
              <>
                <LoaderIcon className="w-4 h-4" />
                {t("notice.generating")}
              </>
            ) : (
              t("notice.generateBtn")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
