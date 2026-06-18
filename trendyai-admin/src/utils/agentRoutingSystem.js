// Agent Routing System - Connects AgentGrid to StudioMode
// This system enables seamless communication between AgentGrid agents and StudioMode agents

import { agentDefinitions } from './agentDefinitions';
import { aiServiceIntegration } from './aiServiceIntegration';

// Agent mapping between AgentGrid and StudioMode
const agentGridToStudioMapping = {
  // Consolidated 8-Agent Grid Mappings
  'trendyai-core': 'TrendyAI Core',
  'clientflow': 'ClientFlow',
  'stratoboss': 'StratoBoss',
  'contentsmith': 'ContentSmith',
  'pixeldex': 'PixelDex',
  'mediawiz': 'MediaWiz',
  'webwiz': 'WebWiz',
  'pulsepilot': 'PulsePilot',
  
  // Legacy / Fallback Mappings (to prevent runtime breaks)
  'onboarding-agent': 'ClientFlow',
  'bizdev-strategist': 'ClientFlow',
  'clientsuccessagent': 'ClientFlow',
  
  'content-crafter': 'ContentSmith',
  'blogsmith': 'ContentSmith',
  'booksmith': 'ContentSmith',
  'coursecraft': 'ContentSmith',
  'poeticai': 'ContentSmith',
  'articlerewriter': 'ContentSmith',
  
  'pixelwitch': 'PixelDex',
  'designdex': 'PixelDex',
  'ebookstylist': 'PixelDex',
  
  'clipcrafter': 'MediaWiz',
  'trendywood': 'MediaWiz',
  'sonicvibe': 'MediaWiz',
  
  'rankrover': 'StratoBoss',
  'trendscout': 'StratoBoss',
  
  'adgenie': 'PulsePilot',
  'mailmage': 'PulsePilot',
  'postpilot': 'PulsePilot',
  'pulsetrack': 'PulsePilot',
  'feedbackloop': 'PulsePilot',
  'funnelmanager': 'PulsePilot',
  'promptify': 'TrendyAI Core',
  'promptwizard': 'TrendyAI Core'
};

// Reverse mapping for StudioMode to AgentGrid
const studioToAgentGridMapping = Object.fromEntries(
  Object.entries(agentGridToStudioMapping).map(([key, value]) => [value, key])
);

// Agent Routing System Class
export class AgentRoutingSystem {
  constructor() {
    this.activeConnections = new Map();
    this.routingHistory = [];
    this.performanceMetrics = {
      totalRoutings: 0,
      successfulRoutings: 0,
      failedRoutings: 0,
      averageResponseTime: 0
    };
  }

  // Route request from AgentGrid to StudioMode
  async routeToStudioMode(agentGridId, userMessage, context = {}) {
    const startTime = Date.now();
    const studioAgentName = agentGridToStudioMapping[agentGridId];
    
    if (!studioAgentName) {
      throw new Error(`No StudioMode agent mapping found for AgentGrid agent: ${agentGridId}`);
    }

    try {
      console.log(`🔄 Routing from AgentGrid ${agentGridId} to StudioMode ${studioAgentName}`);
      
      // Find the StudioMode agent definition
      const studioAgent = agentDefinitions.find(a => a.name === studioAgentName);
      if (!studioAgent) {
        throw new Error(`StudioMode agent not found: ${studioAgentName}`);
      }

      // Create routing context
      const routingContext = {
        source: 'agentgrid',
        sourceAgentId: agentGridId,
        targetAgent: studioAgentName,
        userMessage,
        timestamp: new Date(),
        ...context
      };

      // Execute the routing workflow
      const result = await this.executeStudioModeWorkflow(studioAgent, userMessage, routingContext);
      
      // Update performance metrics
      const responseTime = Date.now() - startTime;
      this.updatePerformanceMetrics(true, responseTime);
      
      // Log routing history
      this.routingHistory.push({
        ...routingContext,
        result,
        responseTime,
        success: true
      });

      return {
        success: true,
        sourceAgent: agentGridId,
        targetAgent: studioAgentName,
        result,
        responseTime
      };

    } catch (error) {
      console.error(`❌ Routing failed from ${agentGridId} to StudioMode:`, error);
      
      // Update performance metrics
      const responseTime = Date.now() - startTime;
      this.updatePerformanceMetrics(false, responseTime);
      
      // Log routing history
      this.routingHistory.push({
        source: 'agentgrid',
        sourceAgentId: agentGridId,
        targetAgent: studioAgentName,
        userMessage,
        timestamp: new Date(),
        error: error.message,
        responseTime,
        success: false
      });

      return {
        success: false,
        sourceAgent: agentGridId,
        targetAgent: studioAgentName,
        error: error.message,
        responseTime
      };
    }
  }

