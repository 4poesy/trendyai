import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useToast } from './Toast';
import { FaPlay, FaSync, FaEye, FaDownload, FaSpinner, FaPlus, FaTimes } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

const Audits = () => {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [url, setUrl] = useState('');
  const [packageType, setPackageType] = useState('full'); // starter | full | individual
  const [selectedSkill, setSelectedSkill] = useState('geo_audit');
  
  const [activeAudits, setActiveAudits] = useState([]);
  const [completedReports, setCompletedReports] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [runningAudit, setRunningAudit] = useState(false);
  
  // Modal state
  const [viewingReport, setViewingReport] = useState(null);
  
  const { showSuccess, showError } = useToast();

  // Fetch clients for dropdown
  useEffect(() => {
    const fetchClients = async () => {
      try {
        if (!supabase) {
          setLoadingClients(false);
          return;
        }
        const { data, error } = await supabase
          .from('clients')
          .select('id, name, website_url')
          .order('name');
        
        if (error) throw error;
        setClients(data || []);
      } catch (err) {
        console.error('Error fetching clients:', err.message);
      } finally {
        setLoadingClients(false);
      }
    };
    
    fetchClients();
  }, []);

  // Fetch audits and reports
  const fetchData = async () => {
    try {
      setLoadingReports(true);
      if (!supabase) return;
      
      // Fetch completed reports
      const { data: reports, error: reportsErr } = await supabase
        .from('audit_reports')
        .select('*, client:clients(name)')
        .order('created_at', { ascending: false });
        
      if (reportsErr) throw reportsErr;
      setCompletedReports(reports || []);

      // Fetch active tasks from agent_tasks
      const { data: tasks, error: tasksErr } = await supabase
        .from('agent_tasks')
        .select('*, client:clients(name)')
        .in('status', ['pending', 'running'])
        .in('task_type', [
          'geo_audit', 'geo_quick', 'geo_citability', 'geo_crawlers', 'geo_report', 'geo_technical', 'geo_content', 'geo_schema',
          'market_audit', 'market_competitors', 'market_seo', 'market_social', 'market_ads', 'market_copy', 'market_emails', 'market_proposal', 'market_report',
          'ads_strategy', 'ads_audience', 'ads_copy', 'ads_competitors', 'ads_budget', 'ads_report',
          'sales_prospect', 'sales_research', 'sales_qualify', 'sales_contacts', 'sales_outreach', 'sales_proposal',
          'agency_onboard', 'agency_quick', 'agency_propose', 'agency_full'
        ])
        .order('created_at', { ascending: false });

      if (tasksErr) throw tasksErr;
      setActiveAudits(tasks || []);
    } catch (err) {
      console.error('Error fetching audits data:', err.message);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Set up real-time subscription for agent_tasks and audit_reports
    if (!supabase) return;
    
    const tasksChannel = supabase
      .channel('audits-tasks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_tasks' }, () => {
        fetchData();
      })
      .subscribe();
      
    const reportsChannel = supabase
      .channel('audits-reports-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'audit_reports' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(reportsChannel);
    };
  }, []);

  // Update website URL when client changes
  useEffect(() => {
    if (selectedClientId) {
      const selected = clients.find(c => c.id === selectedClientId);
      if (selected && selected.website_url) {
        setUrl(selected.website_url);
      }
    }
  }, [selectedClientId, clients]);

  const handleRunAudit = async (e) => {
    e.preventDefault();
    if (!url) {
      showError('Please enter a website URL');
      return;
    }

    setRunningAudit(true);
    const skillToRun = packageType === 'full' 
      ? 'agency_full' 
      : packageType === 'starter' 
        ? 'geo_audit' 
        : selectedSkill;

    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      const response = await fetch(`${backendUrl}/audits/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: selectedClientId || null,
          url,
          skill_type: skillToRun,
          package_type: packageType
        })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        showSuccess('Audit task successfully queued! 5 agents are working on it.');
        setUrl('');
        setSelectedClientId('');
        fetchData();
      } else {
        throw new Error(result.error || 'Failed to trigger audit');
      }
    } catch (err) {
      console.error(err);
      showError(err.message);
    } finally {
      setRunningAudit(false);
    }
  };

  const handleDownloadPDF = (report) => {
    // Open new print-friendly window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${report.skill_type.toUpperCase()} Report - ${report.url_audited}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            h1, h2, h3 { color: #0A1E3F; }
            h1 { border-bottom: 2px solid #00E5FF; padding-bottom: 10px; }
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
          <button onclick="window.print()" style="padding: 10px 20px; background: #00E5FF; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; margin-bottom: 20px;">Print / Save as PDF</button>
          <h1>AI Audit Report: ${report.skill_type.toUpperCase()}</h1>
          <div class="meta">
            <strong>Audited URL:</strong> ${report.url_audited}<br/>
            <strong>Date:</strong> ${new Date(report.created_at).toLocaleString()}<br/>
            <strong>Overall Score:</strong> ${report.score_overall || 'N/A'}/100
          </div>
          <div>
            ${report.report_text.replace(/\n/g, '<br/>')}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-main pb-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-main">AI Website Audits</h1>
          <p className="text-text-sub mt-1 text-sm md:text-base">Trigger, monitor, and view deep SEO and digital marketing reports powered by Claude Code skill teams.</p>
        </div>
        <button
          onClick={fetchData}
          className="crm-btn border border-border-main hover:border-primary text-text-main flex items-center gap-2"
        >
          <FaSync className={loadingReports ? 'animate-spin' : ''} /> Refresh Data
        </button>
      </div>

      {/* Form Section */}
      <div className="crm-card bg-bg-card border border-border-main rounded-xl p-8">
        <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
          <FaPlus className="text-primary text-sm" /> Run New AI Audit
        </h2>
        <form onSubmit={handleRunAudit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-text-sub mb-2">Associate with Client (Optional)</label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="crm-input appearance-none bg-bg-card"
                disabled={loadingClients}
              >
                <option value="">Select a Client...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-sub mb-2">Website URL</label>
              <input
                type="url"
                required
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="crm-input"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-text-sub">Select Audit Package</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                onClick={() => setPackageType('starter')}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${packageType === 'starter' ? 'border-primary bg-primary/10' : 'border-border-main bg-bg-card hover:bg-bg-panel'}`}
              >
                <span className="block font-bold text-text-main">Starter Audit</span>
                <span className="text-xs text-text-sub">Runs GEO/SEO + Marketing audits. Ideal for small budgets.</span>
              </div>
              <div 
                onClick={() => setPackageType('full')}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${packageType === 'full' ? 'border-primary bg-primary/10' : 'border-border-main bg-bg-card hover:bg-bg-panel'}`}
              >
                <span className="block font-bold text-text-main">Full Agency Audit</span>
                <span className="text-xs text-text-sub">Recommended. Runs all 5 teams (SEO, Marketing, Ads, Sales, Agency).</span>
              </div>
              <div 
                onClick={() => setPackageType('individual')}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${packageType === 'individual' ? 'border-primary bg-primary/10' : 'border-border-main bg-bg-card hover:bg-bg-panel'}`}
              >
                <span className="block font-bold text-text-main">Custom Target Skill</span>
                <span className="text-xs text-text-sub">Trigger one specific Claude Code audit team directly.</span>
              </div>
            </div>
          </div>

          {packageType === 'individual' && (
            <div className="p-4 bg-bg-panel border border-border-main rounded-lg animate-fadeIn">
              <label className="block text-sm font-semibold text-text-sub mb-2">Target Claude Code Skill</label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="crm-input bg-bg-card"
              >
                <optgroup label="GEO/SEO Suite">
                  <option value="geo_audit">GEO Audit (Main)</option>
                  <option value="geo_quick">GEO Quick</option>
                  <option value="geo_citability">GEO Citability</option>
                  <option value="geo_crawlers">GEO Crawlers</option>
                  <option value="geo_report">GEO Report</option>
                  <option value="geo_technical">GEO Technical</option>
                  <option value="geo_content">GEO Content</option>
                  <option value="geo_schema">GEO Schema</option>
                </optgroup>
                <optgroup label="Marketing Suite">
                  <option value="market_audit">Marketing Audit (Main)</option>
                  <option value="market_competitors">Marketing Competitors</option>
                  <option value="market_seo">Marketing SEO</option>
                  <option value="market_social">Marketing Social</option>
                  <option value="market_ads">Marketing Ads</option>
                  <option value="market_copy">Marketing Copy</option>
                  <option value="market_emails">Marketing Emails</option>
                  <option value="market_proposal">Marketing Proposal</option>
                  <option value="market_report">Marketing Report</option>
                </optgroup>
                <optgroup label="Ads Suite">
                  <option value="ads_strategy">Ads Strategy</option>
                  <option value="ads_audience">Ads Audience</option>
                  <option value="ads_copy">Ads Copy</option>
                  <option value="ads_competitors">Ads Competitors</option>
                  <option value="ads_budget">Ads Budget</option>
                  <option value="ads_report">Ads Report</option>
                </optgroup>
                <optgroup label="Sales Suite">
                  <option value="sales_prospect">Sales Prospecting</option>
                  <option value="sales_research">Sales Research</option>
                  <option value="sales_qualify">Sales Qualification</option>
                  <option value="sales_contacts">Sales Contacts</option>
                </optgroup>
                <optgroup label="Agency Command Center">
                  <option value="agency_onboard">Agency Onboarding</option>
                  <option value="agency_quick">Agency Quick Analysis</option>
                  <option value="agency_propose">Agency Proposal Maker</option>
                </optgroup>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={runningAudit}
            className="crm-btn crm-btn-primary flex items-center justify-center gap-2 w-full md:w-auto px-8"
          >
            {runningAudit ? (
              <>
                <FaSpinner className="animate-spin" /> Starting Agents...
              </>
            ) : (
              <>
                <FaPlay /> Run AI Audit
              </>
            )}
          </button>
        </form>
      </div>

      {/* Active Audits */}
      <div className="crm-card bg-bg-card border border-border-main rounded-xl p-8">
        <h2 className="text-xl font-bold text-text-main mb-6">Active Audits</h2>
        {activeAudits.length === 0 ? (
          <p className="text-text-sub text-sm">No active audits running at the moment.</p>
        ) : (
          <div className="space-y-4">
            {activeAudits.map(task => (
              <div key={task.id} className="flex justify-between items-center p-4 border border-border-main rounded-lg bg-bg-panel animate-pulse">
                <div>
                  <span className="block font-bold text-text-main">{task.message}</span>
                  <span className="text-xs text-text-sub">
                    Client: {task.client?.name || 'N/A'} | Status: <span className="text-primary font-semibold">{task.status.toUpperCase()}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FaSpinner className="animate-spin text-primary" />
                  <span className="text-xs text-text-sub">Executing skill CLI...</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Reports */}
      <div className="crm-card bg-bg-card border border-border-main rounded-xl p-8">
        <h2 className="text-xl font-bold text-text-main mb-6">Completed Reports</h2>
        {loadingReports ? (
          <div className="flex justify-center items-center py-10">
            <FaSpinner className="animate-spin text-primary text-3xl" />
          </div>
        ) : completedReports.length === 0 ? (
          <p className="text-text-sub text-sm">No completed audit reports found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Website URL</th>
                  <th>Audit Type</th>
                  <th>Overall Score</th>
                  <th>Date Completed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {completedReports.map(report => (
                  <tr key={report.id}>
                    <td>{report.client?.name || 'N/A'}</td>
                    <td>
                      <a href={report.url_audited} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {report.url_audited}
                      </a>
                    </td>
                    <td>
                      <span className="px-2.5 py-1 text-xs font-semibold rounded bg-primary/10 text-primary uppercase">
                        {report.skill_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`font-bold ${report.score_overall >= 80 ? 'text-green-400' : report.score_overall >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {report.score_overall ? `${report.score_overall}/100` : 'N/A'}
                      </span>
                    </td>
                    <td>{new Date(report.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewingReport(report)}
                          className="crm-btn border border-border-main hover:border-primary text-text-main p-2 flex items-center justify-center gap-1.5 text-xs"
                          title="View Report"
                        >
                          <FaEye /> View
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(report)}
                          className="crm-btn border border-border-main hover:border-primary text-text-main p-2 flex items-center justify-center gap-1.5 text-xs"
                          title="Print / Save PDF"
                        >
                          <FaDownload /> PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Markdown View Modal */}
      {viewingReport && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card border border-border-main rounded-xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-border-main flex justify-between items-center bg-bg-panel">
              <div>
                <h3 className="text-xl font-bold text-text-main">
                  AI Audit Report: {viewingReport.skill_type.replace('_', ' ').toUpperCase()}
                </h3>
                <p className="text-xs text-text-sub mt-1">
                  URL: {viewingReport.url_audited} | Completed: {new Date(viewingReport.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setViewingReport(null)}
                className="text-text-sub hover:text-text-main transition-colors p-2 rounded-full hover:bg-bg-card"
              >
                <FaTimes size={18} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 prose prose-invert max-w-none prose-cyan bg-bg-card">
              <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg flex justify-between items-center">
                <span className="text-sm font-semibold text-text-main">Overall Audit Evaluation Score:</span>
                <span className={`text-2xl font-black ${viewingReport.score_overall >= 80 ? 'text-green-400' : viewingReport.score_overall >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {viewingReport.score_overall ? `${viewingReport.score_overall}/100` : 'N/A'}
                </span>
              </div>
              <ReactMarkdown className="markdown-content text-text-main">
                {viewingReport.report_text}
              </ReactMarkdown>
            </div>

            <div className="p-6 border-t border-border-main bg-bg-panel flex justify-end gap-3">
              <button
                onClick={() => handleDownloadPDF(viewingReport)}
                className="crm-btn crm-btn-primary flex items-center gap-2"
              >
                <FaDownload /> Download PDF / Print
              </button>
              <button
                onClick={() => setViewingReport(null)}
                className="crm-btn border border-border-main hover:border-primary text-text-main"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Audits;
