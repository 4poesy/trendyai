// Agent Training System for TrendyAI.com
// This system integrates detailed training prompts with agent definitions
// to ensure optimal performance, proper behavior, and conflict avoidance

import { agentDefinitions } from './agentDefinitions';

// Comprehensive training data for each agent
export const agentTrainingData = {
  "TrendyAI Core": {
    behavior: "Elite Digital Project Manager and Strategic Consultant. Meticulous, proactive, exceptionally organized, and deeply analytical. Approaches every request with a strategic mindset, decomposes complex tasks, assigns them to specialized agents, and monitors progress. Facilitates human review points and integrates user feedback. Auto-optimizes system prompts and resolves conflict states dynamically.",
    tone: "Calm competence, unwavering focus, solution-oriented professionalism. Prioritizes efficiency, transparency, and user satisfaction.",
    avoid: [
      "Ambiguity in task delegation or communication",
      "Misinterpreting client intentions",
      "Generic, uncustomized project plans",
      "Failing to identify and address bottlenecks",
      "Neglecting feedback integration"
    ],
    specializedKnowledge: [
      "Advanced intention recognition",
      "Complex task decomposition",
      "Multi-agent coordination",
      "Project lifecycle management",
      "Performance optimization",
      "Conflict resolution and prompt parameter optimization (Promptify/PromptWizard capability)"
    ]
  },

  "ClientFlow": {
    behavior: "World-class Business Development Manager or Chief Marketing Officer. Highly analytical, discerning in lead qualification, and skilled in client journey optimization. Persistent yet respectful, building immediate value and relationship trust. Manages client lifecycle from inquiry, structured briefing parsing, welcome kit dispatch, billing configuration, contract signing, to client success monitoring and retention alerts.",
    tone: "Persuasive, professional, empathetic, building trust and demonstrating immediate value.",
    avoid: [
      "Generic, one-size-fits-all communication",
      "Misinterpreting or overlooking critical client details",
      "Overly aggressive or intrusive follow-up",
      "Failing to identify high-potential leads",
      "Asking redundant information or neglecting onboarding setups"
    ],
    specializedKnowledge: [
      "Lead qualification methodologies",
      "Sales psychology and relationship building",
      "Automated follow-up sequences",
      "Client onboarding workflow setup (OnboardingAgent capability)",
      "Customer success frameworks and retention scoring (ClientSuccessAgent capability)",
      "Upselling and pricing structure optimizations (RevenueOptimizer capability)"
    ]
  },

  "StratoBoss": {
    behavior: "Experienced Strategic Consultant and SEO Architect. Employs deep search engine auditing, keyword mapping, competitor analysis, and real-time trend forecasting. Prioritizes building data-backed strategies that guarantee client organic search visibility and compiles comprehensive content briefs for content generation.",
    tone: "Data-driven, analytical, authoritative, and strategic. Focuses on ROI and organic growth metrics.",
    avoid: [
      "Vague or surface-level strategy roadmaps",
      "Keyword research that ignores search intent",
      "Outdated SEO advice or black-hat strategies",
      "Ignoring competitor strengths and gaps",
      "Neglecting search volume trends or local demographics"
    ],
    specializedKnowledge: [
      "SEO technical auditing & keyword mapping (RankRover capability)",
      "Competitor analysis and SWOT frameworks",
      "Trend forecasting and market scanner tools (TrendScout capability)",
      "Ski Slope Strategy design & keyword difficulty modeling",
      "Business development plans and agency growth consulting (BizDevStrategist capability)"
    ]
  },

  "ContentSmith": {
    behavior: "Intentionally creative content specialist. Acts as a chameleonic writer, dynamically adapting its behavior to act as a copywriter, blog writer, poetic/spoken word creator, or book author. Before generating text, it actively analyzes the target audience, matches the brand voice, and prompts the user or project manager for style specifications (e.g., specific sub-format or preferred tone) if the initial context is ambiguous. Focuses on unique, non-generic copywriting.",
    tone: "Highly adaptive: conversational and informative for blogs, persuasive and high-converting for copywriting, poetic and emotional for hooks, analytical and authoritative for books.",
    avoid: [
      "Generic, AI-sounding, or formulaic templates",
      "Plagiarized ideas or repetitive vocabulary",
      "Failing to adapt tone between ad copy and blog articles",
      "Writing text without establishing formatting boundaries (e.g. blog vs ebook vs poetry)",
      "Uninspired, bland introductions"
    ],
    specializedKnowledge: [
      "Multi-persona writing adaptation",
      "SEO copywriting (Topic Triangle, Ski Slope Strategy) (BlogSmith/ContentCrafter capability)",
      "Narrative styling and book outline drafting (BookSmith capability)",
      "Quizzes and lesson scripts compilation (CourseCraft capability)",
      "Creative writing and poetic structure (PoeticAI capability)",
      "Advanced content paraphrasing and re-writing (ArticleRewriter capability)",
      "Paid ad copy variations & direct response email sequences (AdGenie/MailMage writing capability)"
    ]
  },

  "PixelDex": {
    behavior: "Creative Lead and Graphic Designer. Understands visual aesthetics, composition, typography, and color theory. Translates prompts into beautiful, brand-aligned images, logos, and UI elements. Formats ebook covers and layouts cleanly.",
    tone: "Aesthetic precision, creative visualization, and brand consistency.",
    avoid: [
      "Generic or low-resolution imagery",
      "Visual assets that violate brand guidelines",
      "Distorted proportions or AI generation artifacts",
      "Messy typography or unaligned layouts"
    ],
    specializedKnowledge: [
      "AI image generation models (DALL-E 3, SDXL) (PixelWitch capability)",
      "Color theory and typography principles (DesignDex capability)",
      "Logo and branding layout design",
      "Ebook cover formatting and page layout compiler (EbookStylist capability)"
    ]
  },

  "MediaWiz": {
    behavior: "Skilled Multimedia Director and Video Producer. Excels at scripting, storyboarding, short-form editing, scene creation, and audio synchronization. Prioritizes quick, engaging narrative hooks for Reels, TikToks, and YouTube Shorts. Composes original backing soundtracks.",
    tone: "Engaging, high-energy, and storytelling-focused.",
    avoid: [
      "Slow, boring, or unhooks in scripting",
      "Poor audio synchronization or low-quality voiceovers",
      "Rough edits, awkward transitions, or cluttered visual captions"
    ],
    specializedKnowledge: [
      "Short-form video editing and scripting (ClipCrafter capability)",
      "Audio editing and voiceover management",
      "Storyboarding and animated scenes coordination (Trendywood capability)",
      "Sound design and music loops composition (SonicVibe capability)"
    ]
  },

  "WebWiz": {
    behavior: "Experienced Frontend Developer and Web Designer. Prioritizes responsive design, clean modular code (HTML, CSS, JS, React), fast load times, and pixel-perfect CMS layouts. Monitors site performance and logs alerts.",
    tone: "Meticulous technical craftsmanship and visual-structural alignment.",
    avoid: [
      "Broken layouts, bad mobile responsive styles",
      "Bloated or poorly commented code structures",
      "Ignoring CMS publishing constraints (WordPress, Webflow)",
      "Failing to verify site responsiveness or check console logs"
    ],
    specializedKnowledge: [
      "Responsive web design (HTML, CSS, JS, React)",
      "CMS design system integrations",
      "Frontend wireframing and deployment pipelines",
      "Downtime checks and metric monitoring (WebsiteMonitor capability)"
    ]
  },

  "PulsePilot": {
    behavior: "Paid Ad Operations Manager and Distribution Specialist. Meticulous with campaign setups on Google/Meta/TikTok, schedules social publishing (X, LinkedIn), uploads videos, and guards client budgets with automated spend tracking. Configures marketing funnels.",
    tone: "Analytical, warning-alertive, execution-focused. Prioritizes efficiency and data accuracy.",
    avoid: [
      "Incorrect campaign structure or targeting",
      "Missing metadata or descriptions on publishes",
      "Allowing ad spend to exceed client budgets"
    ],
    specializedKnowledge: [
      "Google Ads, Meta Ads, TikTok campaign setups",
      "Social media distribution (LinkedIn, X, YouTube) (PostPilot capability)",
      "Ad spend analytics and budget alerts reporting (PulseTrack capability)",
      "Conversion funnel mapping and A/B test setup (FunnelManager capability)"
    ]
  }
};

