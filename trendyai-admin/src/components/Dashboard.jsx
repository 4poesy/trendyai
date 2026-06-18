import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaProjectDiagram, FaClipboardCheck, FaClipboardList, FaRobot, FaArrowUp, FaArrowDown, FaPlus, FaUserPlus, FaRegClock } from 'react-icons/fa';
import { useToast } from './Toast';

const recent = [
  { time: '2m ago', action: 'Client added: Omega Solutions' },
  { time: '10m ago', action: 'Project approved: Social Launch' },
  { time: '1h ago', action: 'Agent PixelDex completed image gen' },
  { time: '2h ago', action: 'Audit log exported' },
  { time: '3h ago', action: 'Approval requested: ContentSmith' },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const StatCard = ({ icon, label, value, change }) => (
  <div className="crm-card flex flex-col justify-between">
    <div className="flex items-start justify-between">
      <div>
        <span className="text-sm font-medium text-text-sub">{label}</span>
        <h3 className="text-3xl font-bold text-text-main mt-1">{value}</h3>
      </div>
      <div className="p-3 bg-bg-panel border border-border-main rounded-lg text-lg text-primary">
        {icon}
      </div>
    </div>
    {change && (
      <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold">
        <span className={`inline-flex items-center gap-0.5 ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change > 0 ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
          {Math.abs(change)}%
        </span>
        <span className="text-text-muted">vs last month</span>
      </div>
    )}
  </div>
);

const activityIcons = {
  'Client added': <FaUserPlus className="text-green-500 bg-green-500/10 border border-green-500/20 rounded p-1.5 w-7 h-7" />,
  'Project approved': <FaClipboardCheck className="text-blue-500 bg-blue-500/10 border border-blue-500/20 rounded p-1.5 w-7 h-7" />,
  'Agent': <FaRobot className="text-purple-500 bg-purple-500/10 border border-purple-500/20 rounded p-1.5 w-7 h-7" />,
  'Audit log': <FaClipboardList className="text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 rounded p-1.5 w-7 h-7" />,
  'Approval requested': <FaClipboardCheck className="text-orange-500 bg-orange-500/10 border border-orange-500/20 rounded p-1.5 w-7 h-7" />,
  'default': <FaClipboardList className="text-primary bg-primary/10 border border-primary/20 rounded p-1.5 w-7 h-7" />
};

const getActivityIcon = (action) => {
  if (action.startsWith('Client added')) return activityIcons['Client added'];
  if (action.startsWith('Project approved')) return activityIcons['Project approved'];
  if (action.startsWith('Agent')) return activityIcons['Agent'];
  if (action.startsWith('Audit log')) return activityIcons['Audit log'];
  if (action.startsWith('Approval requested')) return activityIcons['Approval requested'];
  return activityIcons['default'];
};

const RecentTimeline = ({ recent }) => (
  <div className="crm-card">
    <h3 className="text-lg font-bold text-text-main mb-6 border-b border-border-main pb-3">Recent System Activity</h3>
    <ol className="relative border-l border-border-main ml-4 space-y-6 pl-6">
      {recent.map((item, index) => (
        <li key={index} className="relative flex items-center justify-between gap-4">
          <span className="absolute -left-[38px] bg-bg-card p-1">{getActivityIcon(item.action)}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-main truncate">{item.action}</p>
            <p className="text-xs text-text-muted mt-0.5">{item.time}</p>
          </div>
        </li>
      ))}
    </ol>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { showInfo } = useToast();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-main pb-6">
        <div>
          <div className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <FaRegClock /> {getGreeting()}, Admin
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-main mt-1">Orchestration Center</h1>
          <p className="text-text-sub mt-1 text-sm md:text-base">Monitor agents, scale content generation, and manage active client accounts.</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => { navigate('/projects'); showInfo('Opening Projects'); }}
            className="crm-btn crm-btn-primary py-2 text-sm"
          >
            <FaPlus size={12} /> New Project
          </button>
          <button 
            onClick={() => { navigate('/clients'); showInfo('Opening Clients'); }}
            className="crm-btn crm-btn-secondary py-2 text-sm"
          >
            <FaUserPlus size={12} /> Add Client
          </button>
          <button 
            onClick={() => { navigate('/approval-queue'); showInfo('Opening Approval Queue'); }}
            className="crm-btn crm-btn-secondary py-2 text-sm"
          >
            <FaClipboardCheck size={12} /> Approval Queue
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          icon={<FaRobot />} 
          label="Active AI Agents" 
          value="27" 
          change={5}
        />
        <StatCard 
          icon={<FaProjectDiagram />} 
          label="Active Projects" 
          value="12" 
          change={12}
        />
        <StatCard 
          icon={<FaUsers />} 
          label="Client Accounts" 
          value="8" 
          change={-2}
        />
        <StatCard 
          icon={<FaClipboardCheck />} 
          label="Tasks Completed" 
          value="156" 
          change={8}
        />
      </div>

      {/* Details layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Activity Feed */}
        <div className="lg:col-span-2">
          <RecentTimeline recent={recent} />
        </div>

        {/* Right Column: AI Engine Status */}
        <div className="space-y-6">
          <div className="crm-card">
            <h3 className="text-lg font-bold text-text-main mb-4 border-b border-border-main pb-3">Automation Engine</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-sub">Docker Status:</span>
                <span className="badge badge-success">Running</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-sub">n8n Instance:</span>
                <span className="badge badge-success">Online (Port 5678)</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-sub">Supabase Connection:</span>
                <span className="badge badge-success">Online (Cloud)</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-sub font-semibold">Active Workers:</span>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-bg-panel border border-border-main">4 Web, 2 SEO</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/agent-status')}
              className="w-full mt-6 crm-btn crm-btn-secondary text-xs py-2"
            >
              Configure AI Agents
            </button>
          </div>

          <div className="crm-card bg-bg-panel border-dashed border-2">
            <h4 className="font-bold text-text-main mb-1 text-sm">Orchestration Tip</h4>
            <p className="text-xs text-text-sub leading-relaxed">
              If an n8n webhook returns a timeout, verify that your local Docker ports are mapped correctly in your n8n environment variables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;