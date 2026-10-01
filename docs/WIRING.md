# WIRING - how everything connects (all free)

## 1. System diagram
```
 Browser (React + Vite + Tailwind)  -- HTTPS/JSON + JWT -->  Express API (Render free)
   Vercel/Netlify free                                          |
   - Landing, Customer chat, Email sim                          |-- Auth / RBAC / Zod validation
   - Agent, CX, Admin                                           |-- Case Orchestrator
                                                                |-- Memory (identity, linker, context)
                                                                |-- Documents (upload, checks)
                                                                |-- Resolution (actions, approvals)
                                                                |-- CX (aggregate, insights)
                                                                |-- AIService --> Router --> Cache --> Gemini (free tier)
                                                                |                             \--> MockProvider (fixtures)
                                                                \-- Postgres (Neon free) : all data, files (bytea), ai_usage, cache
```
Secrets (Gemini key, JWT secret, encryption key, DB URL) live only in server env vars. The browser never sees them.

## 2. Recommended folder structure
```
setuvia/
  client/
    src/
      pages/        landing/ auth/ customer/ agent/ cx/ admin/ dev/
      components/   ui/ chat/ case/ findings/ charts/ demo/
      lib/          api.ts  auth.ts  format.ts (en-IN money/dates)  i18n.ts
      styles/       tokens.css fonts.css index.css
    tailwind.config.js  vite.config.ts  vercel.json (SPA rewrite)
  server/
    src/
      app.ts  server.ts
      config/       env.ts  ai.config.json
      db/           schema.sql  migrate.ts  seed.ts  queries/
      middleware/   auth.ts rbac.ts validate.ts rateLimit.ts errors.ts requestId.ts
      routes/       auth conversations messages documents cases customers channels cx recommendations ai demo
      services/
        ai/         AIService.ts router.ts cache.ts throttle.ts health.ts providers/ prompts/ schemas/ fallback/
        memory/     identityResolver.ts caseLinker.ts contextBuilder.ts
        documents/  extractor.ts billChecks.ts tariff.ts pdfSeed.ts
        resolution/ actionSchema.ts actionValidator.ts actionExecutor.ts approvalPolicy.ts
        cx/         aggregator.ts trends.ts insightGenerator.ts
        demo/       loadScenario.ts reset.ts
      tests/
  fixtures/  docs/  design/  prompts/  tools/
  package.json (root scripts: dev, test, seed, lint)
```

