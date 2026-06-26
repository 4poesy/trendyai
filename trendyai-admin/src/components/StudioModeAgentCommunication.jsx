import React, { useState } from 'react';
import { FaRobot, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { studioModeAgentUtils } from '../utils/studioModeAgentCommunication';
import { findBestAgentsForPrompt } from '../utils/agentUtils';

const StudioModeAgentCommunication = ({ onBackToWorkspace }) => {
  const [userPrompt, setUserPrompt] = useState('');
  const [workflowStatus, setWorkflowStatus] = useState('idle');
  const [workflowStep, setWorkflowStep] = useState(0);
  const [workflowResult, setWorkflowResult] = useState(null);

  const handleSmartWorkflow = async () => {
    if (!userPrompt.trim()) return;
    setWorkflowStatus('running');
    setWorkflowStep(1);
    setWorkflowResult(null);
    try {
      // Step 1: Core → Promptify
      setWorkflowStep(1);
      const promptifyResult = await studioModeAgentUtils.assignTask(
        'TrendyAI Core',
        'Promptify',
        userPrompt,
        'normal'
      );
      if (promptifyResult.status !== 'completed') throw new Error('Promptify failed: ' + (promptifyResult.error || ''));
      
      // Step 2: Promptify → Core (verify)
      setWorkflowStep(2);
      const improvedPrompt = promptifyResult.result?.content || promptifyResult.result;
      const verificationResult = await studioModeAgentUtils.assignTask(
        'Promptify',
        'TrendyAI Core',
        improvedPrompt
      );
      if (verificationResult.status !== 'completed') throw new Error('Verification failed: ' + (verificationResult.error || ''));
      
      // Step 3: Core → Best Agent (auto-select)
      setWorkflowStep(3);
      const bestAgents = findBestAgentsForPrompt(improvedPrompt);
      const bestAgent = bestAgents.find(a => a !== 'TrendyAI Core' && a !== 'Promptify') || bestAgents[0];
      if (!bestAgent) throw new Error('No suitable agent found for this task.');
      const finalResult = await studioModeAgentUtils.assignTask(
        'TrendyAI Core',
        bestAgent,
        improvedPrompt
      );
      if (finalResult.status !== 'completed') throw new Error('Final agent failed: ' + (finalResult.error || ''));
      
      // Step 4: Best Agent → Core (review)
      setWorkflowStep(4);
      const reviewResult = await studioModeAgentUtils.assignTask(
        bestAgent,
        'TrendyAI Core',
        finalResult.result?.content || finalResult.result
      );
      if (reviewResult.status !== 'completed') throw new Error('Final review failed: ' + (reviewResult.error || ''));
      
      setWorkflowResult(reviewResult);
      setWorkflowStatus('done');
      setWorkflowStep(5);
      setUserPrompt('');
    } catch (err) {
      setWorkflowStatus('error');
      setWorkflowResult(err.message);
    }
  };

  return (
    <div className="w-full flex flex-col">
      {onBackToWorkspace && (
        <button
          onClick={onBackToWorkspace}
          className="crm-btn crm-btn-secondary text-xs mb-4 self-start"
        >
          <FaArrowLeft /> Back to Workspace
        </button>
      )}
      
      <div className="space-y-4 w-full">
        <p className="text-xs text-text-sub">
          Provide a high-level task. The TrendyAI orchestration system will automatically optimize your instructions, select the optimal agent, execute the steps, and audit the output.
        </p>
        
        <div className="flex flex-col gap-3">
          <textarea
            value={userPrompt}
            onChange={e => setUserPrompt(e.target.value)}
            placeholder="Describe what you want TrendyAI to do..."
            className="crm-input resize-none min-h-[90px]"
            rows="3"
            disabled={workflowStatus === 'running'}
          />
          <button
            onClick={handleSmartWorkflow}
            disabled={!userPrompt.trim() || workflowStatus === 'running'}
            className="crm-btn crm-btn-primary w-full py-2.5 flex items-center justify-center gap-2"
          >
            {workflowStatus === 'running' && <FaSpinner className="animate-spin text-white" />}
            {workflowStatus === 'running' ? 'Executing Orchestration Flow...' : 'Start Smart Workflow'}
          </button>
        </div>

        {/* Progress Pipeline */}
        {workflowStatus === 'running' && (
          <div className="p-4 bg-bg-panel border border-border-main rounded-lg space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Workflow Pipeline Progress</div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className={`px-2 py-0.5 rounded ${workflowStep >= 1 ? 'bg-primary text-white font-semibold' : 'bg-bg-card border border-border-main text-text-sub'}`}>1. Promptify</span>
              <span className="text-text-muted">&rarr;</span>
              <span className={`px-2 py-0.5 rounded ${workflowStep >= 2 ? 'bg-primary text-white font-semibold' : 'bg-bg-card border border-border-main text-text-sub'}`}>2. Verification</span>
              <span className="text-text-muted">&rarr;</span>
              <span className={`px-2 py-0.5 rounded ${workflowStep >= 3 ? 'bg-primary text-white font-semibold' : 'bg-bg-card border border-border-main text-text-sub'}`}>3. Execution</span>
              <span className="text-text-muted">&rarr;</span>
              <span className={`px-2 py-0.5 rounded ${workflowStep >= 4 ? 'bg-primary text-white font-semibold' : 'bg-bg-card border border-border-main text-text-sub'}`}>4. Audit Review</span>
            </div>
          </div>
        )}

        {/* Output Area */}
        {workflowStatus === 'done' && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-text-main mt-4">
            <div className="font-bold text-green-600 dark:text-green-400 mb-1">Workflow Complete:</div>
            <pre className="mt-2 break-words whitespace-pre-wrap font-mono bg-bg-panel p-3 border border-border-main rounded max-h-48 overflow-y-auto">
              {workflowResult?.result?.content || workflowResult?.result || JSON.stringify(workflowResult)}
            </pre>
          </div>
        )}

        {workflowStatus === 'error' && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-600 dark:text-red-400 font-semibold mt-4">
            Orchestration Error: {workflowResult}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioModeAgentCommunication;
