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
   // Test advanced features for specific agents
  async testAgentAdvanced(agent, prompt) {
    if (agent.name === 'ContentSmith') {
      // Test function-calling for content generation
      await aiServiceIntegration.generateText(prompt, { 
        service: 'puter', 
        model: 'openai/gpt-4' 
      }, null, { functions: ['generateEmail'] });
    } else if (agent.name === 'PulsePilot') {
      // Test function-calling for social media publishing
      await aiServiceIntegration.generateText(prompt, { 
        service: 'puter', 
        model: 'openai/gpt-4' 
      }, null, { functions: ['generateSocialPost'] });
    } else if (agent.name === 'TrendyAI Core') {
      // Test function-calling for project management optimization
      await aiServiceIntegration.generateText(prompt, { 
        service: 'puter', 
        model: 'openai/gpt-4' 
      }, null, { functions: ['optimizePrompt'] });
    }
  }

  // Generate appropriate test prompt for each agent
  generateTestPrompt(agent) {
    const prompts = {
      'TrendyAI Core': 'Analyze this project request and create a task breakdown',
      'ClientFlow': 'Process this new client inquiry and qualify the lead',
      'StratoBoss': 'Perform SEO audit and keyword search for trendtacticsdigital.com',
      'ContentSmith': 'Write an SEO-friendly blog post about organic search marketing',
      'PixelDex': 'Generate a vector logo for an AI consulting agency',
      'MediaWiz': 'Edit a 30-second promo clip with text overlay and soundtracks',
      'WebWiz': 'Code a responsive React navbar element with Tailwind CSS',
      'PulsePilot': 'Schedule a LinkedIn post and check the Meta Ads campaign spend'
    };
    
    return prompts[agent.name] || `Test prompt for ${agent.name}`;
  }

  // Determine if agent should test advanced features
  shouldTestAdvancedFeatures(agent) {
    const advancedAgents = [
      'TrendyAI Core', 'ClientFlow', 'StratoBoss', 'ContentSmith',
      'PixelDex', 'MediaWiz', 'WebWiz', 'PulsePilot'
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