  // Execute StudioMode workflow (similar to StudioMode's executeEnhancedWorkflow)
  async executeStudioModeWorkflow(studioAgent, userMessage, context) {
    // Step 1: Analyze intent and complexity
    const taskComplexity = this.classifyTaskComplexity(userMessage, studioAgent);
    
    // Step 2: Choose workflow based on complexity
    if (taskComplexity === 'high-level-strategy') {
      return await this.executeTwoTierWorkflow(userMessage, studioAgent, context);
    } else if (taskComplexity === 'moderate-complexity') {
      return await this.executeSingleTierWorkflow(userMessage, studioAgent, context);
    } else {
      return await this.executeDirectWorkflow(userMessage, studioAgent, context);
    }
  }

  // Two-tier workflow for high-level strategy tasks
  async executeTwoTierWorkflow(userMessage, studioAgent, context) {
    // Step 1: PromptWizard creates high-level strategy
    const strategyPrompt = await this.createStrategyPrompt(userMessage, studioAgent);
    
    // Step 2: Promptify optimizes the strategy prompt
    const optimizedPrompt = await this.craftOptimizedPrompt(strategyPrompt, studioAgent);
    
    // Step 3: Execute with optimized prompt
    const result = await this.executeTaskWithPrompt(studioAgent, optimizedPrompt, context);
    
    return {
      workflow: 'two-tier',
      targetAgent: studioAgent.name,
      strategyPrompt,
      optimizedPrompt,
      result
    };
  }

  // Single-tier workflow for moderate complexity tasks
  async executeSingleTierWorkflow(userMessage, studioAgent, context) {
    // Step 1: Actually call Promptify as an agent
    const { globalStudioModeNetwork } = require('./studioModeAgentCommunication');
    const promptifyResult = await globalStudioModeNetwork.assignTask(
      'TrendyAI Core', 'Promptify', userMessage
    );
    if (promptifyResult.status !== 'completed') throw new Error('Promptify failed: ' + (promptifyResult.error || ''));

    // Step 2: Use Promptify's output as the optimized prompt
    const optimizedPrompt = promptifyResult.result?.content || promptifyResult.result;

    // Step 3: Execute with optimized prompt
    const result = await this.executeTaskWithPrompt(studioAgent, optimizedPrompt, context);

    return {
      workflow: 'single-tier',
      targetAgent: studioAgent.name,
      optimizedPrompt,
      result
    };
  }

  // Direct workflow for simple tasks
  async executeDirectWorkflow(userMessage, studioAgent, context) {
    // Execute directly without prompt optimization
    const result = await this.executeTaskWithPrompt(studioAgent, userMessage, context);
    
    return {
      workflow: 'direct',
      targetAgent: studioAgent.name,
      result
    };
  }

