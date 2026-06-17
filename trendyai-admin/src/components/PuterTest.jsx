import React, { useState, useEffect } from 'react';

const PuterTest = () => {
  const [puterStatus, setPuterStatus] = useState('checking');
  const [debugInfo, setDebugInfo] = useState({
    windowExists: false,
    puterExists: false,
    puterKeys: [],
    aiExists: [],
    allGlobals: []
  });

  useEffect(() => {
    const checkPuter = () => {
      const info = {
        windowExists: typeof window !== 'undefined',
        puterExists: typeof window !== 'undefined' && typeof window.puter !== 'undefined',
        puterKeys: typeof window !== 'undefined' && window.puter ? Object.keys(window.puter) : [],
        aiExists: typeof window !== 'undefined' && window.puter && window.puter.ai ? Object.keys(window.puter.ai) : [],
        allGlobals: typeof window !== 'undefined' ? Object.keys(window).filter(k => k.includes('puter')) : []
      };

      setDebugInfo(info);

      if (info.puterExists && info.aiExists.length > 0) {
        setPuterStatus('loaded');
      } else {
        setPuterStatus('not-loaded');
      }
    };

    // Check immediately
    checkPuter();

    // Check again after a delay to account for script loading
    const timer = setTimeout(checkPuter, 2000);

    return () => clearTimeout(timer);
  }, []);

  const testPuterChat = async () => {
    try {
      const result = await window.puter.ai.chat('Hello, this is a test!');
      alert('Puter.js test successful: ' + result);
    } catch (error) {
      alert('Puter.js test failed: ' + error.message);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2">Puter.js Status</h3>
      <div className="text-xs space-y-1">
        <div>Status: <span className={puterStatus === 'loaded' ? 'text-green-600' : 'text-red-600'}>{puterStatus}</span></div>
        <div>Window: {debugInfo.windowExists ? '✅' : '❌'}</div>
        <div>Puter: {debugInfo.puterExists ? '✅' : '❌'}</div>
        <div>AI Methods: {debugInfo.aiExists ? debugInfo.aiExists.join(', ') : 'None'}</div>
        <div>Global Keys: {debugInfo.allGlobals ? debugInfo.allGlobals.join(', ') : 'None'}</div>
      </div>
      {puterStatus === 'loaded' && (
        <button 
          onClick={testPuterChat}
          className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Test Chat
        </button>
      )}
    </div>
  );
};

export default PuterTest; 