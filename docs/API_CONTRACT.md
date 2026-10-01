# API Contract

Base: `${VITE_API_URL}/api`. JSON only. Auth: `Authorization: Bearer <jwt>`.
Success: `{ "data": ... }`. Error: `{ "error": { "code": "VALIDATION_ERROR", "message": "Human readable text", "requestId": "..." } }`
Codes: `VALIDATION_ERROR 400, UNAUTHENTICATED 401, FORBIDDEN 403, NOT_FOUND 404, CONFLICT 409 (duplicate case), UNSUPPORTED_FILE 415, FILE_TOO_LARGE 413, RATE_LIMITED 429, AI_UNAVAILABLE 503, INTERNAL 500`.
Never return stack traces or secrets.

## Auth
| Method | Path | Body | Roles | Returns |
|---|---|---|---|---|
| POST | /auth/login | {email, password} | public | {token, user:{id,name,role,preferredLanguage}} |
| POST | /auth/register | {name,email,password,phone} | public (CUSTOMER only) | same |
| GET | /auth/me | - | any | user |

## Conversations & messages
| POST | /conversations | {channel:"whatsapp"|"email"|"web"} | CUSTOMER/AGENT | {id, customerId, caseId|null} |
| POST | /messages | {conversationId, channel, body, attachments?:[documentId]} | CUSTOMER/AGENT | {message, reply?:{body, source:"ai|template|fixture", actions?:[...] }, caseId|null, link:{method, confidence}} |
| GET | /conversations/:id/messages | - | owner/AGENT | messages[] |

## Documents & analysis
| POST | /documents | multipart: file, caseId? | CUSTOMER/AGENT | {id, name, sha256, status:"uploaded"} (415/413 on bad file) |
| POST | /ai/analyze | {documentId} | CUSTOMER/AGENT | {billNumber, date, total, issuesCount, amountPotentiallyRequiringReview, findings:[Finding], extractionStatus:"ok|uncertain", source} |
| GET | /documents/:id/explain?lang=en\|hi\|mr&finding=ID | - | owner/AGENT | {lang, text, englishText, label:"AI-translated - please verify"} |
Finding: `{id, type:"possible_duplicate|stay_mismatch|insurance_review|tax_review|arithmetic", amount, evidenceStrength:"HIGH|MEDIUM|LOW", detectedBy:"rule|llm", evidence:{lines:[..], rule:"..."}, observation, interpretation, recommendation}`

## Cases
| POST | /cases | {customerId?, documentId?, issueType, summary?, channel} | CUSTOMER/AGENT | Case (409 if duplicate -> returns existing id) |
| GET | /cases?status&team&priority | - | AGENT/MANAGER | Case[] with SLA |
| GET | /cases/:id | - | owner/AGENT | Case + events + findings + documents |
| POST | /cases/:id/actions | Action (below) | per role | {event, case, requiresApproval} |
| GET | /customers/:id/context | - | AGENT/MANAGER | Customer360 object |
Action: `{ "action":"ESCALATE|ASSIGN_CASE|UPDATE_CASE|GENERATE_REPLY|GENERATE_QUERY|FOLLOW_UP|ASK_FOR_INFORMATION|ANSWER|CLOSE_CASE|CREATE_CASE", "reason":"...", "priority":"low|medium|high", "department":"billing", "payload":{} }`
Case: `{id:"CASE-48291", customerId, issueType, summary, priority, status, ownerTeam, ownerAgent, channel, slaDueAt, potentialIssues, createdAt}`
Customer360: `{customer:{name,accountId,since,preferredLanguage}, activeCase, channelHistory:[], documents:[], previousCases:[], preferences:{}, aiSummary, nextBestAction}`

## Channels (simulated)
| POST | /channels/email/inbound | {from, subject, body, threadRef?} | AGENT/ADMIN/demo | {linkedCaseId, link:{method,confidence}, draftReply} |
| GET | /channels/email/threads | - | CUSTOMER/AGENT | threads[] |

## CX intelligence
| GET | /cx/insights?period=8w | - | MANAGER/AGENT | {sampleSize, period, insights:[{id,category,affectedCustomers,volume,trendPct,repeatContactRate,escalationRate,avgResolutionDays,priority}]} |
| GET | /cx/insights/:id | - | MANAGER/AGENT | {observed:{...,weeklyVolume:[...],quotes:[...],channelMix:{}}, inferred:[...], recommended:[...], owner, metrics:[...], promptVersion, source} |
| GET | /recommendations | - | MANAGER | Recommendation[] |

## Admin / AI
| GET | /ai/providers | admin | masked list |
| POST | /ai/providers | admin | {provider, modelClass, modelName, tasks[], priority, enabled} |
| POST | /ai/credentials | admin | {providerId, apiKey, priority, rpm, rpd} -> returns masked only |
| GET | /ai/usage | admin | aggregates from ai_usage |
| GET | /ai/health | admin | per credential status/cooldown |
| GET | /health | public | {status:"ok", db:"ok", aiMode} |

## Demo (only when DEMO_MODE=true)
| POST | /demo/load | loads deterministic scenario + seed dataset |
| POST | /demo/simulate-email | inserts hospital email for CASE-48291 |
| POST | /demo/reset | resets demo data |
