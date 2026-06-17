// StudioMode Inter-Agent Communication System
// Enables agents within StudioMode to communicate and collaborate with each other

import { agentDefinitions } from './agentDefinitions';
import { aiServiceIntegration } from './aiServiceIntegration';

// Agent collaboration network
class StudioModeAgentNetwork {
  constructor() {
    this.agents = new Map();
    this.collaborationRooms = new Map();
    this.taskQueue = [];
    this.communicationHistory = [];
    this.activeCollaborations = new Set();
  }

  // Register an agent in the network
  registerAgent(agentName, capabilities = []) {
    const agent = agentDefinitions.find(a => a.name === agentName);
    if (!agent) {
      throw new Error(`Agent ${agentName} not found in definitions`);
    }

    this.agents.set(agentName, {
      ...agent,
      capabilities: capabilities.length > 0 ? capabilities : agent.keyFunctions,
      status: 'available',
      currentTask: null,
      collaborationHistory: [],
      performance: {
        tasksCompleted: 0,
        successRate: 1.0,
        averageResponseTime: 0
      }
    });

    console.log(`🤖 Agent ${agentName} registered in StudioMode network`);
    return this.agents.get(agentName);
  }

  // Create a collaboration room between agents
  createCollaborationRoom(agents, task, roomType = 'task-based') {
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const room = {
      id: roomId,
      agents: new Set(agents),
      task: task,
      type: roomType,
      status: 'active',
      createdAt: new Date(),
      messages: [],
      sharedResources: new Map(),
      taskProgress: {
        completed: 0,
        total: 1,
        currentStep: 'initialization'
      }
    };

    this.collaborationRooms.set(roomId, room);
    this.activeCollaborations.add(roomId);

    // Notify all agents in the room
    agents.forEach(agentName => {
      const agent = this.agents.get(agentName);
      if (agent) {
        agent.status = 'collaborating';
        agent.collaborationHistory.push({
          roomId,
          task,
          joinedAt: new Date()
        });
      }
    });

    console.log(`👥 Collaboration room ${roomId} created with agents: ${agents.join(', ')}`);
    return room;
  }

  // Send message between agents
  async sendAgentMessage(fromAgent, toAgent, message, context = {}) {
    const timestamp = new Date();
    const messageId = `msg_${timestamp.getTime()}_${Math.random().toString(36).substr(2, 9)}`;

    const agentMessage = {
      id: messageId,
      from: fromAgent,
      to: toAgent,
      message: message,
      context: context,
      timestamp: timestamp,
      status: 'sent'
    };

    // Add to communication history
    this.communicationHistory.push(agentMessage);

    // Find the target agent
    const targetAgent = this.agents.get(toAgent);
    if (!targetAgent) {
      agentMessage.status = 'failed';
      agentMessage.error = `Agent ${toAgent} not found`;
      return agentMessage;
    }

    // Process the message based on agent type
    try {
      const response = await this.processAgentMessage(targetAgent, message, context);
      agentMessage.status = 'delivered';
      agentMessage.response = response;
      
      // Update agent performance
      targetAgent.performance.tasksCompleted++;
      
      return agentMessage;
    } catch (error) {
      agentMessage.status = 'failed';
      agentMessage.error = error.message;
      return agentMessage;
    }
  }

