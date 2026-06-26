import React, { useState, useRef, useEffect } from 'react';
import { FaBuilding, FaRocket, FaGlobe, FaExternalLinkAlt } from 'react-icons/fa';
import { domainNavigation, getCurrentDomain, crossDomainAuth } from '../utils/domainIntegration';
import { useToast } from './Toast';

const DomainSwitcher = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDomain] = useState(getCurrentDomain());
  const { showInfo, showError } = useToast();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const domains = [
    {
      name: 'Trendtactics Digital',
      url: 'https://trendtacticsdigital.com',
      icon: <FaBuilding />,
      description: 'Digital Marketing Agency',
      isCurrent: currentDomain.includes('trendtacticsdigital')
    },
    {
      name: 'TrendyAI Admin',
      url: 'https://trendyai365.vercel.app',
      icon: <FaRocket />,
      description: 'Internal AI Workspace (Admin Only)',
      isCurrent: currentDomain.includes('trendyai'),
      restricted: true
    }
  ];

  const handleDomainSwitch = (domain) => {
    if (domain.isCurrent) {
      showInfo('You are already on this domain');
      setIsOpen(false);
      return;
    }

    if (domain.url.includes('trendyai') && !crossDomainAuth.canAccessTrendyAI()) {
      showError('Access Denied: TrendyAI is restricted to administrators only.');
      return;
    }

    if (crossDomainAuth.isAuthenticated()) {
      const auth = crossDomainAuth.getAuth();
      showInfo(`Switching to ${domain.name}...`);
      localStorage.setItem('trendtactics_switch_domain', 'true');
      localStorage.setItem('trendtactics_auth_data', JSON.stringify(auth));
    }

    setTimeout(() => {
      window.location.href = domain.url;
    }, 1000);
  };

  const handleOpenInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    showInfo('Opened in new tab');
  };

  /* ── Inline styles (dark-theme aware) ─────────────────── */
  const btnStyle = {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '5px 10px',
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 7,
    color: '#888888',
    fontSize: 11, fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  };

  const dropdownStyle = {
    position: 'absolute', right: 0, top: '110%',
    width: 280,
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 10,
    zIndex: 50,
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`} style={{ position: 'relative' }}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={btnStyle}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#FFFFFF'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888888'; }}
        aria-label="Switch between domains"
      >
        <FaGlobe size={12} style={{ color: '#facc15' }} />
        <span className="hidden sm:inline">
          {currentDomain.includes('trendtacticsdigital') ? 'Trendtactics' : 'TrendyAI'}
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div style={dropdownStyle}>
          {/* Header */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #2a2a2a',
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Switch Platform
            </p>
            <p style={{ fontSize: 10, color: '#555555', margin: '4px 0 0' }}>
              Navigate between your platforms
            </p>
          </div>

          {/* Domain List */}
          <div style={{ padding: 8 }}>
            {domains.map((domain, index) => {
              const isRestricted = domain.restricted && !crossDomainAuth.canAccessTrendyAI();
              return (
                <div
                  key={index}
                  onClick={() => !isRestricted && handleDomainSwitch(domain)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 8,
                    cursor: isRestricted ? 'not-allowed' : 'pointer',
                    opacity: isRestricted ? 0.4 : 1,
                    background: domain.isCurrent ? 'rgba(250, 204, 21, 0.08)' : 'transparent',
                    border: domain.isCurrent ? '1px solid rgba(250, 204, 21, 0.25)' : '1px solid transparent',
                    marginBottom: 4,
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    if (!domain.isCurrent && !isRestricted) e.currentTarget.style.background = '#222222';
                  }}
                  onMouseLeave={e => {
                    if (!domain.isCurrent && !isRestricted) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                    {/* Icon */}
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: domain.isCurrent ? 'rgba(250, 204, 21, 0.12)' : 'rgba(37, 99, 235, 0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: domain.isCurrent ? '#facc15' : '#2563eb',
                      fontSize: 13, flexShrink: 0,
                    }}>
                      {domain.icon}
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 12, fontWeight: 600, margin: 0,
                        color: domain.isCurrent ? '#facc15' : '#FFFFFF',
                      }}>
                        {domain.name}
                        {domain.restricted && (
                          <span style={{ fontSize: 9, color: '#ef4444', marginLeft: 6 }}>(Admin Only)</span>
                        )}
                      </p>
                      <p style={{
                        fontSize: 10, color: '#555555', margin: '2px 0 0',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {domain.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    {domain.isCurrent && (
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: '#22c55e',
                        boxShadow: '0 0 6px rgba(34, 197, 94, 0.5)',
                      }} />
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenInNewTab(domain.url); }}
                      style={{
                        background: 'none', border: 'none', padding: 4,
                        color: '#555555', cursor: 'pointer', display: 'flex',
                        borderRadius: 4, transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#facc15'}
                      onMouseLeave={e => e.currentTarget.style.color = '#555555'}
                      title="Open in new tab"
                    >
                      <FaExternalLinkAlt size={10} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{
            padding: '10px 16px',
            borderTop: '1px solid #2a2a2a',
            display: 'flex', justifyContent: 'space-between',
            fontSize: 10, color: '#555555',
          }}>
            <span>Current: {currentDomain}</span>
            <span style={{ color: '#22c55e' }}>● Connected</span>
          </div>
        </div>
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

  const linkStyle = (active) => ({
    display: 'flex', alignItems: 'center', gap: 4,
    padding: '4px 8px', borderRadius: 6,
    fontSize: 11, fontWeight: 600,
    background: active ? 'rgba(250, 204, 21, 0.10)' : 'transparent',
    color: active ? '#facc15' : '#555555',
    border: 'none', cursor: 'pointer',
    transition: 'all 0.15s ease',
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <button
        onClick={switchToTrendtactics}
        style={linkStyle(isTrendtactics)}
        onMouseEnter={e => { if (!isTrendtactics) e.currentTarget.style.color = '#FFFFFF'; }}
        onMouseLeave={e => { if (!isTrendtactics) e.currentTarget.style.color = '#555555'; }}
      >
        <FaBuilding size={10} />
        <span className="hidden sm:inline">Trendtactics</span>
      </button>
      
      <button
        onClick={switchToTrendyAI}
        style={linkStyle(isTrendyAI)}
        onMouseEnter={e => { if (!isTrendyAI) e.currentTarget.style.color = '#FFFFFF'; }}
        onMouseLeave={e => { if (!isTrendyAI) e.currentTarget.style.color = '#555555'; }}
      >
        <FaRocket size={10} />
        <span className="hidden sm:inline">TrendyAI</span>
      </button>
    </div>
  );
};

export default DomainSwitcher;