## 3. Environment variables
### server/.env (never commit)
| Var | Purpose | Notes |
|---|---|---|
| PORT | API port | 4000 locally; Render provides its own |
| DATABASE_URL | Neon/Supabase connection string | include `sslmode=require` |
| JWT_SECRET | signs tokens | `openssl rand -hex 32` |
| ENCRYPTION_KEY | AES-256-GCM key for stored credentials | `openssl rand -hex 32` |
| CLIENT_ORIGIN | CORS allow-list | Vercel URL (comma-separated for several) |
| GEMINI_API_KEY | default AI credential | from Google AI Studio, no billing |
| GEMINI_MODEL_FAST / _BALANCED / _REASONING / _VISION | model IDs | **verify current model names in AI Studio**; never hard-code in code |
| AI_MODE | live / cached / mock | demo recording: cached |
| AI_BUDGET_MODE | FREE_ONLY (default) | |
| AI_MAX_RETRIES | 2 | |
| AI_RPM_LIMIT / AI_RPD_LIMIT | conservative local throttles | set below published free limits; check current limits |
| DEMO_MODE | true/false | shows Demo Controls |
| LOG_LEVEL | info | |
### client/.env
| VITE_API_URL | backend base URL (e.g., http://localhost:4000 or the Render URL) |
| VITE_DEMO_MODE | true/false |

## 4. Request lifecycle (every API call)
requestId -> rate limit -> auth (JWT) -> RBAC -> Zod validate -> service -> DB -> response `{data}` or `{error:{code,message,requestId}}`. Every AI call additionally: cache -> router -> throttle -> provider -> Zod validate -> cache write -> `ai_usage` row.

## 5. AI call path (detail)
```
service.needsAI(task, input)
  -> AIService.run(task, input, {importance, budget})
       1 hash = sha256(task + promptVersion + normalizedInput)
       2 cache hit?  -> return (source: "cache")
       3 AI_MODE=mock/cached and miss? -> MockProvider fixture (source: "fixture", UI shows 'Demo data' only where needed)
       4 router picks {provider, model, credential} by model class + health + limits
       5 throttle (RPM/RPD from config) ; over limit -> fallback
       6 provider.generate() with timeout; on 429/5xx -> cooldown + backoff(jitter) + next credential/provider (max 2 retries)
       7 Zod-validate JSON; invalid -> one repair retry -> fallback
       8 write cache + ai_usage; return {data, source, promptVersion}
```
Task -> model class: intent/sentiment/summary/categorize = FAST; reply/translate = BALANCED; bill extraction = VISION; recommendations = REASONING.

## 6. Demo flow wiring (step -> API -> data -> UI)
| # | Demo step | Calls | DB writes | UI result |
|---|---|---|---|---|
| 1 | Customer opens WhatsApp chat, says bill issue | POST /api/conversations, POST /api/messages | conversation, message | bubbles; intent classified (FAST, cached) |
| 2 | Uploads bill | POST /api/documents | document (bytea, hash) | file chip |
| 3 | Analysis | POST /api/ai/analyze {documentId} | document_extractions, bill_findings, ai_usage | Analysis card (4 findings, Rs 6,800) |
| 4 | Explain in Marathi | GET /api/documents/:id/explain?lang=mr | cache | Marathi + English text |
| 5 | Create query / get resolved | POST /api/cases ; POST /api/cases/:id/actions {GENERATE_QUERY} ; {CREATE_CASE/ASSIGN} | case, case_events | CASE-48291 + timeline; routed to Billing Support |
| 6 | Agent opens dashboard | GET /api/cases ; GET /api/cases/:id ; GET /api/customers/:id/context | - | Case detail + AI panel + Customer 360 |
| 7 | Agent edits/approves draft | POST /api/cases/:id/actions {GENERATE_REPLY / approve} | message (email out), case_event | toast; timeline entry |
| 8 | Hospital email arrives | POST /api/channels/email/inbound (Demo Controls) | message (link_method=reference_id) | banner "Existing case detected" + draft reply |
| 9 | Customer: "Any update?" | POST /api/messages | message | template reply from case state (deterministic) |
| 10 | Owner opens CX Intelligence | GET /api/cx/insights ; GET /api/cx/insights/:id ; GET /api/recommendations | insights/recommendations cached | table, charts, recommendation card |

## 7. Data wiring rules
- `messages.case_id` is set by the caseLinker; `link_method` and `link_confidence` are stored and shown in UI.
- `case_events` is the audit spine; every action (human or AI) writes one row linking case, actor, input_ref (message/document id), result.
- Documents: bytes in `documents.content` (bytea), `sha256` unique per case; extractions in `document_extractions.json`; findings in `bill_findings`.
- CX aggregates are SQL views/queries over `cases` + `messages`; insights cache stores computed numbers + AI text with `prompt_version`.
- Seeded cases carry precomputed `issue_category`.

## 8. Deployment wiring (free)
1. **GitHub** public repo. Secrets never committed (`.gitignore` has `.env*` except examples).
2. **Neon**: new project -> copy connection string -> `DATABASE_URL`. Run `npm run migrate && npm run seed` locally against it once.
3. **Render (Web Service, free)**: root dir `server`, build `npm install`, start `npm start`, health check path `/api/health`; env vars from section 3. Expect ~30-60 s cold start after idle.
4. **Vercel (free)**: root dir `client`, framework Vite, env `VITE_API_URL=<Render URL>`; `vercel.json` rewrites `/(.*)` -> `/index.html` so deep links work.
5. Set `CLIENT_ORIGIN=<Vercel URL>` on Render; redeploy.
6. **UptimeRobot (free)** pings `<Render URL>/api/health` every 5 min; `tools/warmup.sh` before recording.
7. Smoke test: login, upload bill, AI call, create case, simulate email, CX page.

## 9. Free-tier guardrails
- One Gemini key; local RPM/RPD throttle below published limits (check limits at setup time, they change).
- Cache aggressively; demo bill analysed once; seeds precomputed.
- No pgvector/embeddings in P0. No external services beyond: Gemini, Neon, Render, Vercel, GitHub, Google Fonts.
- Uploads <= 5 MB stored in Postgres (Neon free storage is limited - keep demo files small).

## 10. Suggested npm packages (verify names/versions at install)
client: react, react-dom, react-router-dom, axios, recharts, tailwindcss, postcss, autoprefixer, lucide-react, clsx
server: express, cors, helmet, express-rate-limit, jsonwebtoken, bcrypt (use bcryptjs if native build fails on Render), pg, zod, multer, pdfkit, dotenv, pino, @google/genai (official Gemini SDK)
dev: vitest, supertest, concurrently, eslint, typescript (optional)

## 11. Prompt -> files map (what the agent should read per prompt)
| Prompt | Files |
|---|---|
| 01 | design/*, server/src/db/schema.sql, both .env.example, docs/WIRING 1-3, API_CONTRACT (auth, errors) |
| 02 | schema.sql, MASTER 5/7/9.4, API_CONTRACT (conv/msg/cases), UX_FLOWS 2-5 |
| 03 | MASTER 6/14, server/src/config/ai.config.example.json, WIRING 5, fixtures/golden_path.json |
| 04 | MASTER 8, fixtures/sample_bill.json, tariff.json, bill_findings.expected.json, explanations.json, UX_FLOWS 2 |
| 05 | MASTER 7, WIRING 6, UX_FLOWS 6-8, fixtures/golden_path.json |
| 06 | MASTER 9, UX_FLOWS 4,5,8, DESIGN_SYSTEM 6-7 |
| 07 | MASTER 10, fixtures/seed_cases.json, tools/generate_seed.py, UX_FLOWS 9 |
| 08 | MASTER 6.4-6.10, UX_FLOWS 10 |
| 09 | DESIGN_SYSTEM 8-10, UX_FLOWS 11-13, DEMO_SCRIPT |
| 10 | WIRING 8, DEMO_SCRIPT |
