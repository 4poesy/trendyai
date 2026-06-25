import { createClient } from "@supabase/supabase-js";
import express from "express";
import { env } from "../env.js";
import { callAgent, callAgentWithContext, routeRequest } from "../flowise-client.js";
import defaultSupabaseClient from "../services/supabaseClient.js";

const router = express.Router();

// Initialize Supabase with service role key if available, otherwise fallback to default client
const supabaseUrl = env.SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey)
  : defaultSupabaseClient;

// Helper function to validate if a string is a valid UUID format
function isValidUUID(uuid) {
  if (typeof uuid !== "string")
    return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// POST /api/agent/run
// Direct agent call — used by dashboard
router.post("/run", async (req, res) => {
  const { agent, message, client_id, task_type } = req.body;

  if (!agent || !message) {
    return res.status(400).json({ error: "agent and message are required" });
  }

  // Ensure UUID safety check for client_id to prevent database insertion crashes
  const cleanClientId = isValidUUID(client_id) ? client_id : null;

  try {
    // Log task start
    const { data: task, error: insertError } = await supabase
      .from("agent_tasks")
      .insert({
        agent,
        message,
        client_id: cleanClientId,
        task_type,
        status: "running",
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to log task start in Supabase: ${insertError.message}`);
    }

    // Call Flowise agent with client context
    const result = await callAgentWithContext(agent, message, cleanClientId);

    // Save result
    const { error: updateError } = await supabase
      .from("agent_tasks")
      .update({
        status: "awaiting_approval",
        output: typeof result === "string"
          ? { text: result }
          : result,
        completed_at: new Date(),
      })
      .eq("id", task.id);

    if (updateError) {
      console.error("Failed to log task completion in Supabase:", updateError.message);
    }

    res.json({
      success: true,
      task_id: task.id,
      result,
      requires_approval: true,
    });
  }
  catch (err) {
    console.error("Agent error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// POST /api/agent/chain
// Sequential agent chaining (ContentSmith -> PulsePilot)
router.post("/chain", async (req, res) => {
  const { initial_agent, message, client_id, chain_to } = req.body;

  if (!initial_agent || !message || !chain_to) {
    return res.status(400).json({ error: "initial_agent, message, and chain_to are required" });
  }

  const cleanClientId = isValidUUID(client_id) ? client_id : null;

  try {
    // Step 1: Run first agent
    const firstResult = await callAgentWithContext(
      initial_agent,
      message,
      cleanClientId
    );

    // Step 2: Chain to second agent
    const chainedResult = await callAgentWithContext(
      chain_to,
      `Based on this content, create social media posts: ${firstResult}`,
      cleanClientId
    );

    // Save both tasks to Supabase as awaiting_approval
    const { error: insertError } = await supabase.from("agent_tasks").insert([
      {
        agent: initial_agent,
        message: message,
        output: typeof firstResult === "string" ? { text: firstResult } : firstResult,
        client_id: cleanClientId,
        status: "awaiting_approval",
        completed_at: new Date()
      },
      {
        agent: chain_to,
        message: `Based on this content, create social media posts: ${firstResult}`,
        output: typeof chainedResult === "string" ? { text: chainedResult } : chainedResult,
        client_id: cleanClientId,
        status: "awaiting_approval",
        completed_at: new Date()
      }
    ]);

    if (insertError) {
      console.error("Failed to save chained tasks to Supabase:", insertError.message);
    }

    res.json({
      success: true,
      [initial_agent]: firstResult,
      [chain_to]: chainedResult,
      requires_approval: true
    });
  }
  catch (err) {
    console.error("Chain error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// POST /api/agent/route
// Smart routing — TrendyAI Core decides which agent to use
router.post("/route", async (req, res) => {
  const { message, client_id } = req.body;

  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  // Ensure UUID safety check for client_id to prevent database insertion crashes
  const cleanClientId = isValidUUID(client_id) ? client_id : null;

  try {
    const result = await routeRequest(message, cleanClientId);

    // Save to Supabase if approval needed
    if (result.requires_human_approval) {
      const { error: approvalError } = await supabase
        .from("approval_queue")
        .insert({
          agent: result.agent_used,
          client_id: cleanClientId,
          output_summary: message.substring(0, 200),
          output_full: result,
          status: "pending",
        });

      if (approvalError) {
        console.error("Failed to insert into approval queue:", approvalError.message);
      }
    }

    res.json({ success: true, ...result });
  }
  catch (err) {
    console.error("Route error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// GET /api/agent/status
// Check all agents are reachable (executed in parallel for speed)
router.get("/status", async (req, res) => {
  const agents = [
    "trendyai_core",
    "client_flow",
    "content_smith",
    "strato_boss",
    "web_wiz",
    "pixel_dex",
    "media_wiz",
    "pulse_pilot",
  ];

  const status = {};

  await Promise.all(
    agents.map(async (agent) => {
      try {
        await callAgent(agent, "ping", null);
        status[agent] = "online";
      }
      catch (err) {
        console.warn(`Agent ${agent} status check failed:`, err.message);
        status[agent] = "offline";
      }
    }),
  );

  res.json({ agents: status, timestamp: new Date() });
});

export default router;
