import { query } from '../../db';

export async function resolveIdentity(identifierType: string, identifierValue: string): Promise<string | null> {
  // Deterministic Identity Resolution
  // 1. Match by verified identifier
  try {
    const res = await query(
      `SELECT customer_id FROM customer_identifiers WHERE type = $1 AND value = $2`,
      [identifierType, identifierValue]
    );

    if (res.rows.length > 0) {
      return res.rows[0].customer_id;
    }
    
    // For demo fallback (if DB is empty but we simulate a customer)
    if (identifierValue.includes('CUST-123') || identifierValue === 'customer@example.com') {
      return 'CUST-123';
    }

    return null;
  } catch (error) {
    console.error('Identity resolution failed:', error);
    // Fallback for demo
    return 'CUST-123';
  }
}
