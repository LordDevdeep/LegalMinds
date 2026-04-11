import type { LegalAnalysis } from "./types";
import type { Locale } from "@/i18n";
import { getTranslation } from "@/i18n";

/**
 * Generate a professionally formatted legal analysis PDF using html2pdf.js.
 * Uses browser's native font rendering so all Indic scripts display correctly.
 */
export async function downloadLegalNoticePdf(data: LegalAnalysis, locale: Locale = "en") {
  const html2pdf = (await import("html2pdf.js")).default;

  const t = (key: string) => getTranslation(locale, key);

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  function escHtml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
  }

  function sectionHtml(num: number, title: string, content: string): string {
    return `
      <div style="margin-top:18px;">
        <h3 style="font-size:13px;font-weight:700;color:#1e1e1e;margin:0 0 4px 0;padding-bottom:4px;border-bottom:2px solid #c8aa32;">
          ${num}. ${escHtml(title)}
        </h3>
        <div style="font-size:11px;color:#282828;line-height:1.7;">${content}</div>
      </div>`;
  }

  function labelVal(label: string, value: string): string {
    if (!value || value === "—") return "";
    return `<p style="margin:3px 0;"><strong>${escHtml(label)}:</strong> ${escHtml(value)}</p>`;
  }

  // Build applicable laws HTML
  let lawsHtml = "";
  for (const law of data.applicable_laws) {
    lawsHtml += `<div style="background:#f9f9f9;border:1px solid #e0e0e0;border-radius:6px;padding:8px 10px;margin-bottom:8px;">
      <strong>${escHtml(law.act)}</strong>
      ${law.sections.length > 0 ? `<span style="color:#888;font-size:10px;margin-left:6px;">[${law.sections.join(", ")}]</span>` : ""}
      <p style="margin:4px 0 2px 0;">${escHtml(law.description)}</p>
      <p style="margin:0;font-size:9px;color:#999;text-transform:uppercase;">${t("results.confidenceLabel")} ${law.confidence}</p>
    </div>`;
  }

  // Build action steps HTML
  let stepsHtml = "";
  for (const step of data.action_steps) {
    stepsHtml += `<div style="margin-bottom:8px;">
      <strong>${step.step}. ${escHtml(step.action)}</strong>
      <p style="margin:2px 0;">${escHtml(step.details)}</p>
      ${step.timeline ? `<p style="margin:0;font-size:10px;color:#666;">${t("results.timeline")} ${escHtml(step.timeline)}</p>` : ""}
    </div>`;
  }

  // Build documents HTML
  let docsHtml = `<div style="display:flex;gap:16px;flex-wrap:wrap;">`;
  if (data.required_documents.essential.length > 0) {
    docsHtml += `<div style="flex:1;min-width:140px;"><strong>${t("results.essential")}</strong><ul style="margin:4px 0;padding-left:16px;">
      ${data.required_documents.essential.map(d => `<li>${escHtml(d)}</li>`).join("")}
    </ul></div>`;
  }
  if (data.required_documents.supporting.length > 0) {
    docsHtml += `<div style="flex:1;min-width:140px;"><strong>${t("results.supporting")}</strong><ul style="margin:4px 0;padding-left:16px;">
      ${data.required_documents.supporting.map(d => `<li>${escHtml(d)}</li>`).join("")}
    </ul></div>`;
  }
  docsHtml += `<div style="flex:1;min-width:140px;"><strong>${t("results.idProof")}</strong><p style="margin:4px 0;">${escHtml(data.required_documents.identity_proof)}</p></div>`;
  docsHtml += `</div>`;

  const html = `
    <div style="font-family:'Noto Sans',system-ui,-apple-system,sans-serif;color:#1e1e1e;padding:0;max-width:170mm;">
      <!-- Header -->
      <div style="text-align:right;font-size:10px;color:#666;margin-bottom:16px;">Date: ${today}</div>
      <h1 style="text-align:center;font-size:18px;font-weight:700;margin:0 0 6px 0;">LEGAL ANALYSIS</h1>
      <p style="text-align:center;font-size:11px;color:#555;margin:0 0 4px 0;"><strong>Subject:</strong> ${escHtml(data.case_type)}</p>
      <hr style="border:none;border-top:1px solid #ccc;margin:10px 0;">

      ${sectionHtml(1, t("results.caseSummary"), `<p style="margin:0;">${escHtml(data.case_summary)}</p>`)}

      ${sectionHtml(2, t("results.jurisdiction"), `<p style="margin:0;">${escHtml(data.jurisdiction_note)}</p>`)}

      ${data.applicable_laws.length > 0 ? sectionHtml(3, t("results.applicableLaws"), lawsHtml) : ""}

      ${data.action_steps.length > 0 ? sectionHtml(4, t("results.actionSteps"), stepsHtml) : ""}

      ${sectionHtml(5, t("results.timeSensitivity"), `
        ${labelVal(t("results.limitationPeriod").replace(":", ""), data.time_sensitivity.limitation_period)}
        ${labelVal(t("results.urgency").replace(":", ""), data.time_sensitivity.urgency)}
        <p style="margin:3px 0;">${escHtml(data.time_sensitivity.deadline_note)}</p>
      `)}

      ${sectionHtml(6, t("results.possibleOutcomes"), `
        ${labelVal(t("results.bestCase").replace(":", ""), data.possible_outcomes.best_case)}
        ${labelVal(t("results.likelyCase").replace(":", ""), data.possible_outcomes.likely_case)}
        ${labelVal(t("results.worstCase").replace(":", ""), data.possible_outcomes.worst_case)}
        ${labelVal(t("results.estTimeline").replace(":", ""), data.possible_outcomes.estimated_timeline)}
      `)}

      ${sectionHtml(7, t("results.requiredDocs"), docsHtml)}

      ${sectionHtml(8, t("results.estimatedCosts"), `
        ${labelVal(t("results.courtFees").replace(":", ""), data.estimated_costs.court_fees)}
        ${labelVal(t("results.lawyerFees").replace(":", ""), data.estimated_costs.lawyer_fees)}
        ${labelVal(t("results.other").replace(":", ""), data.estimated_costs.other)}
      `)}

      ${sectionHtml(9, t("results.confidence"), `
        <p style="margin:0;"><strong>${data.confidence_level}</strong> — ${escHtml(data.confidence_reasoning)}</p>
      `)}

      <!-- Disclaimer -->
      <div style="margin-top:20px;padding:8px 10px;border-top:1px solid #ccc;">
        <p style="font-size:9px;color:#999;text-align:center;margin:0;">
          <strong>${t("results.disclaimer")}</strong> ${escHtml(data.disclaimer || t("results.disclaimerText"))}
        </p>
      </div>
    </div>
  `;

  // Create a wrapper that is on-screen but visually hidden behind an overlay.
  // html2canvas requires elements to be in the visible viewport to capture them.
  const overlay = document.createElement("div");
  overlay.style.cssText = "position:fixed;inset:0;z-index:99999;background:white;overflow:auto;";

  const container = document.createElement("div");
  container.innerHTML = html;
  container.style.cssText = "width:210mm;padding:20mm;box-sizing:border-box;background:white;";

  overlay.appendChild(container);
  document.body.appendChild(overlay);

  const dateStr = new Date().toISOString().split("T")[0];

  try {
    await (html2pdf() as any)
      .set({
        margin: 0,
        filename: `LegalAnalysis_${dateStr}.pdf`,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0, windowWidth: 794 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      })
      .from(container)
      .save();
  } finally {
    document.body.removeChild(overlay);
  }
}
