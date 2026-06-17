// Master Intelligent Orchestrator
// Integrates all advanced systems into a unified intelligent platform

import { globalIntelligenceManager } from './agentIntelligence.js';
import { globalWorkflowOrchestrator } from './workflowOrchestrator.js';
import { globalCollaborationSystem } from './collaborationSystem.js';
import { globalAnalyticsSystem } from './analyticsSystem.js';

export class IntelligentOrchestrator {
  constructor() {
    this.intelligenceManager = globalIntelligenceManager;
    this.workflowOrchestrator = globalWorkflowOrchestrator;
    this.collaborationSystem = globalCollaborationSystem;
    this.analyticsSystem = globalAnalyticsSystem;
    
    this.activeSessions = new Map();
    this.learningEngine = new LearningEngine();
    this.optimizationEngine = new OptimizationEngine();
    this.predictiveEngine = new PredictiveEngine();
  }

  // Session Management
  createIntelligentSession(userId, sessionConfig = {}) {
    const session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      config: sessionConfig,
      startTime: Date.now(),
      agents: new Set(),
      workflows: new Set(),
      collaborations: new Set(),
      context: {},
      status: 'active'
    };

    this.activeSessions.set(session.id, session);
    
    // Track session creation
    this.analyticsSystem.trackEvent('session_created', {
      sessionId: session.id,
      userId,
      config: sessionConfig
    }, userId);

    return session;
  }

  // Intelligent Agent Selection and Routing
  async selectOptimalAgent(userQuery, sessionId, context = {}) {
    const session = this.activeSessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    // Get available agents
    const availableAgents = Array.from(this.intelligenceManager.agents.values());
    
    // Use predictive engine to determine optimal agent
    const agentScores = await this.predictiveEngine.scoreAgents(userQuery, availableAgents, context);
    
    // Select top agent
    const optimalAgent = agentScores[0];
    
    // Register agent with session
    session.agents.add(optimalAgent.agentName);
    
    // Track agent selection
    this.analyticsSystem.trackEvent('agent_selected', {
      sessionId,
      agentName: optimalAgent.agentName,
      score: optimalAgent.score,
      query: userQuery
    }, session.userId, optimalAgent.agentName);

    return optimalAgent;
  }

  // Intelligent Workflow Execution
  async executeIntelligentWorkflow(workflowType, parameters, sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    // Create optimized workflow
    const workflow = this.workflowOrchestrator.createWorkflow(workflowType, {
      ...parameters,
      sessionId,
      userId: session.userId
    });

    // Register workflow with session
    session.workflows.add(workflow.id);

    // Execute with intelligent monitoring
    const result = await this.executeWorkflowWithIntelligence(workflow, session);

    return result;
  }

  async executeWorkflowWithIntelligence(workflow, session) {
    const startTime = Date.now();
    
    try {
      // Execute workflow
      const result = await this.workflowOrchestrator.executeWorkflow(workflow.id);
      
      // Learn from execution
      await this.learningEngine.learnFromWorkflowExecution(workflow, result, session);
      
      // Optimize future executions
      this.optimizationEngine.optimizeWorkflow(workflow, result);
      
      // Track successful execution
      this.analyticsSystem.trackEvent('workflow_completed', {
        workflowId: workflow.id,
        executionTime: Date.now() - startTime,
        success: true
      }, session.userId);

      return result;
      
    } catch (error) {
      // Track failed execution
      this.analyticsSystem.trackEvent('workflow_failed', {
        workflowId: workflow.id,
        error: error.message,
        executionTime: Date.now() - startTime
      }, session.userId);

      throw error;
    }
  }

  // Intelligent Collaboration
  async createIntelligentCollaboration(participants, task, sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    // Create collaboration room
    const roomId = `collab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const room = this.collaborationSystem.createRoom(roomId, {
      name: `Collaboration: ${task.title}`,
      type: 'intelligent_collaboration'
    });

    // Add participants
    participants.forEach(participant => {
      if (participant.type === 'user') {
        this.collaborationSystem.joinRoom(roomId, participant.id, 'user');
      } else if (participant.type === 'agent') {
        this.collaborationSystem.joinRoom(roomId, participant.id, 'agent');
      }
    });

    // Register collaboration with session
    session.collaborations.add(roomId);

    // Initialize intelligent agents in collaboration
    await this.initializeCollaborationAgents(roomId, task);

    // Track collaboration creation
    this.analyticsSystem.trackEvent('collaboration_created', {
      roomId,
      participants: participants.length,
      task: task.title
    }, session.userId);

    return room;
  }

  async initializeCollaborationAgents(roomId, task) {
    // Select relevant agents based on task
    const relevantAgents = await this.selectRelevantAgents(task);
    
    // Add agents to collaboration
    for (const agent of relevantAgents) {
      this.collaborationSystem.joinRoom(roomId, agent.agentName, 'agent');
      
      // Initialize agent with task context
      agent.addToContext({
        task: task.title,
        description: task.description,
        requirements: task.requirements,
        roomId
      });
    }
  }

  async selectRelevantAgents(task) {
    const availableAgents = Array.from(this.intelligenceManager.agents.values());
    const relevantAgents = [];

    for (const agent of availableAgents) {
      const relevance = await this.calculateTaskRelevance(agent, task);
      if (relevance > 0.7) { // 70% relevance threshold
        relevantAgents.push({
          agentName: agent.agentName,
          relevance,
          agent
        });
      }
    }

    return relevantAgents
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 3) // Limit to top 3 agents
      .map(item => item.agent);
  }

  async calculateTaskRelevance(agent, task) {
    const taskKeywords = this.extractKeywords(task.description);
    const agentCapabilities = agent.specializedKnowledge;
    
    let relevance = 0;
    let matches = 0;

    taskKeywords.forEach(keyword => {
      agentCapabilities.forEach(([type, patterns]) => {
        patterns.forEach(pattern => {
          if (pattern.pattern.toLowerCase().includes(keyword.toLowerCase())) {
            relevance += pattern.confidence;
            matches++;
          }
        });
      });
    });

    return matches > 0 ? relevance / matches : 0;
  }

  extractKeywords(text) {
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = text.toLowerCase().split(/\s+/);
    return words.filter(word => 
      word.length > 2 && !stopWords.includes(word)
    );
  }

  // Intelligent Response Generation
  async generateIntelligentResponse(userQuery, sessionId, context = {}) {
    const session = this.activeSessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    // Select optimal agent
    const optimalAgent = await this.selectOptimalAgent(userQuery, sessionId, context);
    
    // Get agent intelligence
    const agent = this.intelligenceManager.getAgent(optimalAgent.agentName);
    
    // Generate intelligent response
    const response = await this.generateContextualResponse(agent, userQuery, context, session);
    
    // Learn from interaction
    await this.learningEngine.learnFromInteraction(agent, userQuery, response, session);
    
    // Track response generation
    this.analyticsSystem.trackEvent('response_generated', {
      agentName: optimalAgent.agentName,
      query: userQuery,
      responseLength: response.length,
      responseTime: Date.now() - session.startTime
    }, session.userId, optimalAgent.agentName);

    return {
      agent: optimalAgent.agentName,
      response,
      confidence: optimalAgent.score,
      context: agent.getRelevantContext(userQuery)
    };
  }

  async generateContextualResponse(agent, userQuery, context, session) {
    // Get relevant context
    const relevantContext = agent.getRelevantContext(userQuery);
    const sessionContext = session.context;
    
    // Combine contexts
    const combinedContext = {
      ...context,
      ...sessionContext,
      relevantHistory: relevantContext
    };

    // Generate response using agent's intelligence
    const baseResponse = await agent.generateResponse(userQuery, combinedContext);
    
    // Enhance response with context
    const enhancedResponse = this.enhanceResponseWithContext(baseResponse, combinedContext);
    
    // Update session context
    session.context = {
      ...session.context,
      lastQuery: userQuery,
      lastResponse: enhancedResponse,
      timestamp: Date.now()
    };

    return enhancedResponse;
  }

  enhanceResponseWithContext(response, context) {
    let enhancedResponse = response;
    
    // Add context-specific enhancements
    if (context.relevantHistory && context.relevantHistory.length > 0) {
      enhancedResponse += `\n\nBased on our previous interactions, I can also suggest: ${context.relevantHistory[0].value}`;
    }
    
    if (context.userPreferences) {
      enhancedResponse += `\n\nI've tailored this response to your preferences for ${context.userPreferences.style || 'professional'} style.`;
    }
    
    return enhancedResponse;
  }

  // Analytics and Insights
  getIntelligentInsights(sessionId = null, timeRange = '24h') {
    const insights = {
      system: this.analyticsSystem.generateInsights(timeRange),
      intelligence: this.getIntelligenceInsights(timeRange),
      workflows: this.getWorkflowInsights(timeRange),
      collaborations: this.getCollaborationInsights(timeRange)
    };

    if (sessionId) {
      insights.session = this.getSessionInsights(sessionId);
    }

    return insights;
  }

  getIntelligenceInsights(timeRange) {
    const agents = Array.from(this.intelligenceManager.agents.values());
    
    return {
      totalAgents: agents.length,
      averagePerformance: agents.reduce((sum, agent) => 
        sum + agent.performanceMetrics.successRate, 0) / agents.length,
      topPerformers: agents
        .sort((a, b) => b.performanceMetrics.successRate - a.performanceMetrics.successRate)
        .slice(0, 5)
        .map(agent => ({
          name: agent.agentName,
          successRate: agent.performanceMetrics.successRate,
          tasksCompleted: agent.performanceMetrics.tasksCompleted
        })),
      learningProgress: agents.map(agent => ({
        name: agent.agentName,
        learningHistorySize: agent.learningHistory.length,
        memorySize: agent.memory.size
      }))
    };
  }

  getWorkflowInsights(timeRange) {
    const workflows = this.workflowOrchestrator.workflows;
    const recentWorkflows = Array.from(workflows.values())
      .filter(wf => Date.now() - wf.startTime < this.getTimeRangeInMs(timeRange));

    return {
      totalWorkflows: recentWorkflows.length,
      successRate: recentWorkflows.filter(wf => wf.status === 'completed').length / recentWorkflows.length,
      averageExecutionTime: recentWorkflows.reduce((sum, wf) => 
        sum + (wf.endTime - wf.startTime), 0) / recentWorkflows.length,
      popularTemplates: this.getPopularWorkflowTemplates(recentWorkflows)
    };
  }

  getCollaborationInsights(timeRange) {
    const rooms = this.collaborationSystem.rooms;
    const recentRooms = Array.from(rooms.values())
      .filter(room => Date.now() - room.lastActivity < this.getTimeRangeInMs(timeRange));

    return {
      totalCollaborations: recentRooms.length,
      averageParticipants: recentRooms.reduce((sum, room) => 
        sum + room.users.size + room.agents.size, 0) / recentRooms.length,
      activeCollaborations: recentRooms.filter(room => room.status === 'active').length
    };
  }

  getSessionInsights(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    return {
      sessionId: session.id,
      duration: Date.now() - session.startTime,
      agentsUsed: session.agents.size,
      workflowsExecuted: session.workflows.size,
      collaborationsCreated: session.collaborations.size,
      contextSize: Object.keys(session.context).length
    };
  }

  getPopularWorkflowTemplates(workflows) {
    const templateCounts = {};
    workflows.forEach(wf => {
      templateCounts[wf.template] = (templateCounts[wf.template] || 0) + 1;
    });

    return Object.entries(templateCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([template, count]) => ({ template, count }));
  }

  getTimeRangeInMs(timeRange) {
    const timeRangeMap = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    
    return timeRangeMap[timeRange] || timeRangeMap['24h'];
  }

  // System Optimization
  async optimizeSystem() {
    const optimizations = {
      agents: await this.optimizationEngine.optimizeAgents(),
      workflows: await this.optimizationEngine.optimizeWorkflows(),
      collaborations: await this.optimizationEngine.optimizeCollaborations(),
      analytics: await this.optimizationEngine.optimizeAnalytics()
    };

    return optimizations;
  }

  // Export/Import System State
  exportSystemState() {
    return {
      intelligence: this.intelligenceManager.exportAllIntelligenceData(),
      workflows: this.workflowOrchestrator.exportAllIntelligenceData(),
      collaborations: this.collaborationSystem.exportAnalyticsData(),
      analytics: this.analyticsSystem.exportAnalyticsData(),
      sessions: Array.from(this.activeSessions.entries())
    };
  }

  importSystemState(data) {
    if (data.intelligence) {
      this.intelligenceManager.importAllIntelligenceData(data.intelligence);
    }
    if (data.workflows) {
      // Import workflow data
    }
    if (data.collaborations) {
      this.collaborationSystem.importAnalyticsData(data.collaborations);
    }
    if (data.analytics) {
      this.analyticsSystem.importAnalyticsData(data.analytics);
    }
    if (data.sessions) {
      this.activeSessions = new Map(data.sessions);
    }
  }
}

