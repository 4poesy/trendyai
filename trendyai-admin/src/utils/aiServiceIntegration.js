// AI Service Integration - Connected directly to Railway Backend and Flowise
// This links TrendyAI agents to your backend workflow api endpoints

import environment from '../config/environment';

class AIServiceIntegration {
  constructor() {
    this.name = 'AI Service Integration';
    this.description = 'Railway Backend Flowise Gateway Integration';
  }

  getBackendUrl() {
    return environment.backend.baseURL;
  }

  // General run agent call to the Express API
  async runAgent(agentId, prompt, taskType = 'chat_playground') {
    try {
      const response = await fetch(`${this.getBackendUrl()}/agent/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent: agentId,
          message: prompt,
          task_type: taskType
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      if (data.success) {
        // Resolve result text out of Flowise response formats
        let resultText = '';
        if (typeof data.result === 'string') {
          resultText = data.result;
        } else if (data.result && typeof data.result.text === 'string') {
          resultText = data.result.text;
        } else {
          resultText = JSON.stringify(data.result || {});
        }
        return { 
          success: true, 
          text: resultText, 
          task_id: data.task_id,
          service: 'railway-flowise' 
        };
      } else {
        throw new Error(data.error || 'Backend agent execution failed');
      }
    } catch (error) {
      console.error(`Failed to run agent ${agentId}:`, error);
      return { 
        success: false, 
        error: error.message || 'Connection to Railway backend failed. Ensure your server is active.' 
      };
    }
  }

  // Image Generation (handled by backend Flowise route)
  async generateImage(prompt, options = {}) {
    const agentId = options.agentId || 'pixeldex';
    const result = await this.runAgent(agentId, prompt, 'image_generation');
    if (result.success) {
      // Check if output contains image links
      const urlRegex = /(https?:\/\/[^\s]+?\.(?:png|jpe?g|gif|webp))/i;
      const match = result.text.match(urlRegex);
      return {
        success: true,
        imageUrl: match ? match[0] : '/assets/trendyai-og.webp',
        text: result.text,
        service: 'railway-flowise'
      };
    }
    return result;
  }

  // Text Generation
  async generateText(prompt, options = {}) {
    const agentId = options.agentId || 'trendyai-core';
    return this.runAgent(agentId, prompt, 'text_chat');
  }

  // Audio Generation
  async generateAudio(prompt, options = {}) {
    const agentId = options.agentId || 'mediawiz';
    return this.runAgent(agentId, prompt, 'audio_generation');
  }

  // Video Generation
  async generateVideo(prompt, options = {}) {
    const agentId = options.agentId || 'mediawiz';
    return this.runAgent(agentId, prompt, 'video_generation');
  }

  // Code Generation
  async generateCode(prompt, options = {}) {
    const agentId = options.agentId || 'webwiz';
    return this.runAgent(agentId, prompt, 'code_generation');
  }
}

export const aiServiceIntegration = new AIServiceIntegration();
export default aiServiceIntegration;