import express from 'express';
import { callAgent } from '../flowise-client.js';
import { supabase } from '../services/supabaseClient.js';

const router = express.Router();

// POST /api/agent/run
// Called by Vercel frontend when user triggers an agent
router.post('/run', async (req, res) => {
  const { agent, message, client_id, task_type } = req.body;
  
  try {
    // Log task start in Supabase
    const { data: task, error: insertError } = await supabase
      .from('agent_tasks')
      .insert({ agent, message, client_id, task_type, status: 'running' })
      .select().single();

    if (insertError) {
      throw new Error(`Failed to log task start in Supabase: ${insertError.message}`);
    }

    // Call Flowise agent
    const result = await callAgent(agent, message);

    // Log result in Supabase
    const { error: updateError } = await supabase
      .from('agent_tasks')
      .update({ status: 'completed', output: result, completed_at: new Date() })
      .eq('id', task.id);

    if (updateError) {
      console.error('Failed to log task completion in Supabase:', updateError.message);
    }

    res.json({ success: true, task_id: task.id, result });
  } catch (err) {
    console.error('Agent error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
