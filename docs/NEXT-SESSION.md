# SafeAI, next session

Last session: 2026-07-30. Everything below is outstanding. Nothing here blocks
the live site, which is healthy.

## 0. Preview lockdown, revert when the assessment is "validated"

Done 2026-07-30 (`b26a85d`) at David's request. When David or Joe declare the
assessment validated, undo all three:

- [ ] `index.html`: restore the hero "Know my AI Risk" button and the two
      Resources card links. Both originals sit in HTML comments marked
      "Restore"; delete the "Coming soon" spans next to them.
- [ ] Remove the password gate block (style + `#gate` div + script) sitting
      right after `<body>` in `risk-assessment.html` and `checklist.html`.
      Until then the password is `safeai2026`; to rotate it, replace
      `GATE_HASH` in both files with `printf 'newpass' | shasum -a 256`.
      Client-side only, it deters casual visitors, it is not security.

Context: spec `docs/superpowers/specs/2026-07-28-safeai-questions-and-agentic-matrix-design.md`,
plan `docs/superpowers/plans/2026-07-28-safeai-questions-and-agentic-matrix.md`.
Both fully implemented and deployed as of `15e229e`.

## 1. Caleb only, cannot be done from here

- [ ] **Vercel Firewall rate-limit rule on `/api/*`**, in the **calebspark**
      project (the one whose Domains list shows `safeai.sg`, not c-lb). This is
      the loudest item. `/api/assess` is unauthenticated, has no limiter at
      all, and calls Sonnet at `max_tokens: 5000`, so it is an open
      wallet-drain. `/api/classify` has a per-instance per-IP bucket, which
      only blunts a single-source flood.
- [x] **Upload `~/Downloads/ssic2025report.pdf`** to Joe Chiu's Drive folder.
      Done, confirmed 2026-07-31.
- [x] **Joe to review the 1/3/5 anchor text** on the ten IMDA agentic factors
      in `assets/agentic.mjs`. Done, confirmed 2026-07-31.

## 2. Decisions waiting on you

- [ ] **Recreate the `safeai-sg` Vercel project?** It was deleted this session.
      It had no Git connection and no env vars in settings, but its frozen
      deployment still held a working Anthropic key and was answering requests,
      so it was a live spend hole. Deleting closed it. Nothing functional was
      lost; recreating is about a minute if you want the fallback back.
- [ ] **Verify the tier thresholds and control mappings with David.** Carried
      over from earlier sessions, still open.

## 3. Spec B, parked and ready to brainstorm

Backend for the risk tool. Scoped but not designed.

- Users can see their own past assessments.
- Internal analytics on how the tool is being used and what AI usage it reveals.
- **Evaluate Power BI and Tableau** as the analytics surface, against a
  hand-built dashboard. Caleb raised this specifically.
- Natural follow-on once assessments persist: let a deployed user return and
  work through their agentic action catalogue over time, which is the use case
  the Dayos branch is really built for.
- Storing free-text entries also gives a backlog of what to add to the fixed
  option lists, and the SSIC section code makes the data joinable to ACRA
  company records.

## 4. Known gaps, not urgent

- **RPA and Gen AI maturity tracks are inert placeholders.** Only the Agentic
  AI track is live.
- **No alerting path.** Classify failures and rate-limit trips are logged as
  structured JSON, but nothing reaches a human. A Vercel log drain alert would
  close item 10 of the gandalf checklist.
- **The commit message on `15e229e` is missing a word** where zsh ate a
  backticked `detail`. Cosmetic, already pushed, not worth a force-push.

## Footguns worth re-reading before touching this repo

- **SSIC 2025 shifted the letters.** Financial and Insurance is **L**, not K.
  Section J split and everything after moved. Every third-party site still
  lists SSIC 2020 and is wrong. Only the official SingStat report is
  trustworthy. A test pins this.
- **No `package.json`, deliberately.** Adding one risks Vercel switching this
  static site to a build pipeline. Run tests with
  `node --test "tests/*.test.mjs"`; the bare `tests/` directory form resolves
  as a module path and fails.
- **Deleting a Vercel env var does not revoke it from deployments already
  built.** The value is captured at build time. Remove the deployment or
  redeploy to actually revoke.
- **`vercel remove <projectName>` deletes the project**, not just deployments.
  Pass deployment URLs to scope it to deployments.
- **Two Vercel accounts.** `safeai.sg` lives in **calebspark**, which is not
  authenticated locally. The c-lb CLI cannot see or change it.