  // Create strategy prompt using PromptWizard
  async createStrategyPrompt(userMessage, studioAgent) {
    const basePrompt = userMessage;
    let strategyPrompt = basePrompt;
    
    // Professional quality indicators
    const professionalKeywords = [
      'hyperrealistic', 'ultra-realistic', 'photorealistic', 'cinematic', '4k', '8k',
      'professional', 'studio-quality', 'commercial-grade', 'award-winning', 'premium',
      'responsive', 'mobile-first', 'adaptive', 'cross-platform', 'multi-device',
      'user experience', 'user interface', 'ux/ui', 'wireframe', 'prototype',
      'full-stack', 'frontend', 'backend', 'api', 'database', 'cloud', 'serverless',
      'cinematic', 'film-quality', 'broadcast', 'commercial', 'advertising',
      'studio-quality', 'professional audio', 'mastering', 'mixing', 'recording',
      'seo-optimized', 'conversion-focused', 'persuasive', 'compelling', 'engaging',
      'enterprise', 'corporate', 'b2b', 'b2c', 'saas', 'ecommerce', 'marketplace'
    ];
    
    const hasProfessionalKeywords = professionalKeywords.some(keyword => 
      basePrompt.toLowerCase().includes(keyword)
    );
    
    // Add strategic context based on agent type and quality requirements
    if (studioAgent.role.includes('Business') || studioAgent.role.includes('Strategy')) {
      strategyPrompt = `Strategic Business Request: "${basePrompt}". Consider market positioning, competitive landscape, target audience analysis, and long-term business objectives. ${hasProfessionalKeywords ? 'Focus on enterprise-grade, professional quality deliverables that meet industry standards and best practices.' : ''} Develop a comprehensive strategic approach that aligns with business goals.`;
    } else if (studioAgent.role.includes('Design')) {
      if (basePrompt.toLowerCase().includes('brand') || basePrompt.toLowerCase().includes('identity')) {
        strategyPrompt = `Brand Strategy Request: "${basePrompt}". Consider brand positioning, visual identity system, brand guidelines, market research, competitor analysis, and brand architecture. ${hasProfessionalKeywords ? 'Ensure all design elements meet professional standards with high-resolution, responsive design principles, and industry best practices.' : ''} Develop a cohesive brand strategy.`;
      } else if (hasProfessionalKeywords) {
        strategyPrompt = `Professional Design Request: "${basePrompt}". Focus on high-quality, commercial-grade design with attention to detail, professional standards, and industry best practices. Consider responsive design, accessibility, and cross-platform compatibility.`;
      }
    } else if (studioAgent.role.includes('Video') || studioAgent.role.includes('Motion')) {
      if (basePrompt.toLowerCase().includes('campaign') || basePrompt.toLowerCase().includes('series')) {
        strategyPrompt = `Video Campaign Strategy: "${basePrompt}". Consider storytelling arc, audience engagement, platform optimization, content calendar, performance metrics, and cross-platform distribution strategy. ${hasProfessionalKeywords ? 'Ensure cinematic quality, professional post-production, and broadcast standards.' : ''}`;
      } else if (hasProfessionalKeywords) {
        strategyPrompt = `Professional Video Request: "${basePrompt}". Focus on cinematic quality, professional camera work, high-resolution output, and industry-standard post-production techniques.`;
      }
    } else if (studioAgent.role.includes('Web') || studioAgent.role.includes('Development')) {
      if (hasProfessionalKeywords) {
        strategyPrompt = `Professional Web Development Request: "${basePrompt}". Focus on responsive design, mobile-first approach, performance optimization, accessibility standards, SEO best practices, and modern development frameworks. Ensure enterprise-grade quality and scalability.`;
      }
    } else if (studioAgent.role.includes('Audio') || studioAgent.role.includes('Music')) {
      if (hasProfessionalKeywords) {
        strategyPrompt = `Professional Audio Request: "${basePrompt}". Focus on studio-quality production, professional mixing and mastering, high-fidelity output, and industry-standard audio processing techniques.`;
      }
    } else if (studioAgent.role.includes('Marketing') || studioAgent.role.includes('Campaign')) {
      strategyPrompt = `Marketing Strategy Request: "${basePrompt}". Consider target audience segmentation, channel strategy, messaging framework, performance metrics, budget allocation, and campaign timeline. ${hasProfessionalKeywords ? 'Ensure professional quality, data-driven approach, and measurable ROI.' : ''}`;
    }
    
    return strategyPrompt;
  }

