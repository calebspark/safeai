# SafeAI, next session

State as of **2026-08-06**. The live site is healthy. Nothing below blocks it.

Deploy is `git push` to main; safeai.sg auto-deploys within about a minute from
the **calebspark** Vercel account. Do not use the local `vercel` CLI: its
`.vercel/project.json` still points at `safeai-sg`, deleted 2026-07-28.

Tests: `node --test "tests/*.test.mjs"` (124 passing).

## Where the risk tool stands

`risk-assessment.html` behind a preview password (`safeai2026`), plus
`assets/*.mjs` for the data and local scoring, `api/` for the two serverless
endpoints, `tests/` for the headless tests.

- **Profile → overall risk rating.** Eight scored questions, rated by Claude
  against fixed anchors; the server recomputes the index and tier from the
  driver ratings and overrides the model. `/api/assess`.
- **Gen AI Governance Readiness** (2026-08-05). Eleven questions, one per
  principle of the IMDA and AI Verify Foundation testing framework, answered
  Yes, Partially done, No, or Not applicable. Not applicable is excluded from
  the denominator, and an all-N/A set scores nothing rather than zero.
  `assets/genai.mjs`, `tests/genai.test.mjs`. Scores in the browser.
- **Agentic AI Risk Assessment Matrix.** Pre-deployment factor tables, or the
  Dayos action tiering for anyone already deployed. `assets/agentic.mjs`.
- Both tracks open as their own page and keep their answers. Every result view
  carries the same four actions: copy summary, copy as CSV, download the PDF
  report, start over. Everything survives a reload; only Reset or Start over
  clears it.

**Changed 2026-08-06, David's asks**

- **The profile form is one column at every width.** Two columns made the eye
  jump between a question and its option row.
- **One use case at a time.** The "Not listed" box on the use case picker stops
  on an entry holding more than one (comma, slash, "and" and similar), offers
  the first, and keeps a "Keep it as one" escape for phrases that only look
  like two, such as "search and rescue". `MULTI_SPLIT`, `splitEntries`,
  `warnMultiple`. Scoped to the use case picker only.
- **Typed answers read "Your entry "x" is matched with "y"."** One `matchNote`
  for the local fuzzy path and the `/api/classify` path, in both the industry
  combo and the group pickers. It used to say "Read as y" in two places and
  "Matched to y" in the other two, and never quoted back what was typed.
- **The data source question asks for the source holding the most sensitive
  data**, not the one read most often.
- **"Where the weights come from"** sits under "How this score is computed": a
  reason per driver, plus the 65 / 35 split between the three primary drivers
  and the four secondary ones. The numbers are read off the response, not
  retyped, so a re-weighting in `api/_engine.mjs` cannot leave it quoting a
  dead figure. **The prose is not sourced from any document**: it is now the
  public explanation of the calibration. Approved by Caleb 2026-08-06.
- **The visitor can set the driver ratings themselves.** "Edit these ratings" on
  the rating card opens a slider per driver. Moving one previews the index and
  tier only; committing goes back through `/api/assess` with the chosen levels
  so the rationale, scenarios and controls are rewritten together. Only changed
  ratings are sent. `sanitizeOverrides` whitelists both the seven labels and the
  three levels, the levels are given to the model so the narrative is written
  against them, and forced back over the response before scoring.
  `tests/engine-overrides.test.mjs`. Overridden drivers come back `userSet`, and
  the tile, the derivation table and all three exports say so.
- **Both tracks now say why, and what to do first.** Gen AI readiness explains
  the band in the reader's own numbers (the arithmetic, the distance to the next
  band, the not-applicable note) and orders the gaps by exposure, each with the
  reason for its rank and one concrete first step. `PRIORITY` and `urgencyOf` in
  `assets/genai.mjs`, `explainReadiness` for the band. The agentic
  pre-deployment result explains the tier, names which factors a team can
  actually lower and which come with the use case, and says what the tier would
  be if every changeable factor came down to a 3. `FACTOR_ACTIONS` and
  `explainPredeployment` in `assets/agentic.mjs`. The Dayos branch orders gaps
  by how far past the ceiling they run and names the exact change.
  `tests/explanations.test.mjs`. **The rankings and the lever/floor split are
  SafeAI's, not IMDA's or the AI Verify framework's, and both pages say so.**
- **"Print / PDF" is now "Download PDF report".** It builds a separate report
  document (white page, black wordmark, profile table, every disclosure
  expanded, no controls) in a hidden iframe and prints that, rather than
  printing the dark page with its accordions shut. It clones the live result
  cards, so the tracks print through the same path. `safeai-logo-print.png` is
  the wordmark recoloured for paper.

**Changed 2026-08-05, David's asks**

- The adoption gate offers Agentic AI, Gen AI, and "Both are applicable", which
  is a shortcut that stores the same two values. "None of these" is gone.
- **Gen AI on its own caps agent capability at Level 2.** Levels 3 to 5 are
  hidden with a note, and a stored answer above the cap is cleared. Selecting
  Agentic AI restores them. `applyCapabilityLimit` and `scaleField.limitTo`.
- **The governance and risk tier question is gone.** Asking the visitor for the
  severity tier was asking them for the answer the tool exists to produce, so
  the model now judges severity from the use case, autonomy and capability.
  `GOVERNANCE` is removed from `assets/options.mjs` and `governance` from
  `PROFILE_FIELDS`. `SAVE_VERSION` is 2.
