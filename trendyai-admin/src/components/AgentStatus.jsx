import React, { useState } from 'react';
import {
  FiPlay, FiPause, FiSquare,
} from 'react-icons/fi';
import { useToast } from './Toast';
import { agentDefinitions } from '../utils/agentDefinitions';

const STATUS_COLORS = {
  Active:      'var(--accent-primary)',
  Idle:        '#FFB020',
  Offline:     '#4A6080',
  Maintenance: '#FFB020',
};

const STATUS_BG = {
  Active:      'rgba(250, 204, 21, 0.10)',
  Idle:        'rgba(255, 176, 32, 0.10)',
  Offline:     'rgba(74, 96, 128, 0.10)',
  Maintenance: 'rgba(255, 176, 32, 0.10)',
};

const AVATAR_COLOR = 'var(--accent-primary)';

// Map agent definitions to status entries with realistic data
const buildAgentList = () => agentDefinitions.map((def, idx) => {
  // Cycle through statuses to simulate a realistic dashboard
  const statuses = ['Active', 'Active', 'Active', 'Idle', 'Active', 'Active', 'Active', 'Maintenance'];
  const status = statuses[idx] || 'Active';
  const taskMessages = {
    Active: `Processing ${def.role.toLowerCase()} tasks`,
    Idle: 'Awaiting new task assignments',
    Offline: 'Agent offline',
    Maintenance: 'System maintenance in progress',
  };
  const logMessages = {
    Active: 'All systems operational',
    Idle: 'Waiting for new assignments',
    Offline: 'Connection lost - attempting reconnect',
    Maintenance: 'Updating agent model and embeddings',
  };
  return {
    id: idx + 1,
    name: def.name,
    type: def.role,
    status,
    lastActivity: status === 'Active' ? `${(idx + 1) * 2} minutes ago` : status === 'Idle' ? '1 hour ago' : '30 minutes ago',
    uptime: status === 'Active' ? '99.8%' : status === 'Idle' ? '99.5%' : '98.2%',
    tasksCompleted: Math.floor(Math.random() * 200) + 50,
    currentTask: taskMessages[status],
    performance: status === 'Active' ? 90 + Math.floor(Math.random() * 8) : status === 'Idle' ? 85 + Math.floor(Math.random() * 10) : 75,
    logs: logMessages[status],
  };
});

const AgentStatus = () => {
  const { showSuccess } = useToast();
  const [agents, setAgents] = useState(buildAgentList);


  const [hoveredBtn, setHoveredBtn] = useState(null);

  const updateAgentStatus = (id, newStatus) => {
    setAgents(agents.map(agent =>
      agent.id === id ? { ...agent, status: newStatus } : agent
    ));
    showSuccess(`Agent status set to ${newStatus}`);
  };

  const getPerformanceColor = (p) => {
    if (p >= 90) return 'var(--accent-primary)';
    if (p >= 75) return '#FFB020';
    return '#FF4D4D';
  };

  const totalAgents   = agents.length;
  const activeAgents  = agents.filter(a => a.status === 'Active').length;
  const idleAgents    = agents.filter(a => a.status === 'Idle').length;
  const offlineAgents = agents.filter(a => a.status === 'Offline' || a.status === 'Maintenance').length;

  const metricCards = [
    { label: 'Total Workers',      value: totalAgents,   color: '#FFFFFF' },
    { label: 'Active Running',     value: activeAgents,  color: 'var(--accent-primary)' },
    { label: 'Idle Waiting',       value: idleAgents,    color: '#FFFFFF' },
    { label: 'Offline / Suspended',value: offlineAgents, color: '#FFFFFF' },
  ];

  const cardStyle = {
    background: 'var(--bg-secondary)',
    border: '1px solid rgba(250, 204, 21, 0.15)',
    borderRadius: '12px',
    padding: '28px 32px',
  };

  const metricRowStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '44px',
  };

  const agentGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid rgba(250, 204, 21, 0.15)',
  };

  const labelStyle = {
    fontSize: '12px',
    color: '#4A6080',
    fontWeight: 500,
  };

  const valueStyle = {
    fontSize: '12px',
    color: '#FFFFFF',
    fontWeight: 500,
  };

  const badgeStyle = (status) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    background: STATUS_BG[status] || 'rgba(74, 96, 128, 0.10)',
    color: STATUS_COLORS[status] || '#4A6080',
    border: `1px solid ${STATUS_COLORS[status] || '#4A6080'}33`,
    borderRadius: '20px',
    padding: '3px 10px',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.04em',
  });

  const monoBlockStyle = {
    background: 'var(--bg-primary)',
    border: '1px solid rgba(250, 204, 21, 0.15)',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '11px',
    fontFamily: 'monospace',
    color: '#FFFFFF',
    lineHeight: 1.6,
    marginTop: '6px',
  };

  const logBlockStyle = {
    ...monoBlockStyle,
    color: '#A0B4CC',
  };

  const getBtnStyle = (key, disabled) => ({
    background: 'transparent',
    border: '1px solid rgba(250, 204, 21, 0.25)',
    borderRadius: '6px',
    padding: '6px 14px',
    fontSize: '11px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: hoveredBtn === key && !disabled ? 'var(--accent-primary)' : '#4A6080',
    borderColor: hoveredBtn === key && !disabled ? 'var(--accent-primary)' : 'rgba(250, 204, 21, 0.25)',
    opacity: disabled ? 0.3 : 1,
    transition: 'color 0.15s, border-color 0.15s',
  });

  return (
    <div className="animate-fadeIn" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '48px' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '36px' }}>
        <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-primary)', marginBottom: '8px' }}>
          Agent Status
        </p>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', margin: 0, lineHeight: 1.3 }}>
          Agent Status Center
        </h1>
        <p style={{ fontSize: '13px', color: '#A0B4CC', marginTop: '6px', lineHeight: 1.7 }}>
          Monitor runtime performance, tasks executed, and connection status for each worker.
        </p>
      </div>

      {/* ── Metric Strip ── */}
      <div style={metricRowStyle}>
        {metricCards.map((m) => (
          <div key={m.label} style={cardStyle}>
            <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4A6080', marginBottom: '12px' }}>
              {m.label}
            </p>
            <p style={{ fontSize: '28px', fontWeight: 600, color: m.color, lineHeight: 1.1, margin: 0 }}>
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
                  background: 'rgba(250, 204, 21, 0.12)',
                  border: '1px solid rgba(250, 204, 21, 0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: AVATAR_COLOR,
                  fontSize: '15px', fontWeight: 700, flexShrink: 0,
                }}>
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>{agent.name}</p>
                  <p style={{ fontSize: '11px', color: '#4A6080', margin: 0, marginTop: '1px' }}>{agent.type}</p>
                </div>
              </div>

              {/* Status badge */}
              <span style={badgeStyle(agent.status)}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: STATUS_COLORS[agent.status] || '#4A6080', display: 'inline-block',
                  boxShadow: agent.status === 'Active' ? '0 0 6px rgba(250, 204, 21, 0.5)' : 'none'
                }} />
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
              <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4A6080', marginBottom: '4px' }}>
                Current Task
              </p>
              <div style={monoBlockStyle}>{agent.currentTask}</div>
            </div>

            {/* Logs */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4A6080', marginBottom: '4px' }}>
                Logs
              </p>
              <div style={logBlockStyle}>{agent.logs}</div>
            </div>

            {/* Footer buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '16px', borderTop: '1px solid rgba(250, 204, 21, 0.15)' }}>
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
