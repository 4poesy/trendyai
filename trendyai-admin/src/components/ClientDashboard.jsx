import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTasks, FaCheckCircle, FaFileAlt, FaClock, FaPlus, FaArrowRight, FaRobot, FaExternalLinkAlt } from 'react-icons/fa';
import { useToast } from './Toast';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { showInfo } = useToast();
  const [loading, setLoading] = useState(true);

  // Mock statistics
  const stats = [
    { label: 'Active Projects', value: '2', icon: <FaTasks className="text-primary" />, desc: 'Running AI campaigns' },
    { label: 'Pending Approvals', value: '3', icon: <FaClock className="text-yellow-500" />, desc: 'Requires your feedback' },
    { label: 'Completed Deliverables', value: '18', icon: <FaCheckCircle className="text-green-500" />, desc: 'Ready for use' },
    { label: 'AI Actions Today', value: '142', icon: <FaRobot className="text-purple-500" />, desc: 'Automated workflow runs' },
  ];

  // Mock Active Projects
  const activeProjects = [
    { id: 1, name: 'SaaS Launch SEO', status: 'In Progress', progress: 65, lastActive: '5m ago', leadAgent: 'RankRover' },
    { id: 2, name: 'Social Lead Campaign', status: 'Reviewing', progress: 90, lastActive: '1h ago', leadAgent: 'WebWiz' },
  ];

  // Mock Deliverables
  const deliverables = [
    { id: 101, name: 'Blog Post: "Intro to Agentic AI"', type: 'Content copy', project: 'SaaS Launch SEO', date: 'Today, 2:14 PM' },
    { id: 102, name: 'Landing Page Mockup', type: 'Design asset', project: 'Social Lead Campaign', date: 'Yesterday' },
    { id: 103, name: 'Keywords Research Pack', type: 'SEO config', project: 'SaaS Launch SEO', date: 'June 16, 2026' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-main">Client Portal</h1>
          <p className="text-text-sub mt-1 text-sm md:text-base">Welcome to your TrendyAI workspace. Monitor campaigns and approve deliverables.</p>
        </div>
        <button
          onClick={() => {
            navigate('/client/requests');
            showInfo('Opening intake brief form');
          }}
          className="crm-btn crm-btn-primary"
        >
          <FaPlus /> New Campaign Request
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <div key={idx} className="crm-card flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-sm font-medium text-text-sub">{stat.label}</span>
                <h3 className="text-3xl font-bold text-text-main mt-1">{stat.value}</h3>
              </div>
              <div className="p-3 bg-bg-panel border border-border-main rounded-lg text-lg">
                {stat.icon}
              </div>
            </div>
            <p className="text-xs text-text-muted mt-4">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Active Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="crm-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text-main">Active Campaigns</h2>
              <button 
                onClick={() => navigate('/client/projects')} 
                className="text-primary hover:underline text-sm font-semibold flex items-center gap-1"
              >
                Track Pipelines <FaArrowRight size={12} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Lead Agent</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {activeProjects.map(proj => (
                    <tr key={proj.id}>
                      <td className="font-semibold">{proj.name}</td>
                      <td>
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-bg-panel border border-border-main text-xs text-text-main">
                          <FaRobot className="text-primary" /> {proj.leadAgent}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${proj.status === 'Reviewing' ? 'badge-warning' : 'badge-info'}`}>
                          {proj.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-bg-panel rounded-full h-1.5 overflow-hidden border border-border-main">
                            <div className="bg-primary h-full rounded-full" style={{ width: `${proj.progress}%` }}></div>
                          </div>
                          <span className="text-xs font-semibold">{proj.progress}%</span>
                        </div>
                      </td>
                      <td className="text-xs text-text-muted">{proj.lastActive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deliverables review block */}
          <div className="crm-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text-main">Recent Generated Deliverables</h2>
              <button 
                onClick={() => navigate('/client/deliverables')} 
                className="text-primary hover:underline text-sm font-semibold flex items-center gap-1"
              >
                View Asset Center <FaArrowRight size={12} />
              </button>
            </div>
            <div className="space-y-4">
              {deliverables.map(deliv => (
                <div key={deliv.id} className="p-4 bg-bg-panel border border-border-main rounded-lg flex items-center justify-between hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-bg-card border border-border-main rounded text-primary mt-0.5">
                      <FaFileAlt />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-text-main">{deliv.name}</h4>
                      <p className="text-xs text-text-sub mt-0.5">{deliv.type} • {deliv.project}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted hidden sm:inline">{deliv.date}</span>
                    <button
                      onClick={() => navigate('/client/deliverables')}
                      className="crm-btn crm-btn-secondary py-1.5 px-3 text-xs"
                    >
                      Review <FaExternalLinkAlt size={10} className="ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Activity feed / instructions */}
        <div className="space-y-6">
          <div className="crm-card">
            <h2 className="text-lg font-bold text-text-main mb-4">AI Agency Process</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
                <div>
                  <h4 className="text-sm font-semibold text-text-main">Submit briefing</h4>
                  <p className="text-xs text-text-sub mt-0.5">Fill out an intake form specifying your keywords, outline, or landing page needs.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
                <div>
                  <h4 className="text-sm font-semibold text-text-main">Agents execute</h4>
                  <p className="text-xs text-text-sub mt-0.5">AI Agents auto-verify website metrics, write content, design assets, and audit SEO.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">3</div>
                <div>
                  <h4 className="text-sm font-semibold text-text-main">Approve deliverables</h4>
                  <p className="text-xs text-text-sub mt-0.5">Review the generated marketing assets, request modifications, or approve for distribution.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="crm-card bg-bg-panel border-dashed border-2">
            <h3 className="font-bold text-text-main mb-2">Need a Custom Automation?</h3>
            <p className="text-xs text-text-sub leading-relaxed">
              As a client, you can request custom n8n automations to sync approved content directly to your WordPress, Webflow, or Shopify store. Reach out to support to set this up.
            </p>
            <a 
              href="mailto:support@trendtacticsdigital.com" 
              className="inline-block mt-4 text-xs font-bold text-primary hover:underline"
            >
              Contact Integrations Team &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
