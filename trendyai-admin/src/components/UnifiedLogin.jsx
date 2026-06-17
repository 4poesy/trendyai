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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-cyan-100 to-navy-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {domainInfo.icon}
            <h1 className="text-3xl font-bold text-navy-900 ml-3">
              {domainInfo.name}
            </h1>
          </div>
          <p className="text-navy-900/80">{domainInfo.description}</p>
          <div className="mt-2 text-sm text-navy-900/70">
            Domain: {currentDomain}
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-cyan-200/40">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-navy-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-cyan-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-300' : 'border-cyan-200'
                  }`}
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-navy-900 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-cyan-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
                    errors.password ? 'border-red-300' : 'border-cyan-200'
                  }`}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-cyan-500 hover:text-cyan-700" />
                  ) : (
                    <FaEye className="h-5 w-5 text-cyan-500 hover:text-cyan-700" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
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
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-cyan-300 rounded"
                  disabled={loading}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-navy-900">
                  Remember me
                </label>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-navy-900 py-3 px-4 rounded-lg font-bold hover:from-cyan-400 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-900 mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Demo Login */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full bg-navy-900 text-cyan-200 py-3 px-4 rounded-lg font-bold hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-cyan-200/40"
            >
              Try Demo Mode
            </button>

            {/* Client Login */}
            <button
              type="button"
              onClick={handleClientLogin}
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-bold hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-border-main"
            >
              Try Client Mode
            </button>
          </form>

          {/* Domain Navigation */}
          <div className="mt-8 pt-6 border-t border-cyan-200/40">
            <p className="text-sm text-navy-900/70 text-center mb-4">
              Navigate between platforms:
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => domainNavigation.goToTrendtactics()}
                className="flex-1 bg-navy-900 text-cyan-200 py-2 px-4 rounded-lg text-sm font-bold hover:bg-navy-800 transition-colors border-2 border-cyan-200/40"
              >
                <FaBuilding className="inline mr-2" />
                Trendtactics
              </button>
              <button
                onClick={() => domainNavigation.goToTrendyAI()}
                className="flex-1 bg-cyan-500 text-navy-900 py-2 px-4 rounded-lg text-sm font-bold hover:bg-cyan-400 transition-colors"
              >
                <FaRocket className="inline mr-2" />
                TrendyAI
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-navy-900/70">
            © 2025 Trendtactics Digital. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin;