import { Router } from 'express';
import { resolveIdentity } from '../services/memory/identityResolver';
import { linkCase } from '../services/memory/caseLinker';

const router = Router();

router.post('/email/inbound', async (req, res) => {
  try {
    const { fromEmail, body, subject } = req.body;
    
    // 1. Resolve Identity
    const customerId = await resolveIdentity('email', fromEmail);
    if (!customerId) {
      return res.json({ message: 'Unknown customer', newCaseProposed: true });
    }

    // 2. Case Linking
    const fullText = `${subject} ${body}`;
    const linkResult = await linkCase(customerId, fullText);

    if (linkResult.caseId) {
      // Attached to existing case
      return res.json({
        message: `Linked to ${linkResult.caseId} via ${linkResult.linkMethod}.`,
        caseId: linkResult.caseId,
        action: 'UPDATE_CASE'
      });
    } else {
      // No active case, propose new case
      return res.json({
        message: 'No active case found. Proposing new case.',
        action: 'CREATE_CASE'
      });
    }
  } catch (error) {
    console.error('Error processing inbound email:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