// Learning Engine for continuous improvement
class LearningEngine {
  async learnFromWorkflowExecution(workflow, result, session) {
    // Learn from workflow performance
    const performance = this.analyzeWorkflowPerformance(workflow, result);
    
    // Update agent learning
    if (result.workflow && result.targetAgent) {
      const agent = globalIntelligenceManager.getAgent(result.targetAgent);
      if (agent) {
        agent.learnFromInteraction(
          `Workflow: ${workflow.template}`,
          `Result: ${result.success ? 'Success' : 'Failed'}`,
          performance.score
        );
      }
    }
  }

  async learnFromInteraction(agent, userQuery, response, session) {
    // Learn from user interaction
    const interactionQuality = this.assessInteractionQuality(userQuery, response);
    
    agent.learnFromInteraction(userQuery, response, interactionQuality);
    
    // Update session learning
    session.context.interactionHistory = session.context.interactionHistory || [];
    session.context.interactionHistory.push({
      query: userQuery,
      response,
      quality: interactionQuality,
      timestamp: Date.now()
    });
  }

  analyzeWorkflowPerformance(workflow, result) {
    const executionTime = result.executionTime || 0;
    const success = result.success || false;
    
    return {
      score: success ? 1.0 : 0.0,
      executionTime,
      efficiency: executionTime < workflow.estimatedDuration ? 1.0 : 0.5
    };
  }

