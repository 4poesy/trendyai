// AI Service Integration - Real AI API Connections
// This connects TrendyAI agents to actual AI services

// No imports needed for Puter.js, it is loaded globally via <script src="https://js.puter.com/v2/"></script>

// Advanced streaming and function-calling support for Puter.js
class AIServiceIntegration {
  constructor() {
    this.name = 'AI Service Integration';
    this.description = 'Direct Puter.js AI service integration (with streaming and function-calling)';
  }

  // Image Generation (with streaming support)
  async generateImage(prompt, options = {}, onStream) {
    if (typeof window.puter === 'undefined') {
      return { success: false, error: 'Puter.js not loaded', fallback: { note: 'Puter.js script is missing.' } };
    }
    try {
      if (onStream && typeof window.puter.ai.generateImageStream === 'function') {
        // Streaming image generation
        const stream = window.puter.ai.generateImageStream({ prompt, ...options });
        for await (const chunk of stream) {
          onStream(chunk);
        }
        // Final result (if needed)
        return { success: true, streamed: true };
      } else {
        // Standard image generation
        const result = await window.puter.ai.generateImage({ prompt, ...options });
        return { success: true, imageUrl: result.url, prompt, service: 'puter' };
      }
    } catch (error) {
      return { success: false, error: error.message, fallback: { note: 'Puter.js error.' } };
    }
  }

  // Text Generation (with streaming and function-calling support)
  async generateText(prompt, options = {}, onStream, functionCall) {
    if (typeof window === 'undefined' || typeof window.puter === 'undefined') {
      return { success: false, error: 'Puter.js not loaded', fallback: { note: 'Puter.js script is missing.' } };
    }
    try {
      if (onStream && typeof window.puter.ai.chatStream === 'function') {
        // Streaming text generation
        const stream = window.puter.ai.chatStream(prompt, options);
        for await (const chunk of stream) {
          onStream(chunk);
        }
        return { success: true, streamed: true };
      } else if (functionCall && typeof window.puter.ai.chatWithFunctions === 'function') {
        // Function-calling support
        const result = await window.puter.ai.chatWithFunctions(prompt, functionCall, options);
        return { success: true, text: result, prompt, service: 'puter', functionCall: true };
      } else {
        // Standard text generation
        const result = await window.puter.ai.chat(prompt, options);
        return { success: true, text: result, prompt, service: 'puter' };
      }
    } catch (error) {
      return { success: false, error: error.message, fallback: { note: 'Puter.js error: ' + error.message } };
    }
  }

  // Audio Generation (with streaming support)
  async generateAudio(prompt, options = {}, onStream) {
    if (typeof window.puter === 'undefined') {
      return { success: false, error: 'Puter.js not loaded', fallback: { note: 'Puter.js script is missing.' } };
    }
    try {
      if (onStream && typeof window.puter.ai.generateAudioStream === 'function') {
        // Streaming audio generation
        const stream = window.puter.ai.generateAudioStream({ prompt, ...options });
        for await (const chunk of stream) {
          onStream(chunk);
        }
        return { success: true, streamed: true };
      } else {
        // Standard audio generation
        const result = await window.puter.ai.generateAudio({ prompt, ...options });
        return { success: true, audioUrl: result.url, prompt, service: 'puter' };
      }
    } catch (error) {
      return { success: false, error: error.message, fallback: { note: 'Puter.js error.' } };
    }
  }

  // Video Generation (with streaming support)
  async generateVideo(prompt, options = {}, onStream) {
    if (typeof window.puter === 'undefined') {
      return { success: false, error: 'Puter.js not loaded', fallback: { note: 'Puter.js script is missing.' } };
    }
    try {
      if (onStream && typeof window.puter.ai.generateVideoStream === 'function') {
        // Streaming video generation
        const stream = window.puter.ai.generateVideoStream({ prompt, ...options });
        for await (const chunk of stream) {
          onStream(chunk);
        }
        return { success: true, streamed: true };
      } else {
        // Standard video generation
        const result = await window.puter.ai.generateVideo({ prompt, ...options });
        return { success: true, videoUrl: result.url, prompt, service: 'puter' };
      }
    } catch (error) {
      return { success: false, error: error.message, fallback: { note: 'Puter.js error.' } };
    }
  }

  // Code Generation (with streaming support)
  async generateCode(prompt, options = {}, onStream) {
    if (typeof window.puter === 'undefined') {
      return { success: false, error: 'Puter.js not loaded', fallback: { note: 'Puter.js script is missing.' } };
    }
    try {
      if (onStream && typeof window.puter.ai.generateCodeStream === 'function') {
        // Streaming code generation
        const stream = window.puter.ai.generateCodeStream({ prompt, ...options });
        for await (const chunk of stream) {
          onStream(chunk);
        }
        return { success: true, streamed: true };
      } else {
        // Standard code generation
        const result = await window.puter.ai.generateCode({ prompt, ...options });
        return { success: true, code: result.code, prompt, service: 'puter' };
      }
    } catch (error) {
      return { success: false, error: error.message, fallback: { note: 'Puter.js error.' } };
    }
  }

  // Generic function-calling support for agents
  async functionCall(functionName, args = {}, options = {}) {
    if (typeof window.puter === 'undefined' || typeof window.puter.ai.callFunction !== 'function') {
      return { success: false, error: 'Puter.js function-calling not available', fallback: { note: 'Puter.js script or function-calling missing.' } };
    }
    try {
      const result = await window.puter.ai.callFunction(functionName, args, options);
      return { success: true, result, functionName, args };
    } catch (error) {
      return { success: false, error: error.message, fallback: { note: 'Puter.js function-calling error.' } };
    }
  }
}

export const aiServiceIntegration = new AIServiceIntegration();
export default aiServiceIntegration; 