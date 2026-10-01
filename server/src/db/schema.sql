-- Setuvia schema (PostgreSQL: Neon / Supabase free). No pgvector required.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now());

CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL, sla_hours INT NOT NULL DEFAULT 72);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('CUSTOMER','AGENT','MANAGER','ADMIN')),
  team_id UUID REFERENCES teams(id), customer_id UUID, created_at TIMESTAMPTZ DEFAULT now());

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY, org_id UUID REFERENCES organizations(id), name TEXT NOT NULL,
  account_id TEXT, customer_since DATE, preferred_language TEXT DEFAULT 'en',
  preferred_channel TEXT, is_synthetic BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT now());

CREATE TABLE IF NOT EXISTS customer_identifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), customer_id TEXT REFERENCES customers(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('phone','email','account_id')), value TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false, UNIQUE (type, value));

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID REFERENCES organizations(id),
  customer_id TEXT REFERENCES customers(id), channel TEXT NOT NULL CHECK (channel IN ('whatsapp','email','web')),
  case_id TEXT, created_at TIMESTAMPTZ DEFAULT now());

CREATE TABLE IF NOT EXISTS cases (
  id TEXT PRIMARY KEY,                       -- e.g. CASE-48291
  org_id UUID REFERENCES organizations(id), customer_id TEXT REFERENCES customers(id),
  issue_type TEXT NOT NULL, issue_category TEXT, summary TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','AWAITING_REVIEW','AWAITING_CUSTOMER','ESCALATED','RESOLVED','CLOSED')),
  owner_team TEXT, owner_agent UUID REFERENCES users(id), channel TEXT,
  sla_due_at TIMESTAMPTZ, potential_issues INT DEFAULT 0, escalated BOOLEAN DEFAULT false,
  resolution_days NUMERIC, is_seed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_category_created ON cases(issue_category, created_at);
CREATE INDEX IF NOT EXISTS idx_cases_customer ON cases(customer_id);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), conversation_id UUID REFERENCES conversations(id),
  customer_id TEXT REFERENCES customers(id), case_id TEXT REFERENCES cases(id),
  channel TEXT NOT NULL, direction TEXT NOT NULL CHECK (direction IN ('inbound','outbound')),
  sender TEXT NOT NULL CHECK (sender IN ('customer','agent','ai','system','external')),
  body TEXT NOT NULL, language TEXT, source TEXT,        -- ai | template | fixture | human
  link_method TEXT CHECK (link_method IN ('reference_id','active_case','semantic','manual')),
  link_confidence NUMERIC, created_at TIMESTAMPTZ DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_messages_case ON messages(case_id, created_at);

CREATE TABLE IF NOT EXISTS case_events (   -- audit spine: every AI/human action traceable
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), case_id TEXT REFERENCES cases(id) ON DELETE CASCADE,
  actor TEXT NOT NULL CHECK (actor IN ('customer','agent','ai','system')), actor_id TEXT,
  action TEXT NOT NULL, input_ref TEXT, result JSONB, created_at TIMESTAMPTZ DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_events_case ON case_events(case_id, created_at);

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), case_id TEXT REFERENCES cases(id),
  customer_id TEXT REFERENCES customers(id), original_name TEXT, stored_name TEXT NOT NULL,
  mime TEXT NOT NULL, size_bytes INT NOT NULL, sha256 TEXT NOT NULL, content BYTEA NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(), UNIQUE (case_id, sha256));

CREATE TABLE IF NOT EXISTS document_extractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  extracted JSONB NOT NULL, status TEXT NOT NULL CHECK (status IN ('ok','uncertain','failed')),
  source TEXT, prompt_version TEXT, created_at TIMESTAMPTZ DEFAULT now());

CREATE TABLE IF NOT EXISTS bill_findings (
  id TEXT, document_id UUID REFERENCES documents(id) ON DELETE CASCADE, type TEXT NOT NULL,
  amount NUMERIC NOT NULL, evidence_strength TEXT NOT NULL CHECK (evidence_strength IN ('HIGH','MEDIUM','LOW')),
  detected_by TEXT NOT NULL CHECK (detected_by IN ('rule','llm')), evidence JSONB,
  observation TEXT, interpretation TEXT, recommendation TEXT, PRIMARY KEY (document_id, id));

-- AI layer ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_providers (
  id TEXT PRIMARY KEY, display_name TEXT, enabled BOOLEAN DEFAULT true, base_url TEXT);
CREATE TABLE IF NOT EXISTS ai_models (
  id TEXT PRIMARY KEY, provider_id TEXT REFERENCES ai_providers(id), model_name TEXT NOT NULL, display_name TEXT,
  model_class TEXT CHECK (model_class IN ('FAST','BALANCED','REASONING','VISION','EMBEDDING')),
  supports_text BOOLEAN DEFAULT true, supports_image BOOLEAN DEFAULT false, supports_documents BOOLEAN DEFAULT false,
  supports_structured_output BOOLEAN DEFAULT true, context_window INT,
  free_status TEXT DEFAULT 'unknown',    -- editable; never assume free forever
  enabled BOOLEAN DEFAULT true, priority INT DEFAULT 50);
CREATE TABLE IF NOT EXISTS ai_credentials (
  id TEXT PRIMARY KEY, provider_id TEXT REFERENCES ai_providers(id), label TEXT,
  encrypted_key TEXT NOT NULL, key_hint TEXT,             -- masked hint only, e.g. AIza****9X2
  priority INT DEFAULT 50, enabled BOOLEAN DEFAULT true, rpm_limit INT, rpd_limit INT,
  cooldown_until TIMESTAMPTZ, last_error TEXT, last_used_at TIMESTAMPTZ);
CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), request_id TEXT, task TEXT, provider_id TEXT, model TEXT,
  credential_id TEXT, latency_ms INT, status TEXT, error_category TEXT,   -- ok|429|5xx|timeout|schema|fallback
  tokens_in INT, tokens_out INT, case_id TEXT, prompt_version TEXT, source TEXT, created_at TIMESTAMPTZ DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_ai_usage_time ON ai_usage(created_at);
CREATE TABLE IF NOT EXISTS ai_cache (
  hash TEXT PRIMARY KEY, task TEXT, prompt_version TEXT, response JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS ai_prompts (
  name TEXT, version INT, task TEXT, model_class TEXT, active BOOLEAN DEFAULT true, PRIMARY KEY (name, version));
CREATE TABLE IF NOT EXISTS ai_settings (key TEXT PRIMARY KEY, value JSONB NOT NULL);

-- CX intelligence -----------------------------------------------------
CREATE TABLE IF NOT EXISTS insights (
  id TEXT PRIMARY KEY, category TEXT, period TEXT, observed JSONB NOT NULL,   -- computed numbers
  inferred JSONB, recommended JSONB, prompt_version TEXT, source TEXT, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS recommendations (
  id TEXT PRIMARY KEY, insight_id TEXT REFERENCES insights(id), action TEXT NOT NULL, rationale TEXT,
  owner TEXT, metrics JSONB, status TEXT DEFAULT 'proposed', created_at TIMESTAMPTZ DEFAULT now());

-- Rules & audit -------------------------------------------------------
CREATE TABLE IF NOT EXISTS action_rules (
  action TEXT PRIMARY KEY, approval_level INT NOT NULL CHECK (approval_level BETWEEN 1 AND 4), roles TEXT[] NOT NULL);
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), actor_id TEXT, role TEXT, action TEXT NOT NULL,
  target TEXT, detail JSONB, request_id TEXT, created_at TIMESTAMPTZ DEFAULT now());