  // Process incoming message for an agent
  async processAgentMessage(agent, message, context) {
    const lowerMessage = message.toLowerCase();
    console.log(`[StudioMode] Processing message for agent: ${agent.name}, role: ${agent.role}, message: ${message}`);
    try {
      // Advanced routing: choose AI method based on agent role
      if (agent.role.includes('Design') || lowerMessage.includes('image') || lowerMessage.includes('design')) {
        // Design/Image agent (PixelWitch, DesignDex, etc.)
        return await aiServiceIntegration.generateImage(message, { service: 'puter', size: '1024x1024', quality: 'standard' });
      } else if (agent.role.includes('Video') || lowerMessage.includes('video') || lowerMessage.includes('animation')) {
        // Video agent (ClipCrafter, Trendywood, etc.)
        return await aiServiceIntegration.generateVideo(message, { service: 'puter', duration: 10, quality: 'standard' });
      } else if (agent.role.includes('Audio') || lowerMessage.includes('audio') || lowerMessage.includes('music') || lowerMessage.includes('sound')) {
        // Audio agent (SonicVibe, etc.)
        return await aiServiceIntegration.generateAudio(message, { service: 'puter', voice: 'alloy', speed: 1.0 });
      } else if (agent.role.includes('SEO') || lowerMessage.includes('seo')) {
        // SEO agent (RankRover, etc.)
        return await aiServiceIntegration.generateText(message, { service: 'puter', model: 'openai/gpt-4', maxTokens: 1200, temperature: 0.6 });
      } else if (agent.role.includes('Prompt Engineer') || agent.name === 'Promptify') {
        // Prompt engineering agent (Promptify)
        // Use advanced prompt engineering and function-calling if available
        return await aiServiceIntegration.generateText(message, { service: 'puter', model: 'openai/gpt-4', maxTokens: 1200, temperature: 0.5 }, null, { functions: ['optimizePrompt'] });
      } else if (agent.role.includes('Copy') || lowerMessage.includes('copy') || lowerMessage.includes('content') || agent.role.includes('Writer') || agent.role.includes('Blog') || agent.role.includes('Book')) {
        // Copy/content agents (AdGenie, ContentCrafter, BlogSmith, BookSmith, etc.)
        return await aiServiceIntegration.generateText(message, { service: 'puter', model: 'openai/gpt-4', maxTokens: 2000, temperature: 0.7 });
      } else if (agent.role.includes('Email') || agent.name === 'MailMage') {
        // Email agent (MailMage)
        return await aiServiceIntegration.generateText(message, { service: 'puter', model: 'openai/gpt-4', maxTokens: 1000, temperature: 0.7 }, null, { functions: ['generateEmail'] });
      } else if (agent.role.includes('Social Media') || agent.name === 'PostPilot') {
        // Social media agent (PostPilot)
        return await aiServiceIntegration.generateText(message, { service: 'puter', model: 'openai/gpt-4', maxTokens: 800, temperature: 0.8 }, null, { functions: ['generateSocialPost'] });
      } else if (agent.role.includes('Analytics') || agent.name === 'PulseTrack') {
        // Analytics agent (PulseTrack)
        return await aiServiceIntegration.generateText(message, { service: 'puter', model: 'openai/gpt-4', maxTokens: 1200, temperature: 0.5 }, null, { functions: ['analyzeData'] });
      } else if (agent.role.includes('Strategy') || agent.name === 'StratoBoss' || agent.name === 'BizDevStrategist') {
        // Strategy agents (StratoBoss, BizDevStrategist)
        return await aiServiceIntegration.generateText(message, { service: 'puter', model: 'openai/gpt-4', maxTokens: 1500, temperature: 0.6 }, null, { functions: ['generateStrategy'] });
      } else if (agent.role.includes('Funnel') || agent.name === 'FunnelManager') {
        // Funnel manager
        return await aiServiceIntegration.generateText(message, { service: 'puter', model: 'openai/gpt-4', maxTokens: 1200, temperature: 0.6 }, null, { functions: ['generateFunnel'] });
      } else if (agent.role.includes('Trend') || agent.name === 'TrendScout') {
        // Trend analysis
        return await aiServiceIntegration.generateText(message, { service: 'puter', model: 'openai/gpt-4', maxTokens: 1200, temperature: 0.7 }, null, { functions: ['analyzeTrends'] });
      } else if (agent.role.includes('Feedback') || agent.name === 'FeedbackLoop') {
        // Feedback processor
        return await aiServiceIntegration.generateText(message, { service: 'puter', model: 'openai/gpt-4', maxTokens: 800, temperature: 0.5 }, null, { functions: ['processFeedback'] });
      } else if (agent.role.includes('Ebook') || agent.name === 'EbookStylist') {
        // Ebook formatting
        return await aiServiceIntegration.generateText(message, { service: 'puter', model: 'openai/gpt-4', maxTokens: 1200, temperature: 0.6 }, null, { functions: ['formatEbook'] });
      } else if (agent.role.includes('Course') || agent.name === 'CourseCraft') {
        // Course generator
        return await aiServiceIntegration.generateText(message, { service: 'puter', model: 'openai/gpt-4', maxTokens: 1500, temperature: 0.7 }, null, { functions: ['generateCourse'] });
      } else if (agent.role.includes('Poem') || agent.name === 'PoeticAI') {
        // Poem/spoken word
        return await aiServiceIntegration.generateText(message, { service: 'puter', model: 'openai/gpt-4', maxTokens: 600, temperature: 0.9 }, null, { functions: ['generatePoem'] });
      } else if (agent.role.includes('Paraphrasing') || agent.name === 'ArticleRewriter') {
        // Article rewriter
        return await aiServiceIntegration.generateText(message, { service: 'puter', model: 'openai/gpt-4', maxTokens: 1200, temperature: 0.7 }, null, { functions: ['rewriteArticle'] });
      } else {
        // General fallback (text)
        return await aiServiceIntegration.generateText(message, { service: 'puter', model: 'openai/gpt-4', maxTokens: 1000, temperature: 0.7 });
      }
    } catch (error) {
      console.error(`[StudioMode] Agent processing error for ${agent.name}:`, error);
      return { type: 'error', content: `Agent ${agent.name} failed: ${error.message}`, agent: agent.name };
    }
  }

