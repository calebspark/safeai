# SafeAI risk assessment: question expansion and Agentic AI matrix

Date: 2026-07-28
Status: approved design, ready for implementation planning
Scope: `risk-assessment.html`, `api/_engine.mjs`, new `api/classify.mjs`

## 1. Context

The SafeAI risk assessment tool at `safeai.sg/risk-assessment.html` collects six
pill-selected inputs, sends them to Claude via `POST /api/assess`, and renders a
tier (1 to 4), a needle gauge, a driver breakdown, a scenario table and a
controls checklist.

Current state:

- Six fields, all closed lists, all single-select pills: industry (7 options),
  role (6), usecase (7), autonomy (3), data (4), deploy (4).
- `api/_engine.mjs` holds the prescribed rubric. The model rates six drivers
  Low/Medium/High; the server recomputes `riskIndex` and tier from fixed weights
  and overwrites whatever the model returned.
- `sanitizeProfile()` whitelists exactly those six keys and caps each value at
  120 characters.
- No persistence. Nothing is stored between runs.

Two limits motivate this work. The closed lists are too coarse to describe real
deployments, and the tool says nothing specific about agentic AI despite IMDA
having published a dedicated framework for it in January 2026.

## 2. Goals

1. Replace the industry list with the official Singapore Standard Industrial
   Classification, and materially expand roles and use cases.
2. Let users describe something not on the list, and tell them when what they
   typed is not a valid answer.
3. Add an Agentic AI Risk Assessment Matrix grounded in the IMDA Model AI
   Governance Framework for Agentic AI.
4. Explain what the tier labels mean, not just how the number was derived.

## 3. Non-goals

- No change to the six drivers, their weights, or the tier bands. Ratings stay
  comparable to every run to date. The scoring prompt is edited in exactly one
  place, section 5.2, to restate the regulated-industry guidance in SSIC terms
  because the old category names cease to exist. That edit is required to
  preserve current behaviour, not to alter it.
- No persistence, no accounts, no analytics. That is Spec B.
- RPA and Gen AI maturity tracks are placeholders only.

## 4. Source documents

| Source | Used for | Location |
| --- | --- | --- |
| SingStat, Singapore Standard Industrial Classification 2025 | The 22 industry sections | `~/Downloads/ssic2025report.pdf`, 98 pages |
| IMDA, Model AI Governance Framework for Agentic AI v1.0 | The ten agentic risk factors (pp. 15 to 17) and the Dayos action-tiering case study (p. 18) | Joe Chiu's Drive folder, `mgf-for-agentic-ai.pdf`, 53 pages |

