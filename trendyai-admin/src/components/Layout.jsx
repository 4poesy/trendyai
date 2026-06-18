import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaSun, FaMoon, FaUsers, FaProjectDiagram, FaClipboardCheck, 
  FaClipboardList, FaRobot, FaChartLine, FaGraduationCap, 
  FaHistory, FaUser, FaSignOutAlt, FaRocket, FaTasks, FaPlusCircle, FaFileAlt
} from 'react-icons/fa';
import DomainSwitcher from './DomainSwitcher';
import { useTheme } from '../contexts/ThemeContext';
import { crossDomainAuth } from '../utils/domainIntegration';
import { useToast } from './Toast';

// Snov.io style CRM sidebar navigation configuration
const adminLinks = [
  { to: '/', label: 'Dashboard', icon: <FaRocket /> },
  { to: '/analytics', label: 'Analytics', icon: <FaChartLine /> },
  { to: '/clients', label: 'Clients', icon: <FaUsers /> },
  { to: '/projects', label: 'Projects', icon: <FaProjectDiagram /> },
  { to: '/approval-queue', label: 'Approval Queue', icon: <FaClipboardCheck /> },
  { to: '/agent-status', label: 'Agent Status', icon: <FaRobot /> },
  { to: '/studio-mode', label: 'Studio Mode', icon: <FaClipboardList /> },
  { to: '/agent-grid', label: 'Agent Grid', icon: <FaTasks /> },
  { to: '/agent-training', label: 'Agent Training', icon: <FaGraduationCap /> },
  { to: '/audit-logs', label: 'Audit Logs', icon: <FaHistory /> },
];

const clientLinks = [
  { to: '/client', label: 'Dashboard', icon: <FaRocket /> },
  { to: '/client/projects', label: 'Campaign Tracker', icon: <FaTasks /> },
  { to: '/client/requests', label: 'Request Campaign', icon: <FaPlusCircle /> },
  { to: '/client/deliverables', label: 'Asset Review', icon: <FaFileAlt /> },
];

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { showInfo } = useToast();
  
  // Role selection state for local dev testing
  const [role, setRole] = useState(() => {
    const savedRole = localStorage.getItem('trendyai_dev_role');
    if (savedRole) return savedRole;
    
    // Check auth integration
    const auth = crossDomainAuth.getAuth();
    return auth?.user?.role || 'admin';
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('trendyai_dev_role', role);
  }, [role]);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    showInfo(`Switched workspace to ${newRole.toUpperCase()} view`);
    if (newRole === 'client') {
      navigate('/client');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    crossDomainAuth.clearAuth();
    showInfo('Logged out successfully');
    navigate('/login');
  };

  const navLinks = role === 'client' ? clientLinks : adminLinks;

  return (
    <div className="min-h-screen flex bg-bg-main text-text-main transition-colors duration-200">
      
      {/* SIDEBAR - Left side navigation */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-sidebar-bg border-r border-border-main flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 md:static ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Brand Header */}
        <div>
          <div className="h-16 flex items-center px-6 border-b border-border-main/10 gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-lg shadow-sm">
              T
            </div>
            <span className="text-xl font-bold text-text-main tracking-tight font-heading">TrendyAI</span>
            {role === 'client' && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary-light text-primary uppercase tracking-wider">
                Portal
              </span>
            )}
          </div>

          {/* Navigation Links list */}
          <nav className="p-3 space-y-1">
            {navLinks.map(link => {
              const isActive = location.pathname === link.to || (link.to !== '/' && link.to !== '/client' && location.pathname.startsWith(link.to));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-sidebar-hover text-sidebar-active font-extrabold shadow-sm'
                      : 'text-sidebar-inactive hover:bg-sidebar-hover hover:text-sidebar-active'
                  }`}
                >
                  <span className="text-base shrink-0">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / User section */}
        <div className="p-4 border-t border-border-main/10 bg-bg-panel/40">
          <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-border-main/10 bg-bg-secondary shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-inner">
                U
              </div>
              <div className="truncate w-28">
                <p className="text-xs font-bold text-text-main truncate">User Account</p>
                <p className="text-[9px] text-text-muted uppercase tracking-wider font-extrabold capitalize mt-0.5">{role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              title="Logout" 
              className="text-text-muted hover:text-primary p-1.5 rounded-lg hover:bg-bg-panel transition-all duration-200 cursor-pointer"
            >
              <FaSignOutAlt size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOPBAR */}
        <header className="h-16 bg-bg-card border-b border-border-main flex items-center justify-between px-6 md:px-8 z-20">
          {/* Left: Hamburger menu for mobile & title */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 -ml-2 rounded-lg hover:bg-bg-panel md:hidden focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-lg font-bold tracking-tight capitalize hidden sm:inline-block">
              {location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1).replace('-', ' ')}
            </h2>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Dev Mode Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="crm-btn crm-btn-secondary py-2 px-4 text-xs font-semibold flex items-center gap-2 border border-border-main rounded-lg"
              >
                <span>View: {role === 'admin' ? 'Admin Portal' : 'Client Portal'}</span>
                <svg className={`w-3.5 h-3.5 text-text-sub transition-transform duration-200 ${roleDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-bg-card border border-border-main rounded-lg shadow-lg py-1 z-30">
                  <button
                    onClick={() => {
                      handleRoleChange('admin');
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-bg-panel transition-colors block ${
                      role === 'admin' ? 'text-primary' : 'text-text-main'
                    }`}
                  >
                    Admin Portal
                  </button>
                  <button
                    onClick={() => {
                      handleRoleChange('client');
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-bg-panel transition-colors block ${
                      role === 'client' ? 'text-primary' : 'text-text-main'
                    }`}
                  >
                    Client Portal
                  </button>
                </div>
              )}
            </div>

            {/* Domain Switcher */}
            <DomainSwitcher />

            {/* Dark/Light toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg border border-border-main bg-bg-panel hover:bg-bg-card text-text-sub hover:text-text-main transition-all"
              aria-label="Toggle dark/light theme"
            >
              {theme === 'dark' ? <FaSun size={16} /> : <FaMoon size={16} />}
            </button>
          </div>
        </header>

        {/* Page body container */}
        <main className="flex-1 crm-layout-main overflow-y-auto bg-bg-main">
          <Outlet />
        </main>
      </div>

      {/* Mobile menu background overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
        />
      )}
    </div>
  );
};

export default Layout;