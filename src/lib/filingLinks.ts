import type { FilingLink, Helpline } from "./types";

/** Verified, working Indian legal portals and filing links */

const COMMON_LINKS: FilingLink[] = [
  { name: "eCourts Services", url: "https://services.ecourts.gov.in/ecourtindia_v6/", purpose: "Check case status, court orders, and cause lists" },
  { name: "India Code (Bare Acts)", url: "https://www.indiacode.nic.in/", purpose: "Search and read full text of Indian laws and acts" },
  { name: "NALSA (Free Legal Aid)", url: "https://nalsa.gov.in/", purpose: "Apply for free legal aid if you cannot afford a lawyer" },
];

const CRIMINAL_LINKS: FilingLink[] = [
  { name: "File Cyber Crime Complaint", url: "https://cybercrime.gov.in/", purpose: "Report cyber crimes including online fraud, harassment, identity theft" },
  { name: "File FIR Online", url: "https://digitalpolice.gov.in/", purpose: "File a First Information Report (FIR) online" },
  { name: "National Crime Records Bureau", url: "https://ncrb.gov.in/", purpose: "Access crime statistics and reports" },
];

const CONSUMER_LINKS: FilingLink[] = [
  { name: "Consumer Helpline (NCH)", url: "https://consumerhelpline.gov.in/", purpose: "File consumer complaints online and track status" },
  { name: "E-Daakhil (Consumer Court)", url: "https://edaakhil.nic.in/", purpose: "File consumer cases electronically in consumer commissions" },
  { name: "UMANG App", url: "https://web.umang.gov.in/", purpose: "Access government services including consumer grievance filing" },
];

const LABOUR_LINKS: FilingLink[] = [
  { name: "Shram Suvidha Portal", url: "https://shramsuvidha.gov.in/", purpose: "File labour-related complaints and grievances" },
  { name: "EPFO (PF Portal)", url: "https://www.epfindia.gov.in/", purpose: "Check PF balance, file PF withdrawal, lodge PF complaint" },
  { name: "ESIC Portal", url: "https://www.esic.gov.in/", purpose: "Employee State Insurance claims and complaints" },
];

const PROPERTY_LINKS: FilingLink[] = [
  { name: "RERA Portal (Central)", url: "https://rera.gov.in/", purpose: "File real estate complaints under RERA" },
  { name: "IGRS (Stamp & Registration)", url: "https://igrs.gov.in/", purpose: "Property registration and stamp duty information" },
  { name: "Bhoomi / Land Records", url: "https://landrecords.nic.in/", purpose: "Access digitized land records across Indian states" },
];

const FAMILY_LINKS: FilingLink[] = [
  { name: "Family Court (eCourts)", url: "https://services.ecourts.gov.in/ecourtindia_v6/", purpose: "File and track family court cases" },
  { name: "Women Helpline (181)", url: "https://www.ncw.nic.in/", purpose: "National Commission for Women — file complaints online" },
  { name: "Maintenance Case Filing", url: "https://services.ecourts.gov.in/ecourtindia_v6/", purpose: "File maintenance and alimony cases through eCourts" },
];

const TAX_LINKS: FilingLink[] = [
  { name: "Income Tax Portal", url: "https://www.incometax.gov.in/", purpose: "File returns, check refund status, lodge tax grievances" },
  { name: "GST Portal", url: "https://www.gst.gov.in/", purpose: "GST registration, filing, and grievance redressal" },
];

const RTI_LINKS: FilingLink[] = [
  { name: "RTI Online Portal", url: "https://rtionline.gov.in/", purpose: "File Right to Information requests with central government" },
];

