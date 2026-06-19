import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCpu, FiUsers, FiTarget, FiBarChart2,
  FiPenTool, FiImage, FiCode, FiVideo, FiSearch,
} from 'react-icons/fi';
import { useToast } from './Toast';

/* ─── AGENT DEFINITIONS ──────────────────────────────────── */
const agentGroups = [
  {
    label: 'CORE & ONBOARDING',
    agents: [
      {
        id: 'trendyai-core',
        name: 'TrendyAI Core',
        description: 'Central orchestrator — decomposes tasks, routes to agents, manages approvals.',
        iconBg: 'rgba(250,204,21,0.12)',
        iconColor: '#facc15',
        Icon: FiCpu,
        tags: ['Smart Routing', 'PM', 'State Sync'],
        capabilities: [
          'Project decomposition and task assignment',
          'Smart agent routing based on complexity',
          'Human approval gate management',
          'Multi-agent workflow coordination',
        ],
        chatFlow: ['ClientFlow', 'StratoBoss', 'PulsePilot'],
      },
      {
        id: 'clientflow',
        name: 'ClientFlow',
        description: 'Acquires leads, qualifies briefs, and manages CRM pipelines end-to-end.',
        iconBg: 'rgba(29,158,117,0.12)',
        iconColor: '#1D9E75',
        Icon: FiUsers,
        tags: ['CRM', 'Onboarding', 'Retention'],
        capabilities: [
          'Lead acquisition and qualification',
          'Client brief parsing into structured variables',
          'CRM pipeline management',
          'Retention alert generation',
        ],
        chatFlow: ['TrendyAI Core', 'ContentSmith', 'StratoBoss'],
      },
    ],
  },
  {
    label: 'STRATEGY & OPERATIONS',
    agents: [
      {
        id: 'stratoboss',
        name: 'StratoBoss',
        description: 'Market analysis, competitor sweeps, SEO audits, and keyword mapping.',
        iconBg: 'rgba(55,138,221,0.12)',
        iconColor: '#378ADD',
        Icon: FiTarget,
        tags: ['SEO Audit', 'SWOT', 'Forecasting'],
        capabilities: [
          'Market analysis and competitor research',
          'SEO audit and keyword mapping',
          'Trend forecasting and SWOT analysis',
          'Strategic report generation',
        ],
        chatFlow: ['ContentSmith', 'PulsePilot', 'TrendyAI Core'],
      },
      {
        id: 'pulsepilot',
        name: 'PulsePilot',
        description: 'Deploys paid ads, schedules social posts, tracks ad budgets in real time.',
        iconBg: 'rgba(250,204,21,0.12)',
        iconColor: '#facc15',
        Icon: FiBarChart2,
        tags: ['Meta/Google Ads', 'Spend', 'Publishing'],
        capabilities: [
          'Paid ad campaign deployment (Meta, Google)',
          'Social media scheduling and publishing',
          'Real-time ad spend tracking',
          'YouTube video metadata management',
        ],
        chatFlow: ['StratoBoss', 'TrendyAI Core', 'PixelDex'],
      },
    ],
  },
  {
    label: 'CREATIVE CONTENT',
    agents: [
      {
        id: 'contentsmith',
        name: 'ContentSmith',
        description: 'Blogs, ad copy, emails, books, spoken word, and course scripts — all in one.',
        iconBg: 'rgba(216,90,48,0.12)',
        iconColor: '#D85A30',
        Icon: FiPenTool,
        tags: ['Copywriting', 'Blogging', 'Ghostwriting'],
        capabilities: [
          'Multi-persona content (copywriter, blogger, ghostwriter)',
          'Ad copy and email campaign writing',
          'Book and course script generation',
          'Active tone matching across formats',
        ],
        chatFlow: ['PixelDex', 'StratoBoss', 'TrendyAI Core'],
      },
      {
        id: 'pixeldex',
        name: 'PixelDex',
        description: 'Visual designer — logos, brand guides, social templates, ebook covers.',
        iconBg: 'rgba(55,138,221,0.12)',
        iconColor: '#378ADD',
        Icon: FiImage,
        tags: ['Branding', 'Social Design', 'Ebooks'],
        capabilities: [
          'Logo and brand identity design',
          'Social media banner and ad graphics',
          'Ebook layout and cover design',
          'Typography and colour palette systems',
        ],
        chatFlow: ['ContentSmith', 'MediaWiz', 'TrendyAI Core'],
      },
    ],
  },
  {
    label: 'DEV & MEDIA',
    agents: [
      {
        id: 'webwiz',
        name: 'WebWiz',
        description: 'Builds React/HTML sites, integrates Paystack, monitors uptime alerts.',
        iconBg: 'rgba(29,158,117,0.12)',
        iconColor: '#1D9E75',
        Icon: FiCode,
        tags: ['Next.js', 'Paystack', 'CMS'],
        capabilities: [
          'React/HTML UI design and development',
          'CMS integration and publishing',
          'Paystack and payment gateway setup',
          'Uptime monitoring and alerts',
        ],
        chatFlow: ['MediaWiz', 'PixelDex', 'TrendyAI Core'],
      },
      {
        id: 'mediawiz',
        name: 'MediaWiz',
        description: 'Full video pipeline — scripts, editing direction, voiceovers, and music.',
        iconBg: 'rgba(216,90,48,0.12)',
        iconColor: '#D85A30',
        Icon: FiVideo,
        tags: ['Reels', 'Voiceover', 'Afrobeats'],
        capabilities: [
          'Video script and storyboard generation',
          'Shorts and Reels editing direction',
          'Voiceover and backing audio management',
          'Sound design and music curation',
        ],
        chatFlow: ['WebWiz', 'PixelDex', 'TrendyAI Core'],
      },
    ],
  },
];