  // Assign task from TrendyAI Core to specific agent
  async assignTask(fromAgent, toAgent, task, priority = 'normal') {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const taskAssignment = {
      id: taskId,
      from: fromAgent,
      to: toAgent,
      task: task,
      priority: priority,
      status: 'assigned',
      assignedAt: new Date(),
      completedAt: null,
      result: null
    };

    this.taskQueue.push(taskAssignment);

    // Find the target agent
    const targetAgent = this.agents.get(toAgent);
    if (!targetAgent) {
      taskAssignment.status = 'failed';
      taskAssignment.error = `Agent ${toAgent} not found`;
      return taskAssignment;
    }

    // Update agent status
    targetAgent.status = 'busy';
    targetAgent.currentTask = taskAssignment;

    try {
      // Process the task
      const result = await this.processAgentMessage(targetAgent, task, { priority });
      
      taskAssignment.status = 'completed';
      taskAssignment.completedAt = new Date();
      taskAssignment.result = result;

      // Update agent performance
      targetAgent.performance.tasksCompleted++;
      targetAgent.status = 'available';
      targetAgent.currentTask = null;

      return taskAssignment;
    } catch (error) {
      taskAssignment.status = 'failed';
      taskAssignment.error = error.message;
      targetAgent.status = 'available';
      targetAgent.currentTask = null;
      return taskAssignment;
    }
  }

  // Get agent status and capabilities
  getAgentStatus(agentName) {
    const agent = this.agents.get(agentName);
    if (!agent) return null;

    return {
      name: agent.name,
      status: agent.status,
      currentTask: agent.currentTask,
      capabilities: agent.capabilities,
      performance: agent.performance,
      collaborationHistory: agent.collaborationHistory
    };
  }

  // Get all available agents
  getAvailableAgents() {
    return Array.from(this.agents.values())
      .filter(agent => agent.status === 'available')
      .map(agent => ({
        name: agent.name,
        role: agent.role,
        capabilities: agent.capabilities,
        performance: agent.performance
      }));
  }

  // Get collaboration statistics
  getCollaborationStats() {
    return {
      totalAgents: this.agents.size,
      activeCollaborations: this.activeCollaborations.size,
      totalRooms: this.collaborationRooms.size,
      totalMessages: this.communicationHistory.length,
      totalTasks: this.taskQueue.length,
      completedTasks: this.taskQueue.filter(t => t.status === 'completed').length
    };
  }

