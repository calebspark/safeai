// SafeAI - questionnaire option data.
// Reviewed in the option matrix sheet before implementation:
// https://docs.google.com/spreadsheets/d/1DbT1SlwDOrAwMWqjOiMyW455gTnhcH2w5tOB7ThOd44/edit
//
// Note: the old "1|Label" numeric prefix is gone. Nothing ever read it. It was
// vestigial from a design where the browser scored locally; today the model
// rates the seven drivers and the server recomputes the index.

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
      'Agentic AI (tool-using, multi-step)',
      'Autonomous physical systems (robotics, vehicles, drones)',
      'Industrial control and process automation',
      'Digital twin and simulation',
    ],
  },
];

// Every picker carries a plain "Others" so a real answer that is not on the
// list still has a home, next to the free-text escape hatch. Reviewed in the
// option matrix sheet.
export const OTHERS = 'Others';

/* ---- scale questions -------------------------------------------------
   Each option is {label, desc}. The label is what gets stored and sent to
   the assessment; the description is shown once the option is selected, so
   nobody has to guess what "Level 3" means.

   Autonomy follows the Bessemer AI Agent Autonomy Scale, capability follows
   the agent capability levels, sensitivity follows the four governance
   tiers, and hosting follows the infrastructure hosting models. All four
   lists come from the reviewed option matrix. */

export const AUTONOMY = [
  { label: 'Level 0: No agency', desc: 'Fixed scripts, macros or basic chat prompts. The AI produces text and people perform every action.' },
  { label: 'Level 1: Reasoning and traceability', desc: 'The AI reasons step by step and critiques itself, but takes no independent action outside the chat.' },
  { label: 'Level 2: Conditional agency (co-pilot)', desc: 'The agent proposes actions or batch runs, and a person reviews and approves each step.' },
  { label: 'Level 3: High autonomy', desc: 'The agent executes operational workflows or code changes on its own, within bounded scopes.' },
  { label: 'Level 4: Full job performance', desc: 'Agents work as digital employees, setting goals and running complex multi-step work end to end.' },
  { label: 'Level 5: Multi-agent orchestration', desc: 'Teams of agents collaborate, delegate to specialised sub-agents and manage whole projects.' },
];

export const DATA_SOURCE = [
  { label: 'Unstructured stores', desc: 'Document repositories, wikis and meeting transcripts.' },
  { label: 'Structured databases', desc: 'SQL relational stores, data warehouses and data lakes.' },
  { label: 'SaaS and line-of-business tools', desc: 'CRMs, ticketing systems, ERPs and messaging platforms reached through APIs.' },
  { label: 'Agent state and memory', desc: 'Scratchpads and long-term stores of user preferences that persist between sessions.' },
];

export const DATA_SENSITIVITY = [
  { label: 'Public / low sensitivity', desc: 'Marketing collateral and public documents. Read-only access and minimal sandboxing are enough.' },
  { label: 'Internal / medium sensitivity', desc: 'Corporate policies and non-sensitive operational metrics. Standard role-based access control applies.' },
  { label: 'Confidential / high sensitivity', desc: 'Financial reports, proprietary source code, customer transaction data. Needs field-level access rules, PII masking and network isolation.' },
  { label: 'Restricted / regulated (PII, PHI, HIPAA, GDPR)', desc: 'Personal identity and healthcare records. Needs zero-trust segmentation, immutable audit logs and human validation before any external action.' },
];

export const CAPABILITY = [
  { label: 'Level 1: Single task', desc: 'Executes one explicit instruction or tool call per invocation, with no planning of its own.' },
  { label: 'Level 2: Multi-step', desc: 'Runs deterministic sequences or action chains inside a single session.' },
  { label: 'Level 3: Multi-context', desc: 'Uses persistent long-term memory and retrieval across separate sessions or days.' },
  { label: 'Level 4: Multi-agent', desc: 'Coordinates specialised agents that hand sub-tasks off to each other as work arrives.' },
  { label: 'Level 5: Autonomous', desc: 'Manages long-horizon goals around the clock, with minimal or no human checkpoints.' },
];

export const HOSTING = [
  { label: 'Serverless / managed', desc: 'A cloud-native agent platform that scales automatically and traces runs for you. Least to maintain, most vendor reach into your data.' },
  { label: 'Hybrid', desc: 'Cloud control plane with a self-hosted data plane, so sensitive data stays inside your private cloud.' },
  { label: 'Self-hosted', desc: 'Container orchestration on infrastructure you own, cloud or on-premises, for full control of data residency.' },
  { label: 'Third-party SaaS', desc: 'A vendor product you configure rather than host. The vendor holds the data and the model.' },
  { label: 'Edge device', desc: 'Runs on devices in the field, outside the data centre perimeter and harder to patch or monitor.' },
];

export const GOVERNANCE = [
  { label: 'Tier 1: Low severity', desc: 'Fully automated actions that are easy to reverse, such as password resets, with periodic auditing.' },
  { label: 'Tier 2: Moderate severity', desc: 'Partially reversible work. The agent drafts or diagnoses, and a person approves before it executes.' },
  { label: 'Tier 3: High severity', desc: 'Critical system changes, where autonomous execution is blocked entirely.' },
];

export function flatten(groups) {
  return groups.flatMap(g => g.items);
}
