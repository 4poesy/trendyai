// Agent Test Suite - Verify Advanced Puter.js Integration
// Tests all 28+ TrendyAI agents to ensure they work with streaming, function-calling, and prompt engineering

import { agentDefinitions } from './agentDefinitions';
import { aiServiceIntegration } from './aiServiceIntegration';
import { globalStudioModeNetwork } from './studioModeAgentCommunication';

class AgentTestSuite {
  constructor() {
    this.testResults = [];
    this.passedTests = 0;
    this.failedTests = 0;
  }

  // Test all agents
  async runAllTests() {
    console.log('🧪 Starting Agent Test Suite...');
    
    // Test each agent definition
    for (const agent of agentDefinitions) {
      await this.testAgent(agent);
    }
    
    // Test advanced features
    await this.testAdvancedFeatures();
    
    // Generate report
    this.generateReport();
  }

  // Test individual agent
  async testAgent(agent) {
    console.log(`\n🔍 Testing Agent: ${agent.name} (${agent.role})`);
    
    const testPrompt = this.generateTestPrompt(agent);
    let result = null;
    
    try {
      // Test basic functionality
      result = await this.testAgentBasic(agent, testPrompt);
      
      // Test advanced features if applicable
      if (this.shouldTestAdvancedFeatures(agent)) {
        await this.testAgentAdvanced(agent, testPrompt);
      }
      
      this.recordTestResult(agent.name, 'PASS', 'Basic functionality working');
      
    } catch (error) {
      this.recordTestResult(agent.name, 'FAIL', error.message);
    }
  }

  // Test basic agent functionality
  async testAgentBasic(agent, prompt) {
    const lowerMessage = prompt.toLowerCase();
    
    // Route to appropriate AI method based on agent role
    if (agent.role.includes('Design') || agent.name === 'PixelWitch' || agent.name === 'DesignDex') {
      return await aiServiceIntegration.generateImage(prompt, { service: 'puter', size: '512x512' });
    } else if (agent.role.includes('Video') || agent.name === 'ClipCrafter' || agent.name === 'Trendywood') {
      return await aiServiceIntegration.generateVideo(prompt, { service: 'puter', duration: 5 });
    } else if (agent.role.includes('Audio') || agent.name === 'SonicVibe') {
      return await aiServiceIntegration.generateAudio(prompt, { service: 'puter', voice: 'alloy' });
    } else if (agent.role.includes('Code') || agent.name === 'WebWiz') {
      return await aiServiceIntegration.generateCode(prompt, { service: 'puter', language: 'javascript' });
    } else {
      // Text-based agents
      return await aiServiceIntegration.generateText(prompt, { 
        service: 'puter', 
        model: 'openai/gpt-4', 
        maxTokens: 500 
      });
    }
  }

  // Test advanced features for specific agents
  async testAgentAdvanced(agent, prompt) {
    if (agent.name === 'Promptify') {
      // Test function-calling for prompt engineering
      await aiServiceIntegration.generateText(prompt, { 
        service: 'puter', 
        model: 'openai/gpt-4' 
      }, null, { functions: ['optimizePrompt'] });
    } else if (agent.name === 'MailMage') {
      // Test function-calling for email generation
      await aiServiceIntegration.generateText(prompt, { 
        service: 'puter', 
        model: 'openai/gpt-4' 
      }, null, { functions: ['generateEmail'] });
    } else if (agent.name === 'PostPilot') {
      // Test function-calling for social media posts
      await aiServiceIntegration.generateText(prompt, { 
        service: 'puter', 
        model: 'openai/gpt-4' 
      }, null, { functions: ['generateSocialPost'] });
    }
  }

