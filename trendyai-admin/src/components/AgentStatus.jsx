import React, { useState } from 'react';
import {
  FiPlay, FiPause, FiSquare, FiZap, FiClock, FiCheckCircle,
  FiAlertTriangle, FiWifi, FiWifiOff, FiSettings, FiActivity
} from 'react-icons/fi';
import { useToast } from './Toast';

const STATUS_COLORS = {
  Active:      '#1D9E75',
  Idle:        '#facc15',
  Offline:     '#555555',
  Maintenance: '#378ADD',
};

const STATUS_BG = {
  Active:      'rgba(29,158,117,0.12)',
  Idle:        'rgba(250,204,21,0.12)',
  Offline:     'rgba(85,85,85,0.15)',
  Maintenance: 'rgba(55,138,221,0.12)',
};

const AVATAR_COLORS = ['#1D9E75', '#facc15', '#378ADD', '#D85A30', '#9b59b6', '#e67e22'];

const AgentStatus = () => {
  const { showSuccess } = useToast();
  const [agents, setAgents] = useState([
    {
      id: 1,
      name: 'ContentCreator',
      type: 'Content Generation',
      status: 'Active',
      lastActivity: '2 minutes ago',
      uptime: '99.8%',
      tasksCompleted: 156,
      currentTask: 'Writing blog post for Acme Corp',
      performance: 95,
      logs: 'All systems operational',
    },
    {
      id: 2,
      name: 'DesignMaster',
      type: 'Graphic Design',
      status: 'Active',
      lastActivity: '5 minutes ago',
      uptime: '99.5%',
      tasksCompleted: 89,
      currentTask: 'Creating social media graphics',
      performance: 92,
      logs: 'Processing design request',
    },
    {
      id: 3,
      name: 'EmailBot',
      type: 'Email Marketing',
      status: 'Idle',
      lastActivity: '1 hour ago',
      uptime: '99.9%',
      tasksCompleted: 234,
      currentTask: 'No active tasks',
      performance: 88,
      logs: 'Waiting for new email campaigns',
    },
    {
      id: 4,
      name: 'SocialManager',
      type: 'Social Media',
      status: 'Maintenance',
      lastActivity: '30 minutes ago',
      uptime: '98.2%',
      tasksCompleted: 67,
      currentTask: 'System maintenance in progress',
      performance: 75,
      logs: 'Updating social media APIs',
    },
    {
      id: 5,
      name: 'AnalyticsPro',
      type: 'Data Analytics',
      status: 'Active',
      lastActivity: '1 minute ago',
      uptime: '99.7%',
      tasksCompleted: 312,
      currentTask: 'Generating monthly reports',
      performance: 96,
      logs: 'Processing analytics data',
    },
    {
      id: 6,
      name: 'SEOOptimizer',
      type: 'SEO',
      status: 'Offline',
      lastActivity: '3 hours ago',
      uptime: '95.1%',
      tasksCompleted: 45,
      currentTask: 'Agent offline',
      performance: 82,
      logs: 'Connection lost - attempting reconnect',
    },
  ]);

  const [hoveredBtn, setHoveredBtn] = useState(null);

  const updateAgentStatus = (id, newStatus) => {
    setAgents(agents.map(agent =>
      agent.id === id ? { ...agent, status: newStatus } : agent
    ));
    showSuccess(`Agent status set to ${newStatus}`);
  };

  const getPerformanceColor = (p) => {
    if (p >= 90) return '#1D9E75';
    if (p >= 75) return '#facc15';
    return '#D85A30';
  };

  const totalAgents   = agents.length;
  const activeAgents  = agents.filter(a => a.status === 'Active').length;
  const idleAgents    = agents.filter(a => a.status === 'Idle').length;
  const offlineAgents = agents.filter(a => a.status === 'Offline' || a.status === 'Maintenance').length;

  const metricCards = [
    { label: 'Total Workers',      value: totalAgents,   color: '#f0f0f0' },
    { label: 'Active Running',     value: activeAgents,  color: '#facc15' },
    { label: 'Idle Waiting',       value: idleAgents,    color: '#f0f0f0' },
    { label: 'Offline / Suspended',value: offlineAgents, color: '#f0f0f0' },
  ];

  const cardStyle = {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '14px',
    padding: '28px 32px',
  };

  const metricRowStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '40px',
  };

  const agentGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #1e1e1e',
  };

  const labelStyle = {
    fontSize: '12px',
    color: '#555',
    fontWeight: 500,
  };

  const valueStyle = {
    fontSize: '12px',
    color: '#f0f0f0',
    fontWeight: 500,
  };

  const badgeStyle = (status) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    background: STATUS_BG[status] || 'rgba(85,85,85,0.15)',
    color: STATUS_COLORS[status] || '#555',
    border: `1px solid ${STATUS_COLORS[status] || '#555'}33`,
    borderRadius: '20px',
    padding: '3px 10px',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.04em',
  });

  const monoBlockStyle = {
    background: '#141414',
    border: '1px solid #222',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '11px',
    fontFamily: 'monospace',
    color: '#f0f0f0',
    lineHeight: 1.6,
    marginTop: '6px',
  };

  const logBlockStyle = {
    ...monoBlockStyle,
    color: '#555',
  };

  const getBtnStyle = (key, disabled) => ({
    background: 'transparent',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    padding: '6px 14px',
    fontSize: '11px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: hoveredBtn === key && !disabled ? '#facc15' : '#888',
    borderColor: hoveredBtn === key && !disabled ? '#facc15' : '#2a2a2a',
    opacity: disabled ? 0.3 : 1,
    transition: 'color 0.15s, border-color 0.15s',
  });

  return (
    <div className="animate-fadeIn" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '48px' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '36px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#facc15', marginBottom: '8px' }}>
          Agent Status
        </p>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f0f0f0', margin: 0, lineHeight: 1.3 }}>
          Agent Status Center
        </h1>
        <p style={{ fontSize: '13px', color: '#666', marginTop: '6px', lineHeight: 1.7 }}>
          Monitor runtime performance, tasks executed, and connection status for each worker.
        </p>
      </div>

      {/* ── Metric Strip ── */}
      <div style={metricRowStyle}>
        {metricCards.map((m) => (
          <div key={m.label} style={cardStyle}>
            <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#555', marginBottom: '12px' }}>
              {m.label}
            </p>
            <p style={{ fontSize: '32px', fontWeight: 700, color: m.color, lineHeight: 1.1, margin: 0 }}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Agent Cards Grid ── */}
      <div style={agentGridStyle}>
        {agents.map((agent, idx) => (
          <div key={agent.id} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

            {/* Card top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Avatar circle */}
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: AVATAR_COLORS[idx % AVATAR_COLORS.length] + '22',
                  border: `1px solid ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: AVATAR_COLORS[idx % AVATAR_COLORS.length],
                  fontSize: '15px', fontWeight: 700, flexShrink: 0,
                }}>
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#f0f0f0', margin: 0 }}>{agent.name}</p>
                  <p style={{ fontSize: '11px', color: '#555', margin: 0, marginTop: '1px' }}>{agent.type}</p>
                </div>
              </div>

              {/* Status badge */}
              <span style={badgeStyle(agent.status)}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: STATUS_COLORS[agent.status] || '#555', display: 'inline-block' }} />
                {agent.status}
              </span>
            </div>

            {/* Metrics */}
            <div style={{ marginBottom: '16px' }}>
              {[
                { label: 'Last Activity',    value: agent.lastActivity },
                { label: 'Uptime',           value: agent.uptime },
                { label: 'Tasks Completed',  value: agent.tasksCompleted },
              ].map(({ label, value }) => (
                <div key={label} style={rowStyle}>
                  <span style={labelStyle}>{label}</span>
                  <span style={valueStyle}>{value}</span>
                </div>
              ))}
              <div style={{ ...rowStyle, borderBottom: 'none' }}>
                <span style={labelStyle}>Performance</span>
                <span style={{ ...valueStyle, color: getPerformanceColor(agent.performance), fontWeight: 700 }}>
                  {agent.performance}%
                </span>
              </div>
            </div>

            {/* Current Task */}
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#444', marginBottom: '4px' }}>
                Current Task
              </p>
              <div style={monoBlockStyle}>{agent.currentTask}</div>
            </div>

            {/* Logs */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#444', marginBottom: '4px' }}>
                Logs
              </p>
              <div style={logBlockStyle}>{agent.logs}</div>
            </div>

            {/* Footer buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '16px', borderTop: '1px solid #1e1e1e' }}>
              {[
                { label: 'Resume', targetStatus: 'Active',  icon: <FiPlay size={10} />,   disabledStatus: 'Active'  },
                { label: 'Pause',  targetStatus: 'Idle',    icon: <FiPause size={10} />,  disabledStatus: 'Idle'    },
                { label: 'Stop',   targetStatus: 'Offline', icon: <FiSquare size={10} />, disabledStatus: 'Offline' },
              ].map(({ label, targetStatus, icon, disabledStatus }) => {
                const isDisabled = agent.status === disabledStatus;
                const key = `${agent.id}-${label}`;
                return (
                  <button
                    key={key}
                    onClick={() => !isDisabled && updateAgentStatus(agent.id, targetStatus)}
                    disabled={isDisabled}
                    style={getBtnStyle(key, isDisabled)}
                    onMouseEnter={() => !isDisabled && setHoveredBtn(key)}
                    onMouseLeave={() => setHoveredBtn(null)}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {icon} {label}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentStatus;