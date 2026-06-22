import { Router } from 'express';
import { supabase } from '../services/supabaseClient.js';

const router = Router();
const BRIDGE_URL = process.env.BRIDGE_URL || 'http://localhost:4500';
const BRIDGE_SECRET = process.env.BRIDGE_SECRET || 'trendyai_bridge_secret_2024';

// Helper to call the bridge
async function callBridge(endpoint, body) {
  try {
    const url = `${BRIDGE_URL}${endpoint}`;
    console.log(`[BACKEND] Calling bridge: ${url}`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bridge-secret': BRIDGE_SECRET
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Bridge responded with status ${response.status}: ${errText}`);
    }
    
    return await response.json();
  } catch (err) {
    console.error('[BACKEND] callBridge error:', err.message);
    throw err;
  }
}

// POST /api/v1/audits/run
// Called by dashboard/client when an audit is requested
router.post('/run', async (req, res) => {
  const { client_id, url, skill_type, package_type } = req.body;

  if (!url || !skill_type) {
    return res.status(400).json({ error: 'url and skill_type are required' });
  }

  try {
    // 1. Create a task record in agent_tasks
    const { data: task, error: taskError } = await supabase
      .from('agent_tasks')
      .insert({
        agent: 'StratoBoss',
        client_id: client_id || null,
        task_type: skill_type,
        message: `Run ${skill_type} audit on ${url}`,
        status: 'pending'
      })
      .select().single();

    if (taskError) {
      console.error('[BACKEND] Error inserting task:', taskError);
      throw new Error(`Supabase task insertion failed: ${taskError.message}`);
    }

    // 2. Call the local bridge API in background
    const endpoint = skill_type === 'agency_full'
      ? '/agency-audit'
      : '/run-skill';

    // Call bridge asynchronously (do not await, let it process in background)
    callBridge(endpoint, {
      url,
      client_id,
      task_id: task.id,
      skill_type,
      package_type
    }).catch(bridgeErr => {
      console.error('[BACKEND] Async bridge call failed:', bridgeErr.message);
    });

    res.json({
      success: true,
      task_id: task.id,
      message: 'Audit started — results will appear in dashboard when complete'
    });

  } catch (err) {
    console.error('[BACKEND] Audit run error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/audits/:client_id
// Fetch all audit reports for a client
router.get('/:client_id', async (req, res) => {
  const { client_id } = req.params;

  try {
    const { data, error } = await supabase
      .from('audit_reports')
      .select('*')
      .eq('client_id', client_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, reports: data });
  } catch (err) {
    console.error('[BACKEND] Fetch client audits error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/audits/report/:report_id
// Fetch one specific report
router.get('/report/:report_id', async (req, res) => {
  const { report_id } = req.params;

  try {
    const { data, error } = await supabase
      .from('audit_reports')
      .select('*')
      .eq('id', report_id)
      .single();

    if (error) throw error;
    res.json({ success: true, report: data });
  } catch (err) {
    console.error('[BACKEND] Fetch report error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
