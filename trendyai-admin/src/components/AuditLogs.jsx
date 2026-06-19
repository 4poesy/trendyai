import React, { useState } from 'react';
import {
  FiFileText, FiSearch, FiDownload, FiFilter,
  FiUser, FiGlobe
} from 'react-icons/fi';
import { useToast } from './Toast';

const SEVERITY_COLOR = {
  Info:    '#00E5FF',
  Warning: '#FFB020',
  Error:   '#FF4D4D',
};

const SEVERITY_BG = {
  Info:    'rgba(0, 229, 255, 0.10)',
  Warning: 'rgba(255, 176, 32, 0.10)',
  Error:   'rgba(255, 77, 77, 0.10)',
};

const STATUS_COLOR = {
  Success: '#00E5FF',
  Failed:  '#FF4D4D',
};

const STATUS_BG = {
  Success: 'rgba(0, 229, 255, 0.10)',
  Failed:  'rgba(255, 77, 77, 0.10)',
};

const AuditLogs = () => {
  const { showSuccess } = useToast();

  const [logs] = useState([
    {
      id: 1,
      timestamp: '2026-06-19 16:30:45',
      action: 'User Login',
      user: 'admin@trendtacticsdigital.com',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'Success',
      details: 'Successful login from desktop browser',
      severity: 'Info',
    },
    {
      id: 2,
      timestamp: '2026-06-19 16:25:12',
      action: 'Project Created',
      user: 'admin@trendtacticsdigital.com',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'Success',
      details: 'Created project "Social Media Campaign" for Acme Corporation',
      severity: 'Info',
    },
    {
      id: 3,
      timestamp: '2026-06-19 16:20:33',
      action: 'Client Added',
      user: 'jane@trendtacticsdigital.com',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      status: 'Success',
      details: 'Added new client "Global Innovations"',
      severity: 'Info',
    },
    {
      id: 4,
      timestamp: '2026-06-19 16:15:08',
      action: 'Approval Rejected',
      user: 'admin@trendtacticsdigital.com',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'Success',
      details: 'Rejected approval for "Email Sequence - Welcome Series"',
      severity: 'Warning',
    },
    {
      id: 5,
      timestamp: '2026-06-19 16:10:22',
      action: 'Failed Login Attempt',
      user: 'unknown@example.com',
      ipAddress: '203.0.113.45',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'Failed',
      details: 'Invalid password for user account',
      severity: 'Error',
    },
    {
      id: 6,
      timestamp: '2026-06-19 16:05:15',
      action: 'Agent Status Updated',
      user: 'system@trendtacticsdigital.com',
      ipAddress: '127.0.0.1',
      userAgent: 'TrendyAI-System/1.0',
      status: 'Success',
      details: 'Agent "ContentCreator" status changed to "Active"',
      severity: 'Info',
    },
    {
      id: 7,
      timestamp: '2026-06-19 16:00:42',
      action: 'Data Export',
      user: 'admin@trendtacticsdigital.com',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'Success',
      details: 'Exported client data to CSV format',
      severity: 'Info',
    },
    {
      id: 8,
      timestamp: '2026-06-19 15:55:18',
      action: 'Permission Denied',
      user: 'user@trendtacticsdigital.com',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)',
      status: 'Failed',
      details: 'Attempted to access admin panel without proper permissions',
      severity: 'Warning',
    },
  ]);

  const [searchTerm, setSearchTerm]       = useState('');
  const [userFilter, setUserFilter]       = useState('All');
  const [actionFilter, setActionFilter]   = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [focusedInput, setFocusedInput]   = useState(null);

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);
    const matchesUser     = userFilter     === 'All' || log.user     === userFilter;
    const matchesAction   = actionFilter   === 'All' || log.action   === actionFilter;
    const matchesSeverity = severityFilter === 'All' || log.severity === severityFilter;
    return matchesSearch && matchesUser && matchesAction && matchesSeverity;
  });

  const exportLogs = () => {
    const csvContent = [
      ['ID', 'Timestamp', 'User', 'Action', 'Severity', 'Status', 'IP Address', 'Details'],
      ...filteredLogs.map(log => [
        log.id, log.timestamp, log.user, log.action,
        log.severity, log.status, log.ipAddress, log.details,
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url  = window.URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showSuccess('Audit logs exported successfully');
  };

  const uniqueUsers      = Array.from(new Set(logs.map(l => l.user)));
  const uniqueActions    = Array.from(new Set(logs.map(l => l.action)));
  const uniqueSeverities = Array.from(new Set(logs.map(l => l.severity)));

  /* ── shared styles ── */
  const inputStyle = (key) => ({
    width: '100%',
    background: '#0D2347',
    border: `1px solid ${focusedInput === key ? '#00E5FF' : 'rgba(0, 229, 255, 0.2)'}`,
    borderRadius: '8px',
    padding: '9px 14px',
    fontSize: '12px',
    color: '#FFFFFF',
    outline: 'none',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
  });

  const labelSmall = {
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#4A6080',
    display: 'block',
    marginBottom: '6px',
  };

  const pillStyle = (color, bg) => ({
    display: 'inline-block',
    background: bg,
    color: color,
    border: `1px solid ${color}33`,
    borderRadius: '20px',
    padding: '2px 9px',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.05em',
  });

  return (
    <div className="animate-fadeIn" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '48px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px' }}>
        <div>
          <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00E5FF', marginBottom: '8px' }}>
            Audit Logs
          </p>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', margin: 0, lineHeight: 1.3 }}>
            Audit Logs
          </h1>
          <p style={{ fontSize: '13px', color: '#A0B4CC', marginTop: '6px', lineHeight: 1.7 }}>
            Comprehensive audit trail of all system activities, agent requests, and login events.
          </p>
        </div>

        <button
          onClick={exportLogs}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#00E5FF',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#0A1E3F',
            cursor: 'pointer',
            letterSpacing: '0.04em',
            flexShrink: 0,
            marginTop: '4px',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#00CFEA'}
          onMouseLeave={e => e.currentTarget.style.background = '#00E5FF'}
        >
          <FiDownload size={13} />
          Export Logs to CSV
        </button>
      </div>

      {/* ── Filter Bar ── */}
      <div style={{
        background: '#0D2347',
        border: '1px solid rgba(0, 229, 255, 0.15)',
        borderRadius: '12px',
        padding: '24px 28px',
        marginBottom: '24px',
      }}>
        <p style={{ ...labelSmall, marginBottom: '16px', color: '#4A6080' }}>
          <FiFilter size={10} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Filter Audit Stream
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>

          {/* Search */}
          <div>
            <label style={labelSmall}>Search Input</label>
            <div style={{ position: 'relative' }}>
              <FiSearch size={12} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#4A6080' }} />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onFocus={() => setFocusedInput('search')}
                onBlur={() => setFocusedInput(null)}
                style={{ ...inputStyle('search'), paddingLeft: '28px' }}
              />
            </div>
          </div>

          {/* User Account */}
          <div>
            <label style={labelSmall}>User Account</label>
            <select
              value={userFilter}
              onChange={e => setUserFilter(e.target.value)}
              onFocus={() => setFocusedInput('user')}
              onBlur={() => setFocusedInput(null)}
              style={inputStyle('user')}
            >
              <option value="All">All Users</option>
              {uniqueUsers.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          {/* Action / Operations */}
          <div>
            <label style={labelSmall}>Action / Operations</label>
            <select
              value={actionFilter}
              onChange={e => setActionFilter(e.target.value)}
              onFocus={() => setFocusedInput('action')}
              onBlur={() => setFocusedInput(null)}
              style={inputStyle('action')}
            >
              <option value="All">All Actions</option>
              {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Severity Level */}
          <div>
            <label style={labelSmall}>Severity Level</label>
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              onFocus={() => setFocusedInput('severity')}
              onBlur={() => setFocusedInput(null)}
              style={inputStyle('severity')}
            >
              <option value="All">All Severities</option>
              {uniqueSeverities.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── Log Entries ── */}
      <div>
        <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4A6080', marginBottom: '16px' }}>
          Logs History — {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'}
        </p>

        {filteredLogs.length === 0 ? (
          <div style={{
            background: '#0D2347',
            border: '1px solid rgba(0, 229, 255, 0.15)',
            borderRadius: '12px',
            padding: '48px 32px',
            textAlign: 'center',
          }}>
            <FiFileText size={28} style={{ color: '#4A6080', marginBottom: '12px' }} />
            <p style={{ fontSize: '13px', color: '#A0B4CC' }}>No log entries matched your search criteria.</p>
          </div>
        ) : (
          filteredLogs.map(log => (
            <div
              key={log.id}
              style={{
                background: '#0D2347',
                border: '1px solid rgba(0, 229, 255, 0.15)',
                borderRadius: '10px',
                padding: '20px 24px',
                marginBottom: '8px',
              }}
            >
              {/* Row 1: timestamp + action + badges */}
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#4A6080' }}>
                  {log.timestamp}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                  {log.action}
                </span>
                <span style={pillStyle(SEVERITY_COLOR[log.severity] || '#4A6080', SEVERITY_BG[log.severity] || 'rgba(74,96,128,0.10)')}>
                  {log.severity}
                </span>
                <span style={pillStyle(STATUS_COLOR[log.status] || '#4A6080', STATUS_BG[log.status] || 'rgba(74,96,128,0.10)')}>
                  {log.status}
                </span>
              </div>

              {/* Row 2: user + IP */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#A0B4CC' }}>
                  <FiUser size={10} style={{ color: '#00E5FF' }} />
                  {log.user}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#A0B4CC' }}>
                  <FiGlobe size={10} style={{ color: '#00E5FF' }} />
                  {log.ipAddress}
                </span>
              </div>

              {/* Row 3: description */}
              <p style={{ fontSize: '12px', color: '#A0B4CC', lineHeight: 1.6, margin: 0 }}>
                {log.details}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AuditLogs;