import React, { useState, useEffect } from 'react';
import { initializeAgentTraining, globalAgentTrainingSystem } from '../utils/agentTrainingSystem';
import { FaGraduationCap, FaRobot, FaCheckCircle, FaStar, FaLightbulb, FaSync } from 'react-icons/fa';
import { useToast } from './Toast';

const AgentTrainingDashboard = () => {
  const { showSuccess, showInfo } = useToast();
  const [trainingStatus, setTrainingStatus] = useState('idle');
  const [trainedAgents, setTrainedAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [trainingReport, setTrainingReport] = useState(null);

  useEffect(() => {
    initializeTrainingSystem();
  }, []);

  const initializeTrainingSystem = async () => {
    setTrainingStatus('initializing');
    try {
      const system = initializeAgentTraining();
      const agents = Array.from(system.trainedAgents.values());
      setTrainedAgents(agents);
      setTrainingStatus('ready');
      
      const report = system.getTrainingReport();
      setTrainingReport(report);
    } catch (error) {
      console.error('Training initialization failed:', error);
      setTrainingStatus('error');
    }
  };

  const retrainAgent = async (agentName) => {
    setTrainingStatus('training');
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const agent = globalAgentTrainingSystem.trainAgent(agentName);
      setTrainedAgents(prev => 
        prev.map(a => a.name === agentName ? agent : a)
      );
      setTrainingStatus('ready');
      showSuccess(`Worker ${agentName} retrained successfully!`);
    } catch (error) {
      console.error(`Failed to retrain ${agentName}:`, error);
      setTrainingStatus('error');
    }
  };

  const retrainAllAgents = async () => {
    setTrainingStatus('training');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const agents = globalAgentTrainingSystem.trainAllAgents();
      setTrainedAgents(agents);
      setTrainingStatus('ready');
      
      const report = globalAgentTrainingSystem.getTrainingReport();
      setTrainingReport(report);
      showSuccess('All agents retrained and guidelines updated.');
    } catch (error) {
      console.error('Retraining failed:', error);
      setTrainingStatus('error');
    }
  };

  const getAgentStatusColor = (agent) => {
    if (agent.performance.successRate >= 0.9) return 'text-green-500';
    if (agent.performance.successRate >= 0.7) return 'text-cyan-400';
    return 'text-red-500';
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-main pb-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-main flex items-center gap-2">
            <FaGraduationCap className="text-primary" />
            Agent Training Center
          </h1>
          <p className="text-text-sub mt-1 text-sm md:text-base">Fine-tune system guidelines, view worker success rates, and resolve prompt alignment conflicts.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`badge ${
            trainingStatus === 'ready' 
              ? 'badge-success' 
              : trainingStatus === 'training' 
              ? 'badge-warning' 
              : 'badge-info'
          }`}>
            Status: {trainingStatus}
          </span>
          <button
            onClick={retrainAllAgents}
            disabled={trainingStatus === 'training'}
            className="crm-btn crm-btn-primary flex items-center gap-2 py-2 text-sm"
          >
            <FaSync className={trainingStatus === 'training' ? 'animate-spin' : ''} />
            Retrain All Workers
          </button>
        </div>
      </div>

      {/* Training Overview */}
      {trainingReport && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10 mb-12">
          <div className="crm-card">
            <span className="text-sm font-semibold uppercase tracking-wider text-text-sub">Trained Workers</span>
            <h3 className="text-3xl font-bold text-text-main mt-2">{trainingReport.totalAgents}</h3>
          </div>
          <div className="crm-card">
            <span className="text-sm font-semibold uppercase tracking-wider text-text-sub">Avg Success Rate</span>
            <h3 className="text-3xl font-bold text-text-main mt-2 text-green-500">
              {((trainingReport.performanceMetrics.reduce((sum, m) => sum + m.successRate, 0) / trainingReport.performanceMetrics.length) * 100).toFixed(1)}%
            </h3>
          </div>
          <div className="crm-card">
            <span className="text-sm font-semibold uppercase tracking-wider text-text-sub">User Satisfaction</span>
            <h3 className="text-3xl font-bold text-text-main mt-2 text-primary">
              {((trainingReport.performanceMetrics.reduce((sum, m) => sum + m.userSatisfaction, 0) / trainingReport.performanceMetrics.length) * 100).toFixed(1)}%
            </h3>
          </div>
          <div className="crm-card">
            <span className="text-sm font-semibold uppercase tracking-wider text-text-sub">Recommendations</span>
            <h3 className="text-3xl font-bold text-text-main mt-2 text-cyan-400">{trainingReport.recommendations.length}</h3>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left List: Trained Agents */}
        <div className="lg:col-span-2 crm-card">
          <h2 className="text-xl font-bold text-text-main mb-6 border-b border-border-main pb-3">Training Status Overview</h2>
          <div className="overflow-x-auto">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Worker Name</th>
                  <th>Role Scope</th>
                  <th>Success Rate</th>
                  <th>Satisfaction</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trainedAgents.map((agent) => (
                  <tr 
                    key={agent.name} 
                    className={`cursor-pointer ${selectedAgent?.name === agent.name ? 'bg-bg-panel' : ''}`}
                    onClick={() => { setSelectedAgent(agent); showInfo(`Selected ${agent.name}`); }}
                  >
                    <td className="font-bold flex items-center gap-2">
                      <FaRobot className="text-primary text-sm" />
                      {agent.name}
                    </td>
                    <td><span className="text-xs text-text-sub font-medium">{agent.role}</span></td>
                    <td className={`font-semibold ${getAgentStatusColor(agent)}`}>
                      {(agent.performance.successRate * 100).toFixed(0)}%
                    </td>
                    <td className="font-semibold text-text-main">
                      {(agent.performance.userSatisfaction * 100).toFixed(0)}%
                    </td>
                    <td>
                      <button 
                        onClick={(e) => { e.stopPropagation(); retrainAgent(agent.name); }}
                        className="crm-btn crm-btn-secondary py-1 px-2.5 text-xs"
                      >
                        Retrain
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="space-y-6">
          {selectedAgent ? (
            <div className="crm-card">
              <div className="flex items-center gap-3 border-b border-border-main pb-4 mb-4">
                <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  {selectedAgent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-text-main text-base">{selectedAgent.name}</h3>
                  <p className="text-xs text-text-muted capitalize">{selectedAgent.role}</p>
                </div>
              </div>

              <div className="space-y-4 text-xs md:text-sm">
                <div>
                  <span className="text-text-muted font-bold uppercase tracking-wider text-[10px]">Trained Guidelines:</span>
                  <ul className="list-disc pl-4 mt-2 space-y-1.5 text-text-sub font-medium">
                    {selectedAgent.guidelines && selectedAgent.guidelines.map((g, idx) => (
                      <li key={idx}>{g}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-3 border-t border-border-main/50">
                  <span className="text-text-muted font-bold uppercase tracking-wider text-[10px] block mb-2">Prompt Embeddings Code:</span>
                  <pre className="text-[10px] font-mono bg-bg-panel border border-border-main px-3 py-2 rounded text-text-sub overflow-x-auto whitespace-pre-wrap">
                    {selectedAgent.systemPrompt}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="crm-card text-center py-10 text-text-muted">
              <FaRobot className="mx-auto text-3xl mb-3" />
              <p className="text-xs">Click a worker row to view fine-tuned rules and prompt embeddings.</p>
            </div>
          )}

          {/* Recommendations Block */}
          {trainingReport && (
            <div className="crm-card">
              <h3 className="font-bold text-text-main mb-4 flex items-center gap-1.5 text-base">
                <FaLightbulb className="text-cyan-400" />
                Training Suggestions
              </h3>
              <div className="space-y-3">
                {trainingReport.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3 bg-bg-panel border border-border-main rounded text-xs text-text-sub leading-relaxed font-semibold">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentTrainingDashboard;
