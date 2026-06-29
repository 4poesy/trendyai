// Domain Integration System for Trendtactics Digital & TrendyAI
// Handles cross-domain authentication, data sharing, and unified user experience

const DOMAINS = {
  TRENDTACTICS: 'https://trendtacticsdigital.com',
  TRENDYAI: (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'))
    ? 'https://trendyai365.vercel.app'
    : 'https://trendyai.com', // Internal AI workspace - ADMIN ONLY
  LOCALHOST: 'http://localhost:5173'
};

const ENV = import.meta.env.MODE || 'development';

// Get current domain
export const getCurrentDomain = () => {
  if (typeof window === 'undefined') return DOMAINS.LOCALHOST;
  
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return port ? `http://localhost:${port}` : DOMAINS.LOCALHOST;
  }
  
  if (hostname.includes('trendtacticsdigital')) {
    return DOMAINS.TRENDTACTICS;
  }
  
  if (hostname.includes('trendyai')) {
    return DOMAINS.TRENDYAI;
  }
  
  return window.location.origin;
};

// Cross-domain authentication
export class CrossDomainAuth {
  constructor() {
    this.storageKey = 'trendtactics_auth_token';
    this.userKey = 'trendtactics_user_data';
    this.sessionKey = 'trendtactics_session';
    this.checkSSO();
  }

