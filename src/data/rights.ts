export interface RightsCard {
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  rights: string[];
  statutes: { act: string; section: string; gist: string }[];
  whatToDo: string[];
}

export const RIGHTS_DATA: RightsCard[] = [
  {
    slug: "during-arrest",
    title: "Rights During Arrest",
    shortDescription:
      "Constitutional and procedural protections that apply the moment a person is taken into police custody.",
    icon: "shield",
    rights: [
      "You must be informed of the grounds of your arrest in a language you understand.",
      "You have the right to consult and be defended by a legal practitioner of your choice.",
      "You must be produced before the nearest Magistrate within twenty-four hours of arrest, excluding travel time.",
      "Police cannot detain you beyond twenty-four hours without an order from a Magistrate.",
      "You have the right to inform a relative, friend, or nominee about the arrest and the place of custody.",
      "The arresting officer must wear a clear, accurate identification and prepare a memorandum of arrest signed by a witness.",
      "Women can be arrested only between sunrise and sunset, except in exceptional circumstances with prior permission of a Magistrate.",
      "You cannot be compelled to be a witness against yourself (Article 20(3) of the Constitution).",
    ],
    statutes: [
      { act: "Constitution of India", section: "Article 22", gist: "Protection against arbitrary arrest and detention." },
      { act: "Code of Criminal Procedure", section: "41B", gist: "Procedure of arrest, identification, and memorandum requirements." },
      { act: "Code of Criminal Procedure", section: "50", gist: "Right to be informed of grounds of arrest and right to bail in bailable offences." },
      { act: "Code of Criminal Procedure", section: "50A", gist: "Obligation of police to inform a friend or relative of the arrest." },
      { act: "Code of Criminal Procedure", section: "57", gist: "No detention beyond twenty-four hours without Magistrate's authorisation." },
    ],
    whatToDo: [
      "Stay calm. Politely ask the officer for the reason for arrest and request a copy of the FIR if applicable.",
      "Note the officer's name and badge number. Insist on a memorandum of arrest signed by a witness.",
      "Ask the officer to inform a specific family member or friend, and verify the entry in the police register.",
      "Request to call a lawyer. Do not sign blank papers, fingerprint sheets, or undated documents.",
      "If denied bail in a bailable offence, immediately move the Magistrate or Sessions Court.",
      "Document any injuries or mistreatment in writing and request a medical examination.",
    ],
  },
  {
    slug: "womens-rights",
    title: "Women's Rights",
    shortDescription:
      "Protections under criminal law, family law, and workplace law specifically for women in India.",
    icon: "heart",
    rights: [
      "Right to file an FIR for cruelty by husband or in-laws under Section 498A IPC; the offence is cognizable and non-bailable.",
      "Right to seek protection orders, residence orders, and monetary relief under the Protection of Women from Domestic Violence Act 2005.",
      "Right to a safe and harassment-free workplace under the POSH Act 2013, with mandatory Internal Committees in establishments of ten or more employees.",
      "Right to file complaints of sexual harassment within three months of the incident, with confidentiality of identity preserved throughout.",
      "Right to maintenance from husband under Section 125 CrPC and personal laws, irrespective of religion.",
      "Right to share in matrimonial home and to not be dispossessed without due process.",
      "Right to free legal aid as an entitled category under the Legal Services Authorities Act 1987.",
      "Right against gender-based discrimination in employment, equal remuneration, and maternity benefits under the Maternity Benefit Act.",
    ],
    statutes: [
      { act: "Indian Penal Code", section: "498A", gist: "Cruelty by husband or his relatives — three years and fine." },
      { act: "Indian Penal Code", section: "354", gist: "Outraging the modesty of a woman through assault or criminal force." },
      { act: "Domestic Violence Act 2005", section: "12, 18, 19, 20", gist: "Reliefs including protection, residence, and monetary orders." },
      { act: "POSH Act 2013", section: "9", gist: "Mechanism to file complaint of sexual harassment at workplace." },
      { act: "Code of Criminal Procedure", section: "125", gist: "Maintenance for wife unable to maintain herself." },
    ],
    whatToDo: [
      "If facing harassment or violence, document everything: dates, words used, witnesses, injuries with photos and medical records.",
      "Approach the nearest All Women Police Station or call 112/1091 (Women Helpline).",
      "File a complaint under DV Act 2005 before the Magistrate or through a Protection Officer for swift relief.",
      "At workplace, lodge written complaint with the Internal Committee within three months of the incident.",
      "Engage with NALSA-empanelled lawyers for free legal services if eligible.",
      "Reach out to women-focused NGOs such as Sakhi One Stop Centres for shelter, counselling, and legal support.",
    ],
  },
  {
    slug: "tenant-rights",
    title: "Tenant Rights",
    shortDescription:
      "Rights of tenants under Rent Control statutes and the Transfer of Property Act when renting residential or commercial space.",
    icon: "home",
    rights: [
      "Right to peaceful enjoyment of the leased premises without unwarranted interference from the landlord.",
      "Right to be evicted only by following due process under the State Rent Control Act and on specified grounds.",
      "Right to refund of security deposit at the end of tenancy, after lawful deductions for unpaid rent and actual damages only.",
      "Right to written rent receipts for every payment made, especially when rent is paid in cash.",
      "Right to advance written notice from the landlord before any rent revision or termination.",
      "Right to essential services (water, electricity, sanitation) without arbitrary cut-off by the landlord.",
      "Right to challenge unjust eviction or deposit withholding before Civil Court, Rent Controller, or Consumer Forum where applicable.",
    ],
    statutes: [
      { act: "Transfer of Property Act 1882", section: "108", gist: "Rights and liabilities of lessor and lessee." },
      { act: "Transfer of Property Act 1882", section: "106", gist: "Notice period for termination — 15 days for monthly tenancies, 6 months for yearly." },
      { act: "Transfer of Property Act 1882", section: "111", gist: "Modes by which a lease determines." },
      { act: "Specific Relief Act 1963", section: "38", gist: "Perpetual injunction to restrain forcible eviction." },
      { act: "Indian Evidence Act 1872", section: "63, 64", gist: "Importance of written evidence in establishing tenancy terms." },
    ],
    whatToDo: [
      "Always insist on a written, registered lease deed if the tenancy exceeds eleven months or 12 months.",
      "Take photographs and a written inventory of the property condition at the time of moving in and out.",
      "Pay rent through traceable means (bank transfer, UPI, cheque) and retain all receipts.",
      "If the landlord cuts off essential services or attempts forcible eviction, file a suit for injunction in the Civil Court immediately.",
      "For deposit refund disputes, send a legal notice first; if unsuccessful, approach the Civil Court or appropriate Rent Controller.",
      "Keep documentation of repairs requested from the landlord and any expenses you bore for landlord-related repairs.",
    ],
  },
  {
    slug: "employee-rights",
    title: "Employee Rights",
    shortDescription:
      "Statutory protections relating to wages, termination, gratuity, provident fund, and workplace conditions.",
    icon: "briefcase",
    rights: [
      "Right to written terms of employment including designation, salary, working hours, and notice period.",
      "Right to timely payment of wages under the Payment of Wages Act and Code on Wages 2019.",
      "Right to retrenchment compensation of fifteen days' wages per completed year of service if continuously employed for one year or more.",
      "Right to gratuity under the Payment of Gratuity Act 1972 after five years of continuous service.",
      "Right to provident fund and ESI contributions if applicable thresholds are met.",
      "Right to challenge wrongful termination before the Labour Court or Industrial Tribunal.",
      "Right to safe working conditions, including freedom from sexual harassment under POSH Act 2013.",
      "Right to maternity leave of twenty-six weeks for first two children under the Maternity Benefit Act 1961.",
      "Right to weekly off, paid leave, and bonuses as per the applicable Shops and Establishments Act of the State.",
    ],
    statutes: [
      { act: "Industrial Disputes Act 1947", section: "25F", gist: "Notice and retrenchment compensation conditions." },
      { act: "Industrial Disputes Act 1947", section: "25G", gist: "Last in first out principle in retrenchment." },
      { act: "Payment of Gratuity Act 1972", section: "4", gist: "Eligibility and computation of gratuity after five years." },
      { act: "Payment of Wages Act 1936", section: "5", gist: "Wage payment timelines and lawful deductions." },
      { act: "POSH Act 2013", section: "9", gist: "Filing complaint for sexual harassment at workplace." },
    ],
    whatToDo: [
      "Always retain a copy of your appointment letter, salary slips, and all official communications with HR.",
      "If terminated, ask for a written termination letter with the grounds clearly stated and request your full and final settlement.",
      "Compute and demand statutory dues: notice pay, retrenchment compensation, gratuity, leave encashment, PF, and bonus.",
      "If the employer denies dues or terminates wrongfully, file a case before the Labour Commissioner or the Labour Court.",
      "For unpaid wages or PF, complaints can also be made to the Regional Provident Fund Commissioner or Inspector under Wages Act.",
      "Document harassment, discrimination, or denial of statutory benefits in writing — emails are particularly strong evidence.",
    ],
  },
  {
    slug: "consumer-rights",
    title: "Consumer Rights",
    shortDescription:
      "Rights as a consumer of goods and services under the Consumer Protection Act 2019 and allied laws.",
    icon: "shopping-cart",
    rights: [
      "Right to be protected against goods and services that are hazardous to life and property.",
      "Right to information about quality, quantity, potency, purity, standard, and price of goods or services.",
      "Right to choose from a variety of goods and services at competitive prices, free from coercion.",
      "Right to be heard and to have grievances redressed at appropriate forums (District, State, and National Commissions).",
      "Right to seek redressal against unfair trade practices, restrictive trade practices, or unethical exploitation.",
      "Right to consumer education and awareness about rights and remedies available.",
      "Right to file complaint without paying excessive court fees — complaints can be filed online through eDaakhil portal.",
      "Right to file complaint at the place where the cause of action arose, where the defendant resides, or where the consumer resides.",
    ],
    statutes: [
      { act: "Consumer Protection Act 2019", section: "2", gist: "Definitions of consumer, deficiency, and unfair trade practices." },
      { act: "Consumer Protection Act 2019", section: "35", gist: "Manner of making complaints to the District Commission." },
      { act: "Consumer Protection Act 2019", section: "38", gist: "Procedure on admission of a complaint and time-bound disposal." },
      { act: "Consumer Protection Act 2019", section: "47, 58", gist: "Pecuniary jurisdiction of State and National Commissions." },
      { act: "Consumer Protection Act 2019", section: "84-87", gist: "Product liability provisions." },
    ],
    whatToDo: [
      "Preserve all documentation: invoices, receipts, warranty cards, product packaging, screenshots, and email correspondence.",
      "First raise the grievance in writing with the seller or service provider, allowing a reasonable period to respond.",
      "If unresolved, send a legal notice describing the deficiency and the relief sought.",
      "File a complaint at the appropriate Consumer Commission based on the value claimed: District (up to Rs 1 crore), State (up to Rs 10 crore), National (above Rs 10 crore).",
      "Use eDaakhil (edaakhil.nic.in) for online filing of consumer complaints.",
      "Seek reliefs including refund, replacement, repair, compensation for loss or injury, and punitive damages where applicable.",
    ],
  },
];

export function getRightsCard(slug: string): RightsCard | undefined {
  return RIGHTS_DATA.find((r) => r.slug === slug);
}
