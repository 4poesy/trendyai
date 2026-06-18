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
  <div className="crm-card flex flex-col justify-between hover-scale">
    <div className="flex items-start justify-between">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-text-sub">{label}</span>
        <h3 className="text-3xl font-extrabold text-text-main mt-2 tracking-tight">{value}</h3>
      </div>
      <div className="p-3 bg-bg-panel border border-border-main rounded-xl text-lg text-primary shadow-[0_0_15px_rgba(251,191,36,0.1)]">
        {icon}
      </div>
    </div>
    {change !== undefined && (
      <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold">
        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full border ${
          change > 0 
            ? 'bg-primary-light text-primary border-primary/20' 
            : 'bg-bg-panel text-text-muted border-border-main'
        }`}>
          {change > 0 ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
          {Math.abs(change)}%
        </span>
        <span className="text-text-muted">vs last month</span>
      </div>
    )}
  </div>
);

const activityIcons = {
  'Client added': <FaUserPlus className="text-primary bg-primary/10 border border-primary/20 rounded-lg p-1.5 w-8 h-8 shrink-0" />,
  'Project approved': <FaClipboardCheck className="text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg p-1.5 w-8 h-8 shrink-0" />,
  'Agent': <FaRobot className="text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg p-1.5 w-8 h-8 shrink-0" />,
  'Audit log': <FaClipboardList className="text-primary bg-primary/10 border border-primary/20 rounded-lg p-1.5 w-8 h-8 shrink-0" />,
  'Approval requested': <FaClipboardCheck className="text-amber-600 bg-amber-600/10 border border-amber-600/20 rounded-lg p-1.5 w-8 h-8 shrink-0" />,
  'default': <FaClipboardList className="text-primary bg-primary/10 border border-primary/20 rounded-lg p-1.5 w-8 h-8 shrink-0" />
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
    <h3 className="text-lg font-bold text-text-main mb-6 border-b border-border-main pb-3 tracking-tight font-heading">Recent System Activity</h3>
    <ol className="relative border-l border-border-main ml-6 space-y-8 pl-10">
      {recent.map((item, index) => (
        <li key={index} className="relative flex items-center justify-between gap-4">
          <span className="absolute -left-[56px] bg-bg-card p-1.5 rounded-full border border-border-main">{getActivityIcon(item.action)}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-main truncate leading-snug">{item.action}</p>
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
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-main pb-6">
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <FaRegClock /> {getGreeting()}, Administrator
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-main mt-1.5 font-heading">Orchestration Center</h1>
          <p className="text-text-sub mt-1 text-sm md:text-base font-medium">Monitor active agents, review generated campaigns, and manage client briefs.</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => { navigate('/projects'); showInfo('Opening Projects'); }}
            className="crm-btn crm-btn-primary py-2 px-4 text-xs shadow-md"
          >
            <FaPlus size={10} /> New Project
          </button>
          <button 
            onClick={() => { navigate('/clients'); showInfo('Opening Clients'); }}
            className="crm-btn crm-btn-secondary py-2 px-4 text-xs"
          >
            <FaUserPlus size={10} /> Add Client
          </button>
          <button 
            onClick={() => { navigate('/approval-queue'); showInfo('Opening Approval Queue'); }}
            className="crm-btn crm-btn-secondary py-2 px-4 text-xs"
          >
            <FaClipboardCheck size={10} /> Approval Queue
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Recent Activity Feed */}
        <div className="lg:col-span-2">
          <RecentTimeline recent={recent} />
        </div>

        {/* Right Column: AI Engine Status */}
        <div className="space-y-8">
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