# SafeAI.sg Advisory Council Charter Deck
**SPARK by CIO Academy Asia**
*Securing Singapore's AI Future · Innovating for Global Competitiveness*
*Centre of Excellence · Punggol Digital District · Singapore · Version 1.0 · 2026*
*Grounded in Proportionality · Practicality · Independence*

---

## Slide 1 — Title

**SafeAI.sg**
Advisory Council Charter

SPARK by CIO Academy Asia
Centre of Excellence · Punggol Digital District · Singapore · Version 1.0 · 2026
Grounded in Proportionality · Practicality · Independence

---

## Slide 2 — Preamble: The Governance Imperative

The AI deployment landscape presents two equally dangerous failure modes:

**UNDER-GOVERNED — AI Deployed Without Guardrails**
Enterprises adopt AI in ways that expose customers, staff, and society to avoidable harm — without adequate technical controls or accountability.

**OVER-GOVERNED — Innovation Paralysed by Compliance**
Blanket compliance processes designed for high-stakes scenarios are applied to low-risk tools — creating friction that stalls innovation and drives AI initiatives underground.

> SafeAI.sg is established to close this gap — Singapore's industry-led Centre of Excellence for AI technical safety and practical governance, enabling confident AI deployment at the appropriate level of rigour.

---

## Slide 3 — Mission & Three Delivery Pillars

**Mission Statement:**
SafeAI.sg exists to make AI deployment safer, more confident, and more economically rational — providing a risk-weighted governance framework, curated technical controls, and a trusted practitioner community that enables Singapore enterprises, agencies, and technology teams to deploy AI with confidence at the right level of rigour.

### Pillar 01 — Open Risk Assessment Toolkit & UARS Standard
*FREE · OPEN · SELF-SERVICE*

A practitioner-validated, self-service scoring toolkit — freely accessible online, no registration required. Any Singapore organisation applies the UARS to determine the right governance tier for any AI use case in under 30 minutes.

### Pillar 02 — Technology Associate & Showcase Programme
*DEMONSTRATE · NOT ENDORSE*

Technology companies demonstrate how AI governance controls work in real production environments — through reference architectures, case studies, and community events. SafeAI.sg does not endorse, certify, or validate any Associate technology.

### Pillar 03 — Professional Certification & Skills Development
*LEVEL 0 → LEVEL 3*

Co-developed with NUS, NTU, SMU, and SIT. Four certification levels from career conversion (Level 0) through to Chief Architect (Level 3) — aligned to SkillsFuture frameworks and the UARS methodology.

> These three pillars address the full AI governance lifecycle — from scoring risk, to showcasing tooling, to building the skilled workforce to sustain it.

---

## Slide 4 — Target Community & Stakeholders

**Enterprise CIOs & CTOs**
Must make proportionate governance decisions for AI initiatives across multiple business units — enabling more initiatives to reach production rather than stalling in committees.

**CISOs & Security Leaders**
Extending governance beyond classical cybersecurity to address new attack surfaces: AI agents, multi-agent systems, generative AI infrastructure, and autonomous workflows.

**AI Engineering & MLOps**
Technical practitioners who implement AI systems and need concrete, implementable control specifications, reference architectures, and testing methodologies.

**Risk & Compliance Teams**
Developing AI-specific risk appetite statements, audit frameworks, and board reporting with a structured risk vocabulary connecting AI risk to enterprise risk management.

**Institutional Partners:** IMDA · GovTech · CSA · MAS · AI Singapore · NUS · NTU · SMU · International AI Safety Bodies

---

## Slide 5 — SafeAI.sg at Punggol Digital District

### Location Advantage
- **Cyber Security Agency (CSA):** Next-door co-location enables real-time threat intelligence sharing and joint red-teaming cadence.
- **GovTech & IMDA proximity:** Rapid co-innovation on sovereign AI use cases aligned to NAIS 2.0.

### SPARK × JTC Synergy
- **Mutual community activation:** SPARK's 16,000+ CIOs/CTOs cross-pollinate with JTC's PDD enterprise and start-up ecosystem.
- **Neutral convening ground:** JTC's mandate and SPARK's independence create a trusted, non-commercial platform for frank industry dialogue.