  // Prompt crafting function
  async craftOptimizedPrompt(userMessage, studioAgent) {
    const basePrompt = userMessage;
    let optimizedPrompt = basePrompt;
    
    // Professional quality indicators
    const professionalKeywords = [
      'hyperrealistic', 'ultra-realistic', 'photorealistic', 'cinematic', '4k', '8k',
      'professional', 'studio-quality', 'commercial-grade', 'award-winning', 'premium',
      'responsive', 'mobile-first', 'adaptive', 'cross-platform', 'multi-device',
      'user experience', 'user interface', 'ux/ui', 'wireframe', 'prototype',
      'full-stack', 'frontend', 'backend', 'api', 'database', 'cloud', 'serverless',
      'cinematic', 'film-quality', 'broadcast', 'commercial', 'advertising',
      'studio-quality', 'professional audio', 'mastering', 'mixing', 'recording',
      'seo-optimized', 'conversion-focused', 'persuasive', 'compelling', 'engaging',
      'enterprise', 'corporate', 'b2b', 'b2c', 'saas', 'ecommerce', 'marketplace'
    ];
    
    const hasProfessionalKeywords = professionalKeywords.some(keyword => 
      basePrompt.toLowerCase().includes(keyword)
    );
    
    // Add context based on agent capabilities and quality requirements
    if (studioAgent.role.includes('Design')) {
      if (hasProfessionalKeywords) {
        optimizedPrompt = `Create a professional, high-quality design for: "${basePrompt}". Focus on commercial-grade quality, high-resolution output, responsive design principles, accessibility standards, and industry best practices. Ensure pixel-perfect execution and professional presentation.`;
      } else {
        optimizedPrompt = `Create a professional design for: "${basePrompt}". Consider brand consistency, visual hierarchy, and modern design principles. Focus on ${studioAgent.keyFunctions[0].toLowerCase()}.`;
      }
    } else if (studioAgent.role.includes('Copy')) {
      if (hasProfessionalKeywords) {
        optimizedPrompt = `Write professional, conversion-focused copy for: "${basePrompt}". Target audience: professionals. Tone: authoritative and persuasive. Include strategic call-to-action and SEO optimization. Focus on ${studioAgent.keyFunctions[0].toLowerCase()} with data-driven approach.`;
      } else {
        optimizedPrompt = `Write compelling copy for: "${basePrompt}". Target audience: professionals. Tone: engaging and persuasive. Include call-to-action. Focus on ${studioAgent.keyFunctions[0].toLowerCase()}.`;
      }
    } else if (studioAgent.role.includes('Video')) {
      if (hasProfessionalKeywords) {
        optimizedPrompt = `Create professional video content for: "${basePrompt}". Style: cinematic and engaging. Focus on high-resolution output, professional camera work, industry-standard post-production, and broadcast-quality results.`;
      } else {
        optimizedPrompt = `Create video content for: "${basePrompt}". Style: modern and engaging. Duration: 30-60 seconds. Include visual storytelling elements.`;
      }
    } else if (studioAgent.role.includes('Web') || studioAgent.role.includes('Development')) {
      if (hasProfessionalKeywords) {
        optimizedPrompt = `Develop a professional website for: "${basePrompt}". Focus on responsive design, mobile-first approach, performance optimization, accessibility standards, SEO best practices, and modern development frameworks. Ensure enterprise-grade quality and scalability.`;
      }
    } else if (studioAgent.role.includes('Audio') || studioAgent.role.includes('Music')) {
      if (hasProfessionalKeywords) {
        optimizedPrompt = `Create professional audio content for: "${basePrompt}". Focus on studio-quality production, professional mixing and mastering, high-fidelity output, and industry-standard audio processing techniques.`;
      }
    } else if (studioAgent.role.includes('SEO')) {
      if (hasProfessionalKeywords) {
        optimizedPrompt = `Optimize for professional SEO: "${basePrompt}". Include comprehensive keyword research, technical SEO analysis, meta descriptions, content structure recommendations, and performance optimization strategies.`;
      } else {
        optimizedPrompt = `Optimize for SEO: "${basePrompt}". Include keyword research, meta descriptions, and content structure recommendations.`;
      }
    }
    
    return optimizedPrompt;
  }

