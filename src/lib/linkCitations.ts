/**
 * Detect legal citations (Section X IPC, Article Y Constitution, etc.)
 * and convert them to clickable links pointing to India Code search.
 */

const INDIA_CODE_SEARCH = "https://www.indiacode.nic.in/handle/123456789/1362/search";

// Patterns to match Indian legal citations
const CITATION_PATTERNS = [
  // Section 420 IPC, Section 302 of IPC, Section 125 of the Indian Penal Code
  /\b(Section\s+\d+[A-Z]?(?:\s*(?:of|of\s+the)\s+)?(?:IPC|Indian Penal Code|CrPC|Code of Criminal Procedure|BNS|Bharatiya Nyaya Sanhita|BNSS|Bharatiya Nagarik Suraksha Sanhita|CPC|Code of Civil Procedure|NI Act|Negotiable Instruments Act|IT Act|Information Technology Act|POCSO|RERA|Transfer of Property Act|Indian Contract Act|Motor Vehicles Act|Hindu Marriage Act|Special Marriage Act|Indian Evidence Act|BSA|Bharatiya Sakshya Adhiniyam|Consumer Protection Act|Domestic Violence Act|Companies Act))\b/gi,
  // Article 14, Article 21 of Constitution, Article 19(1)(a)
  /\b(Article\s+\d+[A-Z]?(?:\(\d+\))?(?:\([a-z]\))?(?:\s+(?:of|of\s+the)\s+(?:the\s+)?Constitution)?)\b/gi,
];

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Takes plain text and returns HTML string with citations linked.
 */
export function linkCitations(text: string): string {
  let result = escapeHtml(text);

  for (const pattern of CITATION_PATTERNS) {
    result = result.replace(pattern, (match) => {
      const searchQuery = encodeURIComponent(match);
      return `<a href="${INDIA_CODE_SEARCH}?query=${searchQuery}" target="_blank" rel="noreferrer" class="text-legal-blue underline decoration-legal-blue/30 hover:text-gold-400 hover:decoration-gold-400/30 transition-colors">${match}</a>`;
    });
  }

  return result;
}
