// Environment Configuration for Vite
// This file handles environment variables with proper fallbacks

// Helper to sanitize backend URL
const sanitizeBackendURL = (url) => {
  if (!url) return 'http://localhost:3000/api/v1';
  let sanitized = url.trim();
  
  // 1. Check and prepend protocol if missing
  if (!/^https?:\/\//i.test(sanitized)) {
    if (sanitized.includes('localhost') || sanitized.includes('127.0.0.1')) {
      sanitized = `http://${sanitized}`;
    } else {
      sanitized = `https://${sanitized}`;
    }
  }
  
  // 2. Strip trailing slash if present
  if (sanitized.endsWith('/')) {
    sanitized = sanitized.slice(0, -1);
  }
  
  // 3. Ensure the path ends with /api/v1
  if (!sanitized.endsWith('/api/v1')) {
    if (sanitized.endsWith('/api')) {
      sanitized = `${sanitized}/v1`;
    } else {
      sanitized = `${sanitized}/api/v1`;
    }
  }
  
  return sanitized;
};

const rawBaseURL = import.meta.env.VITE_BACKEND_API_URL || 
                   import.meta.env.VITE_API_URL || 
                   localStorage.getItem('VITE_BACKEND_API_URL') || 
                   localStorage.getItem('VITE_API_URL') || 
                   'http://localhost:3000/api/v1';

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
  
  // Backend Express API Configuration
  backend: {
    baseURL: sanitizeBackendURL(rawBaseURL)
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