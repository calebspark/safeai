// SafeAI - Singapore Standard Industrial Classification 2025.
// Source: SingStat, "Singapore Standard Industrial Classification 2025",
// section headings pp. 21-89. Effective 9 May 2026, aligned to ISIC Rev. 5.
//
// WARNING: SSIC 2025 split section J and shifted every later letter up by one.
// Financial and Insurance is L, NOT K. Third-party sites still list the 2020
// letters and are wrong. Verify only against the official SingStat report.

export const SSIC_SECTIONS = [
  { code: 'A', title: 'Agriculture and Fishing' },
  { code: 'B', title: 'Mining and Quarrying' },
  { code: 'C', title: 'Manufacturing' },
  { code: 'D', title: 'Electricity, Gas, Steam and Air-Conditioning Supply' },
  { code: 'E', title: 'Water Supply; Sewerage, Waste Management and Remediation Activities' },
  { code: 'F', title: 'Construction' },
  { code: 'G', title: 'Wholesale and Retail Trade' },
  { code: 'H', title: 'Transportation and Storage' },
  { code: 'I', title: 'Accommodation and Food Service Activities' },
  { code: 'J', title: 'Publishing, Broadcasting, and Content Production and Distribution Activities' },
  { code: 'K', title: 'Telecommunications, Computer Programming, Consultancy, Computing Infrastructure, and Other Information Service Activities' },
  { code: 'L', title: 'Financial and Insurance Activities' },
  { code: 'M', title: 'Real Estate Activities' },
  { code: 'N', title: 'Professional, Scientific and Technical Activities' },
  { code: 'O', title: 'Administrative and Support Service Activities' },
  { code: 'P', title: 'Public Administration and Defence' },
  { code: 'Q', title: 'Education' },
  { code: 'R', title: 'Health and Social Services' },
  { code: 'S', title: 'Arts, Sports and Recreation' },
  { code: 'T', title: 'Other Service Activities' },
  { code: 'U', title: 'Activities of Households as Employers of Domestic Personnel' },
  { code: 'V', title: 'Activities of Extra-Territorial Organisations and Bodies' },
];

// Plain-language terms people actually type, mapped to a section code.
// Expected to grow. Keys must be lowercase.
export const SSIC_SYNONYMS = {
  farming: 'A', agriculture: 'A', fishery: 'A', aquaculture: 'A',
  mining: 'B', quarry: 'B', oil: 'B', gas: 'B',
  factory: 'C', manufacturer: 'C', production: 'C', semiconductor: 'C',
  electronics: 'C', pharma: 'C', pharmaceutical: 'C', chemicals: 'C',
  utilities: 'D', power: 'D', electricity: 'D', energy: 'D', solar: 'D',
  water: 'E', waste: 'E', recycling: 'E', sewerage: 'E',
  construction: 'F', builder: 'F', contractor: 'F', engineering: 'F',
  retail: 'G', wholesale: 'G', ecommerce: 'G', 'e-commerce': 'G',
  shop: 'G', trading: 'G', distributor: 'G',
  shipping: 'H', logistics: 'H', freight: 'H', transport: 'H',
  airline: 'H', aviation: 'H', maritime: 'H', port: 'H', warehousing: 'H',
  hotel: 'I', hospitality: 'I', restaurant: 'I', 'f&b': 'I',
  fnb: 'I', catering: 'I', cafe: 'I',
  publishing: 'J', media: 'J', broadcasting: 'J', film: 'J',
  news: 'J', gaming: 'J', advertising: 'J',
  telco: 'K', telecom: 'K', telecommunications: 'K', software: 'K',
  saas: 'K', it: 'K', tech: 'K', technology: 'K', cloud: 'K',
  'data centre': 'K', 'data center': 'K', hosting: 'K', cybersecurity: 'K',
  bank: 'L', banking: 'L', finance: 'L', financial: 'L', fintech: 'L',
  insurance: 'L', insurtech: 'L', investment: 'L', wealth: 'L',
  payments: 'L', crypto: 'L', 'asset management': 'L',
  'real estate': 'M', property: 'M', proptech: 'M', landlord: 'M',
  consulting: 'N', legal: 'N', law: 'N', accounting: 'N', audit: 'N',
  architecture: 'N', research: 'N', 'r&d': 'N', design: 'N', marketing: 'N',
  staffing: 'O', recruitment: 'O', 'facilities management': 'O',
  security: 'O', cleaning: 'O', 'call centre': 'O', 'call center': 'O',
  government: 'P', 'public sector': 'P', ministry: 'P', defence: 'P',
  defense: 'P', statutory: 'P', 'civil service': 'P',
  education: 'Q', school: 'Q', university: 'Q', edtech: 'Q',
  training: 'Q', tuition: 'Q', polytechnic: 'Q',
  healthcare: 'R', health: 'R', hospital: 'R', clinic: 'R', medical: 'R',
  healthtech: 'R', biotech: 'R', eldercare: 'R', 'social services': 'R',
  arts: 'S', sports: 'S', recreation: 'S', entertainment: 'S',
  museum: 'S', fitness: 'S', gym: 'S',
  'non-profit': 'T', charity: 'T', ngo: 'T', association: 'T',
  religious: 'T', 'trade union': 'T',
  household: 'U', 'domestic help': 'U',
  embassy: 'V', 'international organisation': 'V', un: 'V',
};

// Display order. SSIC_SECTIONS stays canonical A to V because that is the
// official sequence and the thing we can defend. This is presentation only:
// the sections most likely to be picked by an organisation running an AI risk
// assessment in Singapore surface first, the rest follow in SSIC order.
//
// Ranked by who actually does AI governance work here: MAS-regulated finance,
// the tech sector, healthcare, government, professional services and education,
// then the two largest sectors by GDP and by establishment count.
export const SSIC_COMMON = ['L', 'K', 'R', 'P', 'N', 'Q', 'C', 'G'];

export function orderedSections() {
  const byCode = new Map(SSIC_SECTIONS.map(s => [s.code, s]));
  const common = SSIC_COMMON.map(c => ({ ...byCode.get(c), common: true }));
  const rest = SSIC_SECTIONS
    .filter(s => !SSIC_COMMON.includes(s.code))
    .map(s => ({ ...s, common: false }));
  return [...common, ...rest];
}

export function industryValue(section) {
  return `${section.code} - ${section.title}`;
}
