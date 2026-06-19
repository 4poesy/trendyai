import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiUserPlus, FiZap, FiCheckSquare } from 'react-icons/fi';
import supabase from '../utils/supabaseClient';

/* ─── AGENT CONFIG ───────────────────────────────────────── */
const AGENTS = [
  { id: 'trendyai-core',  name: 'TrendyAI Core',  color: '#00E5FF' },
  { id: 'clientflow',     name: 'ClientFlow',      color: '#00E5FF' },
  { id: 'stratoboss',     name: 'StratoBoss',      color: '#00E5FF' },
  { id: 'pulsepilot',     name: 'PulsePilot',      color: '#00E5FF' },
  { id: 'contentsmith',   name: 'ContentSmith',    color: '#00E5FF' },
  { id: 'pixeldex',       name: 'PixelDex',        color: '#00E5FF' },
  { id: 'webwiz',         name: 'WebWiz',          color: '#00E5FF' },
  { id: 'mediawiz',       name: 'MediaWiz',        color: '#00E5FF' },
];

/* ─── HELPERS ────────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatDate() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/* ─── METRIC CARD ────────────────────────────────────────── */
const MetricCard = ({ label, value, highlight }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{
      background: '#0D2347',
      border: hovered ? '1px solid rgba(0, 229, 255, 0.5)' : '1px solid rgba(0, 229, 255, 0.15)',
      borderRadius: 12,
      padding: '28px 32px',
      transition: 'all 0.15s ease',
    }}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    >
      <p style={{
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: '#4A6080',
        fontWeight: 600,
        marginBottom: 16,
      }}>
        {label}
      </p>
      <p style={{
        fontSize: 28,
        fontWeight: 600,
        color: highlight ? '#00E5FF' : '#FFFFFF',
        lineHeight: 1,
        letterSpacing: '-0.02em',
        margin: 0,
      }}>
        {value}
      </p>
    </div>
  );
};

/* ─── QUICK ACTION BUTTON ────────────────────────────────── */
const QuickAction = ({ icon: Icon, label, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 16px',
        background: '#0D2347',
        border: hovered ? '1px solid rgba(0, 229, 255, 0.4)' : '1px solid rgba(0, 229, 255, 0.15)',
        borderRadius: 9,
        color: hovered ? '#FFFFFF' : '#A0B4CC',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s ease',
      }}
    >
      <Icon size={15} style={{ color: '#00E5FF', flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{label}</span>
      <FiArrowRight size={13} style={{ color: hovered ? '#FFFFFF' : '#4A6080' }} />
    </button>
  );
};

