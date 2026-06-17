// Advanced AI Agent Intelligence System
// This system provides enhanced intelligence, memory, and learning capabilities for TrendyAI agents

export class AgentIntelligence {
  constructor(agentName, agentType) {
    this.agentName = agentName;
    this.agentType = agentType;
    this.memory = new Map();
    this.learningHistory = [];
    this.contextWindow = [];
    this.performanceMetrics = {
      tasksCompleted: 0,
      successRate: 0,
      averageResponseTime: 0,
      userSatisfaction: 0
    };
    this.specializedKnowledge = new Map();
    this.collaborationHistory = [];
  }

  // Memory Management System
  addToMemory(key, value, importance = 1) {
    const memoryEntry = {
      value,
      timestamp: Date.now(),
      importance,
      accessCount: 0,
      lastAccessed: Date.now()
    };
    this.memory.set(key, memoryEntry);
    this.cleanupOldMemory();
  }

  getFromMemory(key) {
    const entry = this.memory.get(key);
    if (entry) {
      entry.accessCount++;
      entry.lastAccessed = Date.now();
      return entry.value;
    }
    return null;
  }

  cleanupOldMemory() {
    const maxMemorySize = 1000;
    if (this.memory.size > maxMemorySize) {
      const entries = Array.from(this.memory.entries());
      entries.sort((a, b) => {
        const scoreA = a[1].importance * a[1].accessCount;
        const scoreB = b[1].importance * b[1].accessCount;
        return scoreA - scoreB;
      });
      
      const toRemove = entries.slice(0, this.memory.size - maxMemorySize);
      toRemove.forEach(([key]) => this.memory.delete(key));
    }
  }

  // Context Management
  addToContext(context) {
    this.contextWindow.push({
      ...context,
      timestamp: Date.now()
    });
    
    // Keep only last 10 context entries
    if (this.contextWindow.length > 10) {
      this.contextWindow.shift();
    }
  }

  getRelevantContext(userQuery) {
    return this.contextWindow.filter(context => 
      this.calculateRelevance(context, userQuery) > 0.5
    );
  }

  calculateRelevance(context, query) {
    const contextText = JSON.stringify(context).toLowerCase();
    const queryText = query.toLowerCase();
    const words = queryText.split(' ');
    const matches = words.filter(word => contextText.includes(word));
    return matches.length / words.length;
  }

  // Learning System
  learnFromInteraction(userQuery, response, feedback) {
    const learningEntry = {
      userQuery,
      response,
      feedback,
      timestamp: Date.now(),
      success: feedback > 0.7
    };
    
    this.learningHistory.push(learningEntry);
    this.updatePerformanceMetrics(learningEntry);
    this.extractPatterns(learningEntry);
  }

  updatePerformanceMetrics(learningEntry) {
    this.performanceMetrics.tasksCompleted++;
    
    if (learningEntry.success) {
      this.performanceMetrics.successRate = 
        (this.performanceMetrics.successRate * (this.performanceMetrics.tasksCompleted - 1) + 1) / 
        this.performanceMetrics.tasksCompleted;
    } else {
      this.performanceMetrics.successRate = 
        (this.performanceMetrics.successRate * (this.performanceMetrics.tasksCompleted - 1)) / 
        this.performanceMetrics.tasksCompleted;
    }
  }

  extractPatterns(learningEntry) {
    // Extract common patterns from successful interactions
    if (learningEntry.success) {
      const patterns = this.analyzeQueryPattern(learningEntry.userQuery);
      patterns.forEach(pattern => {
        if (!this.specializedKnowledge.has(pattern.type)) {
          this.specializedKnowledge.set(pattern.type, []);
        }
        this.specializedKnowledge.get(pattern.type).push(pattern);
      });
    }
  }

  analyzeQueryPattern(query) {
    const patterns = [];
    
    // Intent patterns
    if (query.toLowerCase().includes('create') || query.toLowerCase().includes('generate')) {
      patterns.push({ type: 'creation', pattern: 'create/generate', confidence: 0.8 });
    }
    
    if (query.toLowerCase().includes('edit') || query.toLowerCase().includes('modify')) {
      patterns.push({ type: 'modification', pattern: 'edit/modify', confidence: 0.8 });
    }
    
    if (query.toLowerCase().includes('analyze') || query.toLowerCase().includes('review')) {
      patterns.push({ type: 'analysis', pattern: 'analyze/review', confidence: 0.8 });
    }
    
    // Domain patterns
    if (query.toLowerCase().includes('brand') || query.toLowerCase().includes('logo')) {
      patterns.push({ type: 'branding', pattern: 'brand/logo', confidence: 0.9 });
    }
    
    if (query.toLowerCase().includes('website') || query.toLowerCase().includes('web')) {
      patterns.push({ type: 'web_development', pattern: 'website/web', confidence: 0.9 });
    }
    
    return patterns;
  }

