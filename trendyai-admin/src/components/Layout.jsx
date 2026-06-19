import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiZap, FiUsers, FiFolder, FiCheckSquare,
  FiBarChart2, FiActivity, FiCpu, FiFileText, FiLogOut,
  FiMenu, FiX, FiSun, FiMoon, FiChevronDown, FiHome
} from 'react-icons/fi';
import DomainSwitcher from './DomainSwitcher';
import { useTheme } from '../contexts/ThemeContext';
import { crossDomainAuth } from '../utils/domainIntegration';
import { useToast } from './Toast';
import supabase from '../utils/supabaseClient';

/* ─── NAV STRUCTURE ──────────────────────────────────────── */
const adminNavGroups = [
  {
    label: 'WORKSPACE',
    links: [
      { to: '/',             label: 'Dashboard',    icon: FiHome },
      { to: '/agent-grid',   label: 'Agent Grid',   icon: FiGrid },
      { to: '/studio-mode',  label: 'Studio Mode',  icon: FiZap  },
    ],
  },
  {
    label: 'CLIENTS',
    links: [
      { to: '/clients',        label: 'Clients',         icon: FiUsers       },
      { to: '/projects',       label: 'Projects',         icon: FiFolder  },
      { to: '/approval-queue', label: 'Approval Queue',   icon: FiCheckSquare, badge: true },
    ],
  },
  {
    label: 'INSIGHTS',
    links: [
      { to: '/analytics',      label: 'Analytics',       icon: FiBarChart2 },
      { to: '/agent-status',   label: 'Agent Status',    icon: FiActivity  },
      { to: '/agent-training', label: 'Agent Training',  icon: FiCpu       },
    ],
  },
  {
    label: 'SYSTEM',
    links: [
      { to: '/audit-logs', label: 'Audit Logs', icon: FiFileText },
    ],
  },
];

const clientNavGroups = [
  {
    label: 'CLIENT PORTAL',
    links: [
      { to: '/client',              label: 'Dashboard',       icon: FiGrid       },
      { to: '/client/projects',     label: 'Campaign Tracker', icon: FiFolder },
      { to: '/client/requests',     label: 'Request Campaign', icon: FiZap        },
      { to: '/client/deliverables', label: 'Asset Review',    icon: FiFileText   },
    ],
  },
];

