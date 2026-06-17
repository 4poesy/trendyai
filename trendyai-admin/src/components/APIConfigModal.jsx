import React, { useState } from 'react';
import { FaKey, FaEye, FaEyeSlash, FaSave, FaTimes, FaInfoCircle } from 'react-icons/fa';

const APIConfigModal = ({ isOpen, onClose, onSave }) => {
  const [apiKeys, setApiKeys] = useState({
    openrouter: localStorage.getItem('REACT_APP_OPENROUTER_API_KEY') || '',
    openai: localStorage.getItem('REACT_APP_OPENAI_API_KEY') || '',
    stability: localStorage.getItem('REACT_APP_STABILITY_API_KEY') || '',
    anthropic: localStorage.getItem('REACT_APP_ANTHROPIC_API_KEY') || ''
  });
  
  const [showKeys, setShowKeys] = useState({
    openrouter: false,
    openai: false,
    stability: false,
    anthropic: false
  });
  
  const [status, setStatus] = useState('');

  const handleInputChange = (service, value) => {
    setApiKeys(prev => ({
      ...prev,
      [service]: value
    }));
  };

  const toggleKeyVisibility = (service) => {
    setShowKeys(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const handleSave = () => {
    // Save to localStorage (for demo purposes)
    Object.entries(apiKeys).forEach(([service, key]) => {
      if (key.trim()) {
        localStorage.setItem(`REACT_APP_${service.toUpperCase()}_API_KEY`, key.trim());
      }
    });
    
    setStatus('API keys saved successfully!');
    setTimeout(() => setStatus(''), 3000);
    
    if (onSave) {
      onSave(apiKeys);
    }
  };

  const testConnection = async (service) => {
    setStatus(`Testing ${service} connection...`);
    
    try {
      const key = apiKeys[service];
      if (!key.trim()) {
        setStatus(`${service} key is required`);
        return;
      }

      // Simple test - try to fetch models
      const baseURL = {
        openrouter: 'https://openrouter.ai/api/v1',
        openai: 'https://api.openai.com/v1',
        stability: 'https://api.stability.ai/v1',
        anthropic: 'https://api.anthropic.com/v1'
      }[service];

      const headers = {
        'Authorization': `Bearer ${key}`
      };
      
      // Add OpenRouter specific headers
      if (service === 'openrouter') {
        headers['HTTP-Referer'] = window.location.origin;
        headers['X-Title'] = 'TrendyAI Admin Dashboard';
      }
      
      const response = await fetch(`${baseURL}/models`, {
        headers: headers
      });

      if (response.ok) {
        setStatus(`${service} connection successful!`);
      } else {
        setStatus(`${service} connection failed: ${response.status}`);
      }
    } catch (error) {
      setStatus(`${service} connection error: ${error.message}`);
    }
    
    setTimeout(() => setStatus(''), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaKey className="text-2xl text-cyan-500" />
            <h2 className="text-2xl font-bold text-navy-900">API Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-6">
          {/* OpenRouter Configuration */}
          <div className="border border-cyan-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-navy-900">OpenRouter API Key</h3>
              <button
                onClick={() => testConnection('openrouter')}
                className="px-3 py-1 bg-cyan-500 text-white rounded-lg text-sm hover:bg-cyan-400"
              >
                Test
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Recommended: Access to multiple AI models (GPT-4, Claude, DALL-E, etc.) through a single API
            </p>
            <div className="relative">
              <input
                type={showKeys.openrouter ? 'text' : 'password'}
                value={apiKeys.openrouter}
                onChange={(e) => handleInputChange('openrouter', e.target.value)}
                placeholder="sk-or-..."
                className="w-full px-4 py-2 border border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none"
              />
              <button
                onClick={() => toggleKeyVisibility('openrouter')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKeys.openrouter ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <FaInfoCircle />
              <span>Get your key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">OpenRouter Platform</a></span>
            </div>
          </div>

          {/* OpenAI Configuration */}
          <div className="border border-cyan-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-navy-900">OpenAI API Key</h3>
              <button
                onClick={() => testConnection('openai')}
                className="px-3 py-1 bg-cyan-500 text-white rounded-lg text-sm hover:bg-cyan-400"
              >
                Test
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Required for GPT-4, DALL-E 3, Text-to-Speech, and Video Generation
            </p>
            <div className="relative">
              <input
                type={showKeys.openai ? 'text' : 'password'}
                value={apiKeys.openai}
                onChange={(e) => handleInputChange('openai', e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-2 border border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none"
              />
              <button
                onClick={() => toggleKeyVisibility('openai')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKeys.openai ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <FaInfoCircle />
              <span>Get your key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">OpenAI Platform</a></span>
            </div>
          </div>

          {/* Stability AI Configuration */}
          <div className="border border-cyan-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-navy-900">Stability AI API Key</h3>
              <button
                onClick={() => testConnection('stability')}
                className="px-3 py-1 bg-cyan-500 text-white rounded-lg text-sm hover:bg-cyan-400"
              >
                Test
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Optional: Alternative image generation with Stable Diffusion XL
            </p>
            <div className="relative">
              <input
                type={showKeys.stability ? 'text' : 'password'}
                value={apiKeys.stability}
                onChange={(e) => handleInputChange('stability', e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-2 border border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none"
              />
              <button
                onClick={() => toggleKeyVisibility('stability')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKeys.stability ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <FaInfoCircle />
              <span>Get your key from <a href="https://platform.stability.ai/account/keys" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">Stability AI Platform</a></span>
            </div>
          </div>

          {/* Anthropic Configuration */}
          <div className="border border-cyan-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-navy-900">Anthropic API Key</h3>
              <button
                onClick={() => testConnection('anthropic')}
                className="px-3 py-1 bg-cyan-500 text-white rounded-lg text-sm hover:bg-cyan-400"
              >
                Test
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Optional: Alternative text generation with Claude
            </p>
            <div className="relative">
              <input
                type={showKeys.anthropic ? 'text' : 'password'}
                value={apiKeys.anthropic}
                onChange={(e) => handleInputChange('anthropic', e.target.value)}
                placeholder="sk-ant-..."
                className="w-full px-4 py-2 border border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none"
              />
              <button
                onClick={() => toggleKeyVisibility('anthropic')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKeys.anthropic ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <FaInfoCircle />
              <span>Get your key from <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">Anthropic Console</a></span>
            </div>
          </div>

          {/* Status Message */}
          {status && (
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
              <p className="text-sm text-cyan-700">{status}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-navy-900 mb-2">Setup Instructions:</h4>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Get your API keys from the respective platforms</li>
              <li>2. Paste your keys in the fields above</li>
              <li>3. Test each connection to verify your keys work</li>
              <li>4. Save the configuration</li>
              <li>5. Restart the application to apply changes</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 flex items-center gap-2"
            >
              <FaSave />
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIConfigModal; 