### Singapore's AI Asset
- **Unique global positioning:** The only country with an industry-led CoE dedicated to helping companies adopt best-in-class AI with robust governance built in.
- **JTC's FDI attraction mandate:** SafeAI.sg gives overseas AI innovators a trusted, governed entry point into Singapore and ASEAN.

### Industry Intelligence Loop · Shaping Singapore's AI Operating Landscape
**Community Engagement** → **Insight Synthesis** → **Agency Briefings** → **Landscape Shifts**

CIOs & CISOs share real adoption challenges → Advisory Council distils into policy briefs → Findings surfaced to IMDA, CSA, MAS & EDB → Clearer compliance pathways, sandbox access & regulatory safe harbours

---

## Slide 6 — Universal AI Use-Case Risk Score (UARS)

*FREE · OPEN · SELF-SERVICE*

A lightweight, five-dimension scoring instrument. Applied in under 30 minutes. No consultants, no registration, no cost — published as an open standard for any Singapore organisation to use freely.

**Scoring Formula:** UARS = (A × 2) + (B × 2) + (C × 1.5) + (D × 1.5) + (E × 1) | Score Range: 7 – 21

### Five Dimensions

| Dimension | Weight | Description |
|---|---|---|
| **A — Autonomy** | ×2 | Degree of independent decision-making and action without human intervention |
| **B — Data Sensitivity** | ×2 | Classification of data accessed: public, internal, regulated, or PII/financial |
| **C — Attack Surface** | ×1.5 | Exposure scope: fully internal through to internet-facing multi-agent mesh |
| **D — Consequentiality** | ×1.5 | Reversibility and impact of agent actions: read-only to irreversible external |
| **E — Error Tolerance** | ×1 | Domain tolerance for incorrect outputs: high tolerance to zero-tolerance critical |

---

## Slide 7 — Risk Bands & Governance Tiers

### Tier 1 — Standard AI Governance (UARS 7–10)

**Applies to:** Limited autonomy · Read-only tools · Non-regulated data · Internal attack surface

**Mandatory Controls:**
- LLM Guardrails & Output Filtering
- Agent Identity & Access Baseline
- Prompt injection defences + output classifiers
- Policy-as-Code Review (Monthly)

### Tier 2 — Agentic Governance (UARS 11–15)

**Applies to:** Meaningful autonomy · Internal writes · Business-sensitive data · Internal APIs

**Mandatory Controls:**
- Human-in-the-Loop (HITL) Checkpoint Architecture
- MCP Allowlisting & Tool Scope Enforcement
- Least-privilege tooling per agent role
- Agentic Workflow Threat Model (Per Use Case)

### Tier 3 — Full AI Safety Stack (UARS 16–21)

**Applies to:** Fully autonomous · Irreversible external actions · Regulated/PII data · Internet-facing

**Mandatory Controls:**
- AI-SPM & Generative AI Firewall (GAF)
- Agentic Control Plane with Circuit Breakers
- Pre-Deployment Safety Case + Simulation Testing
- Monthly Continuous Red-Team + Incident Playbook

> UARS is a living score, not a one-time compliance gate — re-score when use-case parameters change.

---

## Slide 8 — Policy-as-Code Principle

*Eliminating governance drift: the gap between documented policy and implemented control.*

**Governance Policy Defined** → **Encoded as Versioned Artefacts** → **Deployed via CI/CD Pipeline** → **Auto-Propagation on Update**

1. Guardrail rules, tool permissions, HITL checkpoints, and monitoring thresholds set for each use case.
2. Machine-readable policy artefacts deployed through a centralised policy engine.
3. Policies automatically applied to all systems within the AI use case's operational scope.
4. When policy updates, all affected systems re-validate automatically — no manual re-configuration.

> Any system that the AI use case touches inherits the relevant controls on deployment — automatically, consistently, without manual re-configuration.

---

## Slide 9 — Advisory Council Structure

