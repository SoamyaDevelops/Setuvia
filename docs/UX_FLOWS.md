# UX Flows, Screens, States and Microcopy

Information hierarchy for business users: **What happened -> What's happening now -> What should I do -> What should the business improve.**
Customer promise: **"You don't need to repeat yourself."**

## 1. Screen inventory (P0 unless marked)
Public: Landing - Login - Demo entry
Customer: WhatsApp chat (simulated) - Analysis card - Case status - Email view (simulated)
Business: Agent inbox - Case detail - Customer 360 - Approvals - CX Intelligence - Problem detail - Recommendation center
Admin (P1): Providers & keys - Model registry - AI settings - Usage - Provider health
Demo: Demo Controls drawer

## 2. Customer WhatsApp flow
```
[Header: WhatsApp (simulated)  - Hospital Billing Support]
Customer:  I think something is wrong with my hospital bill.
Bot:       I can help check it. Please upload your bill (PDF or photo).
Customer:  [Bill-83921.pdf]
Bot:       Reading your bill... (skeleton, max 8s)
Bot:       I found 4 items that may require clarification.
           [ANALYSIS CARD]
           [Explain this]  [Get this resolved]
Customer:  Explain them in Marathi.
Bot:       (Marathi explanation of each finding; English shown beneath)
Customer:  Create a query for the hospital.
Bot:       Here's a draft query. [Preview] [Send to billing team] [Edit]
Bot:       Done. Your case CASE-48291 is open. You can message here or by email - I'll keep everything together.
```
Rules: bot bubbles carry the AI chip only on analysis/draft content; all channel UIs carry a "Simulated" badge.

### Analysis card
```
Bill analysis
Bill #83921                        Date: 14 Sep 2026
Total                              Rs 42,000
Potential issues                   4
Amount potentially requiring review   Rs 6,800
(Not a confirmed overcharge. Findings need verification by the billing team.)

[HIGH]   Possible duplicate charge          Rs 3,200
         Observation: MRI Lumbar Spine appears twice on 13 Sep at 11:20.
         Interpretation: Possible duplicate entry.
         Recommendation: Ask billing to confirm whether two scans were done.
         [Explain this v EN | HI | MR]
[HIGH]   Possible date/stay mismatch        Rs 3,200
[MEDIUM] Insurance-related review           Rs 250
[MEDIUM] Tax treatment review               Rs 150
```
Evidence chip tooltip shows the rule and line numbers (e.g., "Rule: same item + same timestamp + same amount; lines 4 and 5").

### States
- Uploading: progress bar + file chip.  - Reading: skeleton card.  - Unreadable file: "I couldn't read this file clearly. Please upload a clearer PDF or photo."  - Unsupported file: "I can read PDF, JPG or PNG files up to 5 MB."  - AI busy: "Our assistant is busy. Showing a saved analysis for the demo bill." (only for the demo document; label "Demo data").

## 3. Case created confirmation
```
CASE-48291                       Status: Open  -> Awaiting review
Issue: Hospital billing discrepancy
Priority: Medium     Channel: WhatsApp     Owner: Billing Support
Documents: Bill-83921.pdf     Potential issues: 4
Timeline: 10:02 Customer started chat - 10:03 Bill uploaded - 10:03 AI analysis (4 findings) - 10:05 Case created - 10:05 Routed to Billing Support
```

## 4. Agent inbox
Table columns: Case (mono) - Customer - Issue - Channel badge - Priority - Status badge - Owner - SLA (time left, red if < 4h) - Last activity.
Filters: status, team, priority, channel. Row click -> Case detail. Empty: "No open cases. New customer conversations appear here."

## 5. Case detail
Header: `CASE-48291` - title - status badge - priority - owner select - SLA countdown - buttons [Escalate] [Assign] [Resolve] (validated).
Tabs center: Conversation (all channels interleaved with ChannelBadge) - Documents (preview + extracted lines) - Findings.
Right AI panel (sticky):
```
AI SUMMARY  [AI-generated - review before sending]
Customer believes 4 billing items need clarification. Bill and evidence were already provided on WhatsApp.

SIGNALS
Detected frustration signal: Moderate     Urgency: Medium

RELEVANT HISTORY (only what matters)
- 14 Sep WhatsApp: bill uploaded, 4 findings
- 15 Sep Email: hospital asked which charges are disputed

DOCUMENTS   Bill-83921.pdf

RECOMMENDED ACTION
Billing review appears appropriate based on the uploaded evidence.

DRAFT REPLY (editable)
[ textarea ... ]
[Regenerate] [Save draft] [Approve & send via Email v]
```
After send: event "Agent approved AI-drafted reply" in timeline; toast "Reply sent (simulated email)".