- **Every question carries a serial number**, on the profile, the agentic
  factors and the Gen AI principles, and the numbers go into the CSV export.
  Result sections are lettered A, B, C; scenario rows and control categories are
  numbered; the footer sources are numbered by a CSS counter.

**Neither track feeds the overall risk rating, on purpose.** Readiness and
inherent risk are different measures, and mixing them would let good paperwork
lower a genuinely risky score.

## 1. Caleb only, cannot be done from here

- [ ] **Vercel Firewall rate-limit rule on `/api/*`** in the **calebspark**
      project (the one whose Domains list shows `safeai.sg`). The loudest open
      item: `/api/assess` is unauthenticated, has no limiter, and calls Sonnet
      at `max_tokens: 5000`, so it is an open wallet drain. `/api/classify` has
      a per-instance per-IP bucket, which only blunts a single-source flood.

## 2. Waiting on David

- [x] **Scale wording: settled 2026-08-05, "implemented" stays.** The original
      ask was "compiled"; David confirmed the shipped wording is fine. Closed,
      do not reopen.
- [ ] **Verify the tier thresholds and control mappings.** Carried over from
      earlier sessions.
- [x] **Weight rationale: approved by Caleb 2026-08-06.** The prose under
      "How this score is computed" is SafeAI's, not lifted from a source
      document. Approved as written. Same applies to the two orderings added
      the same day (Gen AI principle exposure ranks, agentic factor levers):
      both say on the page that they are SafeAI's and not the framework's.
- [ ] **Declare the assessment validated**, which triggers the revert below.

## 3. Preview lockdown, revert on validation

Done 2026-07-30 (`b26a85d`) at David's request. When validated, undo both:

- [ ] `index.html`: restore the hero "Know my AI Risk" button and the two
      Resources card links. Originals sit in HTML comments marked "Restore";
      delete the "Coming soon" spans beside them.
- [ ] Remove the password gate (style + `#gate` div + script) after `<body>` in
      `risk-assessment.html` and `checklist.html`. To rotate instead, replace
      `GATE_HASH` in **both** files with `printf 'newpass' | shasum -a 256`.
      Client-side only: it deters casual visitors, it is not security.

## 4. Parked: Spec B, the backend

Scoped, not designed. Users see their own past assessments; internal analytics
on usage and on what AI adoption it reveals; **evaluate Power BI and Tableau**
against a hand-built dashboard (Caleb raised this). Persisting assessments is
what makes the Dayos branch genuinely useful, since an operator can work
through their action catalogue over time. Stored free text also becomes a
backlog of options to add, and the SSIC code makes the data joinable to ACRA
company records.

## 5. Known gaps, not urgent

- **RPA is gone** (2026-08-05, David's call: automation, not AI, and low risk
  for the organisations running it). Removed from the adoption gate, the
  maturity tracks, the comparison table and the use case list. Do not put it
  back without asking.
- **No alerting path.** Classify failures and rate-limit trips are logged as
  structured JSON, but nothing reaches a human. A Vercel log drain alert would
  close item 10 of the gandalf checklist.
- **Session data is per tab.** The reload-survival record lives in
  sessionStorage, so it is gone when the tab closes. That is deliberate: a
  shared machine should not hand the next person someone else's risk profile.

## Footguns worth re-reading before touching this repo

**Repo and deploy**

- **No `package.json`, deliberately.** Adding one risks Vercel switching this
  static site to a build pipeline. Run tests with `node --test "tests/*.test.mjs"`;
  the bare `tests/` form resolves as a module path and fails.
- **Deleting a Vercel env var does not revoke it** from deployments already
  built; the value was captured at build time. Remove the deployment or redeploy.
- **`vercel remove <projectName>` deletes the project**, not just deployments.
- **Two Vercel accounts.** `safeai.sg` lives in **calebspark**, not
  authenticated locally, so the c-lb CLI cannot see or change it.
- **imda.gov.sg returns 200 for unknown routes**, so a status check does not
  prove a link is real. Check the content, or link a PDF where the content type
  is proof.

**Data**

- **SSIC 2025 shifted the letters.** Financial and Insurance is **L**, not K.
  Section J split and everything after moved. Third-party sites still list SSIC
  2020 and are wrong; only the official SingStat report is trustworthy. A test
  pins this.
- **`SAVE_VERSION` in `risk-assessment.html` guards the saved session shape.**
  `KEYS` has changed before, and a stale save from an older build restores a
  half-empty profile that looks complete. Bump it whenever the saved shape or
  `KEYS` changes.
- **A restore replays through the same commit path a click uses**, so it fires
  `onFieldChanged`, so it would save mid-restore and erase the result from the
  record being restored. Writes are held by the `restoring` flag.

**UI**

- **The bare `nav` selector styles the sticky top bar** (flex, sticky, 104px).
  Any other `<nav>` on the page gets swallowed by it. Use a `<section>`.
- **`html` carries `scroll-behavior: smooth`**, so `scrollTo` with behavior
  "auto" animates rather than jumps, and a jump issued during another scroll
  loses. Use "instant", and repeat on the next frame when the document has just
  got shorter.
- **`table.risk` has `min-width: 680px`** and nowrap on the last column, which
  pushes narrow tables off a phone. The `gtable` modifier opts out of both.
- **Edit curls straight quotes in this HTML** and can break class attributes.
  Grep-guard after bulk edits.
- **Never paste a line-counted extraction between the two gated pages.** That is
  how an unclosed `<nav>` once swallowed the whole checklist page.
