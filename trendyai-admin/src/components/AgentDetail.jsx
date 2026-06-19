import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiCpu, FiUsers, FiTarget, FiBarChart2,
  FiPenTool, FiImage, FiCode, FiVideo,
  FiArrowLeft, FiSend, FiRefreshCw,
} from 'react-icons/fi';
import { globalAgentTrainingSystem } from '../utils/agentTrainingSystem';
import { useToast } from './Toast';
import supabase from '../utils/supabaseClient';
import ChatBox from './ChatBox';

/* ─── AGENT REGISTRY ─────────────────────────────────────── */
const AGENTS = {
  'trendyai-core': {
    id: 'trendyai-core',
    name: 'TrendyAI Core',
    description: 'Central orchestrator — decomposes tasks, routes to agents, manages human approval gates, and ensures project state sync across the full pipeline.',
    iconBg: 'rgba(250,204,21,0.12)',
    iconColor: '#facc15',
    Icon: FiCpu,
    tags: ['Smart Routing', 'PM', 'State Sync'],
    capabilities: [
      'Project decomposition and task assignment',
      'Smart agent routing based on complexity',
      'Human approval gate management',
      'Multi-agent workflow coordination',
      'Real-time state synchronisation',
    ],
    chatFlow: ['ClientFlow', 'StratoBoss', 'PulsePilot'],
  },
  'clientflow': {
    id: 'clientflow',
    name: 'ClientFlow',
    description: 'Acquires leads, qualifies briefs, and manages CRM pipelines end-to-end — from first contact to onboarding and retention alerts.',
    iconBg: 'rgba(29,158,117,0.12)',
    iconColor: '#1D9E75',
    Icon: FiUsers,
    tags: ['CRM', 'Onboarding', 'Retention'],
    capabilities: [
      'Lead acquisition and qualification',
      'Client brief parsing into structured variables',
      'CRM pipeline management',
      'Onboarding automation',
      'Retention alert generation',
    ],
    chatFlow: ['TrendyAI Core', 'ContentSmith', 'StratoBoss'],
  },
  'stratoboss': {
    id: 'stratoboss',
    name: 'StratoBoss',
    description: 'Conducts market analysis, competitor sweeps, SEO audits, keyword lookups, and trend forecasts to power informed strategy decisions.',
    iconBg: 'rgba(55,138,221,0.12)',
    iconColor: '#378ADD',
    Icon: FiTarget,
    tags: ['SEO Audit', 'SWOT', 'Forecasting'],
    capabilities: [
      'Market analysis and competitor research',
      'SEO audit and keyword mapping',
      'Trend forecasting',
      'SWOT analysis generation',
      'Strategic report output',
    ],
    chatFlow: ['ContentSmith', 'PulsePilot', 'TrendyAI Core'],
  },
  'pulsepilot': {
    id: 'pulsepilot',
    name: 'PulsePilot',
    description: 'Deploys paid ads on Meta and Google, schedules social media posts, manages YouTube metadata, and tracks ad spend in real time.',
    iconBg: 'rgba(250,204,21,0.12)',
    iconColor: '#facc15',
    Icon: FiBarChart2,
    tags: ['Meta/Google Ads', 'Spend', 'Publishing'],
    capabilities: [
      'Paid ad campaign deployment (Meta, Google)',
      'Social media scheduling and publishing',
      'Real-time ad spend tracking',
      'YouTube video metadata management',
      'Budget optimisation recommendations',
    ],
    chatFlow: ['StratoBoss', 'TrendyAI Core', 'PixelDex'],
  },
  'contentsmith': {
    id: 'contentsmith',
    name: 'ContentSmith',
    description: 'Creative specialist adapting dynamically — Copywriter, Blogger, Ghostwriter, Book Writer — with active tone matching and clarifying questions.',
    iconBg: 'rgba(216,90,48,0.12)',
    iconColor: '#D85A30',
    Icon: FiPenTool,
    tags: ['Copywriting', 'Blogging', 'Ghostwriting'],
    capabilities: [
      'Multi-persona content creation',
      'Ad copy and email campaign writing',
      'Blog posts and long-form articles',
      'Book and course script generation',
      'Active tone matching across formats',
    ],
    chatFlow: ['PixelDex', 'StratoBoss', 'TrendyAI Core'],
  },
  'pixeldex': {
    id: 'pixeldex',
    name: 'PixelDex',
    description: 'Visual designer crafting logos, brand guides, social media banners, ad graphics, and formatting ebook layouts.',
    iconBg: 'rgba(55,138,221,0.12)',
    iconColor: '#378ADD',
    Icon: FiImage,
    tags: ['Branding', 'Social Design', 'Ebooks'],
    capabilities: [
      'Logo and brand identity design',
      'Social media banner and ad graphics',
      'Ebook layout and cover design',
      'Typography and colour palette systems',
      'Design system documentation',
    ],
    chatFlow: ['ContentSmith', 'MediaWiz', 'TrendyAI Core'],
  },
  'webwiz': {
    id: 'webwiz',
    name: 'WebWiz',
    description: 'Designs UI layouts, generates React/HTML frontend code, connects CMS publishing, integrates Paystack, and monitors site uptime.',
    iconBg: 'rgba(29,158,117,0.12)',
    iconColor: '#1D9E75',
    Icon: FiCode,
    tags: ['Next.js', 'Paystack', 'CMS'],
    capabilities: [
      'React and HTML/CSS UI development',
      'CMS integration and publishing automation',
      'Paystack and payment gateway setup',
      'Uptime monitoring and alert management',
      'Wireframe and component design',
    ],
    chatFlow: ['MediaWiz', 'PixelDex', 'TrendyAI Core'],
  },
  'mediawiz': {
    id: 'mediawiz',
    name: 'MediaWiz',
    description: 'Full video pipeline — scripts, storyboards, Shorts/Reels editing direction, voiceovers, backing audio, and music curation.',
    iconBg: 'rgba(216,90,48,0.12)',
    iconColor: '#D85A30',
    Icon: FiVideo,
    tags: ['Reels', 'Voiceover', 'Afrobeats'],
    capabilities: [
      'Video script and storyboard generation',
      'Shorts and Reels editing direction',
      'Voiceover recording and direction',
      'Backing audio and music curation',
      'Sound design integration',
    ],
    chatFlow: ['WebWiz', 'PixelDex', 'TrendyAI Core'],
  },
};

