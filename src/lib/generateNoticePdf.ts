import { jsPDF } from "jspdf";
import type { LegalNoticeContent } from "./types";

const PAGE_W = 210;
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;
const LINE_H = 6;

/**
 * Generate a court-submittable Indian legal notice PDF.
 */
export function downloadLegalNoticeDocument(notice: LegalNoticeContent) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  function ensureSpace(needed: number) {
    if (y + needed > 275) {
      doc.addPage();
      y = MARGIN;
    }
  }

  function writeLines(text: string, x: number, maxW: number, font: "normal" | "bold" | "italic" = "normal", size = 11) {
    doc.setFont("helvetica", font);
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, maxW);
    for (const line of lines) {
      ensureSpace(LINE_H);
      doc.text(line, x, y);
      y += LINE_H;
    }
  }

  doc.setTextColor(30, 30, 30);

  // ─── Date (top-right) ───
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Date: ${notice.date}`, PAGE_W - MARGIN, y, { align: "right" });
  y += LINE_H * 2;

  // ─── To (Recipient) ───
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("To,", MARGIN, y);
  y += LINE_H;
  writeLines(notice.recipientName, MARGIN, CONTENT_W, "bold");
  writeLines(notice.recipientAddress, MARGIN, CONTENT_W, "normal", 10);
  y += LINE_H;

  // ─── From (Sender) ───
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("From,", MARGIN, y);
  y += LINE_H;
  writeLines(notice.senderName, MARGIN, CONTENT_W, "bold");
  writeLines(notice.senderAddress, MARGIN, CONTENT_W, "normal", 10);
  y += LINE_H;

  // ─── Subject ───
  ensureSpace(14);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  const subjectLines = doc.splitTextToSize(`Subject: ${notice.subject_line}`, CONTENT_W);
  for (const line of subjectLines) {
    doc.text(line, MARGIN, y);
    y += LINE_H;
  }
  y += 4;

  // ─── LEGAL NOTICE heading ───
  ensureSpace(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("LEGAL NOTICE", PAGE_W / 2, y, { align: "center" });
  y += 2;
  doc.setDrawColor(200, 170, 50);
  doc.setLineWidth(0.6);
  const headingW = doc.getTextWidth("LEGAL NOTICE");
  doc.line(PAGE_W / 2 - headingW / 2, y, PAGE_W / 2 + headingW / 2, y);
  y += LINE_H;

  // ─── Under reference ───
  if (notice.under_reference) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const refLines = doc.splitTextToSize(notice.under_reference, CONTENT_W - 20);
    for (const line of refLines) {
      doc.text(line, PAGE_W / 2, y, { align: "center" });
      y += LINE_H;
    }
    y += 2;
  }

  y += 4;
  doc.setTextColor(30, 30, 30);

  // ─── Salutation ───
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Sir/Madam,", MARGIN, y);
  y += LINE_H + 2;

  // ─── Fact paragraphs (numbered) ───
  for (let i = 0; i < notice.facts_paragraphs.length; i++) {
    ensureSpace(LINE_H * 3);
    const paraNum = `${i + 1}.  `;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const numW = doc.getTextWidth(paraNum);
    doc.text(paraNum, MARGIN, y);

    doc.setFont("helvetica", "normal");
    const paraLines = doc.splitTextToSize(notice.facts_paragraphs[i], CONTENT_W - numW);
    if (paraLines.length > 0) {
      doc.text(paraLines[0], MARGIN + numW, y);
      y += LINE_H;
    }
    for (let j = 1; j < paraLines.length; j++) {
      ensureSpace(LINE_H);
      doc.text(paraLines[j], MARGIN + numW, y);
      y += LINE_H;
    }
    y += 3;
  }

  // ─── Grievance ───
  ensureSpace(LINE_H * 4);
  y += 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("GRIEVANCE:", MARGIN, y);
  y += LINE_H;
  writeLines(notice.grievance, MARGIN, CONTENT_W);
  y += 3;

  // ─── Demand ───
  ensureSpace(LINE_H * 4);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("DEMAND:", MARGIN, y);
  y += LINE_H;
  writeLines(notice.demand, MARGIN, CONTENT_W);
  y += 3;

  // ─── Compliance & Consequences ───
  ensureSpace(LINE_H * 5);
  writeLines(
    `You are hereby called upon to comply with the above demand within ${notice.compliance_period}, failing which ${notice.consequences}`,
    MARGIN,
    CONTENT_W,
  );
  y += 4;

  // ─── Closing statement ───
  ensureSpace(LINE_H * 4);
  writeLines(notice.closing_statement, MARGIN, CONTENT_W, "italic");
  y += LINE_H * 2;

  // ─── Signature block ───
  ensureSpace(30);
  const sigX = PAGE_W - MARGIN - 60;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Yours faithfully,", sigX, y);
  y += LINE_H * 3;
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.3);
  doc.line(sigX, y, sigX + 55, y);
  y += LINE_H;
  doc.setFont("helvetica", "bold");
  doc.text(notice.senderName, sigX, y);

  // ─── Footer on every page ───
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text(`Page ${i} of ${pageCount}`, PAGE_W / 2, 288, { align: "center" });
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7);
    doc.text(
      "DISCLAIMER: This legal notice was generated with AI assistance. It should be reviewed by a qualified advocate before dispatch.",
      PAGE_W / 2,
      292,
      { align: "center" }
    );
  }

  const dateStr = new Date().toISOString().split("T")[0];
  doc.save(`LegalNotice_${dateStr}.pdf`);
}