  // Check and consume incoming SSO tokens from URL params
  checkSSO() {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const ssoToken = params.get('sso_token');
      const ssoUser = params.get('sso_user');
      
      if (ssoToken && ssoUser) {
        const userData = JSON.parse(ssoUser);
        this.setAuth(ssoToken, userData);
        
        // Clean URL parameters to keep address bar tidy
        const url = new URL(window.location.href);
        url.searchParams.delete('sso_token');
        url.searchParams.delete('sso_user');
        window.history.replaceState({}, document.title, url.pathname + url.search);
      }
    } catch (e) {
      console.error('SSO consumption failed:', e);
    }
  }

  // Set authentication data across domains
  setAuth(token, userData) {
    try {
      // Store in localStorage
      localStorage.setItem(this.storageKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(userData));
      localStorage.setItem(this.sessionKey, JSON.stringify({
        timestamp: Date.now(),
        domain: getCurrentDomain()
      }));

      // Store in sessionStorage for immediate access
      sessionStorage.setItem(this.storageKey, token);
      sessionStorage.setItem(this.userKey, JSON.stringify(userData));

      // If in production, set cross-domain cookie
      if (ENV === 'production') {
        this.setCrossDomainCookie('auth_token', token, 7); // 7 days
        this.setCrossDomainCookie('user_data', JSON.stringify(userData), 7);
      }

      return true;
    } catch (error) {
      console.error('Auth storage error:', error);
      return false;
    }
  }

  // Get authentication data
  getAuth() {
    try {
      const token = localStorage.getItem(this.storageKey) || sessionStorage.getItem(this.storageKey);
      const userData = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey);
      
      if (!token || !userData) return null;

      const session = JSON.parse(localStorage.getItem(this.sessionKey) || '{}');
      const isExpired = Date.now() - session.timestamp > (7 * 24 * 60 * 60 * 1000); // 7 days

      if (isExpired) {
        this.clearAuth();
        return null;
      }

      return {
        token,
        user: JSON.parse(userData),
        session
      };
    } catch (error) {
      console.error('Auth retrieval error:', error);
      return null;
    }
  }

  // Clear authentication
  clearAuth() {
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.userKey);
      localStorage.removeItem(this.sessionKey);
      sessionStorage.removeItem(this.storageKey);
      sessionStorage.removeItem(this.userKey);

      if (ENV === 'production') {
        this.clearCrossDomainCookie('auth_token');
        this.clearCrossDomainCookie('user_data');
      }
    } catch (error) {
      console.error('Auth clear error:', error);
    }
  }

  // Set cross-domain cookie
  setCrossDomainCookie(name, value, days) {
    const domain = '.trendtacticsdigital.com'; // Shared domain
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; domain=${domain}; secure; samesite=strict`;
  }

  // Clear cross-domain cookie
  clearCrossDomainCookie(name) {
    const domain = '.trendtacticsdigital.com';
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getAuth();
  }

  // Get user role and permissions
  getUserRole() {
    const auth = this.getAuth();
    return auth?.user?.role || 'guest';
  }

  // Check if user has permission
  hasPermission(permission) {
    const auth = this.getAuth();
    const permissions = auth?.user?.permissions || [];
    return permissions.includes(permission);
  }

  // Check if user can access TrendyAI (admin only)
  canAccessTrendyAI() {
    const auth = this.getAuth();
    const role = auth?.user?.role;
    return role === 'admin' || role === 'super_admin';
  }

  // Check if user can access client portal
  canAccessClientPortal() {
    const auth = this.getAuth();
    const role = auth?.user?.role;
    return role === 'client' || role === 'admin' || role === 'super_admin';
  }
}

// Domain navigation utilities
export const domainNavigation = {
  // Navigate to Trendtactics Digital
  goToTrendtactics(path = '') {
    let target = `${DOMAINS.TRENDTACTICS}${path}`;
    if (crossDomainAuth.isAuthenticated()) {
      const auth = crossDomainAuth.getAuth();
      try {
        const urlObj = new URL(target);
        urlObj.searchParams.set('sso_token', auth.token);
        urlObj.searchParams.set('sso_user', JSON.stringify(auth.user));
        target = urlObj.toString();
      } catch (err) {
        console.error('SSO navigation error:', err);
      }
    }
    window.location.href = target;
  },

  // Navigate to TrendyAI (admin only)
  goToTrendyAI(path = '') {
    if (!crossDomainAuth.canAccessTrendyAI()) {
      alert('Access Denied: TrendyAI is restricted to administrators only.');
      return;
    }
    let target = `${DOMAINS.TRENDYAI}${path}`;
    if (crossDomainAuth.isAuthenticated()) {
      const auth = crossDomainAuth.getAuth();
      try {
        const urlObj = new URL(target);
        urlObj.searchParams.set('sso_token', auth.token);
        urlObj.searchParams.set('sso_user', JSON.stringify(auth.user));
        target = urlObj.toString();
      } catch (err) {
        console.error('SSO navigation error:', err);
      }
    }
    window.location.href = target;
  },

  // Open in new tab
  openInNewTab(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  },

  // Check if current domain is Trendtactics
  isTrendtactics() {
    return getCurrentDomain() === DOMAINS.TRENDTACTICS;
  },

  // Check if current domain is TrendyAI
  isTrendyAI() {
    return getCurrentDomain() === DOMAINS.TRENDYAI;
  }
};

// Data sharing between domains
export class CrossDomainData {
  constructor() {
    this.storagePrefix = 'trendtactics_shared_';
  }

  // Share data between domains
  shareData(key, data, ttl = 3600000) { // 1 hour default
    const sharedData = {
      data,
      timestamp: Date.now(),
      ttl,
      domain: getCurrentDomain()
    };

    localStorage.setItem(`${this.storagePrefix}${key}`, JSON.stringify(sharedData));
    
    // Broadcast to other tabs/windows
    if (typeof window !== 'undefined') {
      window.postMessage({
        type: 'TRENDTACTICS_DATA_SHARED',
        key,
        data: sharedData
      }, '*');
    }
  }

  // Get shared data
  getSharedData(key) {
    try {
      const stored = localStorage.getItem(`${this.storagePrefix}${key}`);
      if (!stored) return null;

      const sharedData = JSON.parse(stored);
      const isExpired = Date.now() - sharedData.timestamp > sharedData.ttl;

      if (isExpired) {
        localStorage.removeItem(`${this.storagePrefix}${key}`);
        return null;
      }

      return sharedData.data;
    } catch (error) {
      console.error('Shared data retrieval error:', error);
      return null;
    }
  }

  // Clear shared data
  clearSharedData(key) {
    localStorage.removeItem(`${this.storagePrefix}${key}`);
  }

  // Clear all shared data
  clearAllSharedData() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.storagePrefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Initialize cross-domain communication
export const initCrossDomainCommunication = () => {
  if (typeof window === 'undefined') return;

  // Listen for messages from other domains/tabs
  window.addEventListener('message', (event) => {
    if (event.data.type === 'TRENDTACTICS_DATA_SHARED') {
      // Handle shared data updates
      console.log('Received shared data:', event.data);
    }
  });

  // Listen for storage changes
  window.addEventListener('storage', (event) => {
    if (event.key && event.key.startsWith('trendtactics_')) {
      // Handle storage changes from other tabs
      console.log('Storage changed:', event.key, event.newValue);
    }
  });
};

// Export instances
export const crossDomainAuth = new CrossDomainAuth();
export const crossDomainData = new CrossDomainData();

// Initialize on load
if (typeof window !== 'undefined') {
  initCrossDomainCommunication();
} 