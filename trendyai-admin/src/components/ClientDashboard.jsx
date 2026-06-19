import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiLayers, FiClock, FiCheckCircle, FiZap,
  FiArrowRight, FiExternalLink, FiFileText,
  FiCpu, FiPlus, FiTrendingUp,
} from 'react-icons/fi';
import { useToast } from './Toast';

/* ─── METRIC CARD ────────────────────────────────────────── */
const MetricCard = ({ label, value, desc, Icon, iconColor, iconBg, highlight }) => (
  <div style={{
    background: '#0D2347',
    border: `1px solid ${highlight ? 'rgba(0, 229, 255, 0.4)' : 'rgba(0, 229, 255, 0.15)'}`,
    borderRadius: 12,
    padding: '28px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    transition: 'border-color 0.15s ease',
  }}
  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.6)'}
  onMouseLeave={e => e.currentTarget.style.borderColor = highlight ? 'rgba(0, 229, 255, 0.4)' : 'rgba(0, 229, 255, 0.15)'}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
      <p style={{
        fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.08em', color: '#4A6080',
      }}>
        {label}
      </p>
      <div style={{
        width: 34, height: 34, borderRadius: 8,
        background: iconBg, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={15} style={{ color: iconColor }} />
      </div>
    </div>
    <p style={{
      fontSize: 28, fontWeight: 600, lineHeight: 1,
      color: highlight ? '#00E5FF' : '#FFFFFF',
      letterSpacing: '-0.025em',
      marginBottom: 12,
    }}>
      {value}
    </p>
    <p style={{ fontSize: 12, color: '#4A6080', lineHeight: 1.6 }}>{desc}</p>
  </div>
);

/* ─── PROGRESS BAR ───────────────────────────────────────── */
const ProgressBar = ({ pct }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{
      flex: 1, height: 3, background: '#0A1E3F',
      borderRadius: 2, overflow: 'hidden',
    }}>
      <div style={{
        width: `${pct}%`, height: '100%',
        background: '#00E5FF', borderRadius: 2,
        transition: 'width 0.4s ease',
      }} />
    </div>
    <span style={{ fontSize: 11, fontWeight: 700, color: '#00E5FF', minWidth: 30 }}>{pct}%</span>
  </div>
);

/* ─── STATUS BADGE ───────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    'In Progress': { bg: 'rgba(0, 229, 255, 0.10)', color: '#00E5FF' },
    'Reviewing':   { bg: 'rgba(255, 176, 32, 0.10)', color: '#FFB020' },
    'Completed':   { bg: 'rgba(0, 229, 255, 0.15)', color: '#00E5FF' },
    'Paused':      { bg: 'rgba(74, 96, 128, 0.10)', color: '#4A6080' },
  };
  const s = map[status] || map['Paused'];
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.06em', padding: '3px 9px', borderRadius: 5,
      background: s.bg, color: s.color,
    }}>
      {status}
    </span>
  );
};

/* ─── PROCESS STEP ───────────────────────────────────────── */
const ProcessStep = ({ num, title, desc, isLast }) => (
  <div style={{ display: 'flex', gap: 14 }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: 'rgba(0, 229, 255, 0.10)',
        border: '1px solid rgba(0, 229, 255, 0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 800, color: '#00E5FF',
      }}>
        {num}
      </div>
      {!isLast && (
        <div style={{ width: 1, flex: 1, background: 'rgba(0, 229, 255, 0.15)', margin: '6px 0' }} />
      )}
    </div>
    <div style={{ paddingBottom: isLast ? 0 : 20 }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', marginBottom: 5, lineHeight: 1.3 }}>{title}</p>
      <p style={{ fontSize: 12, color: '#A0B4CC', lineHeight: 1.6 }}>{desc}</p>
    </div>
  </div>
);

