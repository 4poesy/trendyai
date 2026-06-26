import React, { useState, useEffect } from 'react';
import { FaExchangeAlt, FaRobot, FaChartLine, FaCog, FaPlay, FaStop, FaHistory } from 'react-icons/fa';
import { globalAgentRoutingSystem } from '../utils/agentRoutingSystem';

const StudioModeIntegration = ({ onAgentActivation, onWorkflowComplete }) => {
  const [routingStats, setRoutingStats] = useState(null);
  const [recentRoutings, setRecentRoutings] = useState([]);
  const [activeConnections] = useState([]);
  const [systemStatus, setSystemStatus] = useState('idle');

  useEffect(() => {
    // Update routing stats every 5 seconds
    const interval = setInterval(() => {
      const stats = globalAgentRoutingSystem.getRoutingStats();
      setRoutingStats(stats);
      setRecentRoutings(stats.recentRoutings);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Listen for routing events
  useEffect(() => {
    // Add event listener (this would be implemented in the routing system)
    // globalAgentRoutingSystem.addEventListener('routing_event', (event) => {
    //   if (event.type === 'routing_started') {
    //     setSystemStatus('routing');
    //     setActiveConnections(prev => [...prev, event.connection]);
    //   } else if (event.type === 'routing_completed') {
    //     setSystemStatus('idle');
    //     setActiveConnections(prev => prev.filter(conn => conn.id !== event.connection.id));
    //     if (onWorkflowComplete) {
    //       onWorkflowComplete(event.result);
    //     }
    //   }
    // });

    return () => {
      // Remove event listener
      // globalAgentRoutingSystem.removeEventListener('routing_event', handleRoutingEvent);
    };
  }, [onWorkflowComplete]);

  const getAgentMapping = () => {
    return globalAgentRoutingSystem.getAgentMapping();
  };

  const testRouting = async (agentGridId, testMessage) => {
    try {
      setSystemStatus('testing');
      const result = await globalAgentRoutingSystem.routeToStudioMode(agentGridId, testMessage, {
        sourceComponent: 'studio-integration',
        testMode: true
      });
      
      if (result.success && onAgentActivation) {
        onAgentActivation(result.targetAgent);
      }
      
      return result;
    } catch (error) {
      console.error('Test routing failed:', error);
      return { success: false, error: error.message };
    } finally {
      setSystemStatus('idle');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-cyan-500 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaExchangeAlt className="text-2xl text-cyan-500" />
          <div>
            <h3 className="text-lg font-bold text-navy-900">
              StudioMode Integration
            </h3>
            <p className="text-sm text-navy-900/70">
              AgentGrid ↔ StudioMode Routing System
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          systemStatus === 'idle' ? 'bg-green-950/40 text-green-400 border-green-800/30' :
          systemStatus === 'routing' ? 'bg-blue-950/40 text-blue-400 border-blue-800/30' :
          systemStatus === 'testing' ? 'bg-brand-cyan-soft text-brand-cyan border-brand-cyan/20' :
          'bg-gray-900 text-gray-400 border-gray-800'
        }`}>
          {systemStatus === 'idle' && '🟢 Ready'}
          {systemStatus === 'routing' && '🔄 Routing'}
          {systemStatus === 'testing' && '🧪 Testing'}
        </div>
      </div>

      {/* Routing Statistics */}
      {routingStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-cyan-50 rounded-lg p-4 text-center border border-cyan-200">
            <div className="text-2xl font-bold text-cyan-600">{routingStats.totalRoutings}</div>
            <div className="text-xs text-cyan-600">Total Routings</div>
          </div>
          <div className="bg-cyan-50 rounded-lg p-4 text-center border border-cyan-200">
            <div className="text-2xl font-bold text-cyan-600">{routingStats.successRate.toFixed(1)}%</div>
            <div className="text-xs text-cyan-600">Success Rate</div>
          </div>
          <div className="bg-cyan-50 rounded-lg p-4 text-center border border-cyan-200">
            <div className="text-2xl font-bold text-cyan-600">{routingStats.averageResponseTime.toFixed(0)}ms</div>
            <div className="text-xs text-cyan-600">Avg Response</div>
          </div>
          <div className="bg-cyan-50 rounded-lg p-4 text-center border border-cyan-200">
            <div className="text-2xl font-bold text-cyan-600">{activeConnections.length}</div>
            <div className="text-xs text-cyan-600">Active</div>
          </div>
        </div>
      )}

      {/* Agent Mapping Display */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-navy-900 mb-3 flex items-center gap-2">
          <FaRobot className="text-cyan-500" />
          Agent Mappings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
            <h5 className="text-xs font-semibold text-cyan-600 mb-2">AgentGrid → StudioMode</h5>
            <div className="space-y-1">
              {Object.entries(getAgentMapping().agentGridToStudio).slice(0, 5).map(([gridId, studioName]) => (
                <div key={gridId} className="flex items-center justify-between text-xs">
                  <span className="text-navy-900">{gridId}</span>
                  <FaExchangeAlt className="text-cyan-500 text-xs" />
                  <span className="text-cyan-600">{studioName}</span>
                </div>
              ))}
              {Object.keys(getAgentMapping().agentGridToStudio).length > 5 && (
                <div className="text-xs text-navy-900/50 text-center">+{Object.keys(getAgentMapping().agentGridToStudio).length - 5} more</div>
              )}
            </div>
          </div>
          <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
            <h5 className="text-xs font-semibold text-cyan-600 mb-2">StudioMode → AgentGrid</h5>
            <div className="space-y-1">
              {Object.entries(getAgentMapping().studioToAgentGrid).slice(0, 5).map(([studioName, gridId]) => (
                <div key={studioName} className="flex items-center justify-between text-xs">
                  <span className="text-navy-900">{studioName}</span>
                  <FaExchangeAlt className="text-cyan-500 text-xs" />
                  <span className="text-cyan-600">{gridId}</span>
                </div>
              ))}
              {Object.keys(getAgentMapping().studioToAgentGrid).length > 5 && (
                <div className="text-xs text-navy-900/50 text-center">+{Object.keys(getAgentMapping().studioToAgentGrid).length - 5} more</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Routings */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-navy-900 mb-3 flex items-center gap-2">
          <FaHistory className="text-cyan-500" />
          Recent Routings
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {recentRoutings.length > 0 ? (
            recentRoutings.map((routing, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg text-xs ${
                routing.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    routing.success ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-medium text-navy-900">
                    {routing.sourceAgentId} → {routing.targetAgent}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-navy-900/50">
                  <span>{routing.responseTime}ms</span>
                  <span>{routing.workflow || 'direct'}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-navy-900/50 text-sm py-4">
              No recent routings
            </div>
          )}
        </div>
      </div>

      {/* Test Routing */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-navy-900 mb-3 flex items-center gap-2">
          <FaCog className="text-cyan-500" />
          Test Routing
        </h4>
        <div className="space-y-3">
          <div className="flex gap-2">
            <select className="flex-1 px-3 py-2 border border-cyan-500 rounded-lg text-sm bg-white text-navy-900">
              <option value="">Select AgentGrid Agent</option>
              {Object.keys(getAgentMapping().agentGridToStudio).map(agentId => (
                <option key={agentId} value={agentId}>{agentId}</option>
              ))}
            </select>
            <button
              onClick={() => testRouting('trendyai-core', 'Create a professional logo design')}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-navy-900 rounded-lg text-sm font-semibold transition-colors"
            >
              Test
            </button>
          </div>
          <div className="text-xs text-navy-900/50">
            Test the routing system with a sample request
          </div>
        </div>
      </div>

      {/* Active Connections */}
      {activeConnections.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-navy-900 mb-3 flex items-center gap-2">
            <FaPlay className="text-cyan-500" />
            Active Connections
          </h4>
          <div className="space-y-2">
            {activeConnections.map((connection, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-navy-900">
                    {connection.sourceAgentId} → {connection.targetAgent}
                  </span>
                </div>
                <span className="text-xs text-blue-600">{connection.workflow}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudioModeIntegration; 
