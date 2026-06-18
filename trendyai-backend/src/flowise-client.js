// flowise-client.js - Calls Flowise agents from Railway backend

import { AGENT_IDS, FLOWISE_BASE_URL } from './flowise-agent-ids.js';

export async function callAgent(agentSlug, message, sessionId = null) {
  const chatflowId = AGENT_IDS[agentSlug];
  if (!chatflowId) throw new Error(`Unknown agent: ${agentSlug}`);

  const body = {
    question: message,
    ...(sessionId && { sessionId })
  };

  const response = await fetch(`${FLOWISE_BASE_URL}/api/v1/prediction/${chatflowId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) throw new Error(`Flowise error: ${response.status}`);
  
  const data = await response.json();
  return data.text || data;
}
