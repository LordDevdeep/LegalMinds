import type { LegalNoticeContent } from "./types";

function escHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
}

function buildNoticeHtml(notice: LegalNoticeContent, title: string = "LEGAL NOTICE"): string {
  const factsHtml = notice.facts_paragraphs
    .map((p, i) => `<p style="margin:6px 0 6px 20px;text-indent:-20px;"><strong>${i + 1}.</strong>&nbsp;&nbsp;${escHtml(p)}</p>`)
    .join("");

  return `
    <div style="font-family:'Noto Sans',system-ui,-apple-system,sans-serif;color:#1e1e1e;padding:0;max-width:170mm;">
      <!-- Date -->
      <div style="text-align:right;font-size:11px;color:#444;margin-bottom:16px;">Date: ${escHtml(notice.date)}</div>

      <!-- To -->
      <div style="margin-bottom:12px;">
        <strong style="font-size:11px;">To,</strong><br>
        <strong>${escHtml(notice.recipientName)}</strong><br>
        <span style="font-size:10px;color:#444;">${escHtml(notice.recipientAddress)}</span>
      </div>

      <!-- From -->
      <div style="margin-bottom:12px;">
        <strong style="font-size:11px;">From,</strong><br>
        <strong>${escHtml(notice.senderName)}</strong><br>
        <span style="font-size:10px;color:#444;">${escHtml(notice.senderAddress)}</span>
      </div>

      <!-- Subject -->
      <p style="font-size:11px;margin:12px 0 6px 0;"><strong>Subject:</strong> ${escHtml(notice.subject_line)}</p>

      <!-- Heading -->
      <h1 style="text-align:center;font-size:16px;font-weight:700;margin:16px 0 2px 0;">${escHtml(title)}</h1>
      <div style="width:120px;height:2px;background:#c8aa32;margin:0 auto 4px auto;"></div>
      ${notice.under_reference ? `<p style="text-align:center;font-size:10px;font-style:italic;color:#555;margin:0 0 12px 0;">${escHtml(notice.under_reference)}</p>` : ""}

      <!-- Salutation -->
      <p style="margin:12px 0 8px 0;">Sir/Madam,</p>

      <!-- Facts -->
      <div style="font-size:11px;line-height:1.7;">${factsHtml}</div>

      <!-- Grievance -->
      <div style="margin-top:14px;">
        <h3 style="font-size:12px;font-weight:700;margin:0 0 4px 0;">GRIEVANCE:</h3>
        <p style="font-size:11px;line-height:1.7;margin:0;">${escHtml(notice.grievance)}</p>
      </div>

      <!-- Demand -->
      <div style="margin-top:14px;">
        <h3 style="font-size:12px;font-weight:700;margin:0 0 4px 0;">DEMAND:</h3>
        <p style="font-size:11px;line-height:1.7;margin:0;">${escHtml(notice.demand)}</p>
      </div>

      <!-- Compliance -->
      <p style="font-size:11px;line-height:1.7;margin-top:14px;">
        You are hereby called upon to comply with the above demand within <strong>${escHtml(notice.compliance_period)}</strong>, failing which ${escHtml(notice.consequences)}
      </p>

      <!-- Closing -->
      <p style="font-size:11px;font-style:italic;line-height:1.7;margin-top:14px;">${escHtml(notice.closing_statement)}</p>

      <!-- Signature -->
      <div style="margin-top:30px;text-align:right;padding-right:20px;">
        <p style="margin:0;font-size:11px;">Yours faithfully,</p>
        <div style="margin-top:24px;border-top:1px solid #666;width:150px;display:inline-block;"></div>
        <p style="margin:4px 0 0 0;font-weight:700;">${escHtml(notice.senderName)}</p>
      </div>

      <!-- Disclaimer -->
      <div style="margin-top:30px;padding-top:8px;border-top:1px solid #ccc;">
        <p style="font-size:8px;color:#999;text-align:center;margin:0;">
          DISCLAIMER: This legal notice was generated with AI assistance. It should be reviewed by a qualified advocate before dispatch.
        </p>
      </div>
    </div>
  `;
}

/**
 * Generate a legal notice PDF. If translatedNotice is provided (non-English),
 * the PDF will have English version first, then translated version on a new page.
 */
export async function downloadLegalNoticeDocument(
  notice: LegalNoticeContent,
  translatedNotice?: LegalNoticeContent
) {
  const html2pdf = (await import("html2pdf.js")).default;

  let fullHtml: string;

  if (translatedNotice) {
    // Bilingual: English first, then translated version
    fullHtml = `
      <div>
        ${buildNoticeHtml(notice, "LEGAL NOTICE")}
        <div style="page-break-before:always;"></div>
        ${buildNoticeHtml(translatedNotice, "LEGAL NOTICE")}
      </div>
    `;
  } else {
    // English only
    fullHtml = buildNoticeHtml(notice, "LEGAL NOTICE");
  }

  const container = document.createElement("div");
  container.innerHTML = fullHtml;
  container.style.position = "absolute";
  container.style.left = "-9999px";
  document.body.appendChild(container);

  const dateStr = new Date().toISOString().split("T")[0];

  await (html2pdf() as any)
    .set({
      margin: 20,
      filename: `LegalNotice_${dateStr}.pdf`,
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"], avoid: ["div"] },
    })
    .from(container)
    .save();

  document.body.removeChild(container);
}
