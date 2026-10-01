# Setuvia Design System - "Paper & Ink"

Feel: a well-edited operations tool for healthcare/finance teams. Warm paper, ink-dark text, one muted teal-green accent, clay as a sparing secondary, hairline borders, dense readable tables. Must look designed by a human product team.

## 1. Colour (use tokens in `design/tokens.css`; never hard-code hex in components)
| Role | Token | Hex | Use |
|---|---|---|---|
| App background | paper | #F5F2EC | page background |
| Card / table | surface | #FFFFFF | cards, tables, inputs |
| Sidebar / table header | surface-alt | #EFEBE3 | nav, headers, AI chip bg |
| Border | line / line-strong | #DDD7CB / #C4BCAC | all borders (1px) |
| Text | ink / muted / faint | #1E2326 / #5B6368 / #8A9094 | primary / secondary / captions |
| Accent | accent / hover / soft | #1F5C57 / #184A46 / #DCE9E6 | primary buttons, links, selected rows |
| Secondary | clay / soft | #A8552F / #F1DFD5 | highlights, one chart series, rare emphasis |
| Success | success | #3D7A55 | resolved |
| Warning | warning | #A87414 | potential issue, inferred |
| Danger | danger | #9C3A33 | high-priority/overdue |
| Info | info | #3A587A | observed, email |
Channels: WhatsApp bubble tint #D9E6D8, Email #DCE5EF, Web #EAE3D3 (muted - never brand neon green).
Charts (in order): #1F5C57, #A8552F, #3A587A, #A87414, #6D6A5E, #7A9A8E.
Rules: text contrast >= 4.5:1; never show status by colour alone (icon + label); no gradients anywhere; max 1 accent colour per view plus semantic colours.

## 2. Typography (free Google Fonts)
- Display: **Newsreader** 500/600 - page titles, landing headline, insight titles.
- UI: **Public Sans** 400/500/600 - everything else.
- Data: **IBM Plex Mono** 400/500 - case IDs, bill numbers, timestamps; `tabular-nums` for all money.
- Devanagari: **Noto Sans Devanagari** / **Noto Serif Devanagari** as fallbacks (Hindi/Marathi). Verify the rupee sign renders in every stack.
- Scale (px): 12, 13, 14 (base UI), 16, 20, 24, 32, 44. Body line-height 1.5, headings 1.2. Sentence case. Letter-spacing -0.01em on display only.
- Never use: Inter, Space Grotesk, Orbitron, Poppins, gradient text.

## 3. Shape, spacing, motion
- Radius 6px (controls) / 8px (cards, modals). Borders not shadows; one popover shadow only.
- 8px grid. Table row 40px. Page padding 24px (desktop), 16px (mobile).
- Motion 120-200ms ease on hover/expand only. No parallax, blobs, glow, glassmorphism, animated gradients.
- Icons: Lucide, stroke 1.5, 16-20px, used sparingly. No sparkle/robot icons.

## 4. "Not AI-looking" checklist
- Asymmetric editorial landing; no identical 3-icon-card row; no centered-hero-with-blob.
- Visuals = own SVG diagram + real product panels.
- Copy is plain and specific ("Billing team is reviewing 4 items"), never "supercharge/revolutionize/unlock".
- AI output always carries the chip `AI-generated - review before sending` (muted, small).
- Designed empty, loading (skeleton) and error states.

## 5. Information tags (core to trust)
| Tag | Colours | Meaning |
|---|---|---|
| Observed | info-soft / info | computed from data |
| Inferred | warning-soft / warning | AI hypothesis |
| Recommended | accent-soft / accent | suggested action |
| Evidence: High / Medium / Low | danger-soft, warning-soft, surface-alt | rule-proven / tariff mismatch / LLM-only |
| Simulated | surface-alt / ink-muted, dashed border | demo channels and fixtures |

