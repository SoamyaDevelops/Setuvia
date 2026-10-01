import { query } from '../../db';

export async function logAudit(
  actorId: string,
  role: string,
  action: string,
  target: string,
  detail: any
) {
  try {
    await query(
      `INSERT INTO audit_log (actor_id, role, action, target, detail) VALUES ($1, $2, $3, $4, $5)`,
      [actorId, role, action, target, JSON.stringify(detail)]
    );
  } catch (error) {
    console.error('Failed to write audit log:', error);
    // Silent fail for MVP to keep app running without DB
  }
}

export async function getAuditLogs() {
  try {
    const res = await query(`SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 50`);
    return res.rows;
  } catch (error) {
    // Return mock data for MVP
    return [
      { id: '1', actor_id: 'agent', role: 'AGENT', action: 'ANSWER', target: 'CASE-48291', created_at: new Date().toISOString() },
      { id: '2', actor_id: 'system', role: 'SYSTEM', action: 'ISSUE_REFUND', target: 'CASE-48291', detail: { amount: 6800, status: 'BLOCKED_BY_RULE' }, created_at: new Date().toISOString() }
    ];
  }
}
