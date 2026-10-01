import { Router } from 'express';
import { runBatchAnalysis } from '../services/intelligence/batchAnalyzer';
import { getMockInsights } from '../db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // const insights = await runBatchAnalysis(); // offline bypass
    res.json(getMockInsights());
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
