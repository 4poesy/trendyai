import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaBuilding, FaRocket } from 'react-icons/fa';
import { useToast } from './Toast';
import { crossDomainAuth, domainNavigation, getCurrentDomain } from '../utils/domainIntegration';
import { validateEmail, validatePassword } from '../utils/validation';

const UnifiedLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentDomain, setCurrentDomain] = useState('');

  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();

  useEffect(() => {
    setCurrentDomain(getCurrentDomain());
    
    // Check if user is already authenticated
    if (crossDomainAuth.isAuthenticated()) {
      const auth = crossDomainAuth.getAuth();
      showInfo(`Welcome back, ${auth.user.name}!`);
      navigate('/');
    }
  }, [navigate, showInfo]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Please fix the errors above');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication response
      const mockAuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 'user-001',
          email: formData.email,
          name: 'Admin User',
          role: 'admin',
          permissions: ['read', 'write', 'admin', 'trendyai_access'],
          avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D9488&color=fff',
          lastLogin: new Date().toISOString()
        }
      };

      // Store authentication data
      const success = crossDomainAuth.setAuth(mockAuthResponse.token, mockAuthResponse.user);
      
      if (success) {
        showSuccess('Login successful! Welcome to TrendyAI Admin');
        
        // Share user data across domains
        if (formData.rememberMe) {
          localStorage.setItem('trendtactics_remember_me', 'true');
        }
        
        // Navigate to dashboard
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        showError('Failed to store authentication data');
      }
    } catch (loginError) {
      console.error('Login error:', loginError);
      showError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const demoUser = {
        token: 'demo-jwt-token-' + Date.now(),
        user: {
          id: 'demo-001',
          email: 'demo@trendyai.com',
          name: 'Demo User',
          role: 'demo',
          permissions: ['read', 'demo'], // No trendyai_access for demo users
          avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=6366F1&color=fff',
          lastLogin: new Date().toISOString()
        }
      };

      crossDomainAuth.setAuth(demoUser.token, demoUser.user);
      showSuccess('Demo login successful!');
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (demoError) {
      console.error('Demo login error:', demoError);
      showError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClientLogin = async () => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const clientUser = {
        token: 'client-jwt-token-' + Date.now(),
        user: {
          id: 'client-001',
          email: 'client@example.com',
          name: 'Client User',
          role: 'client',
          permissions: ['read', 'client'],
          avatar: 'https://ui-avatars.com/api/?name=Client+User&background=7559e2&color=fff',
          lastLogin: new Date().toISOString()
        }
      };

      crossDomainAuth.setAuth(clientUser.token, clientUser.user);
      localStorage.setItem('trendyai_dev_role', 'client');
      showSuccess('Client login successful! Loading your portal...');
      
      setTimeout(() => {
        navigate('/client');
      }, 1000);
    } catch (clientError) {
      console.error('Client login error:', clientError);
      showError('Client login failed');
    } finally {
      setLoading(false);
    }
  };

  const getDomainInfo = () => {
    if (currentDomain.includes('trendtacticsdigital')) {
      return {
        name: 'Trendtactics Digital',
        icon: <FaBuilding className="text-cyan-500" />,
        description: 'Your digital marketing agency platform'
      };
    } else if (currentDomain.includes('trendyai')) {
      return {
        name: 'TrendyAI Admin',
        icon: <FaRocket className="text-cyan-500" />,
        description: 'Internal AI workspace (Admin access only)'
      };
    } else {
      return {
        name: 'Development Mode',
        icon: <FaRocket className="text-cyan-500" />,
        description: 'Local development environment'
      };
    }
  };

  const domainInfo = getDomainInfo();

  return (
    <div className="min-h-screen bg-[#070709] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-[#070709] to-[#070709] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4 gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-black flex items-center justify-center font-black text-xl shadow-[0_0_15px_rgba(251,191,36,0.5)]">
              T
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading">
              Trendy<span className="text-primary">AI</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm font-medium">{domainInfo.description}</p>
          <div className="mt-2 text-xs text-gray-500 font-mono">
            Secure Node: {currentDomain}
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-[#121216] rounded-2xl shadow-2xl p-8 border border-[#222228] transition-all duration-300 hover:border-primary/30">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FaUser className="h-4 w-4 text-primary" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3.5 py-3 bg-[#1a1a22] border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm ${
                    errors.email ? 'border-red-500/50' : 'border-[#2d2d3a]'
                  }`}
                  placeholder="name@example.com"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-primary" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-12 py-3 bg-[#1a1a22] border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm ${
                    errors.password ? 'border-red-500/50' : 'border-[#2d2d3a]'
                  }`}
                  placeholder="Enter your security password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-4 w-4" />
                  ) : (
                    <FaEye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#070709] focus:ring-primary border-[#2d2d3a] bg-[#1a1a22] rounded accent-primary"
                  disabled={loading}
                />
                <label htmlFor="rememberMe" className="ml-2.5 block text-xs font-medium text-gray-300">
                  Remember my session
                </label>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-[#fcd34d] text-[#070709] py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(251,191,36,0.25)] hover:shadow-[0_0_20px_rgba(251,191,36,0.45)] cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#070709] border-t-transparent"></div>
                  Verifying...
                </div>
              ) : (
                'Authenticate Account'
              )}
            </button>

            {/* Demo & Client Quick Ports */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="bg-[#1a1a22] hover:bg-[#202029] text-primary py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-primary/20 hover:border-primary/40 cursor-pointer"
              >
                Demo Sandbox
              </button>
              <button
                type="button"
                onClick={handleClientLogin}
                disabled={loading}
                className="bg-[#1a1a22] hover:bg-[#202029] text-white py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-[#2d2d3a] hover:border-gray-500 cursor-pointer"
              >
                Client Portal
              </button>
            </div>
          </form>

          {/* Domain Navigation */}
          <div className="mt-8 pt-6 border-t border-[#222228] text-center">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-4">
              Gateway Switch
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => domainNavigation.goToTrendtactics()}
                className="flex-1 bg-[#1a1a22] hover:bg-[#202029] text-gray-300 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors border border-[#2d2d3a] cursor-pointer"
              >
                <FaBuilding className="inline mr-2 text-primary" />
                Trendtactics
              </button>
              <button
                onClick={() => domainNavigation.goToTrendyAI()}
                className="flex-1 bg-[#1a1a22] hover:bg-[#202029] text-primary py-2.5 px-4 rounded-xl text-xs font-bold transition-colors border border-primary/20 cursor-pointer"
              >
                <FaRocket className="inline mr-2" />
                TrendyAI
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-600 font-semibold tracking-wider uppercase">
            © 2026 Trendtactics Digital. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin;
