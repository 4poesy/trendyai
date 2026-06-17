import { agentDefinitions } from './agentDefinitions';

// Simple keyword-based matching for agent routing
export function findBestAgentsForPrompt(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  // Score agents by keyword matches in keyFunctions and description
  const scored = agentDefinitions.map(agent => {
    let score = 0;
    // Check key functions
    agent.keyFunctions.forEach(fn => {
      if (lowerPrompt.includes(fn.toLowerCase().split(' ')[0])) score += 2;
      if (lowerPrompt.includes(fn.toLowerCase())) score += 3;
    });
    // Check description
    if (lowerPrompt.includes(agent.description.toLowerCase().split(' ')[0])) score += 1;
    if (lowerPrompt.includes(agent.description.toLowerCase())) score += 2;
    // Check agent name
    if (lowerPrompt.includes(agent.name.toLowerCase())) score += 2;
    return { agent, score };
  });
  // Sort by score descending
  const sorted = scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score);
  // Return agent names (or all if no match)
  return sorted.length ? sorted.map(s => s.agent.name) : ["TrendyAI Core"];
} 