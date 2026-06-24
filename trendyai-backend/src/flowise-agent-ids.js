// flowise-agent-ids.js
// These IDs come from your local Flowise instance
// In production, these will point to your VPS Flowise URL

export const AGENT_IDS = {
  trendyai_core: "PASTE_FLOWISE_ID_HERE",
  client_flow: "PASTE_FLOWISE_ID_HERE",
  content_smith: "PASTE_FLOWISE_ID_HERE",
  strato_boss: "PASTE_FLOWISE_ID_HERE",
  web_wiz: "PASTE_FLOWISE_ID_HERE",
  pixel_dex: "PASTE_FLOWISE_ID_HERE",
  media_wiz: "PASTE_FLOWISE_ID_HERE",
  pulse_pilot: "PASTE_FLOWISE_ID_HERE",
};

export const FLOWISE_BASE_URL = process.env.FLOWISE_URL || "http://localhost:3002";
