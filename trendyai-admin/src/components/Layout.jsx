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
      { to: '/audits',         label: 'Audits & Reports', icon: FiBarChart2 },
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
          background: '#0d0d0d',
          borderRight: '1px solid #2a2a2a',
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
            padding: '16px 12px 14px',
            borderBottom: '1px solid #2a2a2a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            cursor: 'pointer'
          }}
          className="sidebar-brand-link"
        >
          <img
            src="/logo.jpg"
            alt="TrendTactics Digital"
            style={{
              width: '100%',
              maxWidth: 180,
              height: 'auto',
              objectFit: 'contain',
            }}
          />
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
                      color: active ? '#facc15' : '#555555',
                      background: active ? 'rgba(250, 204, 21, 0.08)' : 'transparent',
                      transition: 'all 0.15s ease',
                      marginBottom: 2,
                    }}
                    className="sidebar-nav-link"
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.background = '#1a1a1a';
                        e.currentTarget.style.color = '#FFFFFF';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#555555';
                      }
                    }}
                  >
                    <Icon
                      size={16}
                      style={{ color: active ? '#facc15' : '#555555', flexShrink: 0 }}
                    />
                    <span style={{ flex: 1 }}>{link.label}</span>
                    {showBadge && (
                      <span style={{
                        background: '#2563eb',
                        color: '#ffffff',
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
        <div style={{ padding: '12px 8px', borderTop: '1px solid #2a2a2a' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 8,
          }}>
            {/* Avatar */}
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(37, 99, 235, 0.15)', color: '#2563eb',
              border: '1px solid rgba(37, 99, 235, 0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, flexShrink: 0,
            }}>
              A
            </div>
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 700, lineHeight: 1.3, margin: 0 }}>ADMIN</p>
              <p style={{
                color: '#888888', fontSize: 10,
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
                color: hoveredLogout ? '#facc15' : '#555555', cursor: 'pointer', padding: 4,
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
        background: '#111111', color: '#f5f5f5',
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
          background: '#0d0d0d',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0,
          zIndex: 20,
        }}>
          {/* Bottom border gradient split */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            background: 'linear-gradient(90deg, #facc15 0%, #2563eb 100%)',
          }} />
          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: 'none', border: 'none', color: '#555555',
                cursor: 'pointer', padding: 6, borderRadius: 6,
                display: 'flex', alignItems: 'center',
              }}
              className="md:hidden"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: '#555555' }}
                  className="hidden sm:inline-flex">
              {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span style={{ color: 'rgba(250, 204, 21, 0.2)' }}>/</span>}
                    {crumb.to ? (
                      <Link
                        to={crumb.to}
                        className="breadcrumb-link"
                        style={{
                          color: '#888888',
                          textDecoration: 'none',
                          transition: 'color 0.15s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#facc15'}
                        onMouseLeave={e => e.currentTarget.style.color = '#888888'}
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span style={{ color: '#f5f5f5' }}>{crumb.label}</span>
                    )}
                  </React.Fragment>
                ))}
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
                  background: '#1a1a1a', border: hoveredRoleBtn ? '1px solid #2563eb' : '1px solid #2a2a2a',
                  borderRadius: 7, color: hoveredRoleBtn ? '#FFFFFF' : '#888888', fontSize: 11,
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
                  background: '#1a1a1a', border: '1px solid #2a2a2a',
                  borderRadius: 8, overflow: 'hidden', zIndex: 50, minWidth: 140,
                }}>
                  {['admin', 'client'].map(r => (
                      <button
                        key={r}
                        onClick={() => { handleRoleChange(r); setRoleDropdownOpen(false); }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = '#222222';
                          if (role !== r) e.currentTarget.style.color = '#FFFFFF';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'none';
                          if (role !== r) e.currentTarget.style.color = '#888888';
                        }}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '8px 14px', background: 'none',
                          border: 'none', fontSize: 12, fontWeight: 600,
                          color: role === r ? '#facc15' : '#888888',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {r === 'admin' ? 'Admin Portal' : 'Client Portal'}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Domain Switcher */}
            <DomainSwitcher />

            {/* Theme toggle */}
            <button
              onClick={() => {
                toggleTheme();
                showInfo(`Theme set to ${theme === 'dark' ? 'Light' : 'Dark'} mode`);
              }}
              onMouseEnter={() => setHoveredThemeBtn(true)}
              onMouseLeave={() => setHoveredThemeBtn(false)}
              style={{
                background: '#1a1a1a', border: hoveredThemeBtn ? '1px solid #2563eb' : '1px solid #2a2a2a',
                borderRadius: 7, color: hoveredThemeBtn ? '#facc15' : '#555555', cursor: 'pointer',
                padding: 7, display: 'flex', alignItems: 'center',
                transition: 'color 0.15s ease, border-color 0.15s ease',
              }}
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <FiSun size={14} /> : <FiMoon size={14} />}
            </button>
          </div>
        </header>

        {/* ── Page body ── */}
        <main style={{ flex: 1, overflowY: 'auto', background: '#111111' }} className="crm-layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
