// Environment Configuration for Vite
// This file handles environment variables with proper fallbacks

export const environment = {
  // OpenRouter API Configuration
  openrouter: {
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || 
            localStorage.getItem('VITE_OPENROUTER_API_KEY') || 
            'your-openrouter-api-key-here',
    baseURL: 'https://openrouter.ai/api/v1'
  },
  
  // OpenAI API Configuration
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || 
            localStorage.getItem('VITE_OPENAI_API_KEY') || 
            'your-openai-api-key-here',
    baseURL: 'https://api.openai.com/v1'
  },
  
  // Stability AI API Configuration
  stability: {
    apiKey: import.meta.env.VITE_STABILITY_API_KEY || 
            localStorage.getItem('VITE_STABILITY_API_KEY') || 
            'your-stability-api-key-here',
    baseURL: 'https://api.stability.ai/v1'
  },
  
  // Anthropic API Configuration
  anthropic: {
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || 
            localStorage.getItem('VITE_ANTHROPIC_API_KEY') || 
            'your-anthropic-api-key-here',
    baseURL: 'https://api.anthropic.com/v1'
  },
  
  // Puter.js Configuration
  puter: {
    appId: import.meta.env.VITE_PUTER_APP_ID || 
           localStorage.getItem('VITE_PUTER_APP_ID') || 
           'a913df5a-f2b6-4adb-b1a4-d2f6148b1508',
    apiKey: import.meta.env.VITE_PUTER_API_KEY || 
            localStorage.getItem('VITE_PUTER_API_KEY') || 
            'your-puter-api-key-here'
  },
  
  // Development Mode
  isDevelopment: import.meta.env.VITE_DEV_MODE === 'true' || import.meta.env.DEV
};

// Helper function to get API key with fallback
export const getApiKey = (service) => {
  return environment[service]?.apiKey || 'your-api-key-here';
};

// Helper function to check if environment is properly configured
export const isEnvironmentConfigured = () => {
  return environment.openrouter.apiKey !== 'your-openrouter-api-key-here' ||
         environment.openai.apiKey !== 'your-openai-api-key-here' ||
         environment.stability.apiKey !== 'your-stability-api-key-here' ||
         environment.anthropic.apiKey !== 'your-anthropic-api-key-here';
};

export default environment; 