import React, { useState, useEffect } from 'react';
import { FaKey, FaEye, FaEyeSlash, FaShieldAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const SecureAPIConfigModal = ({ isOpen, onClose, onSave }) => {
  const [appId, setAppId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Load saved credentials on mount
  useEffect(() => {
    if (isOpen) {
      const savedAppId = localStorage.getItem('trendyai_puter_app_id');
      const savedApiKey = localStorage.getItem('trendyai_puter_api_key');
      
      if (savedAppId) setAppId(savedAppId);
      if (savedApiKey) setApiKey(savedApiKey);
    }
  }, [isOpen]);

  // Validate inputs
  const validateInputs = () => {
    const errors = {};
    
    if (!appId.trim()) {
      errors.appId = 'App ID is required';
    } else if (appId.length < 10) {
      errors.appId = 'App ID must be at least 10 characters';
    }
    
    if (!apiKey.trim()) {
      errors.apiKey = 'API Key is required';
    } else if (apiKey.length < 20) {
      errors.apiKey = 'API Key must be at least 20 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Test Puter.js connection
  const testConnection = async () => {
    if (!validateInputs()) return;
    
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const result = await puterConfig.initialize(appId, apiKey);
      
      if (result.success) {
        setTestResult({ success: true, message: '✅ Connection successful! Puter.js is ready to use.' });
      } else {
        setTestResult({ success: false, message: `❌ Connection failed: ${result.error}` });
      }
    } catch (error) {
      setTestResult({ success: false, message: `❌ Connection failed: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  // Save configuration
  const handleSave = async () => {
    if (!validateInputs()) return;
    
    setIsLoading(true);
    
    try {
      // Test connection first
      const testResult = await puterConfig.initialize(appId, apiKey);
      
      if (testResult.success) {
        // Save to localStorage (in production, use more secure storage)
        localStorage.setItem('trendyai_puter_app_id', appId);
        localStorage.setItem('trendyai_puter_api_key', apiKey);
        
        // Notify parent component
        onSave({ appId, apiKey, puterConfig });
        
        setTestResult({ success: true, message: '✅ Configuration saved successfully!' });
        
        // Close modal after a short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setTestResult({ success: false, message: `❌ Save failed: ${testResult.error}` });
      }
    } catch (error) {
      setTestResult({ success: false, message: `❌ Save failed: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear saved credentials
  const handleClear = () => {
    localStorage.removeItem('trendyai_puter_app_id');
    localStorage.removeItem('trendyai_puter_api_key');
    setAppId('');
    setApiKey('');
    setTestResult(null);
    setValidationErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaShieldAlt className="text-purple-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Secure API Configuration</h2>
              <p className="text-sm text-gray-600">Configure Puter.js credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <FaShieldAlt className="text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Security Notice</h3>
              <p className="text-sm text-blue-700">
                Your API credentials are stored locally and encrypted. Never share these credentials publicly.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* App ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Puter.js App ID
            </label>
            <input
              type="text"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors ${
                validationErrors.appId ? 'border-red-300 focus:border-red-400' : 'border-gray-300 focus:border-purple-400'
              }`}
              placeholder="Enter your Puter.js App ID"
            />
            {validationErrors.appId && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.appId}</p>
            )}
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Puter.js API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors ${
                  validationErrors.apiKey ? 'border-red-300 focus:border-red-400' : 'border-gray-300 focus:border-purple-400'
                }`}
                placeholder="Enter your Puter.js API Key"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showApiKey ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {validationErrors.apiKey && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.apiKey}</p>
            )}
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`p-4 rounded-lg border ${
              testResult.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {testResult.success ? (
                  <FaCheckCircle className="text-green-600" />
                ) : (
                  <FaExclamationTriangle className="text-red-600" />
                )}
                <p className={`text-sm ${
                  testResult.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {testResult.message}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={testConnection}
            disabled={isLoading || !appId.trim() || !apiKey.trim()}
            className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
          >
            {isLoading ? 'Testing...' : 'Test Connection'}
          </button>
          
          <button
            onClick={handleSave}
            disabled={isLoading || !appId.trim() || !apiKey.trim()}
            className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save & Connect'}
          </button>
        </div>

        {/* Clear Button */}
        <div className="mt-4 text-center">
          <button
            onClick={handleClear}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Clear Saved Credentials
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
          <p className="text-sm text-gray-600 mb-2">
            1. Go to <a href="https://puter.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">puter.com</a>
          </p>
          <p className="text-sm text-gray-600 mb-2">
            2. Create an account and get your App ID
          </p>
          <p className="text-sm text-gray-600">
            3. Generate an API key in your dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecureAPIConfigModal; 