  // Task execution with optimized prompt
  async executeTaskWithPrompt(studioAgent, optimizedPrompt, context) {
    // Route to appropriate AI service based on agent type and message content
    const lowerMessage = optimizedPrompt.toLowerCase();
    
    if (studioAgent.role.includes('Design') || lowerMessage.includes('image') || lowerMessage.includes('picture') || lowerMessage.includes('visual')) {
      // Generate image with advanced features
      const imageResult = await aiServiceIntegration.generateImage(optimizedPrompt, {
        size: '1024x1024',
        quality: 'standard'
      });
      
      if (imageResult.success) {
        return {
          type: 'image',
          content: `I've generated an image based on your request: "${optimizedPrompt}". Here's what I created:`,
          mediaUrl: imageResult.imageUrl,
          agent: studioAgent.name
        };
      } else {
        return {
          type: 'error',
          content: `I encountered an issue generating your image: ${imageResult.error}. ${imageResult.fallback?.note || ''}`,
          mediaUrl: imageResult.fallback?.imageUrl,
          agent: studioAgent.name
        };
      }
    } else if (studioAgent.role.includes('Video') || lowerMessage.includes('video') || lowerMessage.includes('animation')) {
      // Generate video with advanced features
      const videoResult = await aiServiceIntegration.generateVideo(optimizedPrompt, {
        duration: 10,
        quality: 'standard'
      });
      
      if (videoResult.success) {
        return {
          type: 'video',
          content: `I've created a video based on your request: "${optimizedPrompt}". Here's what I generated:`,
          mediaUrl: videoResult.videoUrl,
          agent: studioAgent.name
        };
      } else {
        return {
          type: 'error',
          content: `I encountered an issue generating your video: ${videoResult.error}. ${videoResult.fallback?.note || ''}`,
          mediaUrl: videoResult.fallback?.videoUrl,
          agent: studioAgent.name
        };
      }
    } else if (studioAgent.role.includes('Audio') || lowerMessage.includes('audio') || lowerMessage.includes('music') || lowerMessage.includes('sound')) {
      // Generate audio with advanced features
      const audioResult = await aiServiceIntegration.generateAudio(optimizedPrompt, {
        voice: 'alloy',
        speed: 1.0
      });
      
      if (audioResult.success) {
        return {
          type: 'audio',
          content: `I've created audio based on your request: "${optimizedPrompt}". Here's what I generated:`,
          mediaUrl: audioResult.audioUrl,
          agent: studioAgent.name
        };
      } else {
        return {
          type: 'error',
          content: `I encountered an issue generating your audio: ${audioResult.error}. ${audioResult.fallback?.note || ''}`,
          agent: studioAgent.name
        };
      }
    } else if (studioAgent.role.includes('Code') || lowerMessage.includes('code') || lowerMessage.includes('programming')) {
      // Generate code with advanced features
      const codeResult = await aiServiceIntegration.generateCode(optimizedPrompt, {
        language: 'javascript'
      });
      
      if (codeResult.success) {
        return {
          type: 'code',
          content: `I've generated code based on your request: "${optimizedPrompt}". Here's what I created:`,
          code: codeResult.code,
          agent: studioAgent.name
        };
      } else {
        return {
          type: 'error',
          content: `I encountered an issue generating your code: ${codeResult.error}. ${codeResult.fallback?.note || ''}`,
          agent: studioAgent.name
        };
      }
    } else {
      // Generate text response with advanced features (function-calling, streaming support)
      const textResult = await aiServiceIntegration.generateText(optimizedPrompt, {
        model: 'openai/gpt-4',
        maxTokens: 1000,
        temperature: 0.7
      });
      
      if (textResult.success) {
        return {
          type: 'text',
          content: textResult.text,
          agent: studioAgent.name
        };
      } else {
        return {
          type: 'error',
          content: `I encountered an issue generating a response: ${textResult.error}. ${textResult.fallback?.note || ''}`,
          agent: studioAgent.name
        };
      }
    }
  }