Approved option matrix, reviewed before implementation:
[SafeAI Risk Assessment - Question Options Matrix](https://docs.google.com/spreadsheets/d/1DbT1SlwDOrAwMWqjOiMyW455gTnhcH2w5tOB7ThOd44/edit)

## 5. Question expansion

### 5.1 Industry

Replaces the 7 pills with a searchable single-select over all 22 SSIC 2025
sections. **Stores the section letter, not the display string.** This is what
makes Spec B analytics joinable to ACRA company records.

| Code | Title |
| --- | --- |
| A | Agriculture and Fishing |
| B | Mining and Quarrying |
| C | Manufacturing |
| D | Electricity, Gas, Steam and Air-Conditioning Supply |
| E | Water Supply; Sewerage, Waste Management and Remediation Activities |
| F | Construction |
| G | Wholesale and Retail Trade |
| H | Transportation and Storage |
| I | Accommodation and Food Service Activities |
| J | Publishing, Broadcasting, and Content Production and Distribution Activities |
| K | Telecommunications, Computer Programming, Consultancy, Computing Infrastructure, and Other Information Service Activities |
| L | Financial and Insurance Activities |
| M | Real Estate Activities |
| N | Professional, Scientific and Technical Activities |
| O | Administrative and Support Service Activities |
| P | Public Administration and Defence |
| Q | Education |
| R | Health and Social Services |
| S | Arts, Sports and Recreation |
| T | Other Service Activities |
| U | Activities of Households as Employers of Domestic Personnel |
| V | Activities of Extra-Territorial Organisations and Bodies |

Taken from the official SingStat report, section headings pp. 21 to 89.

**Footgun.** SSIC 2025 split section J and shifted every subsequent letter.
Financial and Insurance is **L**, not K. Every third-party website checked
during design had this wrong because they still list SSIC 2020. Do not verify
this table against a blog. The report PDF is the only acceptable source.

A synonym table backs the search so common terms resolve: fintech and bank to L,
shipping and logistics to H, SaaS and software to K, clinic and hospital to R,
school and university to Q, F&B and restaurant to I, and so on. The synonym
table lives beside the section list and is expected to grow.

### 5.1.1 The 120-character cap will truncate section K

`sanitizeProfile()` in `api/_engine.mjs` caps every profile value at 120
characters. Section K's title is **121 characters**:

> Telecommunications, Computer Programming, Consultancy, Computing
> Infrastructure, and Other Information Service Activities

Sent as-is it is silently truncated mid-word, and K is one of the sections most
likely to be selected by this tool's audience. Two changes:

1. Send the profile as `"K - Telecommunications, Computer Programming, ..."` but
   raise the industry cap to 200 characters. The cap exists to stop prompt
   inflation; 200 is still far below anything abusive and the value is now
   drawn from a fixed list rather than free text.
2. For free-text industry entries the 120 cap stays, because those are genuinely
   user-supplied.

Add a test asserting every SSIC title survives sanitisation unmodified. This is
the kind of defect that produces a subtly wrong assessment rather than an error.

### 5.2 Regulated industry driver

`api/_engine.mjs` currently instructs the model: "Regulated industry: High =
Healthcare, Finance, Public Sector". Those names no longer exist as options.
Update the prompt to reference SSIC sections:

- High: L (Financial and Insurance), R (Health and Social Services),
  P (Public Administration and Defence)
- Medium: D, E, H, Q, and K where telecoms licensing applies
- Low: otherwise

This is a prompt clarification to preserve existing behaviour under new labels.
It is not a change to the rubric.

### 5.3 Role and use case

Both become two-level pickers: tap a group, the group's items replace the row, a
back chevron returns. One component, used twice.

Role, 30 options in three groups:

- **End users, business functions** (14): customer service / contact centre
  agent, sales representative, marketing / content practitioner, HR /
  recruitment practitioner, finance / accounting practitioner, procurement /
  supply chain practitioner, operations / production staff, administrative /
  support staff, clinician / allied health professional, educator / teaching
  staff, legal practitioner, research / R&D staff, frontline / field officer,
  customer or member of the public.
- **Builders** (8): software engineer / developer, ML engineer, data scientist,
  data engineer, MLOps / platform engineer, IT operations, security engineer /
  SOC analyst, solution architect.
- **Owners and oversight** (8): business sponsor / product owner, executive /
  C-suite, board or audit committee member, legal / compliance officer, data
  protection officer, risk manager, internal auditor, vendor / third-party
  manager.

Use case, 32 options in five groups:

- **Content and language** (9): drafting and summarisation, translation and
  localisation, marketing and creative content generation, code generation and
  completion, meeting transcription and notes, knowledge assistant / RAG over
  internal documents, conversational agent (internal), conversational agent
  (customer-facing), content moderation.
- **Analysis and prediction** (8): predictive analytics and forecasting, anomaly
  and fraud detection, recommendation and personalisation, search and ranking,
  sentiment and feedback analysis, document intelligence / data extraction,
  synthetic data generation, optimisation and scheduling.
- **Perception** (5): computer vision / image classification, video analytics and
  surveillance, speech recognition and voice, biometric identification (face,
  voice, fingerprint), medical imaging analysis.
- **Decisioning** (5): automated decision making (eligibility, approval), credit
  or risk scoring, CV screening and candidate ranking, pricing and underwriting,
  triage and prioritisation.
- **Automation and autonomy** (5): RPA (robotic process automation), agentic AI
  (tool-using, multi-step), autonomous physical systems (robotics, vehicles,
  drones), industrial control and process automation, digital twin and
  simulation.

### 5.4 Drop the dead numeric prefix

Existing `data-val` attributes carry a numeric prefix, for example
`3|Finance` and `2|Computer Vision`. Nothing reads it. `label()` strips it and
the model rates the six drivers itself. It is vestigial from an earlier
local-scoring design.

Remove the prefixes rather than inventing them for 84 new options. `label()`
keeps its split-on-pipe behaviour so any value without a pipe passes through
unchanged, which means no other call site needs touching.

## 6. Free-text validation

All three expanded fields get a "Not listed? Describe it" option. One mechanism,
used three times.

Resolution order:

1. **Fuzzy match** the input against the option list plus the synonym table. A
   confident match resolves silently. No network call, no cost. This is expected
   to cover the large majority of entries.
2. **No confident match** calls `POST /api/classify`, running Haiku 4.5, which
   returns `{ valid, mappedTo, reason }`.
3. **Invalid** renders inline beneath the field: "That does not look like an
   industry. Did you mean Financial and Insurance Activities?" with the
   suggestion tappable. The assess button stays disabled until resolved.

Valid means a real activity, occupation or AI application, even if unusual.
"Maritime bunkering" is valid and maps to H. Invalid means gibberish, an
instruction aimed at the model, or a category error such as a person's name in
the industry field.

`api/classify.mjs` mirrors the hardening already in `_engine.mjs`: a field
whitelist, a 120-character cap, string coercion, and no echo of raw user input
into the response beyond the mapped suggestion.

## 7. Up-front adoption gate

A select-all question above the profile form:

> Which of these does your organisation use? Agentic AI / RPA / Gen AI / None of these

Selecting Agentic AI shows an inline note that it adds a second short survey
after the results. The answer carries forward and pre-fills the AI Adoption
Maturity Matrix, so the same question is never asked twice.

This field does not feed the main risk score. It is routing only.

## 8. Rename

"Risk rating" becomes **"Overall AI Use Case Risk Rating"** at
`risk-assessment.html:492` (loading state) and `:585` (rendered state). The
rename exists to disambiguate it from the agentic rating introduced below.

## 9. Tier explainer

A new accordion beside the existing "How this score is computed". That one
explains how the number was derived. This one explains what the label means.

| Tier | Band | What it means |
| --- | --- | --- |
| Low | 0 to 25 | Routine, reversible, no sensitive data. Standard IT hygiene suffices. |
| Moderate | 26 to 50 | Real but bounded. Needs a named owner and documented review before go-live. |
| High | 51 to 78 | Consequential to people, money or safety. Needs compliance sign-off, documented human oversight and pre-deployment testing. |
| Severe | 79 to 100 | Potential for serious or irreversible harm. Executive approval required, and some cases should not deploy at all. |

Tier names stay **Low / Moderate / High / Severe**. "Moderate" is not renamed to
"Medium": it appears in the engine, the gauge, the checklist page and every
export produced so far.

## 10. AI Adoption Maturity Matrix

A new section rendered after the risk assessment, pre-filled from the gate.
Three cards:

- **Agentic AI**: live. Opens the matrix in section 11.
- **RPA**: work in progress placeholder.
- **Gen AI**: work in progress placeholder.

Placeholders state plainly that the track is not built yet. They do not collect
input.

## 11. Agentic AI Risk Assessment Matrix

Opens with a branch question: **Have you already deployed any AI agents?**

The two branches use different parts of the IMDA document because they answer
different questions. Pre-deployment asks whether a use case is suitable at all.
Deployed asks how much autonomy each action should be granted.

### 11.1 Pre-deployment branch: the ten factors

Source: IMDA MGF pp. 15 to 17, the two tables.

**Factors affecting impact** (severity if the risk manifests):

1. Domain and use case tolerance of error, including the number and criticality
   of business processes the agent supports.
2. Agent's access to sensitive data, increased where the agent has persistent
   memory across sessions.
3. Agent's access to external systems.
4. Scope of the agent's actions: read only versus write, and few pre-defined
   tools versus broad computer use.
5. Reversibility of the agent's actions, including downstream obligations such
   as entering a contract.

**Factors affecting likelihood** (probability of the risk manifesting):

1. Agent's level of autonomy: follows a defined SOP versus selects every step by
   its own judgement.
2. Task complexity: number of steps and depth of analysis per step.
3. Agent's access to external systems, as exposure to untrusted data.
4. Agent provided or operated by an external party, limiting visibility and
   control.
5. System complexity: single sequential agent versus multiple interacting agents
   with handoff and feedback loops.

**Access to external systems appears in both tables.** That is the framework's
own structure, not a transcription error. Ask it once, feed the answer to both
axes, and say so on screen.

Each factor is rated 1 to 5. Anchors at 1, 3 and 5 are written from the
illustrations given in the IMDA tables; 2 and 4 are intermediate. The anchors
must be shown in the UI, because an unanchored 1-to-5 scale is not reproducible
between two people rating the same system.

Scoring:

```
Impact     = round(mean of the 5 impact factors)        -> 1..5
Likelihood = round(mean of the 5 likelihood factors)    -> 1..5
Raw        = Likelihood x Impact                        -> 1..25
Needle     = (Raw - 1) / 24 * 100                       -> 0..100
```

Tier bands on Raw: **Tier 1** at 6 or below, **Tier 2** at 7 to 14, **Tier 3** at
15 or above.

### 11.2 Tier output: the autonomy ceiling

Three tiers, not four. Dayos and the IMDA case study use three, and the autonomy
ceiling has exactly three meaningful settings. Forcing a fourth to match the
main gauge would be invention layered on a government framework.

| Tier | Profile | Autonomy ceiling |
| --- | --- | --- |
| 1 | Low severity, fully reversible | Agent acts autonomously on a propose-confirm loop, no engineer in the loop. Every action emits a reasoning chain and confidence score; a reviewer audits a cross-section biweekly. |
| 2 | Moderate severity, partially reversible | Agent diagnoses and proposes using a multi-step loop, writing a diagnostic summary and proposed fix. A qualified human signs off before anything executes. |
| 3 | High severity, limited reversibility | Agent does not act. Reassess when safeguards such as multi-agent verification and real-time anomaly detection are validated in real environments. |

### 11.3 Deployed branch: Dayos action tiering

Source: IMDA MGF p. 18, the Dayos case study.

The user adds action types, one row each. Per row they answer the three Dayos
questions plus one more:

1. **Severity of impact.** If the agent gets this wrong, how bad is it? (1 to 5)
2. **Reversibility.** Can the action be undone? (1 fully reversible to 5
   irreversible)
3. **Feasibility of human oversight.** Is it realistic for a human to review this
   at each step? (1 easy to 5 infeasible)
4. **Autonomy currently granted.** Acts autonomously (3) / human signs off (2) /
   agent does not act (1).

Question 4 is our addition, not Dayos's. It is what converts the exercise from a
rating into a finding.

Per-row tier:

```
base = max(severity, reversibility)
tier = 1 if base <= 2, 2 if base == 3, 3 if base >= 4
if oversight_feasibility >= 4: tier = min(3, tier + 1)
```

Ceiling by tier: Tier 1 permits 3, Tier 2 permits 2, Tier 3 permits 1. A row
where granted autonomy exceeds its ceiling is a **governance gap**.

```
Needle = count(rows with a gap) / count(rows) * 100
```

Zero means fully governed. The result lists the offending rows with the specific
correction, for example: "Production deployment is Tier 3 but runs autonomously.
Tier 3 actions should not be agent-executed."

Alongside the needle, show the tier distribution as percentages, the way Dayos
reports 60 / 30 / 10.

### 11.4 Robustness note

Both branches score deterministically in the browser. No Anthropic call, so the
agentic matrix keeps working when the API key is missing or upstream is down.
Worth preserving: it makes the section demo-safe.

## 12. State and data flow

`state` gains: `adoption` (array), `agenticDeployed` (boolean or null),
`agenticFactors` (object of 10 ratings), `agenticActions` (array of row objects).

None of these are sent to `/api/assess`. The main assessment payload is
unchanged apart from industry now carrying an SSIC code. This keeps the existing
server contract stable and means the agentic matrix cannot perturb the main
score.

## 13. Error handling

- `/api/classify` unreachable: fall back to accepting the free text as typed,
  with a quiet inline note that it could not be verified. Never block the
  assessment on a validation service being down.
- `/api/classify` returns invalid: block submission for that field only, with the
  suggestion tappable.
- Agentic matrix with zero action rows in the deployed branch: show an empty
  state, no needle, no division by zero.
- Existing `/api/assess` error paths are untouched.

## 14. Testing

- Fuzzy matcher: a table of inputs to expected sections, including the synonym
  set and near misses.
- SSIC list: assert 22 entries, letters A to V contiguous, and that L is
  Financial and Insurance. This is the regression guard for the 2020 letter map.
- Scoring maths: pre-deployment tier boundaries at Raw 6/7 and 14/15;
  deployed-branch tier rules including the oversight bump and the cap at 3.
- Governance gap: a row granted more autonomy than its ceiling is flagged; a row
  at or below its ceiling is not.
- Prefix removal: `label()` still returns the correct string for values with and
  without a pipe.
- Main assessment: an unchanged profile produces the same tier as before the
  change.

## 15. Implementation notes

- `risk-assessment.html` is already about 52KB in one file. This spec adds a
  searchable select, a two-level picker, a 10-factor form, a repeater table and
  a second gauge. Extract the option data and the agentic scoring into separate
  files rather than growing the single file further.
- The needle gauge (`gaugeSVG`) is written for four bands. Parameterise the band
  arcs so the agentic gauge can render three without a forked copy.

## 16. Open items

1. Upload `~/Downloads/ssic2025report.pdf` to Joe Chiu's Drive folder. It is
   1.7MB, too large to inline through the Drive API, so it needs a manual drag.
2. Write the 1/3/5 anchor text for each of the ten IMDA factors. Draft from the
   illustration column of the source tables, then have Joe review, since these
   anchors determine reproducibility between raters.

## 17. Deferred to Spec B

Persistence, user accounts, saved assessment history, and internal analytics on
AI usage. Power BI and Tableau to be evaluated against a hand-built dashboard as
the analytics surface. Once assessments are saved, the natural follow-on is
letting a deployed user return and work through their action catalogue over
time, which is the use case the Dayos branch is really built for.
