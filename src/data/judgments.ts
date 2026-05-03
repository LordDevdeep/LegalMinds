export interface LandmarkJudgment {
  id: string;
  caseName: string;
  year: number;
  court: string;
  citation: string;
  keyIssue: string;
  holding: string;
  whyItMatters: string;
}

export const JUDGMENTS: LandmarkJudgment[] = [
  {
    id: "kesavananda-1973",
    caseName: "Kesavananda Bharati v. State of Kerala",
    year: 1973,
    court: "Supreme Court of India (13-judge Constitution Bench)",
    citation: "(1973) 4 SCC 225",
    keyIssue:
      "Whether Parliament's power under Article 368 to amend the Constitution is unlimited, including the power to alter or abrogate fundamental rights.",
    holding:
      "Parliament can amend any part of the Constitution, but it cannot alter or destroy the basic structure of the Constitution. The basic structure includes features such as supremacy of the Constitution, rule of law, separation of powers, and federalism.",
    whyItMatters:
      "This decision created the doctrine of basic structure, the most powerful judicial check on legislative excess in Indian constitutional law. Subsequent attempts to amend or override fundamental rights have been measured against this doctrine.",
  },
  {
    id: "maneka-1978",
    caseName: "Maneka Gandhi v. Union of India",
    year: 1978,
    court: "Supreme Court of India (7-judge Constitution Bench)",
    citation: "(1978) 1 SCC 248",
    keyIssue:
      "Whether the right to travel abroad is part of personal liberty under Article 21 and what 'procedure established by law' must mean for deprivation of life or liberty.",
    holding:
      "The procedure under Article 21 must be just, fair, and reasonable, not arbitrary or oppressive. Articles 14, 19, and 21 must be read together, forming a 'golden triangle' of fundamental rights.",
    whyItMatters:
      "This judgment transformed Article 21 from a narrow procedural guarantee into the source of substantive rights such as privacy, dignity, and a fair procedure. It is the foundation of much of modern Indian rights jurisprudence.",
  },
  {
    id: "vishaka-1997",
    caseName: "Vishaka v. State of Rajasthan",
    year: 1997,
    court: "Supreme Court of India",
    citation: "(1997) 6 SCC 241",
    keyIssue:
      "Whether sexual harassment of women at the workplace amounts to violation of fundamental rights under Articles 14, 19, and 21, and what guidelines apply in absence of legislation.",
    holding:
      "Sexual harassment of women at the workplace is a violation of fundamental rights. The Court issued guidelines (the Vishaka Guidelines) requiring employers to set up complaint mechanisms, applicable until Parliament enacted legislation.",
    whyItMatters:
      "The Vishaka Guidelines remained the law for sixteen years and led directly to the enactment of the POSH Act in 2013. The case is also a leading example of judicial law-making in the absence of legislation.",
  },
  {
    id: "puttaswamy-2017",
    caseName: "K.S. Puttaswamy v. Union of India",
    year: 2017,
    court: "Supreme Court of India (9-judge Constitution Bench)",
    citation: "(2017) 10 SCC 1",
    keyIssue:
      "Whether the right to privacy is a fundamental right protected by the Constitution.",
    holding:
      "The right to privacy is a fundamental right intrinsic to the right to life and personal liberty under Article 21, and to the freedoms guaranteed under Part III of the Constitution.",
    whyItMatters:
      "This unanimous decision firmly anchored privacy in the Constitution and provided the foundation for subsequent challenges to mass surveillance, decriminalisation of homosexuality, and the framework for India's data protection law.",
  },
  {
    id: "navtej-2018",
    caseName: "Navtej Singh Johar v. Union of India",
    year: 2018,
    court: "Supreme Court of India (5-judge Constitution Bench)",
    citation: "(2018) 10 SCC 1",
    keyIssue:
      "Whether Section 377 IPC, criminalising consensual same-sex relations between adults, is constitutionally valid.",
    holding:
      "Section 377 was read down to the extent it criminalised consensual same-sex relations between adults. Such consensual conduct is protected under Articles 14, 15, 19, and 21.",
    whyItMatters:
      "The judgment affirmed that constitutional morality, not majoritarian morality, governs the rights of vulnerable groups. It is a landmark recognition of dignity and autonomy of LGBTQIA+ persons in India.",
  },
  {
    id: "shayara-2017",
    caseName: "Shayara Bano v. Union of India",
    year: 2017,
    court: "Supreme Court of India (5-judge Constitution Bench)",
    citation: "(2017) 9 SCC 1",
    keyIssue:
      "Whether the practice of instant triple talaq (talaq-e-biddat) is constitutionally protected as part of personal law.",
    holding:
      "The practice of instant triple talaq was held unconstitutional and arbitrary by majority. It violates Article 14 and is not an essential religious practice protected under Article 25.",
    whyItMatters:
      "The decision led to the enactment of the Muslim Women (Protection of Rights on Marriage) Act 2019 which criminalises pronouncement of instant triple talaq. It strengthens gender justice within personal law.",
  },
  {
    id: "indra-1992",
    caseName: "Indra Sawhney v. Union of India",
    year: 1992,
    court: "Supreme Court of India (9-judge Constitution Bench)",
    citation: "1992 Supp (3) SCC 217",
    keyIssue:
      "The constitutional validity of reservations for socially and educationally backward classes in public employment, including the famous Mandal Commission recommendations.",
    holding:
      "Reservations under Article 16(4) are constitutionally permissible. However, the total reservation should not exceed fifty percent except in extraordinary circumstances, and the 'creamy layer' among backward classes is to be excluded from the benefit.",
    whyItMatters:
      "This judgment is the cornerstone of India's reservation jurisprudence. The 50% ceiling and the creamy layer concept continue to influence every subsequent reservation policy and debate.",
  },
  {
    id: "olga-1985",
    caseName: "Olga Tellis v. Bombay Municipal Corporation",
    year: 1985,
    court: "Supreme Court of India (5-judge Constitution Bench)",
    citation: "(1985) 3 SCC 545",
    keyIssue:
      "Whether the right to livelihood is part of the right to life under Article 21, and whether eviction of pavement dwellers without notice violates the Constitution.",
    holding:
      "The right to livelihood is an integral part of the right to life under Article 21. Deprivation of livelihood without due process amounts to deprivation of life.",
    whyItMatters:
      "The decision broadened Article 21 to include socio-economic rights and laid the groundwork for housing rights jurisprudence in India. It remains a frequently cited authority in displacement and slum eviction cases.",
  },
  {
    id: "shahbano-1985",
    caseName: "Mohd. Ahmed Khan v. Shah Bano Begum",
    year: 1985,
    court: "Supreme Court of India (5-judge Constitution Bench)",
    citation: "(1985) 2 SCC 556",
    keyIssue:
      "Whether a divorced Muslim woman is entitled to maintenance from her former husband under Section 125 CrPC despite personal law provisions.",
    holding:
      "Section 125 CrPC applies uniformly to all Indian citizens irrespective of religion. A divorced Muslim woman is entitled to claim maintenance from her former husband under this provision until she remarries.",
    whyItMatters:
      "Although Parliament subsequently enacted the Muslim Women (Protection of Rights on Divorce) Act 1986 in response, the case sparked an enduring debate on uniform civil code, gender justice, and the relationship between personal laws and constitutional rights.",
  },
  {
    id: "joseph-2018",
    caseName: "Joseph Shine v. Union of India",
    year: 2018,
    court: "Supreme Court of India (5-judge Constitution Bench)",
    citation: "(2018) 2 SCC 189",
    keyIssue:
      "Whether Section 497 IPC, which criminalised adultery, is constitutionally valid given that it treated women as the property of their husbands.",
    holding:
      "Section 497 IPC was struck down as unconstitutional. It violated Articles 14, 15, and 21 by treating women as property of their husbands and denying them sexual autonomy.",
    whyItMatters:
      "The decision affirmed individual sexual autonomy and decisional privacy within marriage. Adultery remains a ground for divorce, but is no longer a criminal offence.",
  },
];