| Domain | Description |
|---|---|
| **Government & Public Policy** | Representatives from IMDA, GovTech, and digital economy bodies |
| **Cybersecurity & National Security** | Practitioners from CSA providing security expertise and threat intelligence |
| **Financial Services & Regulated Industries** | Senior practitioners from the most demanding compliance environments |
| **Academic & Research Institutions** | AI safety researchers from AI Singapore, NUS, NTU, and SMU |
| **Enterprise Technology Leadership** | Sitting CIOs, CTOs, and CISOs from large Singapore enterprises |
| **International Partnerships** | Representatives from peer AI safety bodies in UK, US, and Asia-Pacific |

**Meeting Cadence:** Minimum twice per year · **Independence:** Non-regulatory · Non-endorsing · Non-certifying

---

## Slide 10 — Founding Advisory Council (14 Confirmed Members)

| Member | Organisation | Role |
|---|---|---|
| BG Edward Chen | CSA | Deputy CE |
| Lee Wan Sie | IMDA | Cluster Director |
| David Tan | JTC | Asst Chief Executive |
| Prof. Simon Chesterman | AI Singapore | Senior Director |
| Prof. Lam Kwok Yan | AISI | Executive Director |
| Prof. Mohan Kankanhalli | NUS AI Institute | Director |
| Dr. Adrian Tang | CSIT / DDH | Group Director |
| Cheri Lim | Temasek | CISO |
| Luis Carlos Cruz | DBS Bank | Executive Director |
| Baskara Rao | Temasek | Senior Leader |
| Glen Francis | Google | APAC Leader |
| Nikhil D | Grab | Senior Leader |
| David Allott | Veeam | Field CISO APJ |
| Dr. Lua Rui Ping | MDDI | Director |

*Additional seats reserved for: APAC CTO (Fortinet) · APAC CTO (F5) · Senior Leader (GovTech) · Snowflake representative*

---

## Slide 11 — Advisory Council Responsibilities

1. **Strategic Direction** — Provide strategic direction for SafeAI.sg's research agenda, framework development priorities, and community programmes.
2. **Framework Review** — Review and provide substantive feedback on UARS methodology, risk band calibration, and control set recommendations at least annually.
3. **Emerging Risk Identification** — Identify emerging AI risk domains, new use case categories, and governance gaps for the SafeAI.sg framework to address.
4. **Sector Promotion** — Promote SafeAI.sg frameworks within respective organisations and sectors; encourage contribution of real-world case studies.
5. **Executive Sounding Board** — Serve as a sounding board for SPARK on SafeAI.sg strategy, partnerships, and programme development.
6. **Maintain Independence** — Uphold the non-regulatory, non-endorsement principles; flag any actual or potential conflicts of interest.

> The Advisory Council is a governance and direction-setting body — it does not approve, endorse, certify, or regulate.

---

## Slide 12 — Operating Principles

| Principle | Description |
|---|---|
| **Proportionality** | Governance commensurate with risk. No AI use case bears more governance friction than its actual exposure warrants. |
| **Practicality** | Every output designed for operational implementation by a working technology team — not merely for policy documentation. |
| **Independence** | SafeAI.sg does not regulate, certify, or endorse. Credibility rests on quality of analysis and trust of community. |
| **Inclusivity** | Frameworks accessible to mid-market enterprises, public agencies, and technology teams of all sizes. |
| **Continuous Improvement** | Committed to a continuous update cycle for UARS, control recommendations, and the tool reference library. |
| **Transparency** | Methodology, framework development process, and risk band calibrations publicly documented and open to challenge. |

---

## Slide 13 — Tool & Technology Reference Programme

A curated reference library across seven capability domains — open-source and commercial tools evaluated for each governance tier.

| Domain | Description |
|---|---|
| **01 Agentic Identity & Access Control** | Per-agent identity, dynamic permission scoping, A2A protocol, OAuth 2.0 for MCP |
| **02 Generative AI Firewalls & Semantic Runtime Controls** | Semantic intent classification, jailbreak detection, PII redaction, egress filtering |
| **03 AI Security Posture Management (AI-SPM)** | Continuous model inventory, shadow AI discovery, supply chain risk, configuration drift |
| **04 Agentic Workflow Observability** | Step-level tracing of agent reasoning, plan execution, tool calls, and memory operations |
| **05 DSPM for AI & Vector Store Security** | Vector database governance, RAG pipeline flows, embedding provenance, PDPA / MAS TRM alignment |
| **06 Policy-as-Code Engines** | Versioned machine-readable policies via OPA, auto-propagation across systems |
| **07 Red-Team & Adversarial Testing Frameworks** | Prompt injection, multi-agent cascading failure, safety case construction, MITRE ATLAS alignment |