  // Enhanced Decision Making
  makeIntelligentDecision(userQuery, availableOptions) {
    const context = this.getRelevantContext(userQuery);
    const patterns = this.analyzeQueryPattern(userQuery);
    const memory = this.searchMemory(userQuery);
    
    const decisionFactors = {
      context: context.length > 0 ? 0.3 : 0,
      patterns: patterns.length > 0 ? 0.3 : 0,
      memory: memory.length > 0 ? 0.2 : 0,
      performance: this.performanceMetrics.successRate * 0.2
    };
    
    // Score each option based on decision factors
    const scoredOptions = availableOptions.map(option => ({
      ...option,
      score: this.calculateOptionScore(option, decisionFactors, patterns)
    }));
    
    // Return the best option
    return scoredOptions.sort((a, b) => b.score - a.score)[0];
  }

  calculateOptionScore(option, decisionFactors, patterns) {
    let score = 0;
    
    // Base score from performance
    score += decisionFactors.performance;
    
    // Pattern matching score
    patterns.forEach(pattern => {
      if (option.type === pattern.type) {
        score += pattern.confidence * decisionFactors.patterns;
      }
    });
    
    // Context relevance score
    if (decisionFactors.context > 0) {
      score += decisionFactors.context;
    }
    
    // Memory relevance score
    if (decisionFactors.memory > 0) {
      score += decisionFactors.memory;
    }
    
    return score;
  }

  searchMemory(query) {
    const results = [];
    const queryWords = query.toLowerCase().split(' ');
    
    this.memory.forEach((entry, key) => {
      const keyWords = key.toLowerCase().split(' ');
      const matches = queryWords.filter(word => 
        keyWords.some(keyWord => keyWord.includes(word) || word.includes(keyWord))
      );
      
      if (matches.length > 0) {
        results.push({
          key,
          value: entry.value,
          relevance: matches.length / queryWords.length,
          lastAccessed: entry.lastAccessed
        });
      }
    });
    
    return results.sort((a, b) => b.relevance - a.relevance);
  }

  // Collaboration Intelligence
  recordCollaboration(partnerAgent, task, outcome) {
    this.collaborationHistory.push({
      partnerAgent,
      task,
      outcome,
      timestamp: Date.now()
    });
  }

  getBestCollaborationPartners(taskType) {
    const collaborations = this.collaborationHistory.filter(c => 
      c.task.type === taskType && c.outcome.success
    );
    
    const partnerStats = new Map();
    collaborations.forEach(collab => {
      if (!partnerStats.has(collab.partnerAgent)) {
        partnerStats.set(collab.partnerAgent, { count: 0, successRate: 0 });
      }
      const stats = partnerStats.get(collab.partnerAgent);
      stats.count++;
      stats.successRate = (stats.successRate * (stats.count - 1) + 1) / stats.count;
    });
    
    return Array.from(partnerStats.entries())
      .sort((a, b) => b[1].successRate - a[1].successRate)
      .map(([agent, stats]) => ({ agent, ...stats }));
  }

  // Export agent intelligence data
  exportIntelligenceData() {
    return {
      agentName: this.agentName,
      agentType: this.agentType,
      performanceMetrics: this.performanceMetrics,
      specializedKnowledge: Array.from(this.specializedKnowledge.entries()),
      collaborationHistory: this.collaborationHistory,
      memorySize: this.memory.size,
      learningHistorySize: this.learningHistory.length
    };
  }

  // Import agent intelligence data
  importIntelligenceData(data) {
    if (data.agentName === this.agentName) {
      this.performanceMetrics = data.performanceMetrics;
      this.specializedKnowledge = new Map(data.specializedKnowledge);
      this.collaborationHistory = data.collaborationHistory;
    }
  }
}

// Agent Intelligence Manager for coordinating multiple agents
export class AgentIntelligenceManager {
  constructor() {
    this.agents = new Map();
    this.globalMemory = new Map();
    this.workflowHistory = [];
    this.collaborationNetwork = new Map();
  }

  registerAgent(agentName, agentType) {
    const agent = new AgentIntelligence(agentName, agentType);
    this.agents.set(agentName, agent);
    return agent;
  }

  getAgent(agentName) {
    return this.agents.get(agentName);
  }

  // Multi-agent orchestration
  orchestrateMultiAgentTask(task, requiredAgents) {
    const workflow = {
      id: Date.now(),
      task,
      agents: requiredAgents,
      status: 'in_progress',
      steps: [],
      startTime: Date.now()
    };

    this.workflowHistory.push(workflow);
    
    // Execute workflow steps
    return this.executeWorkflow(workflow);
  }

  async executeWorkflow(workflow) {
    const results = [];
    
    for (const agentName of workflow.agents) {
      const agent = this.getAgent(agentName);
      if (agent) {
        const step = {
          agent: agentName,
          startTime: Date.now(),
          status: 'executing'
        };
        
        workflow.steps.push(step);
        
        try {
          // Simulate agent execution
          const result = await this.simulateAgentExecution(agent, workflow.task);
          step.result = result;
          step.status = 'completed';
          step.endTime = Date.now();
          
          results.push(result);
          
          // Record collaboration
          workflow.agents.forEach(partnerAgent => {
            if (partnerAgent !== agentName) {
              agent.recordCollaboration(partnerAgent, workflow.task, { success: true });
            }
          });
          
        } catch (error) {
          step.error = error.message;
          step.status = 'failed';
          step.endTime = Date.now();
        }
      }
    }
    
    workflow.status = 'completed';
    workflow.endTime = Date.now();
    
    return {
      workflow,
      results
    };
  }

  async simulateAgentExecution(agent, task) {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
    
    // Generate intelligent response based on agent type
    const response = this.generateIntelligentResponse(agent, task);
    
    // Learn from this interaction
    agent.learnFromInteraction(task.description, response, Math.random() * 0.3 + 0.7);
    
    return {
      agent: agent.agentName,
      response,
      processingTime: Date.now() - task.startTime,
      confidence: Math.random() * 0.3 + 0.7
    };
  }

  generateIntelligentResponse(agent, task) {
    const patterns = agent.analyzeQueryPattern(task.description);
    const context = agent.getRelevantContext(task.description);
    
    let response = `Intelligent response from ${agent.agentName}: `;
    
    if (patterns.length > 0) {
      response += `I've identified ${patterns.length} patterns in your request. `;
    }
    
    if (context.length > 0) {
      response += `I'm using ${context.length} relevant context items. `;
    }
    
    response += `Based on my specialized knowledge and ${agent.performanceMetrics.tasksCompleted} previous tasks, `;
    response += `I'll execute this with ${(agent.performanceMetrics.successRate * 100).toFixed(1)}% confidence.`;
    
    return response;
  }

  // Global intelligence features
  getGlobalInsights() {
    const insights = {
      totalAgents: this.agents.size,
      totalWorkflows: this.workflowHistory.length,
      averageSuccessRate: 0,
      mostCollaborativeAgents: [],
      topPerformingAgents: []
    };
    
    if (this.agents.size > 0) {
      const successRates = Array.from(this.agents.values())
        .map(agent => agent.performanceMetrics.successRate);
      insights.averageSuccessRate = successRates.reduce((a, b) => a + b, 0) / successRates.length;
      
      insights.topPerformingAgents = Array.from(this.agents.entries())
        .map(([name, agent]) => ({
          name,
          successRate: agent.performanceMetrics.successRate,
          tasksCompleted: agent.performanceMetrics.tasksCompleted
        }))
        .sort((a, b) => b.successRate - a.successRate)
        .slice(0, 5);
    }
    
    return insights;
  }

  // Export all intelligence data
  exportAllIntelligenceData() {
    const data = {
      agents: {},
      globalMemory: Array.from(this.globalMemory.entries()),
      workflowHistory: this.workflowHistory,
      insights: this.getGlobalInsights()
    };
    
    this.agents.forEach((agent, name) => {
      data.agents[name] = agent.exportIntelligenceData();
    });
    
    return data;
  }
}

// Initialize the global intelligence manager
export const globalIntelligenceManager = new AgentIntelligenceManager(); 