import React, { useState, useEffect } from 'react';

const PuterNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show notification after 2 seconds
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem('puter-notification-dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('puter-notification-dismissed', 'true');
  };

  const handleSetup = () => {
    // Open setup guide
    window.open('/PUTER_SETUP.md', '_blank');
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg shadow-lg p-4 border-l-4 border-green-400">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-lg">🎉</span>
            </div>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-semibold">
              Puter.js Integration Complete!
            </h3>
            <p className="text-xs mt-1 opacity-90">
              Your AI agents now use free Puter.js services. No more API limits! Try generating content now.
            </p>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={handleSetup}
                className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded transition-colors"
              >
                Setup Guide
              </button>
              <button
                onClick={handleDismiss}
                className="text-xs bg-white bg-opacity-10 hover:bg-opacity-20 px-3 py-1 rounded transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-2 text-white opacity-60 hover:opacity-100"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default PuterNotification; 