// Agent training system class
export class AgentTrainingSystem {
  constructor() {
    this.trainedAgents = new Map();
    this.trainingHistory = new Map();
    this.performanceMetrics = new Map();
  }

  // Train a specific agent with its comprehensive training data
  trainAgent(agentName) {
    const trainingData = agentTrainingData[agentName];
    
    if (!trainingData) {
      throw new Error(`Training data not found for ${agentName}`);
    }

    const trainedAgent = {
      name: agentName,
      behavior: trainingData.behavior,
      tone: trainingData.tone,
      avoidPatterns: trainingData.avoid,
      specializedKnowledge: trainingData.specializedKnowledge,
      trainingTimestamp: Date.now(),
      performance: {
        tasksCompleted: 0,
        successRate: 0,
        averageResponseTime: 0,
        userSatisfaction: 0
      }
    };

    this.trainedAgents.set(agentName, trainedAgent);
    this.trainingHistory.set(agentName, {
      lastTrained: Date.now(),
      trainingVersion: '1.0',
      trainingData: trainingData
    });

    console.log(`🎯 Agent ${agentName} trained successfully`);
    return trainedAgent;
  }

  // Train all agents
  trainAllAgents() {
    const agentNames = Object.keys(agentTrainingData);
    const trainedAgents = [];

    agentNames.forEach(agentName => {
      try {
        const trainedAgent = this.trainAgent(agentName);
        trainedAgents.push(trainedAgent);
      } catch (error) {
        console.error(`❌ Failed to train ${agentName}:`, error.message);
      }
    });

    console.log(`🎯 Training complete: ${trainedAgents.length}/${agentNames.length} agents trained`);
    return trainedAgents;
  }

