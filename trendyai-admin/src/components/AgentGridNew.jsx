import React, { useState } from 'react';
import { 
  FaRobot, FaComments, FaTimes, FaExpand, FaCompress, FaPlay, FaPause, FaStop,
  FaUsers, FaRocket, FaChartLine, FaPenNib, FaEdit, FaBook, FaSearch, FaBullhorn,
  FaEnvelope, FaMobileAlt, FaPalette, FaVideo, FaFilm, FaMusic, FaBullseye,
  FaChartBar, FaCompass, FaBolt, FaGraduationCap, FaBookOpen, FaSync, FaMagic,
  FaFilter, FaRetweet, FaPenFancy, FaArrowLeft, FaCheckCircle, FaExclamationTriangle,
  FaCog, FaClock, FaCheck, FaNetworkWired
} from 'react-icons/fa';
import ChatBox from './ChatBox';
import { globalAgentTrainingSystem } from '../utils/agentTrainingSystem';
import { useToast } from './Toast';

console.log('AgentGridNew component loading...');

// Agent definitions with categorization and chat functionality using professional React Icons
const agentGroups = [
  {
    name: 'Core & Onboarding Suite',
    agents: [
      {
        id: 'trendyai-core',
        name: 'TrendyAI Core',
        description: 'Central orchestrator for project decomposition, task assignment, and human approval gates.',
        icon: <FaRobot />,
        status: 'Active',
        chatFlow: ['ClientFlow', 'StratoBoss', 'PulsePilot']
      },
      {
        id: 'clientflow',
        name: 'ClientFlow',
        description: 'Acquires leads, parses briefings into variables, and manages CRM/onboarding pipelines.',
        icon: <FaUsers />,
        status: 'Active',
        chatFlow: ['TrendyAI Core', 'ContentSmith', 'StratoBoss']
      }
    ]
  },
  {
    name: 'Strategy & Operations Suite',
    agents: [
      {
        id: 'stratoboss',
        name: 'StratoBoss',
        description: 'Conducts market analysis, competitor sweeps, SEO audits, keyword lookups, and trend forecasts.',
        icon: <FaBullseye />,
        status: 'Active',
        chatFlow: ['ContentSmith', 'PulsePilot', 'TrendyAI Core']
      },
      {
        id: 'pulsepilot',
        name: 'PulsePilot',
        description: 'Deploys paid ads, schedules social media, manages YouTube video metadata, and tracks ad spend.',
        icon: <FaChartLine />,
        status: 'Active',
        chatFlow: ['StratoBoss', 'TrendyAI Core', 'PixelDex']
      }
    ]
  },
  {
    name: 'Creative Content Suite',
    agents: [
      {
        id: 'contentsmith',
        name: 'ContentSmith',
        description: 'Creative specialist adapting behavior dynamically (Copywriter, Blogger, Poet, Book Writer) with active tone matching.',
        icon: <FaPenNib />,
        status: 'Active',
        chatFlow: ['PixelDex', 'StratoBoss', 'TrendyAI Core']
      },
      {
        id: 'pixeldex',
        name: 'PixelDex',
        description: 'Visual designer crafting logos, ad graphics, social media banners, and formatting ebook layouts.',
        icon: <FaPalette />,
        status: 'Active',
        chatFlow: ['ContentSmith', 'MediaWiz', 'TrendyAI Core']
      }
    ]
  },
  {
    name: 'Development & Media Suite',
    agents: [
      {
        id: 'webwiz',
        name: 'WebWiz',
        description: 'Designs UI layouts, wireframes, generates frontend code (React/HTML), and connects CMS publishing.',
        icon: <FaMagic />,
        status: 'Active',
        chatFlow: ['MediaWiz', 'PixelDex', 'TrendyAI Core']
      },
      {
        id: 'mediawiz',
        name: 'MediaWiz',
        description: 'Generates scripts, storyboards, edits video clips (Shorts/Reels), and manages backing audio/voiceovers.',
        icon: <FaVideo />,
        status: 'Active',
        chatFlow: ['WebWiz', 'PixelDex', 'TrendyAI Core']
      }
    ]
  }
];

