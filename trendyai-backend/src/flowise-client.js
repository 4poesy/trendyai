// flowise-client.js
// Calls Flowise agents from Railway backend

import { env } from "./env.js";

const FLOWISE_BASE_URL = env.FLOWISE_URL || "http://localhost:3002";
const FLOWISE_API_KEY = env.FLOWISE_API_KEY || "trendyai";

const AGENT_IDS = {
  trendyai_core: env.AGENT_TRENDYAI_CORE,
  client_flow: env.AGENT_CLIENT_FLOW,
  content_smith: env.AGENT_CONTENT_SMITH,
  strato_boss: env.AGENT_STRATO_BOSS,
  web_wiz: env.AGENT_WEB_WIZ,
  pixel_dex: env.AGENT_PIXEL_DEX,
  media_wiz: env.AGENT_MEDIA_WIZ,
  pulse_pilot: env.AGENT_PULSE_PILOT,
};

export async function callAgent(agentSlug, message, sessionId = null) {
  const chatflowId = AGENT_IDS[agentSlug];

  if (!chatflowId) {
    throw new Error(`Unknown agent: ${agentSlug}. Available: ${Object.keys(AGENT_IDS).join(", ")}`);
  }

  const body = {
    question: message,
    ...(sessionId && { sessionId }),
  };

  const response = await fetch(
    `${FLOWISE_BASE_URL}/api/v1/prediction/${chatflowId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${FLOWISE_API_KEY}`,
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Flowise error ${response.status}: ${error}`);
  }

  const data = await response.json();
  return data.text || data;
}

export async function routeRequest(userMessage, clientId = null) {
  // Step 1: Send to TrendyAI Core for routing
  const routingResult = await callAgent("trendyai_core", userMessage);

  let routing;
  try {
    // Parse the JSON routing decision
    const jsonMatch = routingResult.match(/\{[\s\S]*\}/);
    routing = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  }
  catch (e) {
    console.error("Routing parse error:", e);
    return { error: "Routing failed", raw: routingResult };
  }

  if (!routing) {
    return { error: "No routing decision returned" };
  }

  // Step 2: Convert agent name to slug
  const agentSlugMap = {
    "ContentSmith": "content_smith",
    "ClientFlow": "client_flow",
    "StratoBoss": "strato_boss",
    "WebWiz": "web_wiz",
    "PixelDex": "pixel_dex",
    "MediaWiz": "media_wiz",
    "PulsePilot": "pulse_pilot",
    "TrendyAI Core": "trendyai_core",
  };

  const targetSlug = agentSlugMap[routing.route_to];

  if (!targetSlug) {
    return {
      routing,
      error: `Unknown agent in routing: ${routing.route_to}`,
    };
  }

  // Step 3: Call the target agent
  const agentResult = await callAgent(
    targetSlug,
    routing.brief || userMessage,
    clientId,
  );

  return {
    routing,
    agent_used: routing.route_to,
    result: agentResult,
    requires_human_approval: routing.requires_human_approval,
  };
}