/* ─── SIDEBAR COMPONENT ──────────────────────────────────── */
const Sidebar = ({ mobileOpen, setMobileOpen, role, pendingCount }) => {
  const location = useLocation();
  const navigate  = useNavigate();
  const { showInfo } = useToast();
  const navGroups = role === 'client' ? clientNavGroups : adminNavGroups;

  const [hoveredLogout, setHoveredLogout] = useState(false);

  const handleLogout = () => {
    crossDomainAuth.clearAuth();
    showInfo('Logged out successfully');
    navigate('/login');
  };

  const isActive = (to) =>
    location.pathname === to ||
    (to !== '/' && to !== '/client' && location.pathname.startsWith(to));

  return (
    <>
      {/* Sidebar panel */}
      <aside
        style={{
          width: 220,
          background: '#071629',
          borderRight: '1px solid rgba(0, 229, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          height: '100vh',
          position: 'sticky',
          top: 0,
        }}
        className={`
          fixed inset-y-0 left-0 z-30 flex flex-col
          transform transition-transform duration-300
          md:translate-x-0 md:static md:flex
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* ── Brand ── */}
        <Link
          to={role === 'client' ? '/client' : '/'}
          style={{
            padding: '20px 16px 16px',
            borderBottom: '1px solid rgba(0, 229, 255, 0.1)',
            display: 'block',
            textDecoration: 'none',
            cursor: 'pointer'
          }}
          className="sidebar-brand-link"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            {/* Yellow bar chart icon (keep as-is, do not recolour) */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <rect x="3" y="14" width="4" height="6" rx="1" fill="#facc15" />
              <rect x="10" y="8" width="4" height="12" rx="1" fill="#facc15" />
              <rect x="17" y="3" width="4" height="17" rx="1" fill="#facc15" />
            </svg>
            <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Trendtactics Digital
            </span>
          </div>
          <p style={{ color: '#4A6080', fontSize: 10, paddingLeft: 26, margin: 0, fontWeight: 600 }}>
            TrendyAI Platform
          </p>
        </Link>

        {/* ── Nav ── */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }} className="custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.label} style={{ marginBottom: 20 }}>
              {/* Section label */}
              <p style={{
                color: '#4A6080',
                fontSize: 10,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '0 8px 6px',
              }}>
                {group.label}
              </p>

              {/* Links */}
              {group.links.map((link) => {
                const active = isActive(link.to);
                const Icon   = link.icon;
                const showBadge = link.badge && pendingCount > 0;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      height: 36,
                      padding: '0 12px',
                      borderRadius: 8,
                      textDecoration: 'none',
                      fontSize: 13,
                      fontWeight: active ? 600 : 500,
                      color: active ? '#00E5FF' : '#4A6080',
                      background: active ? 'rgba(0, 229, 255, 0.10)' : 'transparent',
                      transition: 'all 0.15s ease',
                      marginBottom: 2,
                    }}
                    className="sidebar-nav-link"
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.background = '#112B55';
                        e.currentTarget.style.color = '#FFFFFF';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#4A6080';
                      }
                    }}
                  >
                    <Icon
                      size={16}
                      style={{ color: active ? '#00E5FF' : '#4A6080', flexShrink: 0 }}
                    />
                    <span style={{ flex: 1 }}>{link.label}</span>
                    {showBadge && (
                      <span style={{
                        background: '#00E5FF',
                        color: '#0A1E3F',
                        fontSize: 10,
                        fontWeight: 700,
                        borderRadius: 10,
                        padding: '1px 6px',
                        lineHeight: '16px',
                      }}>
                        {pendingCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* ── Footer ── */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(0, 229, 255, 0.1)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 8,
          }}>
            {/* Avatar */}
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(0, 229, 255, 0.10)', color: '#00E5FF',
              border: '1px solid rgba(0, 229, 255, 0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, flexShrink: 0,
            }}>
              A
            </div>
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 700, lineHeight: 1.3, margin: 0 }}>ADMIN</p>
              <p style={{
                color: '#4A6080', fontSize: 10,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                margin: 0,
              }}>
                akinola@trendtactics...
              </p>
            </div>
            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Logout"
              onMouseEnter={() => setHoveredLogout(true)}
              onMouseLeave={() => setHoveredLogout(false)}
              style={{
                background: 'none', border: 'none',
                color: hoveredLogout ? '#00E5FF' : '#4A6080', cursor: 'pointer', padding: 4,
                borderRadius: 6, display: 'flex', alignItems: 'center',
                transition: 'color 0.15s ease',
              }}
            >
              <FiLogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 20,
          }}
          className="md:hidden"
        />
      )}
    </>
  );
};

/* ─── LAYOUT ─────────────────────────────────────────────── */
const Layout = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { showInfo } = useToast();

  const [role, setRole] = useState(() => {
    const saved = localStorage.getItem('trendyai_dev_role');
    if (saved) return saved;
    const auth = crossDomainAuth.getAuth();
    return auth?.user?.role || 'admin';
  });

  const [mobileOpen,       setMobileOpen]       = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen]  = useState(false);
  const [pendingCount,     setPendingCount]      = useState(0);

  const [hoveredRoleBtn,   setHoveredRoleBtn]    = useState(false);
  const [hoveredThemeBtn,  setHoveredThemeBtn]   = useState(false);

  /* Persist role */
  useEffect(() => {
    localStorage.setItem('trendyai_dev_role', role);
  }, [role]);

  /* Fetch pending approval count */
  useEffect(() => {
    if (!supabase) return;
    const fetchPending = async () => {
      try {
        const { count } = await supabase
          .from('approval_queue')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
        if (count !== null) setPendingCount(count);
      } catch (_) { /* silent */ }
    };
    fetchPending();
  }, []);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    showInfo(`Switched workspace to ${newRole.toUpperCase()} view`);
    navigate(newRole === 'client' ? '/client' : '/');
  };

  /* Breadcrumbs logic */
  const breadcrumbs = (() => {
    const p = location.pathname;
    const isClient = p.startsWith('/client');
    const rootLabel = isClient ? 'Client' : 'Admin';
    const rootPath = isClient ? '/client' : '/';
    
    if (p === '/' || p === '/client') {
      return [{ label: rootLabel, to: rootPath }, { label: 'Dashboard' }];
    }
    
    const list = [{ label: rootLabel, to: rootPath }];
    const parts = p.split('/').filter(Boolean);
    
    const startIndex = (isClient && parts[0] === 'client') ? 1 : 0;
    
    for (let i = startIndex; i < parts.length; i++) {
      const part = parts[i];
      const label = part.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const isLast = i === parts.length - 1;
      const to = (isClient ? '/client' : '') + '/' + parts.slice(startIndex, i + 1).join('/');
      list.push({
        label,
        to: isLast ? null : to
      });
    }
    return list;
  })();

  return (
    <div
      className="dark"
      style={{
        minHeight: '100vh', display: 'flex',
        background: '#0A1E3F', color: '#FFFFFF',
      }}
    >
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        role={role}
        pendingCount={pendingCount}
      />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* ── Topbar ── */}
        <header style={{
          height: 52,
          background: '#071629',
          borderBottom: '1px solid rgba(0, 229, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0,
          zIndex: 20,
        }}>
          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: 'none', border: 'none', color: '#4A6080',
                cursor: 'pointer', padding: 6, borderRadius: 6,
                display: 'flex', alignItems: 'center',
              }}
              className="md:hidden"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: '#4A6080' }}
                  className="hidden sm:inline-flex">
              {breadcrumbs.map((crumb, idx) => {
                const [hoveredCrumb, setHoveredCrumb] = useState(false);
                return (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span style={{ color: 'rgba(0, 229, 255, 0.15)' }}>/</span>}
                    {crumb.to ? (
                      <Link
                        to={crumb.to}
                        onMouseEnter={() => setHoveredCrumb(true)}
                        onMouseLeave={() => setHoveredCrumb(false)}
                        style={{
                          color: hoveredCrumb ? '#00E5FF' : '#4A6080',
                          textDecoration: 'none',
                          transition: 'color 0.15s ease',
                          cursor: 'pointer',
                        }}
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span style={{ color: '#A0B4CC' }}>{crumb.label}</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

            {/* Role switcher */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                onMouseEnter={() => setHoveredRoleBtn(true)}
                onMouseLeave={() => setHoveredRoleBtn(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px',
                  background: '#0D2347', border: hoveredRoleBtn ? '1px solid rgba(0, 229, 255, 0.4)' : '1px solid rgba(0, 229, 255, 0.15)',
                  borderRadius: 7, color: hoveredRoleBtn ? '#FFFFFF' : '#A0B4CC', fontSize: 11,
                  fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                View: {role === 'admin' ? 'Admin' : 'Client'}
                <FiChevronDown size={12} style={{ transform: roleDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
              </button>
              {roleDropdownOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '110%',
                  background: '#0D2347', border: '1px solid rgba(0, 229, 255, 0.15)',
                  borderRadius: 8, overflow: 'hidden', zIndex: 50, minWidth: 140,
                }}>
                  {['admin', 'client'].map(r => {
                    const [hoveredItem, setHoveredItem] = useState(false);
                    return (
                      <button
                        key={r}
                        onClick={() => { handleRoleChange(r); setRoleDropdownOpen(false); }}
                        onMouseEnter={() => setHoveredItem(true)}
                        onMouseLeave={() => setHoveredItem(false)}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '8px 14px', background: hoveredItem ? '#112B55' : 'none',
                          border: 'none', fontSize: 12, fontWeight: 600,
                          color: role === r ? '#00E5FF' : (hoveredItem ? '#FFFFFF' : '#A0B4CC'),
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {r === 'admin' ? 'Admin Portal' : 'Client Portal'}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Domain Switcher */}
            <DomainSwitcher />

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              onMouseEnter={() => setHoveredThemeBtn(true)}
              onMouseLeave={() => setHoveredThemeBtn(false)}
              style={{
                background: '#0D2347', border: hoveredThemeBtn ? '1px solid rgba(0, 229, 255, 0.4)' : '1px solid rgba(0, 229, 255, 0.15)',
                borderRadius: 7, color: hoveredThemeBtn ? '#00E5FF' : '#4A6080', cursor: 'pointer',
                padding: 7, display: 'flex', alignItems: 'center',
                transition: 'color 0.15s ease, border-color 0.15s ease',
              }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun size={14} /> : <FiMoon size={14} />}
            </button>
          </div>
        </header>

        {/* ── Page body ── */}
        <main style={{ flex: 1, overflowY: 'auto', background: '#0A1E3F' }} className="crm-layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;