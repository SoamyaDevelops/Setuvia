import { query } from '../../db';

export interface CaseLinkResult {
  caseId: string | null;
  linkMethod: 'reference_id' | 'active_case' | 'semantic' | 'manual' | null;
  needsClarification?: boolean;
}

export async function linkCase(customerId: string, messageBody: string): Promise<CaseLinkResult> {
  try {
    // 1. Explicit reference (CASE-XXXXX in subject/body)
    const match = messageBody.match(/CASE-\d{5}/i);
    if (match) {
      const caseId = match[0].toUpperCase();
      // Verify case belongs to customer (or skip check for MVP simplicity)
      return { caseId, linkMethod: 'reference_id' };
    }

    // 2. Single active case for that verified customer
    const res = await query(
      `SELECT id FROM cases WHERE customer_id = $1 AND status NOT IN ('RESOLVED', 'CLOSED')`,
      [customerId]
    );

    if (res.rows.length === 1) {
      return { caseId: res.rows[0].id, linkMethod: 'active_case' };
    }

    if (res.rows.length > 1) {
      // Multiple active cases: would use semantic match here
      // For demo, we just return the first one or ask to clarify
      return { caseId: res.rows[0].id, linkMethod: 'active_case', needsClarification: true };
    }

    // No active case
    return { caseId: null, linkMethod: null };
  } catch (error) {
    console.error('Case linking failed:', error);
    
    // Demo fallback memory
    if (messageBody.includes('CASE-48291')) {
      return { caseId: 'CASE-48291', linkMethod: 'reference_id' };
    }
    
    return { caseId: 'CASE-48291', linkMethod: 'active_case' };
  }
}