  assessInteractionQuality(userQuery, response) {
    // Simple quality assessment based on response length and content
    const responseLength = response.length;
    const hasContext = response.includes('Based on') || response.includes('context');
    const hasSuggestions = response.includes('suggest') || response.includes('recommend');
    
    let quality = 0.5; // Base quality
    
    if (responseLength > 100) quality += 0.2;
    if (hasContext) quality += 0.2;
    if (hasSuggestions) quality += 0.1;
    
    return Math.min(quality, 1.0);
  }
}

// Optimization Engine for system improvement
class OptimizationEngine {
  async optimizeAgents() {
    const agents = Array.from(globalIntelligenceManager.agents.values());
    const optimizations = [];

    agents.forEach(agent => {
      if (agent.performanceMetrics.successRate < 0.8) {
        optimizations.push({
          agent: agent.agentName,
          type: 'performance_improvement',
          recommendation: 'Review and update training data'
        });
      }
    });

    return optimizations;
  }

  async optimizeWorkflows() {
    const workflows = Array.from(globalWorkflowOrchestrator.workflows.values());
    const optimizations = [];

    workflows.forEach(workflow => {
      const workflowOptimizations = globalWorkflowOrchestrator.optimizeWorkflow(workflow.id);
      optimizations.push(...workflowOptimizations);
    });

    return optimizations;
  }

  async optimizeCollaborations() {
    // Optimize collaboration settings
    return [];
  }

  async optimizeAnalytics() {
    // Optimize analytics data retention and processing
    return [];
  }
}

// Predictive Engine for intelligent decision making
class PredictiveEngine {
  async scoreAgents(userQuery, availableAgents, context) {
    const scores = [];

    for (const agent of availableAgents) {
      const score = await this.calculateAgentScore(agent, userQuery, context);
      scores.push({
        agentName: agent.agentName,
        score,
        agent
      });
    }

    return scores.sort((a, b) => b.score - a.score);
  }

  async calculateAgentScore(agent, userQuery, context) {
    let score = 0;

    // Base score from performance
    score += agent.performanceMetrics.successRate * 0.4;

    // Context relevance score
    const relevantContext = agent.getRelevantContext(userQuery);
    score += (relevantContext.length / 10) * 0.3;

    // Query-agent match score
    const queryMatch = this.calculateQueryMatch(agent, userQuery);
    score += queryMatch * 0.3;

    return score;
  }

  calculateQueryMatch(agent, userQuery) {
    const queryKeywords = userQuery.toLowerCase().split(' ');
    const agentCapabilities = agent.specializedKnowledge;
    
    let matches = 0;
    let totalKeywords = queryKeywords.length;

    queryKeywords.forEach(keyword => {
      agentCapabilities.forEach(([type, patterns]) => {
        patterns.forEach(pattern => {
          if (pattern.pattern.toLowerCase().includes(keyword)) {
            matches++;
          }
        });
      });
    });

    return matches / totalKeywords;
  }
}

// Initialize the global intelligent orchestrator
export const globalIntelligentOrchestrator = new IntelligentOrchestrator(); 