/* ─── METRIC ROW ─────────────────────────────────────────── */
const MetricRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1e1e1e' }}>
    <span style={{ fontSize: 12, color: '#666' }}>{label}</span>
    <span style={{ fontSize: 12, fontWeight: 600, color: value === '—' ? '#555' : '#f0f0f0' }}>{value}</span>
  </div>
);

/* ─── AGENT DETAIL PAGE ──────────────────────────────────── */
const AgentDetail = () => {
  const { agentId }   = useParams();
  const navigate      = useNavigate();
  const { showSuccess, showInfo } = useToast();

  const agent = AGENTS[agentId];

  const [promptValue,      setPromptValue]      = useState('');
  const [retraining,       setRetraining]       = useState(false);
  const [chatKey,          setChatKey]          = useState(0);
  const [metrics,          setMetrics]          = useState({ uptime: '—', successRate: '—', response: '—', tasks: '—' });

  /* Load agent training data for prompt */
  useEffect(() => {
    if (!agent) return;
    const data = globalAgentTrainingSystem.getAgentTrainingData(agent.name);
    setPromptValue(data?.behavior || agent.description);
  }, [agent]);

  /* Fetch real metrics from Supabase */
  const fetchMetrics = useCallback(async () => {
    if (!supabase || !agent) return;
    try {
      const { data } = await supabase
        .from('agent_metrics')
        .select('uptime, success_rate, avg_response_ms, tasks_completed')
        .eq('agent_id', agent.id)
        .single();
      if (data) {
        setMetrics({
          uptime:       data.uptime       != null ? `${data.uptime}%`         : '—',
          successRate:  data.success_rate != null ? `${data.success_rate}%`   : '—',
          response:     data.avg_response_ms != null ? `${data.avg_response_ms}ms` : '—',
          tasks:        data.tasks_completed != null ? data.tasks_completed    : '—',
        });
      }
    } catch (_) { /* stay as — */ }
  }, [agent]);

  useEffect(() => { fetchMetrics(); }, [fetchMetrics]);

  const handleSavePrompt = () => {
    const data = globalAgentTrainingSystem.getAgentTrainingData(agent.name);
    if (data) data.behavior = promptValue;
    showSuccess(`Custom prompt saved for ${agent.name}`);
  };

  const handleRetrain = async () => {
    setRetraining(true);
    await new Promise(r => setTimeout(r, 1500));
    globalAgentTrainingSystem.trainAgent(agent.name);
    setRetraining(false);
    showSuccess(`${agent.name} guidelines compiled and synced!`);
  };

  /* ── Not found ── */
  if (!agent) {
    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 0', textAlign: 'center' }}>
        <p style={{ color: '#555', fontSize: 14 }}>Agent not found.</p>
        <button
          onClick={() => navigate('/agent-grid')}
          style={{ marginTop: 16, color: '#facc15', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}
        >
          ← Back to Agent Grid
        </button>
      </div>
    );
  }

  const { Icon } = agent;

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }} className="animate-fadeIn">

      {/* ── Back navigation ── */}
      <button
        onClick={() => navigate('/agent-grid')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none',
          color: '#555', fontSize: 12, fontWeight: 500,
          cursor: 'pointer', marginBottom: 24,
          transition: 'color 0.15s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#facc15'}
        onMouseLeave={e => e.currentTarget.style.color = '#555'}
      >
        <FiArrowLeft size={13} /> Back to Agent Grid
      </button>

      {/* ── Two-column layout ── */}
      <div className="crm-detail-grid" style={{ minHeight: 'calc(100vh - 180px)' }}>

        {/* ════════════════════════════════════
            LEFT COLUMN — Info & Config
        ════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Agent identity */}
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, padding: '28px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
              {/* Large icon */}
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: agent.iconBg, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={24} style={{ color: agent.iconColor }} />
              </div>
              <div>
                <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, color: '#f5f5f5', lineHeight: 1.2, marginBottom: 6 }}>
                  {agent.name}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1D9E75', display: 'inline-block' }} />
                  <span style={{ fontSize: 11, color: '#1D9E75', fontWeight: 600 }}>Active</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#888', lineHeight: 1.7 }}>
              {agent.description}
            </p>
          </div>

          {/* Performance metrics */}
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, padding: '28px 32px' }}>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#facc15', marginBottom: 16 }}>
              Performance
            </p>
            <MetricRow label="Uptime"        value={metrics.uptime} />
            <MetricRow label="Success Rate"  value={metrics.successRate} />
            <MetricRow label="Response"      value={metrics.response} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12 }}>
              <span style={{ fontSize: 13, color: '#888' }}>Tasks Completed</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: metrics.tasks === '—' ? '#555' : '#f5f5f5' }}>{metrics.tasks}</span>
            </div>
          </div>

          {/* Capabilities */}
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, padding: '28px 32px' }}>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#facc15', marginBottom: 16 }}>
              Capabilities
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {agent.capabilities.map((cap, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#888', lineHeight: 1.6 }}>
                  <span style={{ color: agent.iconColor, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>•</span>
                  {cap}
                </li>
              ))}
            </ul>
          </div>

          {/* Custom Prompt */}
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, padding: '28px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#facc15' }}>
                Custom Prompt
              </p>
              <span style={{
                fontSize: 9, color: '#555', border: '1px solid #2a2a2a',
                borderRadius: 4, padding: '2px 6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                Writable
              </span>
            </div>
            <textarea
              value={promptValue}
              onChange={e => setPromptValue(e.target.value)}
              rows={5}
              style={{
                width: '100%', padding: '12px 14px',
                background: '#111', border: '1px solid #2a2a2a',
                borderRadius: 8, color: '#f0f0f0', fontSize: 12,
                fontFamily: 'monospace', lineHeight: 1.6, resize: 'vertical',
                outline: 'none', transition: 'border-color 0.15s ease',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(250,204,21,0.4)'}
              onBlur={e => e.target.style.borderColor = '#2a2a2a'}
              placeholder="Edit custom system instructions here…"
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button
                onClick={handleSavePrompt}
                style={{
                  flex: 1, padding: '10px 0', background: '#facc15', color: '#111',
                  border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#eab308'}
                onMouseLeave={e => e.currentTarget.style.background = '#facc15'}
              >
                Save Prompt
              </button>
              <button
                onClick={handleRetrain}
                disabled={retraining}
                style={{
                  padding: '10px 18px',
                  background: 'none', color: '#555',
                  border: '1px solid #2a2a2a', borderRadius: 8,
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'all 0.15s ease', opacity: retraining ? 0.5 : 1,
                }}
                onMouseEnter={e => { if (!retraining) { e.currentTarget.style.borderColor = 'rgba(250,204,21,0.4)'; e.currentTarget.style.color = '#facc15'; } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#555'; }}
              >
                <FiRefreshCw size={11} style={{ animation: retraining ? 'spin 1s linear infinite' : 'none' }} />
                {retraining ? 'Syncing…' : 'Retrain'}
              </button>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════
            RIGHT COLUMN — Playground
        ════════════════════════════════════ */}
        <div style={{
          background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12,
          display: 'flex', flexDirection: 'column',
          height: 'calc(100vh - 120px)', overflow: 'hidden',
          position: 'sticky', top: 24,
        }}>

          {/* Playground header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', borderBottom: '1px solid #2a2a2a', flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#facc15', display: 'inline-block' }} className="animate-pulse" />
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#f5f5f5' }}>
                Interactive Playground
              </span>
            </div>
            <button
              onClick={() => { showInfo(`Resetting session for ${agent.name}…`); setChatKey(k => k + 1); }}
              style={{
                background: 'none', border: 'none',
                color: '#555', fontSize: 11, fontWeight: 600,
                cursor: 'pointer', transition: 'color 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#facc15'}
              onMouseLeave={e => e.currentTarget.style.color = '#555'}
            >
              Reset Session
            </button>
          </div>

          {/* Chat area — reuse existing ChatBox */}
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <ChatBox
              key={chatKey}
              agentFlow={agent.chatFlow}
              onClose={() => navigate('/agent-grid')}
              sourceAgentId={agent.id}
              isInline={true}
            />
          </div>

          {/* Connected status */}
          <div style={{
            padding: '8px 20px', borderTop: '1px solid #1e1e1e', flexShrink: 0,
          }}>
            <p style={{ fontSize: 11, color: '#1D9E75', fontWeight: 500 }}>
              ● Connected to {agent.name}
            </p>
          </div>
        </div>
      </div>

      {/* Spin keyframe for retrain button */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AgentDetail;