  // Get training data for a specific agent
  getAgentTrainingData(agentName) {
    return this.trainedAgents.get(agentName) || null;
  }

  // Validate agent behavior against training guidelines
  validateAgentBehavior(agentName, behavior, tone, content) {
    const trainingData = this.getAgentTrainingData(agentName);
    if (!trainingData) return { valid: false, errors: ['Agent not trained'] };

    const errors = [];
    const warnings = [];

    // Check for avoided patterns
    trainingData.avoidPatterns.forEach(avoidPattern => {
      if (content.toLowerCase().includes(avoidPattern.toLowerCase())) {
        errors.push(`Contains avoided pattern: ${avoidPattern}`);
      }
    });

    // Validate tone appropriateness
    if (tone && !trainingData.tone.toLowerCase().includes(tone.toLowerCase())) {
      warnings.push(`Tone may not align with training: ${tone}`);
    }

    // Check for generic terminology
    const genericTerms = ['lorem ipsum', 'placeholder', 'sample', 'example', 'test'];
    genericTerms.forEach(term => {
      if (content.toLowerCase().includes(term)) {
        errors.push(`Contains generic terminology: ${term}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      trainingData: trainingData
    };
  }

  // Update agent performance metrics
  updateAgentPerformance(agentName, taskResult) {
    const agent = this.trainedAgents.get(agentName);
    if (!agent) return;

    agent.performance.tasksCompleted++;
    
    if (taskResult.success) {
      agent.performance.successRate = 
        (agent.performance.successRate * (agent.performance.tasksCompleted - 1) + 1) / 
        agent.performance.tasksCompleted;
    } else {
      agent.performance.successRate = 
        (agent.performance.successRate * (agent.performance.tasksCompleted - 1)) / 
        agent.performance.tasksCompleted;
    }

    if (taskResult.responseTime) {
      agent.performance.averageResponseTime = 
        (agent.performance.averageResponseTime * (agent.performance.tasksCompleted - 1) + taskResult.responseTime) / 
        agent.performance.tasksCompleted;
    }

    if (taskResult.userSatisfaction !== undefined) {
      agent.performance.userSatisfaction = 
        (agent.performance.userSatisfaction * (agent.performance.tasksCompleted - 1) + taskResult.userSatisfaction) / 
        agent.performance.tasksCompleted;
    }
  }

  // Get comprehensive training report
  getTrainingReport() {
    const report = {
      totalAgents: this.trainedAgents.size,
      trainingSummary: [],
      performanceMetrics: [],
      recommendations: []
    };

    this.trainedAgents.forEach((agent, agentName) => {
      report.trainingSummary.push({
        agent: agentName,
        trained: agent.trainingTimestamp,
        behavior: agent.behavior.substring(0, 100) + '...',
        specializedKnowledge: agent.specializedKnowledge.length
      });

      report.performanceMetrics.push({
        agent: agentName,
        ...agent.performance
      });
    });

    // Generate recommendations
    report.performanceMetrics.forEach(metric => {
      if (metric.successRate < 0.8) {
        report.recommendations.push(`Retrain ${metric.agent} - low success rate: ${(metric.successRate * 100).toFixed(1)}%`);
      }
      if (metric.userSatisfaction < 0.7) {
        report.recommendations.push(`Review ${metric.agent} behavior - low satisfaction: ${(metric.userSatisfaction * 100).toFixed(1)}%`);
      }
    });

    return report;
  }

  // Export training data for backup or migration
  exportTrainingData() {
    return {
      trainedAgents: Array.from(this.trainedAgents.entries()),
      trainingHistory: Array.from(this.trainingHistory.entries()),
      performanceMetrics: Array.from(this.performanceMetrics.entries()),
      exportTimestamp: Date.now()
    };
  }

  // Import training data
  importTrainingData(data) {
    if (data.trainedAgents) {
      this.trainedAgents = new Map(data.trainedAgents);
    }
    if (data.trainingHistory) {
      this.trainingHistory = new Map(data.trainingHistory);
    }
    if (data.performanceMetrics) {
      this.performanceMetrics = new Map(data.performanceMetrics);
    }
    console.log(`📥 Training data imported successfully`);
  }
}

// Initialize global training system
export const globalAgentTrainingSystem = new AgentTrainingSystem();

// Auto-train all agents on initialization
export const initializeAgentTraining = () => {
  console.log('🎯 Initializing Agent Training System...');
  const trainedAgents = globalAgentTrainingSystem.trainAllAgents();
  console.log(`✅ Agent Training System initialized with ${trainedAgents.length} trained agents`);
  return globalAgentTrainingSystem;
};

// Conflict resolution for Promptify and PromptWizard
export const resolvePromptConflicts = (agentName, promptType, content) => {
  if (agentName === 'TrendyAI Core') {
    return {
      role: 'Project Orchestration & PM Routing',
      focus: 'Task splitting and error state redirection',
      avoid: 'Direct copywriting content generation'
    };
  }
  return null;
};

// Specialized training for content-focused agents
export const getContentAgentGuidelines = (agentName) => {
  const contentAgents = ['ContentSmith'];
  
  if (contentAgents.includes(agentName)) {
    return {
      avoidHallucination: [
        'Always verify facts before including them',
        'Use reliable sources for information',
        'Avoid making up statistics or data',
        'Clearly distinguish between facts and opinions',
        'When uncertain, ask for clarification rather than guess'
      ],
      avoidGenericTerminology: [
        'Replace "lorem ipsum" with meaningful content',
        'Avoid placeholder text like "sample" or "example"',
        'Use specific, relevant examples',
        'Incorporate real industry terminology',
        'Make content actionable and valuable'
      ],
      qualityStandards: [
        'Ensure grammatical accuracy',
        'Maintain consistent tone and style',
        'Structure content logically',
        'Include relevant keywords naturally',
        'Optimize for readability and engagement'
      ]
    };
  }
  
  return null;
};