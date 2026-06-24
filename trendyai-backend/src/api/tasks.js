import express from "express";
import { supabase } from "../services/supabaseClient.js";

const router = express.Router();

// GET /api/tasks/approvals
// Fetch all pending approvals from approval_queue
router.get("/approvals", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("approval_queue")
      .select("*, client:clients(name)")
      .eq("status", "pending");

    if (error)
      throw error;
    res.json({ success: true, approvals: data });
  }
  catch (err) {
    console.error("Fetch approvals error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tasks/:id/approve
router.post("/:id/approve", async (req, res) => {
  const { id } = req.params;
  const { reviewer_notes } = req.body;

  try {
    // 1. Update approval queue status
    const { data: approval, error: appError } = await supabase
      .from("approval_queue")
      .update({
        status: "approved",
        reviewed_at: new Date(),
        reviewer_notes,
      })
      .eq("id", id)
      .select()
      .single();

    if (appError)
      throw appError;

    // 2. Update parent agent task status
    const { error: taskError } = await supabase
      .from("agent_tasks")
      .update({
        status: "completed",
        approved_at: new Date(),
        approved_by: "human",
      })
      .eq("id", approval.task_id);

    if (taskError)
      throw taskError;

    // 3. Trigger Activepieces webhook if configured
    const activepiecesUrl = process.env.ACTIVEPIECES_URL;
    if (activepiecesUrl) {
      try {
        await fetch(`${activepiecesUrl}/api/v1/webhooks/publish`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task_id: approval.task_id, approval_id: id }),
        });
      }
      catch (webhookErr) {
        console.error("Activepieces webhook trigger failed:", webhookErr.message);
      }
    }

    res.json({ success: true, message: "Task approved and queued for publishing." });
  }
  catch (err) {
    console.error("Approve task error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tasks/:id/reject
router.post("/:id/reject", async (req, res) => {
  const { id } = req.params;
  const { reviewer_notes } = req.body;

  try {
    const { data: approval, error: appError } = await supabase
      .from("approval_queue")
      .update({
        status: "rejected",
        reviewed_at: new Date(),
        reviewer_notes,
      })
      .eq("id", id)
      .select()
      .single();

    if (appError)
      throw appError;

    const { error: taskError } = await supabase
      .from("agent_tasks")
      .update({ status: "failed" })
      .eq("id", approval.task_id);

    if (taskError)
      throw taskError;

    res.json({ success: true, message: "Task rejected." });
  }
  catch (err) {
    console.error("Reject task error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tasks/:id/revision
router.post("/:id/revision", async (req, res) => {
  const { id } = req.params;
  const { reviewer_notes } = req.body;

  try {
    const { data: approval, error: appError } = await supabase
      .from("approval_queue")
      .update({
        status: "revision_requested",
        reviewed_at: new Date(),
        reviewer_notes,
      })
      .eq("id", id)
      .select()
      .single();

    if (appError)
      throw appError;

    const { error: taskError } = await supabase
      .from("agent_tasks")
      .update({ status: "awaiting_approval", feedback: reviewer_notes })
      .eq("id", approval.task_id);

    if (taskError)
      throw taskError;

    res.json({ success: true, message: "Revision requested." });
  }
  catch (err) {
    console.error("Revision task error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
