# SafeAI.sg

Marketing site for **SafeAI.sg** — Singapore's industry-led Centre of Excellence for AI technical safety and practical governance.

`index.html` is a self-contained single-page site (inline CSS, Poppins via Google Fonts). Open it directly in a browser — no build step.

## Structure

| Path | Purpose |
|------|---------|
| `index.html` | The live single-page site |
| `SafeAIWebsite.html` | Earlier/alternate page version |
| `council-preview.html` | Standalone preview of the council section (kept in sync with `index.html`) |
| `SAFEAI_PHOTO/` | Advisory Council member headshots |
| `SafeAILogoUpdated.png`, `spark-logo-*.svg` | Brand assets |
| `*.md`, charter PDF/PPTX | Source documents; the charter deck and briefing note are linked as downloads from the site |

## Founding Advisory Council

Rendered in the `#council` section. Roles sourced from the SPARK × Veeam launch deck.

### Special Advisors
| Member | Role | Organisation |
|--------|------|--------------|
| Kelly Forbes | President & Executive Director | AI Asia Pacific Institute |
| Prof. Annie Koh | Professor Emeritus of Finance (Practice); Senior Advisor, BFI | Singapore Management University |

### Council Members
| Member | Role | Organisation |
|--------|------|--------------|
| BG Edward Chen | Chief AI Officer | NCS |
| Cheri Lim | Chief Information Security Officer | Temasek Holdings |
| Rodney Tan | Director, Cybersecurity Engineering Centre | CSA |
| Luis Carlos Cruz Huertas | Executive Director, Head of Data Platforms & AI | DBS Bank |
| Nikhil Dwarakanath | Group Head of Data & Analytics | Grab |
| Baskara Rao | Chief Technology Officer | Temasek Holdings |
| Glen Francis | CTO, APAC | Google |
| David Allott | Field CISO, APJ | Veeam Software |
| Tang Bing Wan | Chief Digital Officer, Digital Technology | JTC Corporation |

> Council members participate in a personal capacity; membership does not constitute endorsement by any member's employing organisation or regulatory body.

## Notes

- Transparent-background photos use the `.member-photo-ring` wrapper (white fill + gradient ring) so they match the others.
- Unused heavy source files (decks, spreadsheets, scratch images) are excluded via `.gitignore`.