  // Task complexity classification
  classifyTaskComplexity(userMessage, targetAgent) {
    const lowerMessage = userMessage.toLowerCase();
    
    // High-level strategy indicators
    const strategyKeywords = [
      'strategy', 'campaign', 'plan', 'approach', 'methodology', 'framework',
      'comprehensive', 'complete', 'full', 'end-to-end', 'holistic', 'integrated',
      'multi-channel', 'cross-platform', 'brand', 'identity', 'positioning',
      'market', 'audience', 'target', 'segment', 'competitive', 'analysis',
      'research', 'study', 'survey', 'audit', 'assessment', 'evaluation',
      'optimization', 'improvement', 'enhancement', 'transformation', 'overhaul',
      'rebrand', 'redesign', 'restructure', 'reorganize', 'revamp', 'refresh'
    ];
    
    // Complex task indicators
    const complexKeywords = [
      'multiple', 'various', 'different', 'diverse', 'range', 'series',
      'collection', 'set', 'suite', 'package', 'bundle', 'combo',
      'combination', 'mix', 'blend', 'fusion', 'integration', 'synthesis',
      'coordination', 'orchestration', 'management', 'administration',
      'supervision', 'oversight', 'guidance', 'direction', 'leadership'
    ];
    
    // Simple task indicators
    const simpleKeywords = [
      'single', 'one', 'simple', 'basic', 'quick', 'fast', 'immediate',
      'instant', 'direct', 'straightforward', 'easy', 'simple', 'basic',
      'minor', 'small', 'tiny', 'little', 'brief', 'short', 'concise'
    ];
    
    // Professional quality indicators
    const professionalKeywords = [
      'hyperrealistic', 'ultra-realistic', 'photorealistic', 'cinematic', '4k', '8k',
      'professional', 'studio-quality', 'commercial-grade', 'award-winning', 'premium',
      'responsive', 'mobile-first', 'adaptive', 'cross-platform', 'multi-device',
      'user experience', 'user interface', 'ux/ui', 'wireframe', 'prototype',
      'full-stack', 'frontend', 'backend', 'api', 'database', 'cloud', 'serverless',
      'cinematic', 'film-quality', 'broadcast', 'commercial', 'advertising',
      'studio-quality', 'professional audio', 'mastering', 'mixing', 'recording',
      'seo-optimized', 'conversion-focused', 'persuasive', 'compelling', 'engaging',
      'enterprise', 'corporate', 'b2b', 'b2c', 'saas', 'ecommerce', 'marketplace'
    ];
    
    // Count keywords
    const strategyCount = strategyKeywords.filter(keyword => lowerMessage.includes(keyword)).length;
    const professionalCount = professionalKeywords.filter(keyword => lowerMessage.includes(keyword)).length;
    const complexCount = complexKeywords.filter(keyword => lowerMessage.includes(keyword)).length;
    const simpleCount = simpleKeywords.filter(keyword => lowerMessage.includes(keyword)).length;
    
    // Analyze message length and structure
    const wordCount = userMessage.split(' ').length;
    const hasMultipleRequests = lowerMessage.includes('and') || lowerMessage.includes('also') || lowerMessage.includes('plus');
    const hasSpecificDetails = lowerMessage.includes('for') || lowerMessage.includes('about') || lowerMessage.includes('regarding');
    
    // Determine complexity score
    let complexityScore = 0;
    
    // Base score from keywords
    complexityScore += professionalCount * 4; // Professional keywords are very heavily weighted
    complexityScore += strategyCount * 3;     // Strategy keywords are heavily weighted
    complexityScore += complexCount * 2;      // Complex keywords are moderately weighted
    complexityScore -= simpleCount * 1;       // Simple keywords reduce complexity
    
    // Additional factors
    if (wordCount > 20) complexityScore += 2; // Long messages are more complex
    if (hasMultipleRequests) complexityScore += 3; // Multiple requests increase complexity
    if (hasSpecificDetails) complexityScore += 1; // Specific details add complexity
    
    // Agent-specific complexity adjustments
    if (targetAgent.role.includes('Strategy') || targetAgent.role.includes('Business')) {
      complexityScore += 2; // Strategy agents naturally handle complex tasks
    }
    if (targetAgent.role.includes('Design') && (lowerMessage.includes('brand') || lowerMessage.includes('identity'))) {
      complexityScore += 3; // Brand/identity design is complex
    }
    if (targetAgent.role.includes('Video') && (lowerMessage.includes('campaign') || lowerMessage.includes('series'))) {
      complexityScore += 3; // Video campaigns are complex
    }
    
    // Classification thresholds
    if (complexityScore >= 5) {
      return 'high-level-strategy';
    } else if (complexityScore >= 2) {
      return 'moderate-complexity';
    } else {
      return 'simple-task';
    }
  }

  // Update performance metrics
  updatePerformanceMetrics(success, responseTime) {
    this.performanceMetrics.totalRoutings++;
    
    if (success) {
      this.performanceMetrics.successfulRoutings++;
    } else {
      this.performanceMetrics.failedRoutings++;
    }
    
    // Update average response time
    const totalTime = this.performanceMetrics.averageResponseTime * (this.performanceMetrics.totalRoutings - 1) + responseTime;
    this.performanceMetrics.averageResponseTime = totalTime / this.performanceMetrics.totalRoutings;
  }

  // Get routing statistics
  getRoutingStats() {
    return {
      ...this.performanceMetrics,
      successRate: this.performanceMetrics.totalRoutings > 0 
        ? (this.performanceMetrics.successfulRoutings / this.performanceMetrics.totalRoutings) * 100 
        : 0,
      recentRoutings: this.routingHistory.slice(-10) // Last 10 routings
    };
  }

  // Get agent mapping
  getAgentMapping() {
    return {
      agentGridToStudio: agentGridToStudioMapping,
      studioToAgentGrid: studioToAgentGridMapping
    };
  }

  // Check if agent has StudioMode mapping
  hasStudioModeMapping(agentGridId) {
    return agentGridId in agentGridToStudioMapping;
  }

  // Get StudioMode agent name for AgentGrid agent
  getStudioModeAgent(agentGridId) {
    return agentGridToStudioMapping[agentGridId];
  }

  // Get AgentGrid agent ID for StudioMode agent
  getAgentGridAgent(studioAgentName) {
    return studioToAgentGridMapping[studioAgentName];
  }
}

// Create global instance
export const globalAgentRoutingSystem = new AgentRoutingSystem();

// Export mapping constants for direct use
export { agentGridToStudioMapping, studioToAgentGridMapping }; 