## 6. Email simulation
Webmail layout. Incoming from "Billing Dept, Demo Hospital": "Please provide more information about the charges you are disputing."
Banner (info-soft):
```
Existing case detected - CASE-48291 (linked via thread reference)
Customer has already identified:
 - Room charge (3 days vs 2 days)   - Possible duplicate item
 - Date discrepancy                  - Insurance and tax queries
[Open case]  [Re-link to another case]
```
Draft reply panel beneath: AI-drafted response listing the four items with line references; [Edit] [Approve & send].
Footer: "Email (simulated). No real email is sent."

## 7. Return to WhatsApp
Customer: "Any update?"
Bot (template + status data): "Your billing query (CASE-48291) is awaiting review by the billing team. The hospital has asked for more detail on the disputed charges, and we've already shared the items you identified. You don't need to resend your bill or repeat the issue. Expected response by 17 Sep, 5:00 PM."
Also available in Hindi/Marathi per preferred language.

## 8. Customer 360
```
Customer                         Demo Customer (synthetic)
Account: ACC-1042   Customer since: Jan 2023   Preferred language: Marathi
--------------------------------------------------------------
ACTIVE CASE    CASE-48291  Hospital billing discrepancy
               Status: Awaiting review   Priority: Medium   SLA: 2d 3h left
CHANNEL HISTORY  WhatsApp -> Email -> WhatsApp   (timeline chips)
DOCUMENTS        Bill-83921.pdf
PREVIOUS CASES   table (id, issue, outcome, date)
PREFERENCES      Language: Marathi - Channel: WhatsApp
AI SUMMARY       Customer believes several billing items require clarification. Main evidence already shared.
NEXT BEST ACTION Follow up with billing team after SLA threshold.
```

## 9. CX Intelligence
Header: "CX Intelligence" - subline "Based on demo dataset - N cases, last 8 weeks" (N computed).
Stats row: Cases analysed - Repeat-contact rate - Escalation rate - Avg resolution time (all computed).
Emerging problems table: Problem - Affected customers - Volume - Trend (arrow + %) - Repeat-contact signal - Escalation signal - Priority.
Problem detail (side sheet or page):
```
BILLING CLARIFICATION REQUESTS                     [Observed] numbers  [Inferred] hypotheses  [Recommended] actions
What customers are saying: "Please explain these charges." / "I already sent the bill." / "Nobody told me what this item is."
OBSERVED   volume chart by week - repeat-contact rate - avg resolution time - channel mix
POSSIBLE CONTRIBUTING FACTORS (inferred)  - Itemised bill hard to understand - Disputed-charge info requested again by email
RECOMMENDED ACTION  Add a plain-language bill explainer link to the discharge message and pre-collect disputed line items in the first reply.
OWNER  Billing Operations / Patient Experience
MEASURE  Repeat-contact rate - Resolution time - Billing clarification volume
```
Retention card: "Potential retention-risk signal: customers with repeated unresolved issues show more cancellation activity in the available data. Recommended: review repeated-contact customers early." (Disabled button: Import outcome data - Coming later.)

## 10. Admin (P1)
Providers: table of provider, model class, status dot + text, usage %, last used, cooldown, enabled toggle. Keys masked `AIza****9X2`. Banner: "Use only keys from projects you own. Multiple keys are for failover, not for bypassing limits."
Settings: Budget mode (FREE ONLY default), routing, max retries 2, max providers/task 3, local fallback.
Usage and health: counts and charts from telemetry; empty state if none.

## 11. Demo Controls drawer (only if DEMO_MODE=true)
Buttons: Load demo scenario - Jump to step (1-9) - Simulate hospital email - Switch role (Customer/Agent/Manager) - Reset. Dashed border + label "Demo controls - not part of the product".

## 12. Global states
Loading skeletons; empty states with next action; error toasts (human text + request ID in small mono); offline banner "Using saved demo data" when AI_MODE=cached/mock; session expired -> login.

## 13. Microcopy bank
- "Potential discrepancy" - "Possible duplicate" - "Requires clarification" - "Please verify"
- "Amount potentially requiring review" (never "savings" or "overcharge")
- "Detected frustration signal" (never "angry")
- "AI-translated - please verify with the billing team"
- "Existing case detected"
- "You don't need to resend your bill or repeat the issue."
- "Based on demo dataset - N cases, last 8 weeks"
