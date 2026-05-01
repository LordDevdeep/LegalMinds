export interface GlossaryTerm {
  term: string;
  definition: string;
  example?: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "FIR",
    definition:
      "First Information Report — the written document prepared by the police on receiving information about the commission of a cognizable offence. It is the starting point of an investigation.",
    example: "When a theft is reported at a police station, the officer in charge records the complaint as an FIR under Section 154 CrPC.",
  },
  {
    term: "Chargesheet",
    definition:
      "A final report filed by the police before a Magistrate after completing investigation, listing the accused, evidence collected, witnesses, and applicable sections of law.",
    example: "After 90 days of investigation, the police filed a chargesheet under Section 173 CrPC against the accused for cheating.",
  },
  {
    term: "Bail",
    definition:
      "The release of an arrested person from custody on furnishing security or bond, often subject to conditions, with an undertaking to appear before the court when required.",
    example: "The Magistrate granted bail to the accused on a personal bond of Rs 25,000 with one surety.",
  },
  {
    term: "Anticipatory Bail",
    definition:
      "Bail granted in advance under Section 438 CrPC to a person who apprehends arrest in a non-bailable offence, by the High Court or Court of Session.",
    example: "Apprehending arrest in a 498A case, the petitioner moved for anticipatory bail before the Sessions Court.",
  },
  {
    term: "Cognizable Offence",
    definition:
      "An offence in which the police can arrest without a warrant and start investigation without prior permission of the Magistrate. Generally serious offences.",
    example: "Murder, rape, kidnapping, and robbery are cognizable offences.",
  },
  {
    term: "Non-Cognizable Offence",
    definition:
      "An offence in which the police cannot arrest without a warrant or initiate investigation without permission from the Magistrate. Usually less serious offences.",
    example: "Defamation and simple assault under Section 323 IPC are non-cognizable.",
  },
  {
    term: "Bailable Offence",
    definition:
      "An offence in which bail is a matter of right — the accused must be released on bail if willing to furnish bond.",
    example: "Causing simple hurt under Section 323 IPC is a bailable offence.",
  },
  {
    term: "Non-Bailable Offence",
    definition:
      "An offence in which bail is not a matter of right but is at the discretion of the court, considering the nature and gravity of the offence.",
    example: "Murder under Section 302 IPC is non-bailable.",
  },
  {
    term: "Summons",
    definition:
      "A document issued by a court directing a person to appear before it on a specified date and time, either as a party, witness, or for production of documents.",
  },
  {
    term: "Warrant",
    definition:
      "A written order issued by a court or Magistrate authorising a police officer to arrest a person, search a place, or perform some other specified act.",
  },
  {
    term: "Plaint",
    definition:
      "The written statement by which a civil suit is instituted, setting out the cause of action, parties, jurisdiction, relief sought, and material facts.",
  },
  {
    term: "Written Statement",
    definition:
      "The reply filed by the defendant in a civil suit responding to the plaint, setting out the defence, admissions, and denials.",
  },
  {
    term: "Decree",
    definition:
      "The formal expression of an adjudication of the court that conclusively determines the rights of the parties on the matters in controversy in a civil suit.",
  },
  {
    term: "Judgment",
    definition:
      "The statement given by the judge on the grounds of a decree or order, containing the findings on issues and the reasons for the decision.",
  },
  {
    term: "Appeal",
    definition:
      "An application to a higher court for review of the decision of a lower court on grounds of error in fact or law.",
  },
  {
    term: "Revision",
    definition:
      "The power of a higher court to examine the records of a lower court to ensure correctness, legality, and propriety of the order, exercised at its discretion.",
  },
  {
    term: "Review",
    definition:
      "Re-examination of a judgment by the same court that passed it, on limited grounds such as discovery of new evidence or apparent error on the face of record.",
  },
  {
    term: "Stay",
    definition:
      "An order of the court suspending or postponing the operation of an order, decree, or proceedings until further orders.",
  },
  {
    term: "Injunction",
    definition:
      "A court order directing a person to do, or refrain from doing, a particular act. It may be temporary (interim) or permanent (perpetual).",
  },
  {
    term: "Affidavit",
    definition:
      "A written statement of facts confirmed by the oath or affirmation of the person making it, sworn before a notary or other authorised officer.",
  },
  {
    term: "Notary",
    definition:
      "A public officer authorised to attest documents, administer oaths, and certify true copies of documents.",
  },
  {
    term: "Vakalatnama",
    definition:
      "A document signed by a litigant authorising a lawyer (advocate) to appear, plead, and act for them before a court.",
  },
  {
    term: "Cognizance",
    definition:
      "The act by which a Magistrate takes notice of an offence and applies their mind to it, considered the formal beginning of judicial proceedings.",
  },
  {
    term: "Compoundable Offence",
    definition:
      "An offence which can be settled or compromised between the complainant and the accused, sometimes with permission of the court.",
    example: "Adultery and simple hurt are compoundable offences under Section 320 CrPC.",
  },
  {
    term: "Caveat",
    definition:
      "A formal notice filed in court by a person who anticipates that another may file a case against them, asking the court to hear them before any ex-parte order is passed.",
  },
  {
    term: "Habeas Corpus",
    definition:
      "A constitutional writ ('produce the body') used to challenge unlawful detention; the court orders the authority detaining the person to produce them and justify the detention.",
  },
  {
    term: "Mandamus",
    definition:
      "A constitutional writ ('we command') compelling a public authority or lower court to perform a duty it has refused or failed to discharge.",
  },
  {
    term: "Certiorari",
    definition:
      "A constitutional writ used by a superior court to quash the order of an inferior court or tribunal that has acted without jurisdiction or violated principles of natural justice.",
  },
  {
    term: "Quo Warranto",
    definition:
      "A constitutional writ ('by what authority') used to challenge a person's right to hold a public office, calling upon them to show the authority under which they claim the office.",
  },
  {
    term: "Prohibition",
    definition:
      "A constitutional writ issued by a higher court to a lower court or tribunal preventing it from exceeding its jurisdiction in a pending matter.",
  },
  {
    term: "IPC",
    definition:
      "Indian Penal Code 1860 — the main substantive criminal law of India defining offences and their punishments. Replaced from 1 July 2024 by the Bharatiya Nyaya Sanhita (BNS) for offences committed thereafter.",
  },
  {
    term: "CrPC",
    definition:
      "Code of Criminal Procedure 1973 — the procedural law governing investigation, prosecution, trial, and bail in criminal matters. Replaced for new offences from 1 July 2024 by the Bharatiya Nagarik Suraksha Sanhita (BNSS).",
  },
  {
    term: "CPC",
    definition:
      "Code of Civil Procedure 1908 — the law governing procedure in civil suits, including jurisdiction, pleadings, evidence, judgments, and execution.",
  },
  {
    term: "Suo Motu",
    definition:
      "Action taken by a court or authority on its own motion, without any application or complaint from a party, usually in matters of public interest.",
  },
  {
    term: "Ex-Parte",
    definition:
      "An order or hearing conducted by a court in the absence of one of the parties, usually because they failed to appear despite notice.",
  },
];

export function searchGlossary(q: string): GlossaryTerm[] {
  const lower = q.toLowerCase().trim();
  if (!lower) return GLOSSARY;
  return GLOSSARY.filter(
    (t) =>
      t.term.toLowerCase().includes(lower) ||
      t.definition.toLowerCase().includes(lower) ||
      (t.example || "").toLowerCase().includes(lower)
  );
}