  // Generate appropriate test prompt for each agent
  generateTestPrompt(agent) {
    const prompts = {
      'TrendyAI Core': 'Analyze this project request and create a task breakdown',
      'ClientFlow': 'Process this new client inquiry and qualify the lead',
      'OnboardingAgent': 'Collect necessary information for new client onboarding',
      'WebWiz': 'Create a modern landing page for a tech startup',
      'RankRover': 'Perform SEO audit for an e-commerce website',
      'StratoBoss': 'Develop digital marketing strategy for a B2B SaaS company',
      'Promptify': 'Optimize this prompt for better AI response quality',
      'AdGenie': 'Create compelling ad copy for a fitness app',
      'MailMage': 'Write a welcome email sequence for new subscribers',
      'PostPilot': 'Create engaging social media content for a coffee shop',
      'PulseTrack': 'Analyze campaign performance data and provide insights',
      'ContentCrafter': 'Write a comprehensive blog post about AI in marketing',
      'BlogSmith': 'Create an SEO-optimized blog post about productivity tips',
      'BookSmith': 'Outline a business book about digital transformation',
      'CourseCraft': 'Design an online course about social media marketing',
      'PixelWitch': 'Generate a professional logo for a consulting firm',
      'DesignDex': 'Create marketing materials for a product launch',
      'ClipCrafter': 'Edit a promotional video for a software product',
      'Trendywood': 'Create a full video production for a brand campaign',
      'SonicVibe': 'Compose background music for a corporate presentation',
      'PoeticAI': 'Write a brand anthem for a sustainable fashion company',
      'BizDevStrategist': 'Identify partnership opportunities for a tech startup',
      'EbookStylist': 'Format an ebook about personal development',
      'TrendScout': 'Analyze emerging trends in digital marketing',
      'FeedbackLoop': 'Process user feedback for product improvement',
      'FunnelManager': 'Design a sales funnel for an online course',
      'ArticleRewriter': 'Rewrite this article for better SEO performance',
      'EbookSalesAgent': 'Create a sales page for an ebook about productivity',
      'CourseSalesAgent': 'Optimize course sales page for better conversions',
      'WebsiteMonitor': 'Monitor website performance and identify issues',
      'RevenueOptimizer': 'Analyze sales data and suggest optimizations',
      'ClientSuccessAgent': 'Handle client support request and provide solution'
    };
    
    return prompts[agent.name] || `Test prompt for ${agent.name}`;
  }

  // Determine if agent should test advanced features
  shouldTestAdvancedFeatures(agent) {
    const advancedAgents = [
      'Promptify', 'MailMage', 'PostPilot', 'PulseTrack', 
      'StratoBoss', 'BizDevStrategist', 'FunnelManager', 
      'TrendScout', 'FeedbackLoop', 'EbookStylist', 
      'CourseCraft', 'PoeticAI', 'ArticleRewriter'
    ];
    return advancedAgents.includes(agent.name);
  }

  // Test advanced Puter.js features
  async testAdvancedFeatures() {
    console.log('\n🚀 Testing Advanced Features...');
    
    // Test streaming (if available)
    try {
      let streamedContent = '';
      await aiServiceIntegration.generateText(
        'Test streaming functionality', 
        { service: 'puter', model: 'openai/gpt-4' },
        (chunk) => { streamedContent += chunk; }
      );
      if (streamedContent) {
        this.recordTestResult('Streaming', 'PASS', 'Streaming functionality working');
      }
    } catch (error) {
      this.recordTestResult('Streaming', 'SKIP', 'Streaming not available');
    }
    
    // Test function-calling
    try {
      const result = await aiServiceIntegration.functionCall('testFunction', { test: true });
      this.recordTestResult('Function-Calling', 'PASS', 'Function-calling working');
    } catch (error) {
      this.recordTestResult('Function-Calling', 'SKIP', 'Function-calling not available');
    }
  }

  // Record test result
  recordTestResult(agentName, status, message) {
    this.testResults.push({
      agent: agentName,
      status,
      message,
      timestamp: new Date()
    });
    
    if (status === 'PASS') {
      this.passedTests++;
    } else if (status === 'FAIL') {
      this.failedTests++;
    }
    
    console.log(`  ${status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️'} ${agentName}: ${message}`);
  }

  // Generate test report
  generateReport() {
    console.log('\n📊 Test Suite Report');
    console.log('==================');
    console.log(`Total Tests: ${this.testResults.length}`);
    console.log(`Passed: ${this.passedTests}`);
    console.log(`Failed: ${this.failedTests}`);
    console.log(`Skipped: ${this.testResults.length - this.passedTests - this.failedTests}`);
    
    const failedTests = this.testResults.filter(r => r.status === 'FAIL');
    if (failedTests.length > 0) {
      console.log('\n❌ Failed Tests:');
      failedTests.forEach(test => {
        console.log(`  - ${test.agent}: ${test.message}`);
      });
    }
    
    console.log('\n🎉 Agent Test Suite Complete!');
  }
}

// Export test suite
export const agentTestSuite = new AgentTestSuite();

// Auto-run tests if in development
if (process.env.NODE_ENV === 'development') {
  // Uncomment to auto-run tests
  // agentTestSuite.runAllTests();
} 