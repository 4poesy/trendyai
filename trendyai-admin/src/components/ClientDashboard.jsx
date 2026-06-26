import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiLayers, FiClock, FiCheckCircle, FiZap,
  FiArrowRight, FiExternalLink, FiFileText,
  FiCpu, FiPlus, FiTrendingUp, FiLoader, FiEye, FiX, FiDownload
} from 'react-icons/fi';
import { useToast } from './Toast';
import { supabase } from '../utils/supabaseClient';
import { crossDomainAuth } from '../utils/domainIntegration';
import ReactMarkdown from 'react-markdown';
import environment from '../config/environment';

/* ─── METRIC CARD ────────────────────────────────────────── */
const MetricCard = ({ label, value, desc, Icon, iconColor, iconBg, highlight }) => (
  <div style={{
    background: 'var(--bg-secondary)',
    border: `1px solid ${highlight ? 'rgba(250, 204, 21, 0.4)' : 'rgba(250, 204, 21, 0.15)'}`,
    borderRadius: 12,
    padding: '28px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    transition: 'border-color 0.15s ease',
  }}
  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(250, 204, 21, 0.6)'}
  onMouseLeave={e => e.currentTarget.style.borderColor = highlight ? 'rgba(250, 204, 21, 0.4)' : 'rgba(250, 204, 21, 0.15)'}
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
      color: highlight ? 'var(--accent-primary)' : '#FFFFFF',
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
      flex: 1, height: 3, background: 'var(--bg-primary)',
      borderRadius: 2, overflow: 'hidden',
    }}>
      <div style={{
        width: `${pct}%`, height: '100%',
        background: 'var(--accent-primary)', borderRadius: 2,
        transition: 'width 0.4s ease',
      }} />
    </div>
    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-primary)', minWidth: 30 }}>{pct}%</span>
  </div>
);

/* ─── STATUS BADGE ───────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    'In Progress': { bg: 'rgba(250, 204, 21, 0.10)', color: 'var(--accent-primary)' },
    'Reviewing':   { bg: 'rgba(255, 176, 32, 0.10)', color: '#FFB020' },
    'Completed':   { bg: 'rgba(250, 204, 21, 0.15)', color: 'var(--accent-primary)' },
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
        background: 'rgba(250, 204, 21, 0.10)',
        border: '1px solid rgba(250, 204, 21, 0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 800, color: 'var(--accent-primary)',
      }}>
        {num}
      </div>
      {!isLast && (
        <div style={{ width: 1, flex: 1, background: 'rgba(250, 204, 21, 0.15)', margin: '6px 0' }} />
      )}
    </div>
    <div style={{ paddingBottom: isLast ? 0 : 20 }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', marginBottom: 5, lineHeight: 1.3 }}>{title}</p>
      <p style={{ fontSize: 12, color: '#A0B4CC', lineHeight: 1.6 }}>{desc}</p>
    </div>
  </div>
);

/* ─── DELIVERABLE ROW ────────────────────────────────────── */
const DeliverableRow = ({ d, navigate }) => {
  const [hoveredRow, setHoveredRow] = useState(false);
  const [hoveredRevBtn, setHoveredRevBtn] = useState(false);

  return (
    <div key={d.id} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 20px',
      background: hoveredRow ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
      border: hoveredRow ? '1px solid rgba(250, 204, 21, 0.5)' : '1px solid rgba(250, 204, 21, 0.15)',
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
          background: 'rgba(250, 204, 21, 0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <FiFileText size={14} style={{ color: 'var(--accent-primary)' }} />
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
            border: hoveredRevBtn ? '1px solid rgba(250, 204, 21, 0.4)' : '1px solid rgba(250, 204, 21, 0.25)',
            borderRadius: 6, padding: '5px 12px',
            color: hoveredRevBtn ? 'var(--accent-primary)' : '#4A6080', fontSize: 11, fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Review <FiExternalLink size={10} />
        </button>
      </div>
    </div>
  );
};

