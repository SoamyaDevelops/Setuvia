import { Router } from 'express';
import { query } from '../db';
import { z } from 'zod';
import { logAudit } from '../services/audit/auditLogger';
import { validateAction } from '../services/resolution/actionValidator';
import { AIService } from '../services/ai/AIService';
import OpenAI from 'openai';

// Initialize OpenAI
const getOpenAI = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });


const router = Router();

// Schema for creating a case
const createCaseSchema = z.object({
  customerId: z.string(),
  issueType: z.string(),
  summary: z.string(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

// Create a new case
router.post('/', async (req, res) => {
  try {
    const data = createCaseSchema.parse(req.body);
    const caseId = `CASE-${Math.floor(10000 + Math.random() * 90000)}`;
    
    // In a real app we'd also insert the customer if they don't exist
    // and check org_id. We're keeping it simple for the MVP demo.
    const result = await query(
      `INSERT INTO cases (id, customer_id, issue_type, summary, priority, status)
       VALUES ($1, $2, $3, $4, $5, 'OPEN') RETURNING *`,
      [caseId, data.customerId, data.issueType, data.summary, data.priority]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating case:', error);
    res.status(400).json({ error: 'Failed to create case' });
  }
});

// Get case by ID (with events timeline)
router.get('/:id', async (req, res) => {
  try {
    const result = await query(`SELECT * FROM cases WHERE id = $1`, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Case not found' });
    
    // Fetch timeline events
    const events = await query(`SELECT * FROM case_events WHERE case_id = $1 ORDER BY created_at ASC`, [req.params.id]);
    
    res.json({
      ...result.rows[0],
      timeline: events.rows
    });
  } catch (error) {
    // For MVP demo without DB, return a fake case
    res.json({
      id: req.params.id,
      status: 'OPEN',
      issue_type: 'Billing Clarification',
      summary: 'Patient believes there is a duplicate charge.',
      timeline: [
        { actor: 'customer', action: 'CREATED', created_at: new Date().toISOString() }
      ]
    });
  }
});

// Execute an action on a case
router.post('/:id/actions', async (req, res) => {
  try {
    const { action, payload, actor, actor_id } = req.body;
    
    // Simulate role. Real app extracts from JWT.
    const userRole = actor === 'agent' ? 'AGENT' : 'CUSTOMER';

    try {
      // Validate against rules engine
      validateAction({ action, payload }, userRole);
    } catch (ruleError: any) {
      // Log the rule block
      await logAudit(actor_id || 'system', userRole, action, req.params.id, { error: ruleError.message, status: 'BLOCKED_BY_RULE' });
      return res.status(403).json({ error: ruleError.message, blocked: true });
    }

    await query(
      `INSERT INTO case_events (case_id, actor, actor_id, action, result) VALUES ($1, $2, $3, $4, $5)`,
      [req.params.id, actor || 'agent', actor_id || 'system', action, JSON.stringify(payload)]
    );

    // Audit log successful action
    await logAudit(actor_id || 'system', userRole, action, req.params.id, { payload, status: 'SUCCESS' });

    // If closing, update case
    if (action === 'CLOSE_CASE') {
      await query(`UPDATE cases SET status = 'CLOSED', updated_at = now() WHERE id = $1`, [req.params.id]);
    } else if (action === 'GENERATE_REPLY' || action === 'ANSWER') {
      await query(`UPDATE cases SET status = 'AWAITING_CUSTOMER', updated_at = now() WHERE id = $1`, [req.params.id]);
    }

    let aiReply = "Thank you. An agent is reviewing your request.";

    // Use AI Service for response
    if (action === 'MESSAGE' && userRole === 'CUSTOMER') {
      const msg = payload.message || "";
      
      try {
        const aiResponse = await AIService.run({
          task: 'generate_reply',
          prompt: `You are Setuvia AI, an intelligent customer support assistant. The customer sent: "${msg}". Provide a helpful, direct, and concise reply in 1-2 sentences.`,
          modelClass: 'FAST',
          forceMock: false
        });
        
        aiReply = aiResponse.text;
      } catch (e: any) {
        console.error('AI Service Error:', e);
        aiReply = "I'm currently unable to process your request. An agent will review it shortly.";
      }
      
      // Save the AI's reply to the timeline
      await query(
        `INSERT INTO case_events (case_id, actor, actor_id, action, result) VALUES ($1, $2, $3, $4, $5)`,
        [req.params.id, 'system', 'AI', 'MESSAGE', JSON.stringify({ message: aiReply })]
      );
    }

    res.json({ success: true, result: aiReply });
  } catch (error) {
    console.error('Failed to execute action', error);
    res.status(500).json({ error: 'Failed to execute action' });
  }
});

// Get all cases (Agent dashboard)
router.get('/', async (req, res) => {
  try {
    const result = await query(`SELECT * FROM cases ORDER BY created_at DESC LIMIT 50`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update case status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const result = await query(
      `UPDATE cases SET status = $1, updated_at = now() WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update case' });
  }
});

export default router;