## 6. Component specs
- **Button:** primary (accent bg, white text), secondary (surface, line-strong border), ghost, danger. Height 36px (compact 28px). Loading state shows a small spinner + keeps width.
- **Input/Select:** 36px, 1px line-strong, focus ring 2px accent.
- **Badge (status):** OPEN (info), AWAITING_REVIEW (warning), AWAITING_CUSTOMER (clay), ESCALATED (danger), RESOLVED (success), CLOSED (muted). Text always shown.
- **ChannelBadge:** icon + label on channel tint (WhatsApp/Email/Web), plus "Simulated".
- **FindingCard:** left 3px border by evidence strength; title ("Possible duplicate charge"), amount (mono, right-aligned), three stacked blocks - *Observation*, *Interpretation*, *Recommendation*; footer: EvidenceChip, "Explain this" (language select EN/HI/MR).
- **Timeline:** vertical 1px line, 8px dots, actor (customer / agent / AI / system), time in mono, event text, optional expandable payload.
- **Table:** sticky header on surface-alt, right-aligned numerics, zebra off, row hover accent-soft, status badge column, keyboard focusable rows.
- **StatCard:** label (muted 12px), value (display 32px, tabular), delta with arrow + text ("+14% vs prior 4 wks"), footnote with sample size.
- **Chart:** Recharts, 1px axes in --line, labels 12px muted, direct series labels where possible, colour-blind safe palette.
- **Toast:** bottom-right, surface + left status border, auto-dismiss 5s.
- **Skeleton:** surface-alt blocks, no shimmer sweep (static pulse at most).
- **DemoControls drawer:** right-side, dashed border, label "Demo controls - not part of the product".

## 7. Layouts
**Agent shell:** left nav 232px (surface-alt) - Inbox, Cases, Customers, CX Intelligence, Recommendations, Approvals; top bar 56px (search, role, user). Content max-width 1280px.
**Case detail (desktop 3 columns):** left 320px = timeline; center flex = conversation/evidence (tabs: Conversation, Documents, Findings); right 360px = AI assistant panel (sticky). Under 1100px: right panel becomes a tab.
**Customer chat:** centered phone frame 390 x 760, header "WhatsApp (simulated)" on --ch-whatsapp tint; bubbles: customer right (white), business left (--ch-whatsapp); attachments as file chips; action buttons as secondary buttons under the AI bubble ("Explain this", "Get this resolved").
**Email view:** two-pane webmail: thread list 300px + message 1fr; header chip "Email (simulated)"; banner "Existing case detected" in info-soft.
**CX Intelligence:** page title (display), filter row (period, channel), stats row (4 StatCards), problems table, side sheet for detail.
**Admin:** same shell, tabs across top.

## 8. Landing wireframe (asymmetric, 12-col grid)
```
[Wordmark Setuvia]                         [Try Demo] [Business intelligence]
------------------------------------------------------------------------------
cols 1-6                                   | cols 7-12
Newsreader 56px:                           | Product panel (real UI):
 "The customer changes                      |  WhatsApp bubble -> Email thread
  channels. The context                     |  -> single CASE-48291 card with
  shouldn't."                               |  findings and timeline
Public Sans 18px supporting paragraph       |
[Try Demo] (primary) [View business intel]  |
------------------------------------------------------------------------------
Band: own SVG   WhatsApp -> Email -> Phone  =>  One customer  =>  One continuous case
------------------------------------------------------------------------------
Remember | Understand | Resolve | Improve  (4 columns, numbered 01-04, different
copy lengths, hairline dividers - NOT identical icon cards)
------------------------------------------------------------------------------
"Not a chatbot": left comparison table (Typical chatbot vs Setuvia), right
CX Intelligence screenshot panel
------------------------------------------------------------------------------
Footer: demo disclaimer - synthetic data, simulated channels
```

## 9. Microcopy tone
Plain, calm, specific. Hedged where uncertain ("Potential discrepancy", "Please verify"). Never accusatory. Numbers with rupee sign and Indian grouping (Rs 1,23,456 style via `Intl.NumberFormat('en-IN')`).

## 10. Responsive and accessibility
Breakpoints 640 / 1024 / 1280. Chat is mobile-first. Focus ring visible; every icon button has aria-label; forms have labels; reduced-motion respected; language switch sets `lang` attr on explanation blocks.
