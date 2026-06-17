// Comprehensive API Configuration Utility
// Securely manages Puter.js and OpenRouter API keys

class APIConfig {
  constructor() {
    // Removed puterConfig - Puter.js is now loaded globally
    this.openRouterKeys = {};
    this.googleAPIKey = null;
    this.isInitialized = false;
  }

  // Initialize with your provided credentials
  async initialize() {
    try {
      // Initialize Puter.js with your App ID
      const puterAppId = 'a913df5a-f2b6-4adb-b1a4-d2f6148b1508';
      
      // Set up OpenRouter API keys dynamically from environment or placeholders
      const openRouterModelIds = [
        'mistral-small', 'deepseek-r1', 'nvidia-llama', 'kimi-dev', 'qwen-30b',
        'meta-llama', 'qwen-32b', 'deepseek-v3', 'gemma-27b', 'gemini-flash',
        'mistral-nemo', 'deepcoder', 'minimax-m1', 'sarvam-m', 'devstral',
        'deepseek-chimera', 'microsoft-mai', 'glm-z1', 'reka-flash', 'qwq-32b',
        'kimi-vl', 'cypher-alpha', 'deepseek-r1-alt'
      ];
      
      this.openRouterKeys = {};
      openRouterModelIds.forEach(model => {
        const envVarName = `VITE_OPENROUTER_API_KEY_${model.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
        this.openRouterKeys[model] = import.meta.env[envVarName] || 
                                     import.meta.env.VITE_OPENROUTER_API_KEY || 
                                     'your-openrouter-key-here';
      });

      // Set Google API key
      this.googleAPIKey = import.meta.env.VITE_GOOGLE_API_KEY || 'your-google-api-key-here';

      // Store in localStorage for persistence
      this.saveToStorage();

      this.isInitialized = true;
      console.log('✅ API Configuration initialized successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to initialize API configuration:', error);
      return { success: false, error: error.message };
    }
  }

  // Save configuration to localStorage
  saveToStorage() {
    try {
      localStorage.setItem('trendyai_api_config', JSON.stringify({
        puterAppId: 'a913df5a-f2b6-4adb-b1a4-d2f6148b1508',
        openRouterKeys: this.openRouterKeys,
        googleAPIKey: this.googleAPIKey,
        initialized: true
      }));
    } catch (error) {
      console.error('Failed to save API config to storage:', error);
    }
  }

  // Load configuration from localStorage
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('trendyai_api_config');
      if (saved) {
        const config = JSON.parse(saved);
        this.openRouterKeys = config.openRouterKeys || {};
        this.googleAPIKey = config.googleAPIKey;
        this.isInitialized = config.initialized || false;
        return true;
      }
    } catch (error) {
      console.error('Failed to load API config from storage:', error);
    }
    return false;
  }

  // Get OpenRouter API key by model name
  getOpenRouterKey(modelName) {
    return this.openRouterKeys[modelName] || null;
  }

  // Get all available OpenRouter models
  getAvailableModels() {
    return Object.keys(this.openRouterKeys);
  }

  // Get Google API key
  getGoogleAPIKey() {
    return this.googleAPIKey;
  }

  // Get Puter.js App ID
  getPuterAppId() {
    return 'a913df5a-f2b6-4adb-b1a4-d2f6148b1508';
  }

  // Test OpenRouter connection
  async testOpenRouterConnection(modelName = 'mistral-small') {
    try {
      const apiKey = this.getOpenRouterKey(modelName);
      if (!apiKey) {
        throw new Error(`No API key found for model: ${modelName}`);
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'TrendyAI Admin Dashboard'
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: 'user', content: 'Hello! This is a connection test.' }
          ],
          max_tokens: 50
        })
      });

      if (response.ok) {
        return { success: true, message: `✅ Connection to ${modelName} successful` };
      } else {
        const error = await response.text();
        return { success: false, message: `❌ Connection failed: ${error}` };
      }
    } catch (error) {
      return { success: false, message: `❌ Connection failed: ${error.message}` };
    }
  }

  // Test Google API connection
  async testGoogleConnection() {
    try {
      if (!this.googleAPIKey) {
        throw new Error('No Google API key configured');
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${this.googleAPIKey}`);
      
      if (response.ok) {
        return { success: true, message: '✅ Google API connection successful' };
      } else {
        const error = await response.text();
        return { success: false, message: `❌ Google API connection failed: ${error}` };
      }
    } catch (error) {
      return { success: false, message: `❌ Google API connection failed: ${error.message}` };
    }
  }

  // Get configuration status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      puterAppId: this.getPuterAppId(),
      openRouterModels: this.getAvailableModels().length,
      googleAPIKey: !!this.googleAPIKey,
      totalKeys: Object.keys(this.openRouterKeys).length + (this.googleAPIKey ? 1 : 0)
    };
  }

  // Clear all stored configuration
  clearConfiguration() {
    try {
      localStorage.removeItem('trendyai_api_config');
      this.openRouterKeys = {};
      this.googleAPIKey = null;
      this.isInitialized = false;
      console.log('✅ API configuration cleared');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to clear configuration:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
const apiConfig = new APIConfig();

export default apiConfig; 