/* ─── AGENT CARD ─────────────────────────────────────────── */
const AgentCard = ({ agent, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const { Icon } = agent;

  return (
    <div
      onClick={() => onSelect(agent.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(agent.id)}
      aria-label={`Open ${agent.name} playground`}
      style={{
        background: hovered ? '#1e1e1e' : '#1a1a1a',
        border: `1px solid ${hovered ? 'rgba(250,204,21,0.4)' : '#2a2a2a'}`,
        borderRadius: 14,
        padding: 24,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      {/* ── Top row: Icon + Status dot ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
        {/* Icon box */}
        <div style={{
          width: 38, height: 38, borderRadius: 9,
          background: agent.iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={17} style={{ color: agent.iconColor }} />
        </div>

        {/* Status dot */}
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#1D9E75',
          marginTop: 4,
          flexShrink: 0,
        }} />
      </div>

      {/* ── Agent name ── */}
      <p style={{ fontSize: 15, fontWeight: 700, color: '#f0f0f0', marginBottom: 10, lineHeight: 1.3 }}>
        {agent.name}
      </p>

      {/* ── Description — wraps naturally, no ellipsis ── */}
      <p style={{
        fontSize: 12, color: '#777', lineHeight: 1.7,
        marginBottom: 16,
      }}>
        {agent.description}
      </p>

      {/* ── Tag pills — max 3 ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {agent.tags.slice(0, 3).map(tag => (
          <span key={tag} style={{
            fontSize: 10, background: '#222', color: '#888',
            borderRadius: 4, padding: '2px 7px', lineHeight: '18px',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* ── Divider ── */}
      <div style={{ borderTop: '1px solid #2a2a2a', marginBottom: 16 }} />

      {/* ── Footer: Launch link + task indicator ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 12, fontWeight: 600, color: '#facc15',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          Launch Playground <span style={{ fontSize: 13 }}>→</span>
        </span>
        <span style={{ fontSize: 10, color: '#555' }}>
          — tasks
        </span>
      </div>
    </div>
  );
};

/* ─── AGENT GRID ─────────────────────────────────────────── */
const AgentGridNew = () => {
  const navigate = useNavigate();
  const { showInfo } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelect = (agentId) => {
    navigate(`/agent-grid/${agentId}`);
  };

  /* Filter by search */
  const filtered = agentGroups
    .map(group => ({
      ...group,
      agents: group.agents.filter(a => {
        const q = searchTerm.toLowerCase();
        return (
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags.some(t => t.toLowerCase().includes(q))
        );
      }),
    }))
    .filter(g => g.agents.length > 0);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }} className="animate-fadeIn">

      {/* ── Page header ── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        marginBottom: 28,
      }}>
        <div>
          <p style={{
            fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.1em', color: '#facc15', marginBottom: 6,
          }}>
            AI Agents
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#f5f5f5', marginBottom: 6, lineHeight: 1.2 }}>
            Agent Grid
          </h1>
          <p style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>
            8 specialists working across marketing, SEO, and content.
          </p>

          {/* Workflow breadcrumb */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginTop: 12, fontSize: 11, color: '#555',
            fontFamily: 'monospace',
          }}>
            <span style={{ color: '#facc15', fontWeight: 600 }}>TrendyAI Core</span>
            <span>→</span>
            <span>Complexity Analysis</span>
            <span>→</span>
            <span>Smart Routing</span>
            <span>→</span>
            <span>Specialist</span>
          </div>
        </div>

        {/* Auto Orchestrate button */}
        <button
          onClick={() => showInfo('Simulating auto-orchestration across all 8 agents…')}
          style={{
            background: '#facc15', color: '#111', fontSize: 13,
            fontWeight: 600, border: 'none', borderRadius: 8,
            padding: '9px 18px', cursor: 'pointer',
            transition: 'background 0.15s ease',
            display: 'flex', alignItems: 'center', gap: 6,
            flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#eab308'}
          onMouseLeave={e => e.currentTarget.style.background = '#facc15'}
        >
          ⚡ Auto Orchestrate
        </button>
      </div>

      {/* ── Search bar ── */}
      <div style={{ position: 'relative', maxWidth: 380, marginBottom: 32 }}>
        <FiSearch
          size={14}
          style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)', color: '#555',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search agents by name, role, or tag…"
          style={{
            width: '100%',
            paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
            background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 9,
            color: '#f0f0f0', fontSize: 13, outline: 'none',
            transition: 'border-color 0.15s ease',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(250,204,21,0.4)'}
          onBlur={e => e.target.style.borderColor = '#2a2a2a'}
        />
      </div>

      {/* ── Agent groups ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#555' }}>
          <p style={{ fontSize: 14, marginBottom: 12 }}>No agents match "{searchTerm}"</p>
          <button
            onClick={() => setSearchTerm('')}
            style={{
              background: 'none', border: 'none',
              color: '#facc15', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {filtered.map((group, gi) => (
            <section key={group.label} style={{ marginTop: gi === 0 ? 0 : 24 }}>
              {/* Suite section label */}
              <div style={{
                paddingBottom: 10,
                borderBottom: '1px solid #222',
                marginBottom: 16,
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '0.1em', color: '#facc15',
                }}>
                  {group.label}
                </span>
              </div>

              {/* Card grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 16,
              }}>
                {group.agents.map(agent => (
                  <AgentCard key={agent.id} agent={agent} onSelect={handleSelect} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentGridNew;