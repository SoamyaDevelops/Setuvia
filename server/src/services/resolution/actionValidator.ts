import { z } from 'zod';

export const ActionSchema = z.object({
  action: z.enum(['ANSWER', 'CREATE_CASE', 'UPDATE_CASE', 'ASSIGN_CASE', 'ESCALATE', 'GENERATE_REPLY', 'FOLLOW_UP', 'CLOSE_CASE', 'ISSUE_REFUND', 'APPROVE_RULE', 'MESSAGE']),
  reason: z.string().optional(),
  payload: z.any().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

export type ActionRequest = z.infer<typeof ActionSchema>;

export function validateAction(req: any, userRole: string): ActionRequest {
  const parsed = ActionSchema.parse(req);

  // Approval rules for MVP
  if (parsed.action === 'ESCALATE' && userRole === 'CUSTOMER') {
    throw new Error('Customers cannot self-escalate directly without review');
  }

  // Hard Rule: Agents cannot issue refunds > 5000 without MANAGER approval
  if (parsed.action === 'ISSUE_REFUND' && parsed.payload?.amount > 5000 && userRole !== 'MANAGER') {
    throw new Error('Rule Engine Block: Refunds > ₹5000 require MANAGER role');
  }

  return parsed;
}
