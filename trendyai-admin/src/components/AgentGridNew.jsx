import React, { useState } from 'react';
import { 
  FaRobot, FaComments, FaTimes, FaExpand, FaCompress, FaPlay, FaPause, FaStop,
  FaUsers, FaRocket, FaChartLine, FaPenNib, FaEdit, FaBook, FaSearch, FaBullhorn,
  FaEnvelope, FaMobileAlt, FaPalette, FaVideo, FaFilm, FaMusic, FaBullseye,
  FaChartBar, FaCompass, FaBolt, FaGraduationCap, FaBookOpen, FaSync, FaMagic,
  FaFilter, FaRetweet, FaPenFancy
} from 'react-icons/fa';
import ChatBox from './ChatBox';

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

const AgentGridNew = () => {
  const [openChats, setOpenChats] = useState({});
  const [expandedChats, setExpandedChats] = useState({});
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Always open chat on click (never toggle off)
  const openChat = (agentId) => {
    setOpenChats(prev => ({
      ...prev,
      [agentId]: true
    }));
    setSelectedAgent(agentId);
  };

  const toggleExpanded = (agentId) => {
    setExpandedChats(prev => ({
      ...prev,
      [agentId]: !prev[agentId]
    }));
  };

  const closeChat = (agentId) => {
    setOpenChats(prev => ({
      ...prev,
      [agentId]: false
    }));
    setExpandedChats(prev => ({
      ...prev,
      [agentId]: false
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Idle': return 'bg-yellow-500';
      case 'Busy': return 'bg-blue-500';
      case 'Error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="w-full flex flex-col items-start mb-6 mt-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-text-main">TrendyAI Agents</h1>
          <p className="text-text-sub mt-1 text-sm md:text-base">Interact and chat with 28 specialized AI agents working across marketing, SEO, and copywriting.</p>
        </div>
        
        {/* Enhanced Orchestration Bar */}
        <div className="w-full flex items-center justify-start gap-2 px-4 py-2.5 bg-bg-panel border-b border-border-main text-xs text-text-sub font-mono">
          <span className="font-bold text-primary">TrendyAI Core</span>
          <span className="text-text-muted">&rarr;</span>
          <span className="font-bold text-text-main">Complexity Analysis</span>
          <span className="text-text-muted">&rarr;</span>
          <span className="font-bold text-text-main">Smart Routing</span>
          <span className="text-text-muted">&rarr;</span>
          <span className="font-bold text-text-main">Specialized Agent</span>
          <span className="ml-2 text-text-muted">(intelligent workflow)</span>
        </div>
        
        {/* Main Workspace Area */}
        <div className="flex-1 w-full flex flex-row items-start relative bg-bg-main">
          {/* Main Agents Area */}
          <div className="flex-1 flex flex-col items-center justify-start py-6">
            <div className="w-full max-w-7xl bg-bg-card border border-border-main rounded-lg p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-text-main">Agent Groups Grid</div>
                <button className="crm-btn crm-btn-primary py-1.5 text-xs">
                  <FaRobot /> Auto Orchestrate
                </button>
              </div>

              {/* Agent Groups Grid */}
              <div className="space-y-8">
                {agentGroups.map((group, groupIdx) => (
                  <section key={group.name} className="mb-16">
                    <div className="flex items-center mt-8 mb-8 border-l-4 border-primary pl-4">
                      <h2 className="text-lg font-bold tracking-tight text-text-main">
                        {group.name}
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {group.agents.map(agent => (
                        <div
                          key={agent.id}
                          className="relative flex flex-col items-center justify-between w-full min-h-[190px] md:min-h-[220px] rounded-xl shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-accent-yellow/25 hover:border-accent-yellow bg-bg-card p-5"
                          onClick={() => openChat(agent.id)}
                          tabIndex={0}
                          role="button"
                          aria-label={`Open chat with ${agent.name}`}
                        >
                          {/* Status Indicator */}
                          <div className="absolute top-2.5 right-2.5 flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(agent.status)} animate-pulse`}></div>
                            <span className="text-xs font-semibold text-text-sub">
                              {agent.status}
                            </span>
                          </div>

                          {/* Agent Icon */}
                          <div className="text-3xl mt-4 mb-2 text-primary text-center transition-transform duration-300">
                            {agent.icon}
                          </div>

                          {/* Agent Name */}
                          <h3 className="text-base font-bold font-poppins mb-1.5 text-center leading-tight text-text-main">
                            {agent.name}
                          </h3>

                          {/* Agent Description */}
                          <p className="text-[11px] font-montserrat text-center leading-relaxed text-text-sub">
                            {agent.description}
                          </p>

                          {/* Chat Indicator */}
                          <div className="mt-3.5 flex items-center justify-center gap-1.5 text-accent-yellow">
                            <FaComments className="text-xs" />
                            <span className="text-xs font-semibold">Click to Chat</span>
                          </div>

                          {/* Hover Glow Effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-accent-yellow/10 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
          {/* Minimal Tool Dock on the right */}
          <div className="flex flex-col items-center gap-6 bg-transparent absolute right-8 top-1/2 -translate-y-1/2">
            <button title="Agent Grid" className="group flex flex-col items-center">
              <FaRobot className="text-cyan-500 text-2xl group-hover:text-cyan-700" />
              <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-900 text-white px-2 py-1 rounded shadow-lg absolute z-10">Grid</span>
            </button>
            <button title="Upload File" className="group flex flex-col items-center">
              <FaComments className="text-cyan-500 text-2xl group-hover:text-cyan-700" />
              <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-900 text-white px-2 py-1 rounded shadow-lg absolute z-10">Chat</span>
            </button>
            <button title="Agent History" className="group flex flex-col items-center">
              <FaTimes className="text-cyan-500 text-2xl group-hover:text-cyan-700" />
              <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-900 text-white px-2 py-1 rounded shadow-lg absolute z-10">Close</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Panels */}
      {Object.keys(openChats).map((agentId) => {
        if (!openChats[agentId]) return null;
        
        const agent = agentGroups.flatMap(group => group.agents).find(a => a.id === agentId);
        const isExpanded = expandedChats[agentId];
        
        return (
          <div
            key={agentId}
            className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
              isExpanded 
                ? 'w-96 h-[600px]' 
                : 'w-80 h-96'
            }`}
          >
            <div className="bg-white/95 dark:bg-navy-900/95 backdrop-blur-xl border-2 border-cyan-200/40 shadow-2xl rounded-2xl h-full flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-cyan-200/40">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{agent.icon}</div>
                  <div>
                    <h3 className="font-bold font-poppins text-navy-900 dark:text-white">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-navy-900/70 dark:text-white/70">
                      {agent.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleExpanded(agentId)}
                    className="p-2 rounded-lg bg-cyan-100 hover:bg-cyan-200 text-cyan-700 transition-colors"
                  >
                    {isExpanded ? <FaCompress /> : <FaExpand />}
                  </button>
                  <button
                    onClick={() => closeChat(agentId)}
                    className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-hidden">
                <ChatBox
                  agentFlow={agent.chatFlow}
                  onClose={() => closeChat(agentId)}
                  allowDirectTarget={true}
                  agentsList={agentGroups.flatMap(group => group.agents)}
                  sourceAgentId={agentId}
                />
              </div>
            </div>
          </div>
        );
      })}

      {/* Active Chats Counter */}
      {Object.values(openChats).some(Boolean) && (
        <div className="fixed bottom-4 left-4 z-40">
          <div className="bg-cyan-500 text-white px-4 py-2 rounded-full shadow-lg">
            <span className="font-semibold">
              {Object.values(openChats).filter(Boolean).length} Active Chat{Object.values(openChats).filter(Boolean).length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

console.log('AgentGridNew component defined successfully');

export default AgentGridNew;
 