  // Get recent communication history
  getRecentCommunication(limit = 10) {
    return this.communicationHistory
      .slice(-limit)
      .reverse()
      .map(msg => ({
        id: msg.id,
        from: msg.from,
        to: msg.to,
        message: msg.message,
        status: msg.status,
        timestamp: msg.timestamp,
        response: msg.response
      }));
  }

  // Get active collaboration rooms
  getActiveRooms() {
    return Array.from(this.collaborationRooms.values())
      .filter(room => room.status === 'active')
      .map(room => ({
        id: room.id,
        agents: Array.from(room.agents),
        task: room.task,
        type: room.type,
        createdAt: room.createdAt,
        taskProgress: room.taskProgress
      }));
  }
}

// Create global instance
export const globalStudioModeNetwork = new StudioModeAgentNetwork();

// Initialize with default agents
export const initializeStudioModeNetwork = () => {
  // Register all StudioMode agents
  agentDefinitions.forEach(agent => {
    globalStudioModeNetwork.registerAgent(agent.name, agent.keyFunctions);
  });

  console.log(`🎯 StudioMode Agent Network initialized with ${agentDefinitions.length} agents`);
  return globalStudioModeNetwork;
};

// Export utility functions
export const studioModeAgentUtils = {
  // Send message between agents
  sendMessage: (fromAgent, toAgent, message, context) => 
    globalStudioModeNetwork.sendAgentMessage(fromAgent, toAgent, message, context),

  // Assign task from TrendyAI Core
  assignTask: (fromAgent, toAgent, task, priority) => 
    globalStudioModeNetwork.assignTask(fromAgent, toAgent, task, priority),

  // Create collaboration room
  createRoom: (agents, task, roomType) => 
    globalStudioModeNetwork.createCollaborationRoom(agents, task, roomType),

  // Get agent status
  getAgentStatus: (agentName) => 
    globalStudioModeNetwork.getAgentStatus(agentName),

  // Get available agents
  getAvailableAgents: () => 
    globalStudioModeNetwork.getAvailableAgents(),

  // Get collaboration stats
  getStats: () => 
    globalStudioModeNetwork.getCollaborationStats(),

  // Get recent communication
  getRecentMessages: (limit) => 
    globalStudioModeNetwork.getRecentCommunication(limit),

  // Get active rooms
  getActiveRooms: () => 
    globalStudioModeNetwork.getActiveRooms()
};

// Automated workflow: Core -> Promptify -> Core (verify) -> Final Agent -> Core (review)
export async function startAutomatedWorkflow(task, finalAgent) {
  // 1. TrendyAI Core assigns to Promptify
  const promptifyResult = await globalStudioModeNetwork.assignTask(
    'TrendyAI Core', 'Promptify', task
  );
  if (promptifyResult.status !== 'completed') throw new Error('Promptify failed');

  // 2. Promptify returns to TrendyAI Core for verification
  const verificationResult = await globalStudioModeNetwork.assignTask(
    'Promptify', 'TrendyAI Core', promptifyResult.result?.content || promptifyResult.result
  );
  if (verificationResult.status !== 'completed') throw new Error('Verification failed');

  // 3. TrendyAI Core assigns to final agent
  const finalResult = await globalStudioModeNetwork.assignTask(
    'TrendyAI Core', finalAgent, verificationResult.result?.content || verificationResult.result
  );
  if (finalResult.status !== 'completed') throw new Error('Final agent failed');

  // 4. Final agent returns to TrendyAI Core
  const reviewResult = await globalStudioModeNetwork.assignTask(
    finalAgent, 'TrendyAI Core', finalResult.result?.content || finalResult.result
  );
  if (reviewResult.status !== 'completed') throw new Error('Final review failed');

  return reviewResult;
} 