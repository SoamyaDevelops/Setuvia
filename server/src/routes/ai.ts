import { Router } from 'express';
import { AIService } from '../services/ai/AIService';

const router = Router();

router.post('/test', async (req, res) => {
  try {
    const { prompt, forceMock } = req.body;

    const response = await AIService.run({
      task: 'test_gate',
      prompt: prompt || 'Hello, are you working?',
      modelClass: 'FAST',
      forceMock: !!forceMock
    });

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
