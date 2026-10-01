import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres',
});

// Comprehensive Realistic Mock Data for Managers (Agent OS)
let mockCases = [
  {
    id: 'CASE-48291',
    customer_id: 'CUST-8812',
    customer_name: 'Priya Sharma',
    customer_email: 'priya.sharma@gmail.com',
    issue_type: 'Billing Clarification',
    summary: 'Customer billed twice for Deluxe Suite and minibar charges (₹12,400 duplicate).',
    priority: 'urgent',
    status: 'OPEN',
    channel: 'WhatsApp',
    sentiment: 'Frustrated',
    assigned_agent: 'Alex Morgan',
    created_at: new Date(Date.now() - 1800000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'CASE-10294',
    customer_id: 'CUST-4419',
    customer_name: 'Rahul Varma',
    customer_email: 'rahul.v@outlook.com',
    issue_type: 'Insurance Claim',
    summary: 'Awaiting third-party cashless insurance authorization for surgical procedure.',
    priority: 'high',
    status: 'AWAITING_CUSTOMER',
    channel: 'Web Chat',
    sentiment: 'Anxious',
    assigned_agent: 'David Chen',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 1200000).toISOString()
  },
  {
    id: 'CASE-77312',
    customer_id: 'CUST-9011',
    customer_name: 'Ananya Deshmukh',
    customer_email: 'ananya.d@techcorp.in',
    issue_type: 'Corporate Waiver',
    summary: 'Corporate tier traveler requesting non-refundable flight rescheduling credit.',
    priority: 'high',
    status: 'OPEN',
    channel: 'Email',
    sentiment: 'Neutral',
    assigned_agent: 'Alex Morgan',
    created_at: new Date(Date.now() - 14400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'CASE-65201',
    customer_id: 'CUST-3211',
    customer_name: 'Vikram Malhotra',
    customer_email: 'vikram.m@luxurytravel.com',
    issue_type: 'Refund Approval',
    summary: 'Manager sign-off required: Refund of ₹8,500 due to HVAC failure in Executive Suite.',
    priority: 'high',
    status: 'IN_REVIEW',
    channel: 'Phone',
    sentiment: 'Demanding',
    assigned_agent: 'Sarah Jenkins',
    created_at: new Date(Date.now() - 21600000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'CASE-52904',
    customer_id: 'CUST-1944',
    customer_name: 'Sneha Patel',
    customer_email: 'sneha.patel@gmail.com',
    issue_type: 'Loyalty Reconciliation',
    summary: '5,000 tier points failed to credit following annual subscription renewal.',
    priority: 'medium',
    status: 'RESOLVED',
    channel: 'Web Chat',
    sentiment: 'Delighted',
    assigned_agent: 'AI Auto-Pilot',
    created_at: new Date(Date.now() - 43200000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'CASE-39182',
    customer_id: 'CUST-7722',
    customer_name: 'Karan Mehra',
    customer_email: 'karan.m@gmail.com',
    issue_type: 'Charge Dispute',
    summary: 'Fraud team alert: Unknown terminal swipe detected on card ending in 8841.',
    priority: 'urgent',
    status: 'ESCALATED',
    channel: 'System Alert',
    sentiment: 'Severe',
    assigned_agent: 'Risk & Safety AI',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'CASE-88219',
    customer_id: 'CUST-5510',
    customer_name: 'Rohan Singhania',
    customer_email: 'rohan.singhania@apexholding.com',
    issue_type: 'SLA Guarantee Breach',
    summary: 'Enterprise Cloud cluster degraded for 14 minutes; requesting contract SLA 10% credit memo.',
    priority: 'urgent',
    status: 'OPEN',
    channel: 'Email',
    sentiment: 'Critical',
    assigned_agent: 'Alex Morgan',
    created_at: new Date(Date.now() - 10800000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'CASE-91043',
    customer_id: 'CUST-6102',
    customer_name: 'Natasha Rao',
    customer_email: 'natasha.rao@fintechventures.io',
    issue_type: 'Compliance & GDPR Erasure',
    summary: 'Formal Right to be Forgotten statutory notice received. Requires DB vault audit & ledger purge.',
    priority: 'high',
    status: 'IN_REVIEW',
    channel: 'Portal',
    sentiment: 'Formal',
    assigned_agent: 'Sarah Jenkins',
    created_at: new Date(Date.now() - 28800000).toISOString(),
    updated_at: new Date(Date.now() - 5400000).toISOString()
  },
  {
    id: 'CASE-23910',
    customer_id: 'CUST-7821',
    customer_name: 'Arjun Nair',
    customer_email: 'arjun@techforward.ai',
    issue_type: 'API Overage Dispute',
    summary: 'Disputing $1,420 token overage due to webhook retry loop during US-East AWS disruption.',
    priority: 'medium',
    status: 'OPEN',
    channel: 'Web Chat',
    sentiment: 'Inquiring',
    assigned_agent: 'David Chen',
    created_at: new Date(Date.now() - 36000000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'CASE-60482',
    customer_id: 'CUST-3904',
    customer_name: 'Meera Iyer',
    customer_email: 'meera.iyer@zenithcapital.in',
    issue_type: 'Unrecognized Wire Transfer',
    summary: 'SWIFT wire of ₹4,50,000 flagged in escrow. Anti-money laundering hold pending sender KYC.',
    priority: 'urgent',
    status: 'ESCALATED',
    channel: 'Phone',
    sentiment: 'Alarmed',
    assigned_agent: 'Risk & Safety AI',
    created_at: new Date(Date.now() - 54000000).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'CASE-71954',
    customer_id: 'CUST-8219',
    customer_name: 'Kabir Kapoor',
    customer_email: 'kabir.k@globalfreight.org',
    issue_type: 'Flight Cancellation Compensation',
    summary: 'DGCA Rule 133 refund and hotel voucher for canceled charter BLR -> DEL flight.',
    priority: 'medium',
    status: 'RESOLVED',
    channel: 'WhatsApp',
    sentiment: 'Satisfied',
    assigned_agent: 'AI Auto-Pilot',
    created_at: new Date(Date.now() - 72000000).toISOString(),
    updated_at: new Date(Date.now() - 14400000).toISOString()
  },
  {
    id: 'CASE-15830',
    customer_id: 'CUST-9442',
    customer_name: 'Pooja Reddy',
    customer_email: 'pooja.reddy@zetaanalytics.com',
    issue_type: 'Subscription Amendment',
    summary: 'Contract expansion: Adding 200 agent seats and dedicated VPC peering with custom data retention.',
    priority: 'high',
    status: 'OPEN',
    channel: 'Portal',
    sentiment: 'Cooperative',
    assigned_agent: 'Alex Morgan',
    created_at: new Date(Date.now() - 90000000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

let mockCaseEvents = [
  { id: 1, case_id: 'CASE-48291', actor: 'customer', actor_id: 'CUST-8812', action: 'CREATED', result: JSON.stringify({ message: 'I was double charged for room 402 and the mini-bar. Please issue refund.' }), created_at: new Date(Date.now() - 1800000).toISOString() },
  { id: 2, case_id: 'CASE-48291', actor: 'system', actor_id: 'AI', action: 'ANALYZED', result: JSON.stringify({ message: 'Receipt verification matched two entries of ₹6,200. Total discrepancy ₹12,400.' }), created_at: new Date(Date.now() - 1700000).toISOString() },
  { id: 3, case_id: 'CASE-48291', actor: 'agent', actor_id: 'Alex Morgan', action: 'ANSWER', result: JSON.stringify({ message: 'Investigating billing logs. Preparing reconciliation ticket.' }), created_at: new Date(Date.now() - 900000).toISOString() },
  { id: 4, case_id: 'CASE-10294', actor: 'customer', actor_id: 'CUST-4419', action: 'CREATED', result: JSON.stringify({ message: 'Uploaded pre-auth hospital estimate.' }), created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 5, case_id: 'CASE-10294', actor: 'system', actor_id: 'AI', action: 'DISPATCH', result: JSON.stringify({ message: 'Submitted document packet to ICICI Lombard Cashless Desk.' }), created_at: new Date(Date.now() - 6500000).toISOString() },
  { id: 6, case_id: 'CASE-88219', actor: 'customer', actor_id: 'CUST-5510', action: 'CREATED', result: JSON.stringify({ message: 'Cluster #441 was unresponsive for 14 minutes. We expect our contract SLA credit applied to next invoice.' }), created_at: new Date(Date.now() - 10800000).toISOString() },
  { id: 7, case_id: 'CASE-88219', actor: 'system', actor_id: 'AI', action: 'TELEMETRY_CHECK', result: JSON.stringify({ message: 'Datadog metrics confirmed 99.71% availability vs 99.95% committed. SLA tier qualifies for 10% credit ($3,400).' }), created_at: new Date(Date.now() - 10200000).toISOString() },
  { id: 8, case_id: 'CASE-60482', actor: 'system', actor_id: 'Risk & Safety AI', action: 'HOLD_TRIGGERED', result: JSON.stringify({ message: 'SWIFT wire flagged: AML Sanctions screening requires beneficiary entity verification.' }), created_at: new Date(Date.now() - 54000000).toISOString() }
];

// Rich Audit Logs for Admin Governance Dashboard
let mockAuditLogs = [
  { id: 101, actor_id: 'agent-001', role: 'AGENT', action: 'ISSUE_REFUND', target: 'CASE-65201', detail: { amount: 8500, status: 'BLOCKED_BY_RULE', reason: 'Refunds > ₹5,000 require Manager PIN verification.' }, created_at: new Date(Date.now() - 120000).toISOString() },
  { id: 102, actor_id: 'manager-004', role: 'MANAGER', action: 'APPROVE_OVERRIDE', target: 'CASE-65201', detail: { amount: 8500, status: 'SUCCESS', overrideReason: 'Executive room air failure documented by engineering team.' }, created_at: new Date(Date.now() - 600000).toISOString() },
  { id: 103, actor_id: 'ai-engine-01', role: 'SYSTEM_AI', action: 'AUTO_RESOLVE', target: 'CASE-52904', detail: { pointsCredited: 5000, latencyMs: 380, ruleMatched: 'LOYALTY_INSTANT_CREDIT_POLICY' }, created_at: new Date(Date.now() - 1800000).toISOString() },
  { id: 104, actor_id: 'agent-003', role: 'AGENT', action: 'CUSTOMER_PHONE_CALL', target: 'CASE-48291', detail: { durationSeconds: 142, recordingUrl: 's3://audit-vault/call-9821.mp3', complianceScore: 98 }, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 105, actor_id: 'security-guard', role: 'SYSTEM_BOT', action: 'RATE_LIMIT_TRIP', target: 'IP_192.168.1.44', detail: { attempts: 12, window: '60s', mitigation: 'CAPTCHA_CHALLENGE_ISSUED' }, created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 106, actor_id: 'admin-root', role: 'ADMIN', action: 'POLICY_REVISION', target: 'POLICY-REFUND-V4', detail: { updatedField: 'auto_approval_threshold', from: 1500, to: 2000 }, created_at: new Date(Date.now() - 14400000).toISOString() },
  { id: 107, actor_id: 'ai-engine-02', role: 'SYSTEM_AI', action: 'SLA_ESCALATION', target: 'CASE-39182', detail: { timePendingMinutes: 120, slaTargetMinutes: 60, status: 'ESCALATED_TO_SENIOR_LEAD' }, created_at: new Date(Date.now() - 28800000).toISOString() },
  { id: 108, actor_id: 'compliance-sentinel', role: 'SYSTEM_AI', action: 'PII_REDACTION', target: 'CASE-91043', detail: { fieldsMasked: ['aadhaar_no', 'pan_card', 'bank_account'], encryption: 'AES-256-GCM' }, created_at: new Date(Date.now() - 34000000).toISOString() },
  { id: 109, actor_id: 'risk-director', role: 'ADMIN', action: 'AML_HOLD_APPLIED', target: 'CASE-60482', detail: { wireAmount: 450000, trigger: 'FATF_HIGH_VALUE_THRESHOLD', status: 'HELD_PENDING_KYC' }, created_at: new Date(Date.now() - 52000000).toISOString() },
  { id: 110, actor_id: 'ai-engine-01', role: 'SYSTEM_AI', action: 'DGCA_AUTO_SETTLEMENT', target: 'CASE-71954', detail: { passengerCompensation: 10000, airlineClaimID: '6E-BLR-401', status: 'DISBURSED' }, created_at: new Date(Date.now() - 70000000).toISOString() },
  { id: 111, actor_id: 'agent-002', role: 'AGENT', action: 'CONTRACT_AMENDMENT', target: 'CASE-15830', detail: { seatCountAdd: 200, contractValueDelta: 48000, legalReview: 'AUTO_APPROVED_TIER_A' }, created_at: new Date(Date.now() - 88000000).toISOString() },
  { id: 112, actor_id: 'security-guard', role: 'SYSTEM_BOT', action: 'BRUTE_FORCE_BLOCKED', target: 'IP_45.132.88.19', detail: { blockedMinutes: 1440, geoOrigin: 'Tor Exit Node', attempts: 94 }, created_at: new Date(Date.now() - 95000000).toISOString() }
];

// Rich Macro Insights for Executive Intelligence
let mockInsights = [
  {
    id: 1,
    category: 'Billing & Tax Mapping',
    inferred: 'HMS mapping glitch causing erroneous 18% GST calculation on exempt Room Tariff.',
    observed: { issueCount: 24, totalDiscrepancy: 38400, mainDriver: 'Room Tariff Category C (GST 18% instead of 0%)' },
    recommended: 'Update HMS Tax Table Rule #402: enforce zero-rating on room tariffs under ₹7,500/night.',
    impact: 'High Financial Exposure',
    period: 'Last 30 Days'
  },
  {
    id: 2,
    category: 'Cashless Insurance Friction',
    inferred: 'Third-party TPA delays in uploading digitized discharge summaries leading to discharge wait times > 4 hours.',
    observed: { issueCount: 42, totalDiscrepancy: 0, mainDriver: 'Star Health & HDFC Ergo TPA pre-authorization portal timeouts' },
    recommended: 'Activate automated webhook bridge to push EMR discharge summaries directly to TPA APIs.',
    impact: 'Customer Satisfaction (-22 NPS)',
    period: 'Last 14 Days'
  },
  {
    id: 3,
    category: 'Repetitive Cancellation Fees',
    inferred: 'App checkout UI ambiguity causes 14% of mobile users to duplicate reservations within a 3-minute window.',
    observed: { issueCount: 56, totalDiscrepancy: 84000, mainDriver: 'Double-tap on slow gateway submit button' },
    recommended: 'Implement client-side debounce on booking confirmation button and instant idempotency token.',
    impact: 'Operational Triage Drain',
    period: 'Last 7 Days'
  },
  {
    id: 4,
    category: 'Enterprise Cloud SLA Penalty',
    inferred: 'Micro-outages in Asia-South-1 Kubernetes worker node pools triggered automated 10% SLA credit clauses for 6 Tier-1 enterprise clients.',
    observed: { issueCount: 18, totalDiscrepancy: 286000, mainDriver: 'Cross-AZ VPC latency spikes during node auto-healing' },
    recommended: 'Provision dedicated multi-region failover warm standbys and adjust health-check threshold from 15s to 45s.',
    impact: 'Critical Revenue Risk',
    period: 'Last 24 Hours'
  },
  {
    id: 5,
    category: 'Fraudulent Chargeback Wave',
    inferred: 'Coordinated card testing attack across low-value digital loyalty point vouchers using automated carding scripts.',
    observed: { issueCount: 88, totalDiscrepancy: 142000, mainDriver: 'Missing 3DS challenge on tokenized recurring transactions under ₹500' },
    recommended: 'Enforce Step-Up 3D Secure biometric verification on all new IP subnets and velocity check > 3 purchases/hour.',
    impact: 'Merchant Risk & Compliance',
    period: 'Last 3 Days'
  },
  {
    id: 6,
    category: 'Logistics SLA & DGCA Claims',
    inferred: 'Regional fog disruptions at BLR and DEL airports created 140+ concurrent flight cancellation claims needing instant statutory disbursement.',
    observed: { issueCount: 142, totalDiscrepancy: 420000, mainDriver: 'Ground staff bottleneck at physical service desks' },
    recommended: 'Route all affected flight PNRs to Setuvia Auto-Pilot WhatsApp flow for 60-second automated UPI compensation.',
    impact: 'Immediate Brand Advocacy (+38 NPS)',
    period: 'Last 48 Hours'
  }
];

export const query = async (text: string, params?: any[]) => {
  try {
    if (process.env.DATABASE_URL && process.env.USE_MOCK_DB !== 'true') {
      return await pool.query(text, params);
    }
  } catch (err) {
    console.log('DB connection failed, falling back to mock data...');
  }

  // MOCK DB LOGIC
  if (text.includes('INSERT INTO cases')) {
    const newCase = {
      id: params[0], customer_id: params[1], issue_type: params[2], summary: params[3], priority: params[4], status: 'OPEN', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    };
    mockCases.unshift(newCase);
    return { rows: [newCase] };
  }
  
  if (text.includes('SELECT * FROM cases ORDER BY created_at DESC') || text.includes('SELECT * FROM cases ORDER')) {
    return { rows: mockCases };
  }
  
  if (text.includes('SELECT * FROM cases WHERE id = $1')) {
    const c = mockCases.find(c => c.id === params[0]);
    return { rows: c ? [c] : [] };
  }
  
  if (text.includes('SELECT * FROM case_events WHERE case_id = $1')) {
    return { rows: mockCaseEvents.filter(e => e.case_id === params[0]) };
  }

  if (text.includes('INSERT INTO case_events')) {
    const newEvent = { id: Date.now(), case_id: params[0], actor: params[1], actor_id: params[2], action: params[3], result: params[4], created_at: new Date().toISOString() };
    mockCaseEvents.push(newEvent);
    return { rows: [newEvent] };
  }

  if (text.includes('UPDATE cases SET status')) {
    const c = mockCases.find(c => c.id === (params.length === 2 ? params[1] : params[0]));
    if (c) {
      if (params.length === 2) c.status = params[0];
      else c.status = text.includes("'CLOSED'") ? 'CLOSED' : 'AWAITING_CUSTOMER';
      c.updated_at = new Date().toISOString();
    }
    return { rows: c ? [c] : [] };
  }

  if (text.includes('INSERT INTO audit_log')) {
    const newAudit = { id: Date.now(), actor_id: params[0], role: params[1], action: params[2], target: params[3], detail: params[4], created_at: new Date().toISOString() };
    mockAuditLogs.unshift(newAudit);
    return { rows: [newAudit] };
  }

  if (text.includes('SELECT * FROM audit_log') || text.includes('SELECT * FROM audit')) {
    return { rows: mockAuditLogs };
  }

  return { rows: [] };
};

export const getMockInsights = () => mockInsights;

export default pool;