---

## Slide 14 — Technology Associate & Showcase Programme

*A demonstration environment — not an endorsement scheme.*

Technology companies show how governance controls work in real production environments. The question answered: does this product credibly address Governance Challenge Y for an organisation deploying AI at Risk Band Z?

| Activity | Description |
|---|---|
| **Reference Architecture Demos** | Document how their product implements Tier 1/2/3 governance controls, mapped to specific UARS dimensions |
| **Case Study Publications** | Contribute anonymised or attributed case studies of real deployments addressing specific governance challenges |
| **Community Knowledge Sharing** | Participate as practitioners in SafeAI.sg roundtables and workshops |
| **Advisory Contributions** | Contribute technical expertise to framework development processes (subject to conflict-of-interest declarations) |

> **Non-Endorsement Boundary:** SafeAI.sg does not test, validate, certify, or endorse any Associate technology for any regulatory requirement. Associate status does not imply compliance or certification. Organisations remain solely responsible for their own due diligence and procurement decisions.

---

## Slide 15 — Professional Certification & Skills Development

*Co-developed with: NUS · NTU · SMU · SIT | Eligible for SkillsFuture Enterprise Credit (SFEC) and CET funding*

| Level | Title | Audience | Covers |
|---|---|---|---|
| **Level 0** — Career Conversion | Career Conversion Certification | Non-technical professionals transitioning into AI governance, risk, and compliance roles | AI fundamentals & risk literacy, UARS framework orientation, Governance process basics |
| **Level 1** — Practitioner | SafeAI User & Citizen Builder | Business users, project managers, and citizen developers | Applying UARS self-service toolkit, Tier 1 governance controls, Responsible AI usage patterns |
| **Level 2** — Engineer | SafeAI Certified Engineer | AI/ML engineers, MLOps specialists, and solution architects | Full UARS scoring methodology, Tiers 1–3 technical controls, Policy-as-code implementation |
| **Level 3** — Chief Architect | SafeAI Certified Chief Architect | Senior AI architects, CISOs, and governance leads | Enterprise AI safety architecture, Full AI safety stack design, Advisory & organisational governance |

*All levels include a structured continuing education requirement to maintain certification currency.*

---

## Slide 16 — Singapore's Ecosystem Partner of Choice

**Strategic Partners:** EDB (Economic Development Board) · JTC Corporation · IMDA

| Role | Description |
|---|---|
| **Ecosystem Showcase & FDI Enablement** | SafeAI.sg serves as a live demonstration that Singapore possesses the governance infrastructure, skilled practitioners, and knowledge networks needed to support the full AI deployment lifecycle. |
| **Regulatory Feedback Loop** | SafeAI.sg provides a structured channel for ground-level practitioner intelligence to flow to agencies and regulatory bodies — a knowledge function, not a lobbying function. |
| **Pilot Stress-Testing & Deployment Readiness** | Structured peer-review engagements where Singapore's senior AI governance practitioners stress-test company AI pilots and full-stack deployments against the UARS framework. |

*Only country with an industry-led CoE dedicated to AI adoption with governance built in.*

---

## Slide 17 — Charter Administration

| Item | Detail |
|---|---|
| **Annual Charter Review** | Reviewed by the Advisory Council at minimum annually and updated to reflect material changes. |
| **Amendment Process** | Proposed by executive team or any Council member. Circulated 30 days before formal meeting; requires majority agreement. |
| **Effective Date** | Takes effect upon adoption by the founding Advisory Council and remains in force until superseded. |

SafeAI.sg · SPARK by CIO Academy Asia · Punggol Digital District · Singapore
david@wahspark.com · safeai.sg
