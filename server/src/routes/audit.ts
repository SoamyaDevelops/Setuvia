import { Router } from 'express';
import { getAuditLogs } from '../services/audit/auditLogger';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const logs = await getAuditLogs();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

export default router;