/* ─── MAIN CLIENT DASHBOARD ──────────────────────────────── */
export default function ClientDashboard() {
  const navigate = useNavigate();
  const { showInfo } = useToast();
  const [loading, setLoading] = useState(true);

  const [hoveredNewRequest, setHoveredNewRequest] = useState(false);
  const [hoveredTrack, setHoveredTrack] = useState(false);
  const [hoveredAssetBtn, setHoveredAssetBtn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    {
      label: 'Active Projects',
      value: '2',
      desc: 'Running campaigns',
      Icon: FiLayers,
      iconColor: '#00E5FF',
      iconBg: 'rgba(0, 229, 255, 0.10)',
    },
    {
      label: 'Pending Approvals',
      value: '3',
      desc: 'Requires your feedback',
      Icon: FiClock,
      iconColor: '#00E5FF',
      iconBg: 'rgba(0, 229, 255, 0.12)',
      highlight: true,
    },
    {
      label: 'Completed Deliverables',
      value: '18',
      desc: 'Ready for use',
      Icon: FiCheckCircle,
      iconColor: '#00E5FF',
      iconBg: 'rgba(0, 229, 255, 0.10)',
    },
    {
      label: 'Actions Today',
      value: '142',
      desc: 'Automated runs',
      Icon: FiZap,
      iconColor: '#00E5FF',
      iconBg: 'rgba(0, 229, 255, 0.10)',
    },
  ];

  const activeProjects = [
    { id: 1, name: 'SaaS Launch SEO',      status: 'In Progress', progress: 65, lastActive: '5m ago',  leadAgent: 'StratoBoss' },
    { id: 2, name: 'Social Lead Campaign', status: 'Reviewing',   progress: 90, lastActive: '1h ago',  leadAgent: 'WebWiz'     },
  ];

  const deliverables = [
    { id: 101, name: 'Blog Post: "Intro to Agentic AI"', type: 'Content copy', project: 'SaaS Launch SEO',      date: 'Today, 2:14 PM' },
    { id: 102, name: 'Landing Page Mockup',               type: 'Design asset', project: 'Social Lead Campaign', date: 'Yesterday'      },
    { id: 103, name: 'Keywords Research Pack',             type: 'SEO config',  project: 'SaaS Launch SEO',      date: 'Jun 16, 2026'   },
  ];

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          border: '2px solid rgba(0, 229, 255, 0.15)',
          borderTop: '2px solid #00E5FF',
          animation: 'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', paddingTop: 24 }} className="animate-fadeIn">

      {/* ── Page header ── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        marginBottom: 48,
      }}>
        <div>
          <p style={{
            fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.1em', color: '#00E5FF', marginBottom: 6,
          }}>
            Client Portal
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#FFFFFF', marginBottom: 8, lineHeight: 1.2 }}>
            Client Dashboard
          </h1>
          <p style={{ fontSize: 13, color: '#A0B4CC', lineHeight: 1.5 }}>
            Monitor your campaigns, review deliverables, and approve assets.
          </p>
        </div>

        <button
          onClick={() => { navigate('/client/requests'); showInfo('Opening intake brief form'); }}
          onMouseEnter={() => setHoveredNewRequest(true)}
          onMouseLeave={() => setHoveredNewRequest(false)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: hoveredNewRequest ? '#00CFEA' : '#00E5FF', color: '#0A1E3F', border: 'none',
            borderRadius: 8, padding: '10px 20px', fontSize: 13,
            fontWeight: 700, cursor: 'pointer', flexShrink: 0,
            transition: 'background 0.15s ease',
          }}
        >
          <FiPlus size={14} /> New Campaign Request
        </button>
      </div>

      {/* ── Zone 1: Metric cards ── */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mt-8 mb-12"
      >
        {stats.map((s, i) => <MetricCard key={i} {...s} />)}
      </div>

      {/* ── Zone 2: Main content + sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{ alignItems: 'start' }}>

        {/* LEFT — Campaigns + Deliverables */}
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* Active Campaigns */}
          <div style={{
            background: '#0D2347', border: '1px solid rgba(0, 229, 255, 0.15)',
            borderRadius: 12, padding: '28px 32px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>Active Campaigns</h2>
              <button
                onClick={() => navigate('/client/projects')}
                onMouseEnter={() => setHoveredTrack(true)}
                onMouseLeave={() => setHoveredTrack(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'none', border: 'none',
                  color: hoveredTrack ? '#FFFFFF' : '#00E5FF', fontSize: 11, fontWeight: 500, cursor: 'pointer',
                  transition: 'color 0.15s ease',
                }}
              >
                Track Pipelines <FiArrowRight size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, overflowX: 'auto' }} className="custom-scrollbar">
              <div style={{ minWidth: 600, display: 'flex', flexDirection: 'column' }}>
                {/* Table header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1.5fr 80px',
                  gap: 12, padding: '0 0 12px 0',
                  borderBottom: '1px solid rgba(0, 229, 255, 0.15)',
                }}>
                  {['Project', 'Lead Agent', 'Status', 'Progress', 'Last Active'].map(h => (
                    <span key={h} style={{
                      fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
                      letterSpacing: '0.08em', color: '#4A6080',
                    }}>
                      {h}
                    </span>
                  ))}
                </div>

                {/* Table rows */}
                {activeProjects.map(proj => (
                  <div key={proj.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1.5fr 80px',
                    gap: 12, padding: '18px 0',
                    borderBottom: '1px solid rgba(0, 229, 255, 0.15)',
                    alignItems: 'center',
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>{proj.name}</span>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontSize: 11, color: '#00E5FF',
                      background: 'rgba(0, 229, 255, 0.08)', border: '1px solid rgba(0, 229, 255, 0.15)',
                      borderRadius: 4, padding: '3px 8px',
                      width: 'fit-content',
                    }}>
                      <FiCpu size={10} style={{ color: '#00E5FF' }} />
                      {proj.leadAgent}
                    </span>
                    <StatusBadge status={proj.status} />
                    <ProgressBar pct={proj.progress} />
                    <span style={{ fontSize: 11, color: '#4A6080' }}>{proj.lastActive}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Deliverables */}
          <div style={{
            background: '#0D2347', border: '1px solid rgba(0, 229, 255, 0.15)',
            borderRadius: 12, padding: '28px 32px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>Recent Deliverables</h2>
              <button
                onClick={() => navigate('/client/deliverables')}
                onMouseEnter={() => setHoveredAssetBtn(true)}
                onMouseLeave={() => setHoveredAssetBtn(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'none', border: 'none',
                  color: hoveredAssetBtn ? '#FFFFFF' : '#00E5FF', fontSize: 11, fontWeight: 500, cursor: 'pointer',
                  transition: 'color 0.15s ease',
                }}
              >
                View Asset Center <FiArrowRight size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {deliverables.map(d => {
                const [hoveredRow, setHoveredRow] = useState(false);
                const [hoveredRevBtn, setHoveredRevBtn] = useState(false);

                return (
                  <div key={d.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: hoveredRow ? '#112B55' : '#0A1E3F',
                    border: hoveredRow ? '1px solid rgba(0, 229, 255, 0.5)' : '1px solid rgba(0, 229, 255, 0.15)',
                    borderRadius: 8,
                    gap: 12,
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate('/client/deliverables')}
                  onMouseEnter={() => setHoveredRow(true)}
                  onMouseLeave={() => setHoveredRow(false)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 8,
                        background: 'rgba(0, 229, 255, 0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <FiFileText size={14} style={{ color: '#00E5FF' }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', marginBottom: 3, lineHeight: 1.3 }}>
                          {d.name}
                        </p>
                        <p style={{ fontSize: 11, color: '#A0B4CC' }}>
                          {d.type} · {d.project}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                      <span style={{ fontSize: 11, color: '#4A6080' }}>{d.date}</span>
                      <button
                        onClick={() => navigate('/client/deliverables')}
                        onMouseEnter={() => setHoveredRevBtn(true)}
                        onMouseLeave={() => setHoveredRevBtn(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          background: 'none',
                          border: hoveredRevBtn ? '1px solid rgba(0, 229, 255, 0.4)' : '1px solid rgba(0, 229, 255, 0.25)',
                          borderRadius: 6, padding: '5px 12px',
                          color: hoveredRevBtn ? '#00E5FF' : '#4A6080', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        Review <FiExternalLink size={10} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — AI Process + Automation CTA */}
        <div className="lg:col-span-1 flex flex-col gap-8">

          {/* Campaign Health Summary */}
          <div style={{
            background: '#0D2347', border: '1px solid rgba(0, 229, 255, 0.15)',
            borderRadius: 12, padding: '28px 32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <FiTrendingUp size={14} style={{ color: '#00E5FF' }} />
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00E5FF', margin: 0 }}>
                Campaign Health
              </p>
            </div>
            {activeProjects.map(p => (
              <div key={p.id} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                  <span style={{ fontSize: 12, color: '#A0B4CC', fontWeight: 500 }}>{p.name}</span>
                  <StatusBadge status={p.status} />
                </div>
                <ProgressBar pct={p.progress} />
              </div>
            ))}
          </div>

          {/* AI Agency Process */}
          <div style={{
            background: '#0D2347', border: '1px solid rgba(0, 229, 255, 0.15)',
            borderRadius: 12, padding: '28px 32px',
          }}>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00E5FF', marginBottom: 20 }}>
              AI Agency Process
            </p>
            <ProcessStep
              num={1}
              title="Submit briefing"
              desc="Fill out an intake form specifying your keywords, outline, or landing page needs."
            />
            <ProcessStep
              num={2}
              title="Agents execute"
              desc="AI Agents auto-verify website metrics, write content, design assets, and audit SEO."
            />
            <ProcessStep
              num={3}
              title="Approve deliverables"
              desc="Review generated marketing assets, request modifications, or approve for distribution."
              isLast
            />
          </div>

          {/* Custom Automation CTA */}
          <div style={{
            background: '#0A1E3F',
            border: '1px dashed rgba(0, 229, 255, 0.25)',
            borderRadius: 12, padding: '28px 32px',
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', marginBottom: 10 }}>
              Need a Custom Automation?
            </p>
            <p style={{ fontSize: 12, color: '#A0B4CC', lineHeight: 1.7, marginBottom: 14 }}>
              Request custom n8n automations to sync approved content directly to your WordPress, Webflow, or Shopify store.
            </p>
            <a
              href="mailto:support@trendtacticsdigital.com"
              style={{
                fontSize: 12, fontWeight: 700, color: '#00E5FF',
                textDecoration: 'none', display: 'inline-flex',
                alignItems: 'center', gap: 5,
              }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
            >
              Contact Integrations Team <FiArrowRight size={11} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
