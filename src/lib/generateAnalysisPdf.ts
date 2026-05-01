import jsPDF from "jspdf";
import type { AnalysisResult } from "@/types/legal";
import { DOMAIN_LABELS } from "@/types/legal";

const MARGIN_X = 14;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

function inr(n: number): string {
  return `Rs.${n.toLocaleString("en-IN")}`;
}

export function generateAnalysisPDF(r: AnalysisResult): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = 16;

  function ensure(space: number) {
    if (y + space > 280) {
      doc.addPage();
      y = 16;
    }
  }

  function heading(text: string, size = 13) {
    ensure(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(20, 20, 20);
    doc.text(text, MARGIN_X, y);
    y += size === 13 ? 7 : 6;
  }

  function paragraph(text: string, size = 10, color: [number, number, number] = [60, 60, 60]) {
    if (!text) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
    for (const line of lines) {
      ensure(6);
      doc.text(line, MARGIN_X, y);
      y += 5;
    }
    y += 1;
  }

  function divider() {
    ensure(4);
    doc.setDrawColor(220, 220, 220);
    doc.line(MARGIN_X, y, PAGE_WIDTH - MARGIN_X, y);
    y += 4;
  }

  // Header
  doc.setFillColor(10, 14, 26);
  doc.rect(0, 0, PAGE_WIDTH, 24, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("LegalMinds", MARGIN_X, 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(220, 200, 120);
  doc.text("AI-Powered Indian Legal Analysis", MARGIN_X, 19);
  y = 32;

  // Query box
  heading("Your Query");
  paragraph(r.query);
  divider();

  // Meta line
  paragraph(
    `Domain: ${DOMAIN_LABELS[r.primaryDomain]} | Jurisdiction: ${r.jurisdiction} | Confidence: ${r.confidence.toUpperCase()} | Severity: ${r.severity}/5`,
    9,
    [100, 100, 100]
  );
  if (r.needsLawyer) {
    paragraph("Recommendation: Consult a qualified advocate.", 9, [180, 90, 0]);
  }
  divider();

  heading("Plain English Summary");
  paragraph(r.plainSummary);

  heading("Detailed Legal Analysis");
  paragraph(r.detailedAnalysis);

  if (r.applicableLaws.length) {
    heading("Applicable Laws");
    for (const law of r.applicableLaws) {
      ensure(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
      doc.text(`${law.act} - Section ${law.section}: ${law.title}`, MARGIN_X, y);
      y += 5;
      paragraph(law.text);
      if (law.punishment) paragraph(`Punishment: ${law.punishment}`, 9, [160, 0, 0]);
    }
  }

  if (r.rights.length) {
    heading("Your Rights");
    for (const item of r.rights) paragraph(`- ${item}`);
  }

  if (r.penalties.length) {
    heading("Possible Penalties / Outcomes");
    for (const item of r.penalties) paragraph(`- ${item}`);
  }

  if (r.nextSteps.length) {
    heading("Next Steps");
    for (const s of r.nextSteps) {
      ensure(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
      doc.text(`${s.order}. ${s.action}`, MARGIN_X, y);
      y += 5;
      if (s.detail) paragraph(s.detail);
    }
  }

  if (r.timeline.phases.length) {
    heading("Estimated Timeline");
    paragraph(`Total: ${r.timeline.totalDaysMin}-${r.timeline.totalDaysMax} days`);
    for (const p of r.timeline.phases) {
      paragraph(`- ${p.name}: ${p.durationDays[0]}-${p.durationDays[1]} days`);
    }
  }

  heading("Cost Estimate");
  paragraph(
    `Court Fees: ${inr(r.costs.courtFeesINR[0])} - ${inr(r.costs.courtFeesINR[1])}`
  );
  paragraph(
    `Lawyer Fees: ${inr(r.costs.lawyerFeesINR[0])} - ${inr(r.costs.lawyerFeesINR[1])}`
  );
  if (r.costs.legalAidEligible) {
    paragraph(
      "You may be eligible for free legal aid under Section 12, Legal Services Authorities Act 1987.",
      9,
      [0, 120, 60]
    );
  }
  if (r.costs.notes) paragraph(r.costs.notes, 9, [100, 100, 100]);

  // Footer disclaimer
  ensure(20);
  divider();
  paragraph(
    "Disclaimer: This is AI-generated legal information for educational purposes only and does NOT constitute legal advice. Consult a qualified advocate before taking action. Verify all citations with official sources.",
    8,
    [120, 120, 120]
  );
  paragraph(
    `Generated on ${new Date(r.createdAt).toLocaleString("en-IN")} | Analysis ID: ${r.id}`,
    8,
    [150, 150, 150]
  );

  // Page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `LegalMinds | Page ${i} of ${pageCount}`,
      PAGE_WIDTH / 2,
      292,
      { align: "center" }
    );
  }

  doc.save(
    `LegalMinds-Analysis-${r.id.slice(0, 8)}.pdf`
  );
}
