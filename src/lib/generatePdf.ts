import { jsPDF } from "jspdf";
import type { LegalAnalysis } from "./types";

const PAGE_W = 210; // A4 width mm
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;
const LINE_H = 6; // normal line height mm
const SECTION_GAP = 10;

/**
 * Generate a professionally formatted legal-notice PDF from the analysis data.
 * Downloads automatically as LegalNotice_YYYY-MM-DD.pdf.
 */
export function downloadLegalNoticePdf(data: LegalAnalysis) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  /* ── helpers ───────────────────────────────────────── */

  function ensureSpace(needed: number) {
    if (y + needed > 280) {
      doc.addPage();
      y = MARGIN;
    }
  }

  function heading(text: string, size = 16) {
    ensureSpace(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.text(text, PAGE_W / 2, y, { align: "center" });
    y += size * 0.6;
  }

  function sectionTitle(text: string) {
    ensureSpace(14);
    y += SECTION_GAP;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text(text, MARGIN, y);
    y += 2;
    // underline
    doc.setDrawColor(200, 170, 50);
    doc.setLineWidth(0.4);
    doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
    y += LINE_H;
  }

  function bodyText(text: string) {
    if (!text) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    const lines = doc.splitTextToSize(text, CONTENT_W);
    for (const line of lines) {
      ensureSpace(LINE_H);
      doc.text(line, MARGIN, y);
      y += LINE_H;
    }
  }

  function labelValue(label: string, value: string) {
    if (!value || value === "—") return;
    ensureSpace(LINE_H * 2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text(`${label}: `, MARGIN, y);
    const labelWidth = doc.getTextWidth(`${label}: `);
    doc.setFont("helvetica", "normal");
    const valueLines = doc.splitTextToSize(value, CONTENT_W - labelWidth);
    doc.text(valueLines[0], MARGIN + labelWidth, y);
    y += LINE_H;
    for (let i = 1; i < valueLines.length; i++) {
      ensureSpace(LINE_H);
      doc.text(valueLines[i], MARGIN, y);
      y += LINE_H;
    }
  }

  function bulletList(items: string[]) {
    for (const item of items) {
      ensureSpace(LINE_H);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      const lines = doc.splitTextToSize(`•  ${item}`, CONTENT_W - 4);
      for (const line of lines) {
        ensureSpace(LINE_H);
        doc.text(line, MARGIN + 2, y);
        y += LINE_H;
      }
    }
  }

  /* ── build the PDF ─────────────────────────────────── */

  // Date (top-right)
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Date: ${today}`, PAGE_W - MARGIN, y, { align: "right" });
  y += LINE_H * 2;

  // Main heading
  heading("LEGAL NOTICE", 18);
  y += 4;

  // Subject
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  const subjectText = `Subject: Legal Analysis — ${data.case_type}`;
  const subjectLines = doc.splitTextToSize(subjectText, CONTENT_W);
  for (const line of subjectLines) {
    doc.text(line, MARGIN, y);
    y += LINE_H;
  }
  y += 4;

  // Horizontal rule
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
  y += LINE_H;

  // 1 — Case Summary
  sectionTitle("1. Case Summary");
  bodyText(data.case_summary);

  // 2 — Jurisdiction
  sectionTitle("2. Jurisdiction");
  bodyText(data.jurisdiction_note);

  // 3 — Applicable Laws
  if (data.applicable_laws.length > 0) {
    sectionTitle("3. Applicable Laws");
    for (const law of data.applicable_laws) {
      ensureSpace(LINE_H * 3);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(law.act, MARGIN, y);
      if (law.sections.length > 0) {
        const actW = doc.getTextWidth(law.act + "  ");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`[${law.sections.join(", ")}]`, MARGIN + actW, y);
      }
      y += LINE_H;
      doc.setTextColor(40, 40, 40);
      bodyText(law.description);
      y += 2;
    }
  }

  // 4 — Recommended Actions
  if (data.action_steps.length > 0) {
    sectionTitle("4. Recommended Actions");
    for (const step of data.action_steps) {
      ensureSpace(LINE_H * 3);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      doc.text(`${step.step}. ${step.action}`, MARGIN, y);
      y += LINE_H;
      bodyText(step.details);
      if (step.timeline) {
        labelValue("Timeline", step.timeline);
      }
      y += 2;
    }
  }

  // 5 — Time Sensitivity
  sectionTitle("5. Time Sensitivity");
  labelValue("Limitation Period", data.time_sensitivity.limitation_period);
  labelValue("Urgency", data.time_sensitivity.urgency);
  bodyText(data.time_sensitivity.deadline_note);

  // 6 — Possible Outcomes
  sectionTitle("6. Possible Outcomes");
  labelValue("Best Case", data.possible_outcomes.best_case);
  labelValue("Likely Case", data.possible_outcomes.likely_case);
  labelValue("Worst Case", data.possible_outcomes.worst_case);
  labelValue("Estimated Timeline", data.possible_outcomes.estimated_timeline);

  // 7 — Required Documents
  sectionTitle("7. Required Documents");
  if (data.required_documents.essential.length > 0) {
    ensureSpace(LINE_H);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Essential:", MARGIN, y);
    y += LINE_H;
    bulletList(data.required_documents.essential);
  }
  if (data.required_documents.supporting.length > 0) {
    ensureSpace(LINE_H);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Supporting:", MARGIN, y);
    y += LINE_H;
    bulletList(data.required_documents.supporting);
  }
  labelValue("Identity Proof", data.required_documents.identity_proof);

  // 8 — Estimated Costs
  sectionTitle("8. Estimated Costs");
  labelValue("Court Fees", data.estimated_costs.court_fees);
  labelValue("Lawyer Fees", data.estimated_costs.lawyer_fees);
  labelValue("Other", data.estimated_costs.other);

  // 9 — Confidence
  sectionTitle("9. Analysis Confidence");
  labelValue("Confidence Level", data.confidence_level);
  bodyText(data.confidence_reasoning);

  // Footer
  ensureSpace(30);
  y += SECTION_GAP;
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
  y += LINE_H + 2;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  const footerLines = doc.splitTextToSize(
    "This notice is sent without prejudice to any other legal rights. " +
      "This analysis is AI-generated and for informational purposes only. " +
      "It does not constitute legal advice. Consult a qualified lawyer for your specific situation.",
    CONTENT_W,
  );
  for (const line of footerLines) {
    ensureSpace(LINE_H);
    doc.text(line, MARGIN, y);
    y += 5;
  }

  // Page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text(`Page ${i} of ${pageCount}`, PAGE_W / 2, 290, { align: "center" });
  }

  // Download
  const dateStr = new Date().toISOString().split("T")[0];
  doc.save(`LegalNotice_${dateStr}.pdf`);
}