/* ─── MAIN CLIENT DASHBOARD ──────────────────────────────── */
export default function ClientDashboard() {
  const navigate = useNavigate();
  const { showInfo, showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);

  const [hoveredNewRequest, setHoveredNewRequest] = useState(false);
  const [hoveredTrack, setHoveredTrack] = useState(false);
  const [hoveredAssetBtn, setHoveredAssetBtn] = useState(false);

  // Audits & Reports integration state
  const auth = crossDomainAuth.getAuth();
  const user = auth?.user;
  const [clientId, setClientId] = useState(null);
  const [url, setUrl] = useState('');
  const [running, setRunning] = useState(false);
  const [reports, setReports] = useState([]);
  const [activeTasks, setActiveTasks] = useState([]);
  const [viewingReport, setViewingReport] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Fetch client ID, reports, and active tasks dynamically
  const loadClientAndReports = async () => {
    if (!supabase || !user?.email) return;
    try {
      // Find client record by email
      const { data: clientRecord } = await supabase
        .from('clients')
        .eq('email', user.email)
        .maybeSingle();
        
      if (clientRecord) {
        setClientId(clientRecord.id);
        if (clientRecord.website_url) {
          setUrl(clientRecord.website_url);
        }
        
        // Fetch reports
        const { data: repData } = await supabase
          .from('audit_reports')
          .select('*')
          .eq('client_id', clientRecord.id)
          .order('created_at', { ascending: false });
        setReports(repData || []);
        
        // Fetch active tasks
        const { data: tskData } = await supabase
          .from('agent_tasks')
          .select('*')
          .eq('client_id', clientRecord.id)
          .in('status', ['pending', 'running'])
          .order('created_at', { ascending: false });
        setActiveTasks(tskData || []);
      }
    } catch (err) {
      console.error('Error loading client audits data:', err.message);
    }
  };

  useEffect(() => {
    loadClientAndReports();
    
    // Subscribe to database changes
    if (!supabase || !user?.email) return;
    
    const channel = supabase
      .channel('client-audits-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'audit_reports' }, () => {
        loadClientAndReports();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_tasks' }, () => {
        loadClientAndReports();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleRequestAudit = async (pkgType) => {
    if (!url) {
      showError('Please enter a website URL');
      return;
    }
    
    setRunning(true);
    const skillToRun = pkgType === 'full' ? 'agency_full' : 'geo_audit';
    
    try {
      const backendUrl = environment.backend.baseURL;
      const response = await fetch(`${backendUrl}/audits/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          url,
          skill_type: skillToRun,
          package_type: pkgType
        })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        showSuccess('Audit request successfully received! AI agents are running the audit.');
        loadClientAndReports();
      } else {
        throw new Error(result.error || 'Failed to request audit');
      }
    } catch (err) {
      console.error(err);
      showError(err.message);
    } finally {
      setRunning(false);
    }
  };

  const handleDownloadPDF = (report) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${report.skill_type.toUpperCase()} Report - ${report.url_audited}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            h1, h2, h3 { color: var(--bg-primary); }
            h1 { border-bottom: 2px solid var(--accent-primary); padding-bottom: 10px; }
            pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
            code { font-family: monospace; }
            .meta { margin-bottom: 30px; font-size: 0.9em; color: #666; }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <button onclick="window.print()" style="padding: 10px 20px; background: var(--accent-primary); border: none; border-radius: 5px; cursor: pointer; font-weight: bold; margin-bottom: 20px;">Print / Save as PDF</button>
          <h1>AI Audit Report: ${report.skill_type.toUpperCase()}</h1>
          <div class="meta">
            <strong>Audited URL:</strong> ${report.url_audited}<br/>
            <strong>Date:</strong> ${new Date(report.created_at).toLocaleString()}<br/>
            <strong>Overall Evaluation Score:</strong> ${report.score_overall || 'N/A'}/100
          </div>
          <div>
            ${report.report_text.replace(/\n/g, '<br/>')}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const stats = [
    {
      label: 'Active Projects',
      value: '2',
      desc: 'Running campaigns',
      Icon: FiLayers,
      iconColor: 'var(--accent-primary)',
      iconBg: 'rgba(250, 204, 21, 0.10)',
    },
    {
      label: 'Pending Approvals',
      value: '3',
      desc: 'Requires your feedback',
      Icon: FiClock,
      iconColor: 'var(--accent-primary)',
      iconBg: 'rgba(250, 204, 21, 0.12)',
      highlight: true,
    },
    {
      label: 'Completed Deliverables',
      value: '18',
      desc: 'Ready for use',
      Icon: FiCheckCircle,
      iconColor: 'var(--accent-primary)',
      iconBg: 'rgba(250, 204, 21, 0.10)',
    },
    {
      label: 'Actions Today',
      value: '142',
      desc: 'Automated runs',
      Icon: FiZap,
      iconColor: 'var(--accent-primary)',
      iconBg: 'rgba(250, 204, 21, 0.10)',
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
          border: '2px solid rgba(250, 204, 21, 0.15)',
          borderTop: '2px solid var(--accent-primary)',
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
            letterSpacing: '0.1em', color: 'var(--accent-primary)', marginBottom: 6,
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
            background: hoveredNewRequest ? 'var(--accent-hover)' : 'var(--accent-primary)', color: 'var(--bg-primary)', border: 'none',
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
            background: 'var(--bg-secondary)', border: '1px solid rgba(250, 204, 21, 0.15)',
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
                  color: hoveredTrack ? '#FFFFFF' : 'var(--accent-primary)', fontSize: 11, fontWeight: 500, cursor: 'pointer',
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
                  borderBottom: '1px solid rgba(250, 204, 21, 0.15)',
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
                    borderBottom: '1px solid rgba(250, 204, 21, 0.15)',
                    alignItems: 'center',
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>{proj.name}</span>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontSize: 11, color: 'var(--accent-primary)',
                      background: 'rgba(250, 204, 21, 0.08)', border: '1px solid rgba(250, 204, 21, 0.15)',
                      borderRadius: 4, padding: '3px 8px',
                      width: 'fit-content',
                    }}>
                      <FiCpu size={10} style={{ color: 'var(--accent-primary)' }} />
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
            background: 'var(--bg-secondary)', border: '1px solid rgba(250, 204, 21, 0.15)',
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
                  color: hoveredAssetBtn ? '#FFFFFF' : 'var(--accent-primary)', fontSize: 11, fontWeight: 500, cursor: 'pointer',
                  transition: 'color 0.15s ease',
                }}
              >
                View Asset Center <FiArrowRight size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {deliverables.map(d => (
                <DeliverableRow key={d.id} d={d} navigate={navigate} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — AI Process + Automation CTA */}
        <div className="lg:col-span-1 flex flex-col gap-8">

          {/* Campaign Health Summary */}
          <div style={{
            background: 'var(--bg-secondary)', border: '1px solid rgba(250, 204, 21, 0.15)',
            borderRadius: 12, padding: '28px 32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <FiTrendingUp size={14} style={{ color: 'var(--accent-primary)' }} />
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-primary)', margin: 0 }}>
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

          {/* Request a Website Audit Card */}
          <div style={{
            background: 'var(--bg-secondary)', border: '1px solid rgba(250, 204, 21, 0.15)',
            borderRadius: 12, padding: '28px 32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <FiTrendingUp size={14} style={{ color: 'var(--accent-primary)' }} />
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-primary)', margin: 0 }}>
                Request Website Audit
              </p>
            </div>
            <p style={{ fontSize: 12, color: '#A0B4CC', lineHeight: 1.7, marginBottom: 14 }}>
              Get a full AI-powered analysis of your digital presence across SEO, marketing, advertising, and AI search visibility.
            </p>
            
            {activeTasks.length > 0 ? (
              <div style={{ padding: 12, background: 'rgba(250, 204, 21, 0.05)', border: '1px solid rgba(250, 204, 21, 0.15)', borderRadius: 8, marginBottom: 14 }}>
                <p style={{ fontSize: 11, color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FiLoader className="animate-spin" />
                  Your audit is running...
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                <input
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 12px', background: 'var(--bg-primary)',
                    border: '1px solid rgba(250, 204, 21, 0.15)', borderRadius: 6,
                    color: '#FFFFFF', fontSize: 12, outline: 'none'
                  }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleRequestAudit('starter')}
                    disabled={running}
                    style={{
                      flex: 1, padding: '8px 0', background: 'rgba(250, 204, 21, 0.10)',
                      border: '1px solid rgba(250, 204, 21, 0.25)', borderRadius: 6,
                      color: 'var(--accent-primary)', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Request Starter
                  </button>
                  <button
                    onClick={() => handleRequestAudit('full')}
                    disabled={running}
                    style={{
                      flex: 1, padding: '8px 0', background: 'var(--accent-primary)',
                      border: 'none', borderRadius: 6,
                      color: 'var(--bg-primary)', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Request Full
                  </button>
                </div>
              </div>
            )}

            {reports.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid rgba(250, 204, 21, 0.15)', paddingTop: 14 }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: '#4A6080', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Reports</p>
                {reports.slice(0, 3).map(rep => (
                  <div key={rep.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#A0B4CC', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 120 }}>
                      {rep.skill_type === 'agency_full' ? 'Full Audit' : 'SEO/GEO Audit'}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => setViewingReport(rep)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(rep)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                      >
                        PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Agency Process */}
          <div style={{
            background: 'var(--bg-secondary)', border: '1px solid rgba(250, 204, 21, 0.15)',
            borderRadius: 12, padding: '28px 32px',
          }}>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-primary)', marginBottom: 20 }}>
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
            background: 'var(--bg-primary)',
            border: '1px dashed rgba(250, 204, 21, 0.25)',
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
                fontSize: 12, fontWeight: 700, color: 'var(--accent-primary)',
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

      {/* Markdown View Modal */}
      {viewingReport && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16
        }}>
          <div style={{
            background: 'var(--bg-secondary)', border: '1px solid rgba(250, 204, 21, 0.15)',
            borderRadius: 12, width: '100%', maxWidth: 800, maxHeight: '85vh',
            display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid rgba(250, 204, 21, 0.15)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)'
            }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  AI Audit Report: {viewingReport.skill_type.replace('_', ' ').toUpperCase()}
                </h3>
                <p style={{ fontSize: 11, color: '#A0B4CC', margin: '4px 0 0 0' }}>
                  URL: {viewingReport.url_audited} | Date: {new Date(viewingReport.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setViewingReport(null)}
                style={{ background: 'none', border: 'none', color: '#A0B4CC', cursor: 'pointer', padding: 4 }}
              >
                <FiX size={18} />
              </button>
            </div>
            
            <div className="custom-scrollbar" style={{ padding: 32, overflowY: 'auto', flex: 1, background: 'var(--bg-secondary)', color: '#FFFFFF' }}>
              <div style={{ marginBottom: 24, padding: 16, background: 'rgba(250, 204, 21, 0.08)', border: '1px solid rgba(250, 204, 21, 0.15)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#FFFFFF' }}>Evaluation Score:</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--accent-primary)' }}>
                  {viewingReport.score_overall ? `${viewingReport.score_overall}/100` : 'N/A'}
                </span>
              </div>
              <div className="prose prose-invert prose-cyan" style={{ fontSize: 13, lineHeight: 1.8 }}>
                <ReactMarkdown>{viewingReport.report_text}</ReactMarkdown>
              </div>
            </div>

            <div style={{
              padding: '20px 24px', borderTop: '1px solid rgba(250, 204, 21, 0.15)',
              display: 'flex', justifyContent: 'flex-end', gap: 12, background: 'var(--bg-primary)'
            }}>
              <button
                onClick={() => handleDownloadPDF(viewingReport)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'var(--accent-primary)', color: 'var(--bg-primary)', border: 'none',
                  borderRadius: 6, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer'
                }}
              >
                <FiDownload /> Print / PDF
              </button>
              <button
                onClick={() => setViewingReport(null)}
                style={{
                  background: 'none', border: '1px solid rgba(250, 204, 21, 0.25)',
                  borderRadius: 6, padding: '8px 16px', fontSize: 12, fontWeight: 700, color: '#A0B4CC', cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
