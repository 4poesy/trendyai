import React, { useState } from 'react';
import { FaRobot, FaPlay, FaPause, FaStop, FaEye, FaCog, FaChartLine, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useToast } from './Toast';

const AgentStatus = () => {
  const { showSuccess, showInfo } = useToast();
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
      logs: 'All systems operational'
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
      logs: 'Processing design request'
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
      logs: 'Waiting for new email campaigns'
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
      logs: 'Updating social media APIs'
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
      logs: 'Processing analytics data'
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
      logs: 'Connection lost - attempting reconnect'
    }
  ]);

  const updateAgentStatus = (id, newStatus) => {
    setAgents(agents.map(agent => 
      agent.id === id ? { ...agent, status: newStatus } : agent
    ));
    showSuccess(`Agent status set to ${newStatus}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'badge-success';
      case 'Idle': return 'badge-warning';
      case 'Maintenance': return 'badge-info';
      case 'Offline': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return 'text-green-500';
    if (performance >= 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <FaCheckCircle className="text-green-500" />;
      case 'Idle': return <FaClock className="text-yellow-500" />;
      case 'Maintenance': return <FaCog className="text-blue-500" />;
      case 'Offline': return <FaExclamationTriangle className="text-red-500" />;
      default: return <FaRobot className="text-text-muted" />;
    }
  };

  const totalAgents = agents.length;
  const activeAgents = agents.filter(agent => agent.status === 'Active').length;
  const idleAgents = agents.filter(agent => agent.status === 'Idle').length;
  const offlineAgents = agents.filter(agent => agent.status === 'Offline').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-border-main pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-main flex items-center gap-2">
          <FaRobot className="text-primary" />
          Agent Status Center
        </h1>
        <p className="text-text-sub mt-1 text-sm md:text-base">Monitor runtime performance, tasks executed, and connection status for each worker.</p>
      </div>

      {/* Summary stats with breathing space */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="crm-card text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-text-sub">Total Workers</span>
          <h3 className="text-3xl font-bold text-text-main mt-2">{totalAgents}</h3>
        </div>
        <div className="crm-card text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-text-sub">Active Running</span>
          <h3 className="text-3xl font-bold text-text-main mt-2 text-green-500">{activeAgents}</h3>
        </div>
        <div className="crm-card text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-text-sub">Idle Waiting</span>
          <h3 className="text-3xl font-bold text-text-main mt-2 text-yellow-500">{idleAgents}</h3>
        </div>
        <div className="crm-card text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-text-sub">Offline / Suspended</span>
          <h3 className="text-3xl font-bold text-text-main mt-2 text-red-500">{offlineAgents}</h3>
        </div>
      </div>

      {/* Grid of Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {agents.map((agent) => (
          <div key={agent.id} className="crm-card flex flex-col justify-between">
            <div>
              {/* Card top */}
              <div className="flex justify-between items-start mb-5 pb-4 border-b border-border-main">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-primary-light border border-primary/10 flex items-center justify-center text-primary text-lg">
                    <FaRobot />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-main">{agent.name}</h3>
                    <p className="text-xs text-text-muted mt-0.5">{agent.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(agent.status)}
                  <span className={`badge ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                </div>
              </div>

              {/* Status details list */}
              <div className="space-y-3.5 mb-6 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-text-sub font-medium">Last Activity:</span>
                  <span className="text-text-main font-semibold">{agent.lastActivity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-sub font-medium">Uptime:</span>
                  <span className="text-text-main font-semibold">{agent.uptime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-sub font-medium">Tasks Completed:</span>
                  <span className="text-text-main font-semibold">{agent.tasksCompleted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-sub font-medium">Performance:</span>
                  <span className={`font-bold ${getPerformanceColor(agent.performance)}`}>
                    {agent.performance}%
                  </span>
                </div>
                <div className="pt-2 border-t border-border-main/50">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-1">Current Task:</span>
                  <p className="text-xs text-text-main font-semibold bg-bg-panel border border-border-main/50 px-3 py-2 rounded leading-relaxed">
                    {agent.currentTask}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-1">Logs:</span>
                  <pre className="text-[10px] font-mono text-text-sub bg-bg-panel border border-border-main/50 px-3 py-2 rounded overflow-x-auto">
                    {agent.logs}
                  </pre>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 border-t border-border-main pt-4 mt-2">
              <button
                onClick={() => updateAgentStatus(agent.id, 'Active')}
                disabled={agent.status === 'Active'}
                className="crm-btn crm-btn-secondary py-1 px-2.5 text-xs flex items-center gap-1"
              >
                <FaPlay size={9} /> Resume
              </button>
              <button
                onClick={() => updateAgentStatus(agent.id, 'Idle')}
                disabled={agent.status === 'Idle'}
                className="crm-btn crm-btn-secondary py-1 px-2.5 text-xs flex items-center gap-1"
              >
                <FaPause size={9} /> Pause
              </button>
              <button
                onClick={() => updateAgentStatus(agent.id, 'Offline')}
                disabled={agent.status === 'Offline'}
                className="crm-btn crm-btn-secondary py-1 px-2.5 text-xs flex items-center gap-1"
              >
                <FaStop size={9} /> Stop
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentStatus;