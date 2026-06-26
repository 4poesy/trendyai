import React, { useState, useEffect } from 'react';
import { FaRobot, FaExchangeAlt, FaChartLine, FaCog, FaPlay, FaStop, FaHistory, FaArrowLeft } from 'react-icons/fa';
import StudioModeAgentCommunication from './StudioModeAgentCommunication';
import StudioModeIntegration from './StudioModeIntegration';
import { globalStudioModeNetwork, initializeStudioModeNetwork } from '../utils/studioModeAgentCommunication';

const StudioMode = () => {
  const [activeView, setActiveView] = useState('workspace'); // workspace, communication
  const [networkStats, setNetworkStats] = useState(null);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    // Initialize the studio mode network
    try {
      initializeStudioModeNetwork();
      
      // Get initial data
      updateNetworkData();
      
      // Set up interval to update data
      const interval = setInterval(updateNetworkData, 5000);
      return () => clearInterval(interval);
    } catch (error) {
      console.error('Failed to initialize StudioMode network:', error);
    }
  }, []);

  const updateNetworkData = () => {
    try {
      const stats = globalStudioModeNetwork.getCollaborationStats();
      const agents = globalStudioModeNetwork.getAvailableAgents();
      const messages = globalStudioModeNetwork.getRecentCommunication(10);
      
      setNetworkStats(stats);
      setAvailableAgents(agents);
      setRecentMessages(messages);
    } catch (error) {
      console.error('Failed to update network data:', error);
    }
  };

  const handleAgentActivation = (agentName) => {
    console.log(`Agent activated: ${agentName}`);
    updateNetworkData();
  };

  const handleWorkflowComplete = (result) => {
    console.log('Workflow completed:', result);
    updateNetworkData();
  };

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto text-text-main">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-main pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-main flex items-center gap-2">
            <FaRobot className="text-primary" />
            Studio Mode
          </h1>
          <p className="text-text-sub mt-1 text-sm md:text-base">Orchestrate and debug agent-to-agent collaboration in real-time.</p>
        </div>
        
        {/* Toggle Workspace / Communication */}
        <div className="flex items-center bg-bg-panel border border-border-main rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setActiveView('workspace')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors ${
              activeView === 'workspace' 
                ? 'bg-primary text-white' 
                : 'text-text-sub hover:text-text-main'
            }`}
          >
            Workspace
          </button>
          <button
            onClick={() => setActiveView('communication')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors ${
              activeView === 'communication' 
                ? 'bg-primary text-white' 
                : 'text-text-sub hover:text-text-main'
            }`}
          >
            Communication Network
          </button>
        </div>
      </div>

      {activeView === 'workspace' ? (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7" style={{ marginTop: '36px', marginBottom: '36px' }}>
            <div className="crm-card flex items-center gap-4">
              <div className="p-3 bg-bg-panel border border-border-main rounded-lg text-lg text-primary">
                <FaRobot />
              </div>
              <div>
                <span className="text-sm font-medium text-text-sub">Total Agents</span>
                <h3 className="text-2xl font-bold text-text-main mt-0.5">{networkStats?.totalAgents || 0}</h3>
              </div>
            </div>
            
            <div className="crm-card flex items-center gap-4">
              <div className="p-3 bg-bg-panel border border-border-main rounded-lg text-lg text-primary">
                <FaExchangeAlt />
              </div>
              <div>
                <span className="text-sm font-medium text-text-sub">Active Rooms</span>
                <h3 className="text-2xl font-bold text-text-main mt-0.5">{networkStats?.activeCollaborations || 0}</h3>
              </div>
            </div>
            
            <div className="crm-card flex items-center gap-4">
              <div className="p-3 bg-bg-panel border border-border-main rounded-lg text-lg text-primary">
                <FaChartLine />
              </div>
              <div>
                <span className="text-sm font-medium text-text-sub">Tasks Completed</span>
                <h3 className="text-2xl font-bold text-text-main mt-0.5">{networkStats?.completedTasks || 0}</h3>
              </div>
            </div>
            
            <div className="crm-card flex items-center gap-4">
              <div className="p-3 bg-bg-panel border border-border-main rounded-lg text-lg text-primary">
                <FaHistory />
              </div>
              <div>
                <span className="text-sm font-medium text-text-sub">Total Messages</span>
                <h3 className="text-2xl font-bold text-text-main mt-0.5">{networkStats?.totalMessages || 0}</h3>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{ marginTop: '36px' }}>
            {/* Left: Smart Workflow Section */}
            <div className="lg:col-span-2">
              <div className="crm-card h-full">
                <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
                  <FaPlay className="text-primary" />
                  Smart AI Orchestration
                </h2>
                <StudioModeAgentCommunication 
                  onAgentActivation={handleAgentActivation}
                  onWorkflowComplete={handleWorkflowComplete}
                />
              </div>
            </div>
            
            {/* Right: Available Agents */}
            <div className="lg:col-span-1">
              <div className="crm-card h-full">
                <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
                  <FaRobot className="text-primary" />
                  Available Workers
                </h2>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {availableAgents.length > 0 ? (
                    availableAgents.map((agent, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-bg-panel border border-border-main rounded-lg">
                        <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-sm">
                          {agent.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-text-main truncate text-sm">{agent.name}</div>
                          <div className="text-xs text-text-sub truncate">{agent.role}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-text-muted">
                      <FaRobot className="mx-auto text-2xl mb-2" />
                      <p className="text-xs">No agents available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="crm-card">
            <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
              <FaHistory className="text-primary" />
              Collaboration Stream
            </h2>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {recentMessages.length > 0 ? (
                recentMessages.map((msg, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border-b border-border-main last:border-0 hover:bg-bg-panel/50 rounded transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-bold shrink-0">
                      {msg.from.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-text-main text-sm">{msg.from} &rarr; {msg.to}</div>
                      <div className="text-xs text-text-sub mt-0.5 leading-relaxed">{msg.message}</div>
                      <div className="text-[10px] text-text-muted mt-1.5">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      msg.status === 'delivered' 
                        ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' 
                        : msg.status === 'failed' 
                          ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' 
                          : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
                    }`}>
                      {msg.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-text-muted">
                  <FaHistory className="mx-auto text-2xl mb-2" />
                  <p className="text-xs">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="crm-card">
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setActiveView('workspace')}
              className="crm-btn crm-btn-secondary text-xs py-1.5 px-3"
            >
              <FaArrowLeft /> Back to Workspace
            </button>
            <h2 className="text-xl font-bold text-text-main">Agent Communication Network</h2>
          </div>
          <StudioModeIntegration 
            onAgentActivation={handleAgentActivation}
            onWorkflowComplete={handleWorkflowComplete}
          />
        </div>
      )}
    </div>
  );
};

export default StudioMode;
