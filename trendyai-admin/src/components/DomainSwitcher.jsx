import React, { useState } from 'react';
import { FaBuilding, FaRocket, FaGlobe, FaExternalLinkAlt, FaCog } from 'react-icons/fa';
import { domainNavigation, getCurrentDomain, crossDomainAuth } from '../utils/domainIntegration';
import { useToast } from './Toast';

const DomainSwitcher = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDomain] = useState(getCurrentDomain()); // eslint-disable-line no-unused-vars
  const { showInfo, showError } = useToast();

  const domains = [
    {
      name: 'Trendtactics Digital',
      url: 'https://trendtacticsdigital.com',
      icon: <FaBuilding className="text-cyan-500" />,
      description: 'Digital Marketing Agency',
      color: 'cyan',
      isCurrent: currentDomain.includes('trendtacticsdigital')
    },
    {
      name: 'TrendyAI Admin',
      url: 'https://trendyai.com',
      icon: <FaRocket className="text-cyan-500" />,
      description: 'Internal AI Workspace (Admin Only)',
      color: 'cyan',
      isCurrent: currentDomain.includes('trendyai'),
      restricted: true
    }
  ];

  const handleDomainSwitch = (domain) => {
    if (domain.isCurrent) {
      showInfo('You are already on this domain');
      return;
    }

    // Check access permissions for TrendyAI
    if (domain.url.includes('trendyai') && !crossDomainAuth.canAccessTrendyAI()) {
      showError('Access Denied: TrendyAI is restricted to administrators only.');
      return;
    }

    // Check if user is authenticated
    if (crossDomainAuth.isAuthenticated()) {
      const auth = crossDomainAuth.getAuth();
      showInfo(`Switching to ${domain.name}...`);
      
      // Share authentication data before switching
      localStorage.setItem('trendtactics_switch_domain', 'true');
      localStorage.setItem('trendtactics_auth_data', JSON.stringify(auth));
    }

    // Navigate to the domain
    setTimeout(() => {
      window.location.href = domain.url;
    }, 1000);
  };

  const handleOpenInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    showInfo('Opened in new tab');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Domain Switcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg border border-cyan-500 hover:bg-white transition-all duration-200 group"
        aria-label="Switch between domains"
      >
        <FaGlobe className="text-cyan-500 group-hover:text-cyan-600 transition-colors" />
        <span className="text-sm font-medium text-navy-900">
          {currentDomain.includes('trendtacticsdigital') ? 'Trendtactics' : 'TrendyAI'}
        </span>
        <FaCog className="text-cyan-400 group-hover:text-cyan-500 transition-colors" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-cyan-500 z-50 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-cyan-500">
              <h3 className="text-lg font-semibold text-navy-900">
                Switch Platform
              </h3>
              <p className="text-sm text-navy-900/70">
                Navigate between your platforms
              </p>
            </div>

            {/* Domain List */}
            <div className="p-2">
              {domains.map((domain, index) => (
                <div
                  key={index}
                  className={`relative group cursor-pointer rounded-lg p-3 transition-all duration-200 ${
                    domain.isCurrent
                      ? 'bg-cyan-50 border border-cyan-500'
                      : domain.restricted && !crossDomainAuth.canAccessTrendyAI()
                      ? 'opacity-50 cursor-not-allowed bg-gray-100'
                      : 'hover:bg-cyan-50 border border-transparent'
                  }`}
                >
                  {/* Current Indicator */}
                  {domain.isCurrent && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    </div>
                  )}
                  
                  {/* Restricted Access Indicator */}
                  {domain.restricted && !crossDomainAuth.canAccessTrendyAI() && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-cyan-50 dark:bg-navy-800">
                        {domain.icon}
                      </div>
                                          <div className="flex-1 min-w-0">
                      <h4 className={`font-medium text-sm ${
                        domain.isCurrent 
                          ? 'text-cyan-700' 
                          : domain.restricted && !crossDomainAuth.canAccessTrendyAI()
                          ? 'text-gray-400'
                          : 'text-navy-900'
                      }`}>
                        {domain.name}
                        {domain.restricted && (
                          <span className="ml-1 text-xs text-red-500">(Admin Only)</span>
                        )}
                      </h4>
                      <p className="text-xs text-navy-900/70 truncate">
                        {domain.description}
                      </p>
                    </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenInNewTab(domain.url);
                        }}
                        className="p-1 text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
                        title="Open in new tab"
                      >
                        <FaExternalLinkAlt className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Click Handler */}
                                      <div
                      className="absolute inset-0"
                      onClick={() => !domain.restricted || crossDomainAuth.canAccessTrendyAI() ? handleDomainSwitch(domain) : null}
                    />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-cyan-500 bg-cyan-50">
              <div className="flex items-center justify-between text-xs text-navy-900/70">
                <span>Current: {currentDomain}</span>
                <span>Cross-domain auth enabled</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Quick Domain Switcher (Compact version)
export const QuickDomainSwitcher = () => {
  const currentDomain = getCurrentDomain();
  const { showInfo, showError } = useToast();

  const isTrendtactics = currentDomain.includes('trendtacticsdigital');
  const isTrendyAI = currentDomain.includes('trendyai');

  const switchToTrendtactics = () => {
    if (!isTrendtactics) {
      showInfo('Switching to Trendtactics Digital...');
      setTimeout(() => domainNavigation.goToTrendtactics(), 500);
    }
  };

  const switchToTrendyAI = () => {
    if (!isTrendyAI) {
      if (!crossDomainAuth.canAccessTrendyAI()) {
        showError('Access Denied: TrendyAI is restricted to administrators only.');
        return;
      }
      showInfo('Switching to TrendyAI...');
      setTimeout(() => domainNavigation.goToTrendyAI(), 500);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={switchToTrendtactics}
        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
          isTrendtactics
            ? 'bg-cyan-100 text-cyan-700'
            : 'text-navy-900/70 hover:text-cyan-600'
        }`}
      >
        <FaBuilding className="w-3 h-3" />
        <span className="hidden sm:inline">Trendtactics</span>
      </button>
      
      <button
        onClick={switchToTrendyAI}
        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
          isTrendyAI
            ? 'bg-cyan-100 text-cyan-700'
            : 'text-navy-900/70 hover:text-cyan-600'
        }`}
      >
        <FaRocket className="w-3 h-3" />
        <span className="hidden sm:inline">TrendyAI</span>
      </button>
    </div>
  );
};

export default DomainSwitcher;