// Modern capability tags for each agent card preview
const agentTags = {
  'trendyai-core': ['Smart Routing', 'PM Orchestrator', 'State Sync'],
  'clientflow': ['CRM Integrator', 'Onboarding', 'Retention Alert'],
  'stratoboss': ['SEO Audit', 'Keyword Maps', 'SWOT Analysis'],
  'pulsepilot': ['Meta/Google Ads', 'Spend Tracker', 'Publishing'],
  'contentsmith': ['Multi-Persona', 'Ski Slope Copy', 'Clarifying Qs'],
  'pixeldex': ['AI Graphics', 'Typography', 'Ebook Styling'],
  'webwiz': ['React & CSS', 'CMS Deploy', 'Uptime Monitor'],
  'mediawiz': ['Video Script', 'Shorts Editor', 'Sound Design']
};

// Seed performance metrics for mock calculations
const agentMockStats = {
  'trendyai-core': { successRate: 98.2, uptime: 99.98, tasks: 524, latency: 120 },
  'clientflow': { successRate: 96.5, uptime: 99.95, tasks: 382, latency: 195 },
  'stratoboss': { successRate: 94.8, uptime: 99.90, tasks: 215, latency: 310 },
  'pulsepilot': { successRate: 95.1, uptime: 99.92, tasks: 410, latency: 175 },
  'contentsmith': { successRate: 97.4, uptime: 99.97, tasks: 680, latency: 240 },
  'pixeldex': { successRate: 93.6, uptime: 99.85, tasks: 345, latency: 420 },
  'webwiz': { successRate: 94.2, uptime: 99.91, tasks: 290, latency: 280 },
  'mediawiz': { successRate: 92.8, uptime: 99.80, tasks: 180, latency: 510 }
};

const AgentGridNew = () => {
  const { showSuccess, showInfo } = useToast();
  
  // Selection and search states
  const [activeAgentId, setActiveAgentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('guidelines'); // 'guidelines' | 'knowhow' | 'avoid'
  
  // Prompt edit and retrain states
  const [promptSettings, setPromptSettings] = useState({});
  const [retrainingStatus, setRetrainingStatus] = useState({});

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Idle': return 'bg-yellow-500';
      case 'Busy': return 'bg-blue-500';
      case 'Error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAgentMetrics = (agent) => {
    const trained = globalAgentTrainingSystem.getAgentTrainingData(agent.name);
    const mock = agentMockStats[agent.id] || { successRate: 95.0, uptime: 99.9, tasks: 120, latency: 250 };
    
    // If there is actual performance recorded in the system, use it. Otherwise, use mock for presentation
    const tasks = (trained?.performance?.tasksCompleted > 0) ? trained.performance.tasksCompleted : mock.tasks;
    const successRate = (trained?.performance?.successRate > 0) 
      ? (trained.performance.successRate * 100) 
      : mock.successRate;
    const latency = (trained?.performance?.averageResponseTime > 0) ? trained.performance.averageResponseTime : mock.latency;
    const satisfaction = (trained?.performance?.userSatisfaction > 0) 
      ? (trained.performance.userSatisfaction * 100)
      : (mock.successRate - 1.2);
      
    return {
      tasks,
      successRate: successRate.toFixed(1),
      latency: `${latency}ms`,
      satisfaction: `${satisfaction.toFixed(1)}%`,
      uptime: `${mock.uptime}%`
    };
  };

  const handleRetrainAgent = async (agentName) => {
    setRetrainingStatus(prev => ({ ...prev, [agentName]: 'training' }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update custom instructions if the user changed them before retraining
      const customPrompt = promptSettings[agentName];
      if (customPrompt) {
        const data = globalAgentTrainingSystem.getAgentTrainingData(agentName);
        if (data) data.behavior = customPrompt;
      }
      
      globalAgentTrainingSystem.trainAgent(agentName);
      
      setRetrainingStatus(prev => ({ ...prev, [agentName]: 'ready' }));
      showSuccess(`Worker ${agentName} guidelines compiled and synchronized successfully!`);
    } catch (error) {
      console.error(`Failed to retrain ${agentName}:`, error);
      setRetrainingStatus(prev => ({ ...prev, [agentName]: 'error' }));
    }
  };

  const handleSavePrompt = (agentName) => {
    const customPrompt = promptSettings[agentName];
    if (customPrompt !== undefined) {
      const data = globalAgentTrainingSystem.getAgentTrainingData(agentName);
      if (data) {
        data.behavior = customPrompt;
        showSuccess(`Custom prompts saved in memory for ${agentName}`);
      } else {
        showSuccess(`Prompt customized for ${agentName}`);
      }
    }
  };

  // Filter agent groups dynamically by search query
  const filteredAgentGroups = agentGroups.map(group => {
    const agents = group.agents.filter(agent => {
      const tags = agentTags[agent.id] || [];
      const query = searchTerm.toLowerCase();
      return (
        agent.name.toLowerCase().includes(query) ||
        agent.description.toLowerCase().includes(query) ||
        tags.some(t => t.toLowerCase().includes(query))
      );
    });
    return { ...group, agents };
  }).filter(group => group.agents.length > 0);

  // Playground Detailed View
  if (activeAgentId) {
    const agent = agentGroups.flatMap(g => g.agents).find(a => a.id === activeAgentId);
    if (agent) {
      return (
        <div className="h-full flex flex-col p-4 md:p-6 bg-bg-main animate-fadeIn">
          {/* Detailed Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-border-main pb-5 mb-6 gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => setActiveAgentId(null)}
                className="flex items-center gap-2 px-3 py-2 border border-border-main hover:border-primary bg-bg-card rounded-lg text-sm text-text-sub hover:text-primary transition-all cursor-pointer font-medium font-semibold"
              >
                <FaArrowLeft className="text-xs" /> Back to Grid
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-light dark:bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
                  {agent.icon}
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-text-main flex items-center gap-2 tracking-tight">
                    {agent.name}
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      agent.status === 'Active' ? 'bg-green-500/15 text-green-500' : 'bg-yellow-500/15 text-yellow-500'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                      {agent.status}
                    </span>
                  </h1>
                  <p className="text-xs text-text-sub mt-0.5 font-medium">{agent.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Playground Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1 min-h-[500px]">
            {/* Left Column - Configuration & Control Center */}
            <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-14rem)] pr-2 custom-scrollbar">
              {/* Overview Stats */}
              <div className="crm-card p-5 space-y-4">
                <h3 className="text-sm font-bold text-text-main border-b border-border-main/50 pb-2 flex items-center gap-2">
                  <FaChartLine className="text-primary text-xs" /> Performance & Analytics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-bg-panel border border-border-main/40 rounded-xl p-3 flex flex-col">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Uptime</span>
                    <span className="text-lg font-bold text-green-500 mt-1">{getAgentMetrics(agent).uptime}</span>
                  </div>
                  <div className="bg-bg-panel border border-border-main/40 rounded-xl p-3 flex flex-col">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Success Rate</span>
                    <span className="text-lg font-bold text-text-main mt-1">{getAgentMetrics(agent).successRate}%</span>
                  </div>
                  <div className="bg-bg-panel border border-border-main/40 rounded-xl p-3 flex flex-col">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Response Latency</span>
                    <span className="text-lg font-bold text-text-main mt-1">{getAgentMetrics(agent).latency}</span>
                  </div>
                  <div className="bg-bg-panel border border-border-main/40 rounded-xl p-3 flex flex-col">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Completed Tasks</span>
                    <span className="text-lg font-bold text-text-main mt-1">{getAgentMetrics(agent).tasks}</span>
                  </div>
                </div>
              </div>

              {/* Editable Prompts & Custom behavior */}
              <div className="crm-card p-5 space-y-4">
                <h3 className="text-sm font-bold text-text-main border-b border-border-main/50 pb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FaEdit className="text-primary text-xs" /> Custom Prompts & Behavior
                  </span>
                  <span className="text-[10px] text-text-muted font-mono font-bold uppercase bg-bg-panel px-2 py-0.5 rounded border border-border-main/40">
                    Writable
                  </span>
                </h3>
                <div className="space-y-3">
                  <label className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Behavioral Rules (Persona Customization)</label>
                  <textarea
                    value={promptSettings[agent.name] !== undefined ? promptSettings[agent.name] : (globalAgentTrainingSystem.getAgentTrainingData(agent.name)?.behavior || agent.description)}
                    onChange={(e) => setPromptSettings(prev => ({ ...prev, [agent.name]: e.target.value }))}
                    className="w-full h-32 p-3 text-xs bg-bg-panel text-text-main border border-border-main rounded-lg focus:border-primary focus:outline-none transition-all resize-none leading-relaxed font-mono"
                    placeholder="Edit custom system instructions here..."
                  />
                  <button 
                    onClick={() => handleSavePrompt(agent.name)}
                    className="crm-btn crm-btn-primary w-full py-2 text-xs font-semibold rounded-lg flex items-center justify-center cursor-pointer shadow-sm hover:shadow"
                  >
                    Save Customized Prompt
                  </button>
                </div>
              </div>

              {/* Retrain Controls */}
              <div className="crm-card p-5 space-y-4">
                <h3 className="text-sm font-bold text-text-main border-b border-border-main/50 pb-2 flex items-center gap-2">
                  <FaGraduationCap className="text-primary text-xs" /> Training Actions
                </h3>
                <div className="flex items-center justify-between bg-bg-panel border border-border-main/40 rounded-xl p-3.5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-text-main">Worker Brain Sync</span>
                    <span className="text-[10px] text-text-muted mt-0.5">
                      {retrainingStatus[agent.name] === 'training' 
                        ? 'Syncing guidelines...' 
                        : `Active - v${promptSettings[agent.name] ? '1.2' : '1.1'} (Synced)`}
                    </span>
                  </div>
                  <button 
                    disabled={retrainingStatus[agent.name] === 'training'}
                    onClick={() => handleRetrainAgent(agent.name)}
                    className="px-3.5 py-1.5 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <FaSync className={retrainingStatus[agent.name] === 'training' ? 'animate-spin' : ''} />
                    {retrainingStatus[agent.name] === 'training' ? 'Training...' : 'Retrain Worker'}
                  </button>
                </div>
              </div>

              {/* Behavior Guidelines (Tabs Reference) */}
              <div className="crm-card p-5 space-y-4">
                <h3 className="text-sm font-bold text-text-main border-b border-border-main/50 pb-2 flex items-center gap-2">
                  <FaBookOpen className="text-primary text-xs" /> Reference Guidelines
                </h3>
                <div className="flex border-b border-border-main/30 gap-4 text-xs font-semibold">
                  <button 
                    onClick={() => setActiveTab('guidelines')}
                    className={`pb-2 border-b-2 transition-all cursor-pointer ${
                      activeTab === 'guidelines' 
                        ? 'border-primary text-primary font-bold' 
                        : 'border-transparent text-text-muted hover:text-text-main'
                    }`}
                  >
                    Tone
                  </button>
                  <button 
                    onClick={() => setActiveTab('knowhow')}
                    className={`pb-2 border-b-2 transition-all cursor-pointer ${
                      activeTab === 'knowhow' 
                        ? 'border-primary text-primary font-bold' 
                        : 'border-transparent text-text-muted hover:text-text-main'
                    }`}
                  >
                    Knowledge
                  </button>
                  <button 
                    onClick={() => setActiveTab('avoid')}
                    className={`pb-2 border-b-2 transition-all cursor-pointer ${
                      activeTab === 'avoid' 
                        ? 'border-primary text-primary font-bold' 
                        : 'border-transparent text-text-muted hover:text-text-main'
                    }`}
                  >
                    Avoid Rules
                  </button>
                </div>
                <div className="min-h-[120px] bg-bg-panel border border-border-main/40 rounded-xl p-3 text-xs leading-relaxed text-text-sub font-medium">
                  {activeTab === 'guidelines' && (
                    <p className="whitespace-pre-line font-mono">
                      {globalAgentTrainingSystem.getAgentTrainingData(agent.name)?.tone || 'No specific tone details loaded.'}
                    </p>
                  )}
                  {activeTab === 'knowhow' && (
                    <ul className="list-disc pl-4 space-y-1.5">
                      {(globalAgentTrainingSystem.getAgentTrainingData(agent.name)?.specializedKnowledge || []).map((k, i) => (
                        <li key={i}>{k}</li>
                      ))}
                      {(!globalAgentTrainingSystem.getAgentTrainingData(agent.name)?.specializedKnowledge || globalAgentTrainingSystem.getAgentTrainingData(agent.name)?.specializedKnowledge.length === 0) && (
                        <li>No specialized knowledge metrics indexed.</li>
                      )}
                    </ul>
                  )}
                  {activeTab === 'avoid' && (
                    <ul className="list-disc pl-4 space-y-1.5 text-red-500/80">
                      {(globalAgentTrainingSystem.getAgentTrainingData(agent.name)?.avoidPatterns || []).map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                      {(!globalAgentTrainingSystem.getAgentTrainingData(agent.name)?.avoidPatterns || globalAgentTrainingSystem.getAgentTrainingData(agent.name)?.avoidPatterns.length === 0) && (
                        <li className="text-text-muted">No penalty filters defined for this worker.</li>
                      )}
                    </ul>
                  )}
                </div>
              </div>

              {/* Smart Routing Pipeline Visualizer */}
              <div className="crm-card p-5 space-y-4">
                <h3 className="text-sm font-bold text-text-main border-b border-border-main/50 pb-2 flex items-center gap-2">
                  <FaNetworkWired className="text-primary text-xs" /> Multi-Agent Routing Network
                </h3>
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Smart Collaboration Flow</span>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="bg-primary/15 border border-primary/25 text-primary text-[11px] font-bold px-2.5 py-1 rounded-lg">
                      {agent.name}
                    </span>
                    {agent.chatFlow.map((f, i) => (
                      <React.Fragment key={f}>
                        <span className="text-text-muted font-bold text-xs">&rarr;</span>
                        <span className="bg-bg-panel border border-border-main text-text-sub text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                          {f}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                  <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                    When a task is processed, {agent.name} delegates workflow sub-tasks to these downstream systems autonomously based on complexity.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Chat Playground */}
            <div className="lg:col-span-7 flex flex-col h-full overflow-hidden max-h-[calc(100vh-14rem)] bg-bg-card border border-border-main rounded-2xl shadow-lg relative">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border-main bg-bg-card shrink-0">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-text-main">Interactive Playground</span>
                </div>
                <button 
                  onClick={() => {
                    showSuccess(`Resetting playground session for ${agent.name}...`);
                    const id = activeAgentId;
                    setActiveAgentId(null);
                    setTimeout(() => setActiveAgentId(id), 100);
                  }}
                  className="text-xs text-primary hover:text-primary-hover font-semibold cursor-pointer"
                >
                  Reset Session
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <ChatBox
                  agentFlow={agent.chatFlow}
                  onClose={() => setActiveAgentId(null)}
                  sourceAgentId={agent.id}
                  isInline={true}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // Grid Dashboard View
  return (
    <div className="h-full flex flex-col p-4 md:p-6 bg-bg-main animate-fadeIn">
      {/* Header */}
      <div className="w-full flex flex-col items-start mb-6 mt-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-main font-heading">TrendyAI Agents</h1>
        <p className="text-text-sub mt-1 text-sm md:text-base font-medium">Interact and chat with 8 specialized AI agents working across marketing, SEO, and copywriting.</p>
      </div>
      
      {/* Enhanced Orchestration Bar */}
      <div className="w-full flex flex-wrap items-center justify-start gap-2 px-4 py-2.5 bg-bg-panel border border-border-main text-xs text-text-sub font-mono mb-6 rounded-xl shadow-sm">
        <span className="font-bold text-primary">TrendyAI Core</span>
        <span className="text-text-muted">&rarr;</span>
        <span className="font-bold text-text-main">Complexity Analysis</span>
        <span className="text-text-muted">&rarr;</span>
        <span className="font-bold text-text-main">Smart Routing</span>
        <span className="text-text-muted">&rarr;</span>
        <span className="font-bold text-text-main">Specialized Agent</span>
        <span className="ml-2 text-text-muted">(intelligent workflow)</span>
      </div>

      {/* Search and Action Bar */}
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-muted">
            <FaSearch className="text-xs" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search agents by name, role, or capability..."
            className="w-full pl-10 pr-4 py-2.5 border border-border-main bg-bg-card text-text-main rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => {
              showInfo("Simulating auto-orchestration workflow across all 8 agents...");
            }}
            className="crm-btn crm-btn-primary py-2 px-4 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow hover:shadow-md"
          >
            <FaRobot className="text-xs" /> Auto Orchestrate
          </button>
        </div>
      </div>
      
      {/* Main Workspace Grid Area */}
      <div className="flex-1 w-full bg-bg-card border border-border-main rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-border-main/50 pb-4">
          <div className="font-bold text-text-main text-lg tracking-tight font-heading">Agent Groups Grid</div>
        </div>

        {/* Agent Groups Grid */}
        <div className="space-y-12">
          {filteredAgentGroups.map((group) => (
            <section key={group.name} className="animate-fadeIn">
              <div className="flex items-center mb-6 border-l-4 border-primary pl-4">
                <h2 className="text-base font-bold tracking-tight text-text-main">
                  {group.name}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {group.agents.map(agent => (
                  <div
                    key={agent.id}
                    className="group relative flex flex-col justify-between w-full rounded-2xl shadow-sm border border-border-main hover:border-primary bg-bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer"
                    onClick={() => setActiveAgentId(agent.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Open playground for ${agent.name}`}
                  >
                    {/* Top row: Status and Badge */}
                    <div className="flex items-center justify-between mb-4 w-full">
                      {/* Icon inside circle */}
                      <div className="w-12 h-12 rounded-xl bg-primary-light dark:bg-primary/10 text-primary flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                        {agent.icon}
                      </div>
                      
                      {/* Ambient glowing status */}
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)} animate-pulse`}></span>
                        <span className="text-[10px] font-bold text-text-sub uppercase tracking-wider">
                          {agent.status}
                        </span>
                      </div>
                    </div>

                    {/* Agent Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors tracking-tight leading-snug">
                        {agent.name}
                      </h3>
                      <p className="text-xs text-text-sub mt-2 leading-relaxed font-medium">
                        {agent.description}
                      </p>
                      
                      {/* Capabilities Pill Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {(agentTags[agent.id] || []).map(tag => (
                          <span key={tag} className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-bg-panel border border-border-main/50 text-text-sub">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action footer */}
                    <div className="mt-6 border-t border-border-main/40 pt-4 flex items-center justify-between text-primary font-bold text-xs">
                      <span>Launch Playground</span>
                      <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300 font-bold">&rarr;</span>
                    </div>
                    
                    {/* Soft hover gradient block */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                ))}
              </div>
            </section>
          ))}
          
          {filteredAgentGroups.length === 0 && (
            <div className="w-full flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl text-text-muted mb-3">🔍</div>
              <p className="text-sm font-semibold text-text-sub">No agents match "{searchTerm}"</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-3 text-xs text-primary font-bold hover:underline cursor-pointer"
              >
                Clear Search Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

console.log('AgentGridNew component defined successfully');

export default AgentGridNew;
 