/* ─── DASHBOARD ──────────────────────────────────────────── */
const Dashboard = () => {
  const navigate = useNavigate();

  /* Metrics state */
  const [metrics, setMetrics] = useState({
    activeProjects: null,
    pendingApprovals: null,
    clients: null,
    tasksToday: null,
  });

  /* Activity feed */
  const [activity,     setActivity]     = useState([]);
  const [activityLoad, setActivityLoad] = useState(true);

  /* Agent status */
  const [agentStatus, setAgentStatus] = useState({});

  /* Pending for quick action button */
  const [pendingCount, setPendingCount] = useState(null);

  /* ── Fetch everything ── */
  const fetchData = useCallback(async () => {
    if (!supabase) return;

    try {
      /* Metrics — parallel */
      const [projRes, approvalRes, clientRes, tasksRes] = await Promise.allSettled([
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('approval_queue').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('agent_tasks')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
      ]);

      setMetrics({
        activeProjects:   projRes.status    === 'fulfilled' ? projRes.value.count    ?? '—' : '—',
        pendingApprovals: approvalRes.status === 'fulfilled' ? approvalRes.value.count ?? '—' : '—',
        clients:          clientRes.status   === 'fulfilled' ? clientRes.value.count   ?? '—' : '—',
        tasksToday:       tasksRes.status    === 'fulfilled' ? tasksRes.value.count    ?? '—' : '—',
      });
      if (approvalRes.status === 'fulfilled') setPendingCount(approvalRes.value.count ?? 0);

      /* Activity feed */
      const { data: tasks } = await supabase
        .from('agent_tasks')
        .select('id, agent_name, description, completed_at, client_name')
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(8);
      if (tasks) setActivity(tasks);
      setActivityLoad(false);

      /* Agent metrics */
      const { data: agentRows } = await supabase
        .from('agent_metrics')
        .select('agent_id, status, last_run');
      if (agentRows) {
        const map = {};
        agentRows.forEach(r => { map[r.agent_id] = r; });
        setAgentStatus(map);
      }
    } catch (_) {
      setActivityLoad(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* Status dot color */
  const statusDotColor = (agentId) => {
    const s = agentStatus[agentId]?.status;
    if (s === 'active') return '#00E5FF';
    if (s === 'idle')   return '#FFB020';
    if (s === 'error')  return '#FF4D4D';
    return '#00E5FF'; /* default active */
  };

  const agentColor = (name) => {
    return '#00E5FF';
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }} className="animate-fadeIn">

      {/* ── GREETING BAR ── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingBottom: 28,
        borderBottom: '1px solid rgba(0, 229, 255, 0.15)',
        marginBottom: 28,
        flexWrap: 'wrap',
        gap: 8,
      }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 500, color: '#FFFFFF', lineHeight: 1.3, margin: 0 }}>
            {getGreeting()}, Akinola ☀️
          </p>
          <p style={{ fontSize: 12, color: '#4A6080', marginTop: 4, marginBottom: 0 }}>
            Trendtactics Digital · Admin
          </p>
        </div>
        <p style={{ fontSize: 12, color: '#4A6080', marginTop: 4, marginBottom: 0 }}>
          {formatDate()}
        </p>
      </div>

      {/* ── METRIC CARDS ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
        marginBottom: 40,
      }}
      className="grid-cols-2 lg:grid-cols-4"
      >
        <MetricCard label="Active Projects"    value={metrics.activeProjects   ?? '—'} />
        <MetricCard label="Pending Approvals"  value={metrics.pendingApprovals ?? '—'} highlight={Number(metrics.pendingApprovals) > 0} />
        <MetricCard label="Clients"            value={metrics.clients          ?? '—'} />
        <MetricCard label="Tasks Today"        value={metrics.tasksToday       ?? '—'} />
      </div>

      {/* ── ACTIVITY + ACTIONS ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '3fr 2fr',
        gap: 28,
        alignItems: 'start',
      }}>

        {/* ── Left: Recent Activity ── */}
        <div>
          <p style={{
            fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.1em', color: '#00E5FF', marginBottom: 14,
          }}>
            Recent Activity
          </p>

          <div style={{
            background: '#0D2347', border: '1px solid rgba(0, 229, 255, 0.15)', borderRadius: 12,
            overflow: 'hidden',
          }}>
            {activityLoad ? (
              <div style={{ padding: '24px 20px', color: '#4A6080', fontSize: 12 }}>Loading…</div>
            ) : activity.length === 0 ? (
              <div style={{ padding: '24px 20px', color: '#4A6080', fontSize: 12 }}>
                No completed tasks yet. Activity will appear here as agents work.
              </div>
            ) : (
              <>
                {activity.map((item, i) => (
                  <div
                    key={item.id ?? i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 20px',
                      borderBottom: i < activity.length - 1 ? '1px solid rgba(0, 229, 255, 0.15)' : 'none',
                    }}
                  >
                    {/* Colored dot */}
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: agentColor(item.agent_name),
                      boxShadow: '0 0 6px rgba(0, 229, 255, 0.5)',
                      flexShrink: 0,
                    }} />
                    <p style={{ flex: 1, fontSize: 12, color: '#A0B4CC', lineHeight: 1.5, margin: 0 }}>
                      <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>
                        {item.agent_name || 'Agent'}
                      </strong>{' '}
                      {item.description || 'completed a task'}
                      {item.client_name ? (
                        <span style={{ color: '#4A6080' }}> for {item.client_name}</span>
                      ) : null}
                    </p>
                    <span style={{ fontSize: 11, color: '#4A6080', flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {timeAgo(item.completed_at)}
                    </span>
                  </div>
                ))}
              </>
            )}

            {/* View all link */}
            <div style={{ padding: '10px 20px', borderTop: '1px solid rgba(0, 229, 255, 0.15)' }}>
              <button
                onClick={() => navigate('/audit-logs')}
                style={{
                  background: 'none', border: 'none',
                  color: '#00E5FF', fontSize: 11, fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                View all in Audit Logs <FiArrowRight size={11} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Quick Actions + Agent Status ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Quick Actions */}
          <div>
            <p style={{
              fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.1em', color: '#00E5FF', marginBottom: 14,
            }}>
              Quick Actions
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <QuickAction
                icon={FiUserPlus}
                label="Add New Client"
                onClick={() => navigate('/clients')}
              />
              <QuickAction
                icon={FiZap}
                label="Trigger Agent"
                onClick={() => navigate('/agent-grid')}
              />
              <QuickAction
                icon={FiCheckSquare}
                label={`View Approval Queue${pendingCount !== null && pendingCount > 0 ? ` (${pendingCount})` : ''}`}
                onClick={() => navigate('/approval-queue')}
              />
            </div>
          </div>

          {/* Agent Status */}
          <div>
            <p style={{
              fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.1em', color: '#00E5FF', marginBottom: 14,
            }}>
              Agent Status
            </p>
            <div style={{
              background: '#0D2347', border: '1px solid rgba(0, 229, 255, 0.15)', borderRadius: 12,
              overflow: 'hidden',
            }}>
              {AGENTS.map((agent, i) => {
                const meta = agentStatus[agent.id];
                return (
                  <div
                    key={agent.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      height: 40,
                      padding: '0 16px',
                      borderBottom: i < AGENTS.length - 1 ? '1px solid rgba(0, 229, 255, 0.15)' : 'none',
                    }}
                  >
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: statusDotColor(agent.id),
                      boxShadow: statusDotColor(agent.id) === '#00E5FF' ? '0 0 6px rgba(0, 229, 255, 0.5)' : 'none',
                      flexShrink: 0,
                    }} />
                    <span style={{ flex: 1, fontSize: 11, color: '#FFFFFF', fontWeight: 500 }}>
                      {agent.name}
                    </span>
                    <span style={{ fontSize: 10, color: '#4A6080' }}>
                      {meta ? `last run ${timeAgo(meta.last_run)}` : '· Active'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;