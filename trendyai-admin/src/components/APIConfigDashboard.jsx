import React, { useState, useEffect } from 'react';
import { FaKey, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaShieldAlt, FaCog, FaFlask, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import apiConfig from '../utils/apiConfig';

const APIConfigDashboard = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState({});
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const [selectedModel, setSelectedModel] = useState('mistral-small');

  // Load status on mount
  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  const loadStatus = async () => {
    // Load from storage first
    apiConfig.loadFromStorage();
    
    // Initialize if not already done
    if (!apiConfig.isInitialized) {
      await apiConfig.initialize();
    }
    
    setStatus(apiConfig.getStatus());
  };

  const testOpenRouterConnection = async () => {
    setIsLoading(true);
    try {
      const result = await apiConfig.testOpenRouterConnection(selectedModel);
      setTestResults(prev => ({
        ...prev,
        openRouter: result
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        openRouter: { success: false, message: `❌ OpenRouter connection failed: ${error.message}` }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testGoogleConnection = async () => {
    setIsLoading(true);
    try {
      const result = await apiConfig.testGoogleConnection();
      setTestResults(prev => ({
        ...prev,
        google: result
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        google: { success: false, message: `❌ Google API connection failed: ${error.message}` }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testAllConnections = async () => {
    setIsLoading(true);
    setTestResults({});
    
    // Test all connections in parallel
    await Promise.all([
      testOpenRouterConnection(),
      testGoogleConnection()
    ]);
    
    setIsLoading(false);
  };

  const clearConfiguration = () => {
    if (window.confirm('Are you sure you want to clear all API configuration? This action cannot be undone.')) {
      apiConfig.clearConfiguration();
      setStatus({});
      setTestResults({});
    }
  };

  const getModelDisplayName = (modelKey) => {
    const displayNames = {
      'mistral-small': 'Mistral Small 3.2 24B',
      'deepseek-r1': 'DeepSeek R1 0528',
      'nvidia-llama': 'NVIDIA Llama 3.1 Nemotron Ultra 253B',
      'kimi-dev': 'Kimi Dev 72B',
      'qwen-30b': 'Qwen3 30B A3B',
      'meta-llama': 'Meta Llama 4 Maverick',
      'qwen-32b': 'Qwen3 32B',
      'deepseek-v3': 'DeepSeek V3 0324',
      'gemma-27b': 'Google Gemma 3 27B',
      'gemini-flash': 'Google Gemini 2.0 Flash',
      'mistral-nemo': 'Mistral Nemo',
      'deepcoder': 'Agentica Deepcoder 14B',
      'minimax-m1': 'MiniMax M1',
      'sarvam-m': 'Sarvam AI Sarvam-M',
      'devstral': 'Mistral Devstral Small',
      'deepseek-chimera': 'TNG DeepSeek R1T Chimera',
      'microsoft-mai': 'Microsoft MAI DS R1',
      'glm-z1': 'THUDM GLM Z1 32B',
      'reka-flash': 'Reka Flash 3',
      'qwq-32b': 'ArliAI QwQ 32B RpR v1',
      'kimi-vl': 'Moonshot AI Kimi VL A3B',
      'cypher-alpha': 'Cypher Alpha',
      'deepseek-r1-alt': 'DeepSeek R1 0528 (Alt)'
    };
    return displayNames[modelKey] || modelKey;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaCog className="text-purple-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">API Configuration Dashboard</h2>
                <p className="text-sm text-gray-600">Manage and test all API connections</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaShieldAlt className="text-blue-600" />
                <span className="font-semibold text-blue-900">OpenRouter</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{status.openRouterModels || 0}</p>
              <p className="text-sm text-blue-600">Models Available</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaKey className="text-orange-600" />
                <span className="font-semibold text-orange-900">Google API</span>
              </div>
              <p className="text-2xl font-bold text-orange-700">{status.googleAPIKey ? '✅' : '❌'}</p>
              <p className="text-sm text-orange-600">API Key Set</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaCog className="text-purple-600" />
                <span className="font-semibold text-purple-900">Total Keys</span>
              </div>
              <p className="text-2xl font-bold text-purple-700">{status.totalKeys || 0}</p>
              <p className="text-sm text-purple-600">Configured</p>
            </div>
          </div>

          {/* Test Connections */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Connections</h3>
            
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={testOpenRouterConnection}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
              >
                {isLoading ? <FaSpinner className="animate-spin" /> : 'Test OpenRouter'}
              </button>
              
              <button
                onClick={testGoogleConnection}
                disabled={isLoading}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
              >
                {isLoading ? <FaSpinner className="animate-spin" /> : 'Test Google API'}
              </button>
              
              <button
                onClick={testAllConnections}
                disabled={isLoading}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
              >
                {isLoading ? <FaSpinner className="animate-spin" /> : 'Test All'}
              </button>
            </div>

            {/* Test Results */}
            {Object.keys(testResults).length > 0 && (
              <div className="space-y-3">
                {testResults.openRouter && (
                  <div className={`p-3 rounded-lg border ${
                    testResults.openRouter.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {testResults.openRouter.success ? <FaCheckCircle className="text-green-600" /> : <FaExclamationTriangle className="text-red-600" />}
                      <span className="font-semibold">OpenRouter:</span>
                      <span className={testResults.openRouter.success ? 'text-green-700' : 'text-red-700'}>
                        {testResults.openRouter.message}
                      </span>
                    </div>
                  </div>
                )}

                {testResults.google && (
                  <div className={`p-3 rounded-lg border ${
                    testResults.google.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {testResults.google.success ? <FaCheckCircle className="text-green-600" /> : <FaExclamationTriangle className="text-red-600" />}
                      <span className="font-semibold">Google API:</span>
                      <span className={testResults.google.success ? 'text-green-700' : 'text-red-700'}>
                        {testResults.google.message}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* OpenRouter Model Selection */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">OpenRouter Model Selection</h3>
            
            <div className="flex items-center gap-3 mb-4">
              <label className="text-sm font-semibold text-gray-700">Test Model:</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                {apiConfig.getAvailableModels().map(model => (
                  <option key={model} value={model}>
                    {getModelDisplayName(model)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {apiConfig.getAvailableModels().slice(0, 12).map(model => (
                <div key={model} className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {getModelDisplayName(model)}
                    </span>
                    <div className="flex items-center gap-1">
                      <FaKey className="text-green-600 text-xs" />
                      <span className="text-xs text-green-600">✓</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Configuration Details */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Configuration Details</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowKeys(!showKeys)}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  {showKeys ? <FaEyeSlash /> : <FaEye />}
                  {showKeys ? 'Hide Keys' : 'Show Keys'}
                </button>
                <button
                  onClick={clearConfiguration}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                >
                  <FaTrash />
                  Clear All
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">Google API Key</h4>
                    <p className="text-sm text-gray-600">Google Generative AI API access</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {showKeys ? apiConfig.getGoogleAPIKey() : '••••••••••••••••'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIConfigDashboard; 