/** Map common case type keywords to relevant filing links */
function getLinksForCaseType(caseType: string): FilingLink[] {
  const lower = caseType.toLowerCase();

  const links: FilingLink[] = [...COMMON_LINKS];

  if (lower.includes("criminal") || lower.includes("ipc") || lower.includes("bns") || lower.includes("theft") || lower.includes("assault") || lower.includes("fraud") || lower.includes("cheating")) {
    links.push(...CRIMINAL_LINKS);
  }
  if (lower.includes("consumer") || lower.includes("deficiency") || lower.includes("product") || lower.includes("service")) {
    links.push(...CONSUMER_LINKS);
  }
  if (lower.includes("labour") || lower.includes("labor") || lower.includes("employment") || lower.includes("salary") || lower.includes("termination") || lower.includes("workplace") || lower.includes("pf") || lower.includes("provident")) {
    links.push(...LABOUR_LINKS);
  }
  if (lower.includes("property") || lower.includes("rent") || lower.includes("landlord") || lower.includes("tenant") || lower.includes("real estate") || lower.includes("rera") || lower.includes("land") || lower.includes("encroach")) {
    links.push(...PROPERTY_LINKS);
  }
  if (lower.includes("family") || lower.includes("divorce") || lower.includes("maintenance") || lower.includes("custody") || lower.includes("domestic") || lower.includes("marriage") || lower.includes("dowry")) {
    links.push(...FAMILY_LINKS);
  }
  if (lower.includes("tax") || lower.includes("gst") || lower.includes("income tax")) {
    links.push(...TAX_LINKS);
  }
  if (lower.includes("rti") || lower.includes("information")) {
    links.push(...RTI_LINKS);
  }
  if (lower.includes("cyber") || lower.includes("online") || lower.includes("internet") || lower.includes("hacking") || lower.includes("data")) {
    links.push(...CRIMINAL_LINKS.filter(l => l.url.includes("cybercrime")));
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  return links.filter(l => {
    if (seen.has(l.url)) return false;
    seen.add(l.url);
    return true;
  });
}

/** Verified Indian helplines */
const VERIFIED_HELPLINES: Helpline[] = [
  { name: "Police Emergency", number: "112", when_to_use: "Immediate danger, crime in progress, or emergency situations" },
  { name: "Women Helpline", number: "181", when_to_use: "Women facing violence, harassment, or domestic abuse" },
  { name: "Consumer Helpline", number: "1800-11-4000", when_to_use: "Consumer complaints and grievances (toll-free)" },
  { name: "Cyber Crime Helpline", number: "1930", when_to_use: "Report cyber fraud, online scams, or digital crimes" },
  { name: "Legal Aid (NALSA)", number: "15100", when_to_use: "Free legal assistance for those who cannot afford a lawyer" },
  { name: "Senior Citizen Helpline", number: "14567", when_to_use: "Senior citizens facing abuse, neglect, or legal issues" },
  { name: "Child Helpline", number: "1098", when_to_use: "Children in distress, abuse, or need of care and protection" },
];

function getHelplines(caseType: string): Helpline[] {
  const lower = caseType.toLowerCase();
  const helplines: Helpline[] = [VERIFIED_HELPLINES[0], VERIFIED_HELPLINES[4]]; // Police + NALSA always

  if (lower.includes("consumer") || lower.includes("product") || lower.includes("service")) {
    helplines.push(VERIFIED_HELPLINES[3 - 1]); // Consumer helpline
  }
  if (lower.includes("women") || lower.includes("domestic") || lower.includes("dowry") || lower.includes("harassment") || lower.includes("sexual")) {
    helplines.push(VERIFIED_HELPLINES[1]); // Women helpline
  }
  if (lower.includes("cyber") || lower.includes("online") || lower.includes("fraud") || lower.includes("scam")) {
    helplines.push(VERIFIED_HELPLINES[3]); // Cyber crime
  }
  if (lower.includes("senior") || lower.includes("elderly") || lower.includes("old age")) {
    helplines.push(VERIFIED_HELPLINES[5]);
  }
  if (lower.includes("child") || lower.includes("minor") || lower.includes("juvenile")) {
    helplines.push(VERIFIED_HELPLINES[6]);
  }

  // Deduplicate
  const seen = new Set<string>();
  return helplines.filter(h => {
    if (seen.has(h.number)) return false;
    seen.add(h.number);
    return true;
  });
}

export { getLinksForCaseType, getHelplines };
