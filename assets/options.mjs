// SafeAI - questionnaire option data.
// Reviewed in the option matrix sheet before implementation:
// https://docs.google.com/spreadsheets/d/1DbT1SlwDOrAwMWqjOiMyW455gTnhcH2w5tOB7ThOd44/edit
//
// Note: the old "1|Label" numeric prefix is gone. Nothing ever read it. It was
// vestigial from a design where the browser scored locally; today the model
// rates the six drivers and the server recomputes the index.

export const ROLE_GROUPS = [
  {
    group: 'End users, business functions',
    items: [
      'Customer service / contact centre agent',
      'Sales representative',
      'Marketing / content practitioner',
      'HR / recruitment practitioner',
      'Finance / accounting practitioner',
      'Procurement / supply chain practitioner',
      'Operations / production staff',
      'Administrative / support staff',
      'Clinician / allied health professional',
      'Educator / teaching staff',
      'Legal practitioner',
      'Research / R&D staff',
      'Frontline / field officer',
      'Customer or member of the public',
    ],
  },
  {
    group: 'Builders',
    items: [
      'Software engineer / developer',
      'ML engineer',
      'Data scientist',
      'Data engineer',
      'MLOps / platform engineer',
      'IT operations',
      'Security engineer / SOC analyst',
      'Solution architect',
    ],
  },
  {
    group: 'Owners and oversight',
    items: [
      'Business sponsor / product owner',
      'Executive / C-suite',
      'Board or audit committee member',
      'Legal / compliance officer',
      'Data protection officer',
      'Risk manager',
      'Internal auditor',
      'Vendor / third-party manager',
    ],
  },
];

export const USECASE_GROUPS = [
  {
    group: 'Content and language',
    items: [
      'Drafting and summarisation',
      'Translation and localisation',
      'Marketing and creative content generation',
      'Code generation and completion',
      'Meeting transcription and notes',
      'Knowledge assistant / RAG over internal documents',
      'Conversational agent (internal)',
      'Conversational agent (customer-facing)',
      'Content moderation',
    ],
  },
  {
    group: 'Analysis and prediction',
    items: [
      'Predictive analytics and forecasting',
      'Anomaly and fraud detection',
      'Recommendation and personalisation',
      'Search and ranking',
      'Sentiment and feedback analysis',
      'Document intelligence / data extraction',
      'Synthetic data generation',
      'Optimisation and scheduling',
    ],
  },
  {
    group: 'Perception',
    items: [
      'Computer vision / image classification',
      'Video analytics and surveillance',
      'Speech recognition and voice',
      'Biometric identification (face, voice, fingerprint)',
      'Medical imaging analysis',
    ],
  },
  {
    group: 'Decisioning',
    items: [
      'Automated decision making (eligibility, approval)',
      'Credit or risk scoring',
      'CV screening and candidate ranking',
      'Pricing and underwriting',
      'Triage and prioritisation',
    ],
  },
  {
    group: 'Automation and autonomy',
    items: [
      'RPA (robotic process automation)',
      'Agentic AI (tool-using, multi-step)',
      'Autonomous physical systems (robotics, vehicles, drones)',
      'Industrial control and process automation',
      'Digital twin and simulation',
    ],
  },
];

// Unchanged from the original page, minus the dead numeric prefix.
export const AUTONOMY = ['Human-in-the-Loop', 'Human-over-the-Loop', 'Fully Autonomous'];
export const DATA = ['Public/Open Source', 'Internal Confidential', 'PII (personal data)', 'PHI (health / medical)'];
export const DEPLOY = ['Cloud PaaS/IaaS (self-hosted)', 'On-Premises', '3rd-Party SaaS', 'Edge Device'];

export function flatten(groups) {
  return groups.flatMap(g => g.items);
}
