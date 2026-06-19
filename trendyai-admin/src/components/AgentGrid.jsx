import React, { useState } from 'react';
import { FaRobot, FaPlay, FaPause, FaStop, FaCog, FaPlus, FaEdit, FaTrash, FaEye, FaChartLine, FaNetworkWired, FaBrain } from 'react-icons/fa';

const AgentGrid = () => {
  const [agents, setAgents] = useState([
    {
      id: 1,
      name: 'ContentCreator',
      type: 'Content Generation',
      status: 'Deployed',
      version: '2.1.0',
      lastDeployed: '2024-03-15 10:30',
      performance: 95,
      uptime: '99.8%',
      tasksCompleted: 156,
      configuration: {
        model: 'GPT-4',
        temperature: 0.7,
        maxTokens: 2000,
        language: 'English'
      },
      endpoints: ['/api/content/create', '/api/content/edit', '/api/content/optimize']
    },
    {
      id: 2,
      name: 'DesignMaster',
      type: 'Graphic Design',
      status: 'Deployed',
      version: '1.8.2',
      lastDeployed: '2024-03-14 15:45',
      performance: 92,
      uptime: '99.5%',
      tasksCompleted: 89,
      configuration: {
        model: 'DALL-E 3',
        style: 'Modern',
        resolution: '1920x1080',
        format: 'PNG'
      },
      endpoints: ['/api/design/create', '/api/design/edit', '/api/design/export']
    },
    {
      id: 3,
      name: 'EmailBot',
      type: 'Email Marketing',
      status: 'Staging',
      version: '1.5.1',
      lastDeployed: '2024-03-13 09:20',
      performance: 88,
      uptime: '99.9%',
      tasksCompleted: 234,
      configuration: {
        model: 'Claude-3',
        tone: 'Professional',
        maxLength: 500,
        includeCTA: true
      },
      endpoints: ['/api/email/generate', '/api/email/sequence', '/api/email/analyze']
    },
    {
      id: 4,
      name: 'SocialManager',
      type: 'Social Media',
      status: 'Development',
      version: '0.9.5',
      lastDeployed: '2024-03-12 14:15',
      performance: 75,
      uptime: '98.2%',
      tasksCompleted: 67,
      configuration: {
        model: 'GPT-3.5',
        platforms: ['Facebook', 'Instagram', 'Twitter'],
        postFrequency: 'daily',
        engagement: 'high'
      },
      endpoints: ['/api/social/post', '/api/social/schedule', '/api/social/engage']
    },
    {
      id: 5,
      name: 'AnalyticsPro',
      type: 'Data Analytics',
      status: 'Deployed',
      version: '2.0.1',
      lastDeployed: '2024-03-15 08:00',
      performance: 96,
      uptime: '99.7%',
      tasksCompleted: 312,
      configuration: {
        model: 'Custom ML',
        dataSources: ['Google Analytics', 'Facebook Insights', 'Email Metrics'],
        reporting: 'real-time',
        visualization: 'charts'
      },
      endpoints: ['/api/analytics/dashboard', '/api/analytics/report', '/api/analytics/export']
    },
    {
      id: 6,
      name: 'SEOOptimizer',
      type: 'SEO',
      status: 'Offline',
      version: '1.2.3',
      lastDeployed: '2024-03-10 11:30',
      performance: 82,
      uptime: '95.1%',
      tasksCompleted: 45,
      configuration: {
        model: 'BERT',
        keywords: 'auto-detect',
        optimization: 'on-page',
        reporting: 'weekly'
      },
      endpoints: ['/api/seo/analyze', '/api/seo/optimize', '/api/seo/rankings']
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false); // eslint-disable-line no-unused-vars
  const [selectedAgent, setSelectedAgent] = useState(null); // eslint-disable-line no-unused-vars

  const updateAgentStatus = (id, newStatus) => {
    setAgents(agents.map(agent => 
      agent.id === id ? { ...agent, status: newStatus } : agent
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Deployed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Staging': return 'bg-brand-cyan-soft text-brand-cyan border border-brand-cyan/25';
      case 'Development': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Offline': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return 'text-green-500';
    if (performance >= 75) return 'text-cyan-400';
    return 'text-red-500';
  };

  const deployedAgents = agents.filter(agent => agent.status === 'Deployed').length;
  const totalAgents = agents.length;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start px-2 md:px-8 py-4">
      <div className="w-full max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-poppins text-cyan-500 mb-2">
              Agent Grid
            </h1>
            <p className="text-navy-900/80 dark:text-white/80 font-montserrat">
              Manage and deploy AI agents across your infrastructure.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-900 font-bold font-poppins shadow-lg transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-cyan-300 mt-4 md:mt-0"
          >
            <FaPlus /> Deploy Agent
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-cyan-500 shadow-lg rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-navy-900 mb-2">{totalAgents}</div>
            <div className="text-sm text-navy-900/70 font-montserrat">Total Agents</div>
          </div>
          <div className="bg-white border-2 border-cyan-500 shadow-lg rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{deployedAgents}</div>
            <div className="text-sm text-navy-900/70 font-montserrat">Deployed</div>
          </div>
          <div className="bg-white border-2 border-cyan-500 shadow-lg rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-cyan-600 mb-2">
              {agents.filter(a => a.status === 'Staging').length}
            </div>
            <div className="text-sm text-navy-900/70 font-montserrat">In Staging</div>
          </div>
          <div className="bg-white border-2 border-cyan-500 shadow-lg rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {agents.filter(a => a.status === 'Development').length}
            </div>
            <div className="text-sm text-navy-900/70 font-montserrat">In Development</div>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white border-2 border-cyan-500 shadow-lg rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FaRobot className="text-3xl text-cyan-500" />
                  <div>
                    <h3 className="text-xl font-bold font-poppins text-navy-900">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-navy-900/70 font-montserrat">
                      {agent.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaChartLine className="text-cyan-500" />
                  <span className="text-navy-900/80">
                    <strong>Performance:</strong> <span className={getPerformanceColor(agent.performance)}>{agent.performance}%</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaNetworkWired className="text-cyan-500" />
                  <span className="text-navy-900/80">
                    <strong>Uptime:</strong> {agent.uptime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaBrain className="text-cyan-500" />
                  <span className="text-navy-900/80">
                    <strong>Version:</strong> {agent.version}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaChartLine className="text-cyan-500" />
                  <span className="text-navy-900/80">
                    <strong>Tasks:</strong> {agent.tasksCompleted}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-semibold text-navy-900 mb-2">Configuration</div>
                <div className="text-xs text-navy-900/70 bg-gray-50 p-3 rounded-lg">
                  {Object.entries(agent.configuration).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-mono">{key}:</span>
                      <span className="font-mono">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-semibold text-navy-900 mb-2">Endpoints</div>
                <div className="space-y-1">
                  {agent.endpoints.map((endpoint, index) => (
                    <div key={index} className="text-xs text-navy-900/70 font-mono bg-cyan-50 p-2 rounded">
                      {endpoint}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-cyan-500">
                {agent.status === 'Offline' && (
                  <button
                    onClick={() => updateAgentStatus(agent.id, 'Deployed')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-400 text-white font-bold transition-colors"
                  >
                    <FaPlay /> Deploy
                  </button>
                )}
                {agent.status === 'Deployed' && (
                  <>
                    <button
                      onClick={() => updateAgentStatus(agent.id, 'Staging')}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-bold transition-colors"
                    >
                      <FaPause /> Stage
                    </button>
                    <button
                      onClick={() => updateAgentStatus(agent.id, 'Offline')}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white font-bold transition-colors"
                    >
                      <FaStop /> Stop
                    </button>
                  </>
                )}
                {agent.status === 'Staging' && (
                  <>
                    <button 
                      onClick={() => updateAgentStatus(agent.id, 'Deployed')}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-400 text-white font-bold transition-colors"
                    >
                      <FaPlay /> Deploy
                    </button>
                    <button 
                      onClick={() => updateAgentStatus(agent.id, 'Development')}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white font-bold transition-colors"
                    >
                      <FaCog /> Dev
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedAgent(agent)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-navy-900 font-bold transition-colors ml-auto"
                >
                  <FaEye /> Configure
                </button>
              </div>
            </div>
          ))}
        </div>

        {agents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <p className="text-navy-900/80 dark:text-white/80 font-montserrat text-lg">
              No agents configured. Deploy your first AI agent to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentGrid;