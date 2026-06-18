import React, { useState, useEffect } from 'react';
import { 
  FaClipboardCheck, FaCheck, FaTimes, FaEye, FaFilter, FaClock, 
  FaUser, FaFileAlt, FaSync, FaExclamationCircle, FaArrowLeft, FaSearch
} from 'react-icons/fa';
import { useToast } from './Toast';
import { environment } from '../config/environment';
import { supabase } from '../utils/supabaseClient';

const ApprovalQueue = () => {
  const { showSuccess, showInfo, showError } = useToast();
  
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Revision notes inputs state
  const [activeRevisionId, setActiveRevisionId] = useState(null);
  const [reviewerNotes, setReviewerNotes] = useState({});
  
  // Selected approval for full preview modal
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [filter, setFilter] = useState('pending'); // default to pending approvals
  const [searchTerm, setSearchTerm] = useState('');

  const fetchApprovals = async () => {
    try {
      const response = await fetch(`${environment.backend.baseURL}/tasks/approvals`);
      if (!response.ok) throw new Error(`Server returned status ${response.status}`);
      const data = await response.json();
      if (data.success) {
        setApprovals(data.approvals);
        setError(null);
      } else {
        throw new Error(data.error || 'Failed to fetch approvals');
      }
    } catch (err) {
      console.error('Fetch approvals failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
    
    // Setup real-time updates if Supabase is connected
    if (supabase) {
      console.log('📡 Setting up Supabase real-time subscription for approval_queue...');
      const channel = supabase
        .channel('approval-queue-changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'approval_queue' 
        }, (payload) => {
          console.log('Real-time change detected in approval_queue:', payload);
          fetchApprovals();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      // Fallback: Poll every 7 seconds
      const interval = setInterval(fetchApprovals, 7000);
      return () => clearInterval(interval);
    }
  }, []);

  const handleApprove = async (id) => {
    showInfo('Approving task and queuing for publication...');
    try {
      const response = await fetch(`${environment.backend.baseURL}/tasks/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewer_notes: reviewerNotes[id] || '' })
      });
      
      const data = await response.json();
      if (data.success) {
        showSuccess('Task approved successfully!');
        setApprovals(prev => prev.filter(a => a.id !== id));
        if (selectedApproval?.id === id) setSelectedApproval(null);
      } else {
        throw new Error(data.error || 'Failed to approve task');
      }
    } catch (err) {
      showError(`Error: ${err.message}`);
    }
  };

  const handleReject = async (id) => {
    if (!reviewerNotes[id]?.trim()) {
      showError('Please provide notes explaining the rejection.');
      setActiveRevisionId(id);
      return;
    }
    
    try {
      const response = await fetch(`${environment.backend.baseURL}/tasks/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewer_notes: reviewerNotes[id] })
      });
      
      const data = await response.json();
      if (data.success) {
        showSuccess('Task rejected.');
        setApprovals(prev => prev.filter(a => a.id !== id));
        if (selectedApproval?.id === id) setSelectedApproval(null);
      } else {
        throw new Error(data.error || 'Failed to reject task');
      }
    } catch (err) {
      showError(`Error: ${err.message}`);
    }
  };

  const handleRequestRevision = async (id) => {
    if (!reviewerNotes[id]?.trim()) {
      showError('Please provide revision request instructions.');
      setActiveRevisionId(id);
      return;
    }

    try {
      const response = await fetch(`${environment.backend.baseURL}/tasks/${id}/revision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewer_notes: reviewerNotes[id] })
      });
      
      const data = await response.json();
      if (data.success) {
        showSuccess('Revision request sent to agent.');
        setApprovals(prev => prev.filter(a => a.id !== id));
        setActiveRevisionId(null);
        if (selectedApproval?.id === id) setSelectedApproval(null);
      } else {
        throw new Error(data.error || 'Failed to request revision');
      }
    } catch (err) {
      showError(`Error: ${err.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'approved': return 'badge-success';
      case 'rejected': return 'badge-danger';
      case 'revision_requested': return 'badge-info';
      default: return 'badge-info';
    }
  };

  // Filter pending or matched approvals
  const filteredApprovals = approvals.filter(approval => {
    const matchesFilter = filter === 'All' || approval.status === filter;
    
    const clientName = approval.client?.name || 'Internal Task';
    const outputSummary = approval.output_summary || '';
    const agentName = approval.agent || '';
    
    const matchesSearch = 
      agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      outputSummary.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-main pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-main flex items-center gap-2 font-heading">
            <FaClipboardCheck className="text-primary" />
            Approval Queue
          </h1>
          <p className="text-text-sub mt-1 text-sm md:text-base font-medium">Audit generated copies, designs, and templates before publishing to client channels.</p>
        </div>
        <button 
          onClick={fetchApprovals} 
          disabled={loading}
          className="crm-btn crm-btn-secondary py-2 px-3 text-xs flex items-center gap-1.5 cursor-pointer font-bold"
        >
          <FaSync className={loading ? 'animate-spin' : ''} /> Refresh Queue
        </button>
      </div>

      {/* Filters and Search */}
      <div className="crm-card space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex items-center gap-2 text-text-sub text-sm font-bold uppercase tracking-wider shrink-0">
            <FaFilter />
            <span>Filter Status</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Pending Approvals', value: 'pending' },
              { label: 'Approved', value: 'approved' },
              { label: 'Rejected', value: 'rejected' },
              { label: 'Revisions Requested', value: 'revision_requested' },
              { label: 'All History', value: 'All' }
            ].map(item => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`crm-btn py-1.5 px-3 text-xs font-bold rounded-lg ${
                  filter === item.value
                    ? 'crm-btn-primary'
                    : 'crm-btn-secondary'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-muted">
            <FaSearch className="text-xs" />
          </span>
          <input
            type="text"
            placeholder="Search approvals by client, agent, or content preview..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="crm-input text-sm pl-10"
          />
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="text-center py-12 text-text-sub">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium">Synchronizing approval queue...</p>
        </div>
      )}

      {error && !loading && (
        <div className="crm-card bg-red-500/5 border-red-500/20 text-center py-8 text-red-500 max-w-lg mx-auto flex flex-col items-center gap-2">
          <FaExclamationCircle className="text-3xl" />
          <p className="font-semibold text-sm">Failed to connect to the Railway backend API</p>
          <p className="text-xs text-text-sub font-mono">{error}</p>
          <button onClick={fetchApprovals} className="crm-btn crm-btn-secondary py-1 px-3 text-xs mt-2">Try Again</button>
        </div>
      )}

      {/* Approval Tasks List */}
      {!loading && !error && (
        <div className="space-y-6">
          {filteredApprovals.map((approval) => {
            const summary = approval.output_summary || 'No output summary available.';
            const isTruncated = summary.length > 200;
            const previewText = isTruncated ? `${summary.substring(0, 200)}...` : summary;
            const clientName = approval.client?.name || 'Internal Task';
            const showRevisionForm = activeRevisionId === approval.id;
            
            return (
              <div key={approval.id} className="crm-card flex flex-col justify-between border-l-4 border-primary">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border-main pb-4 mb-4">
                  <div className="space-y-1">
                    <span className={`badge ${getStatusColor(approval.status)} uppercase font-bold text-[9px] tracking-wider`}>
                      {approval.status}
                    </span>
                    <h3 className="text-lg font-bold text-text-main pt-1.5 flex items-center gap-2">
                      <FaUser className="text-xs text-primary" /> {approval.agent} Workspace Output
                    </h3>
                    <p className="text-xs text-text-sub font-semibold">
                      Client Campaign: <span className="text-text-main">{clientName}</span>
                    </p>
                  </div>

                  <div className="text-xs text-text-muted text-right font-mono flex items-center gap-1.5 justify-end">
                    <FaClock /> {new Date(approval.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="text-text-sub text-sm mb-6 leading-relaxed font-medium bg-bg-panel/40 p-4 border border-border-main/50 rounded-xl whitespace-pre-wrap">
                  {previewText}
                  {isTruncated && (
                    <button 
                      onClick={() => setSelectedApproval(approval)}
                      className="text-primary hover:text-primary-hover font-bold ml-1.5 text-xs underline focus:outline-none"
                    >
                      Read Full Output
                    </button>
                  )}
                </div>

                {/* Revision Notes Textarea box */}
                {showRevisionForm && (
                  <div className="mb-6 bg-bg-panel border border-border-main/60 p-4 rounded-xl space-y-3">
                    <label className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Notes / Instructions for revision or rejection</label>
                    <textarea
                      value={reviewerNotes[approval.id] || ''}
                      onChange={(e) => setReviewerNotes(prev => ({ ...prev, [approval.id]: e.target.value }))}
                      placeholder="Specify what needs to be changed..."
                      className="crm-input h-20 text-xs resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setActiveRevisionId(null)}
                        className="crm-btn crm-btn-secondary py-1 px-3 text-xs"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleRequestRevision(approval.id)}
                        className="crm-btn crm-btn-primary py-1 px-3 text-xs"
                      >
                        Send Revision Request
                      </button>
                      <button 
                        onClick={() => handleReject(approval.id)}
                        className="crm-btn crm-btn-danger py-1 px-3 text-xs"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-t border-border-main pt-4 mt-2 gap-4">
                  <span className="text-xs text-text-muted bg-bg-panel border border-border-main px-2.5 py-1 rounded w-fit font-semibold font-mono">
                    Task ID: {approval.task_id?.substring(0, 8)}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setSelectedApproval(approval)}
                      className="crm-btn crm-btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 font-bold"
                    >
                      <FaFileAlt /> View Full Output
                    </button>
                    {approval.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(approval.id)}
                          className="crm-btn crm-btn-primary py-1.5 px-3.5 text-xs flex items-center gap-1 font-bold"
                        >
                          <FaCheck /> Approve
                        </button>
                        {!showRevisionForm && (
                          <button
                            onClick={() => {
                              setActiveRevisionId(approval.id);
                              setSelectedApproval(null);
                            }}
                            className="crm-btn crm-btn-secondary py-1.5 px-3.5 text-xs flex items-center gap-1 font-bold"
                          >
                            <FaEye /> Request Edits
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredApprovals.length === 0 && (
            <div className="text-center py-16 text-text-muted crm-card">
              <div className="text-5xl mb-3">✅</div>
              <p className="text-base font-bold text-text-main">No pending approvals found</p>
              <p className="text-xs text-text-sub mt-1">Guidelines and assets are in sync.</p>
            </div>
          )}
        </div>
      )}

      {/* Full Preview Modal */}
      {selectedApproval && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border-main rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-zoomIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-border-main bg-bg-panel">
              <div>
                <h3 className="font-extrabold text-lg text-text-main tracking-tight font-heading">
                  {selectedApproval.agent} Workspace Output Detail
                </h3>
                <p className="text-xs text-text-sub font-semibold mt-0.5">
                  Client: {selectedApproval.client?.name || 'Internal'}
                </p>
              </div>
              <button 
                onClick={() => setSelectedApproval(null)}
                className="text-text-muted hover:text-text-main cursor-pointer p-1.5 hover:bg-bg-panel border border-transparent hover:border-border-main rounded-lg transition-all"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-1 bg-bg-panel border border-border-main/40 p-4 rounded-xl">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Structured JSON/Full Output payload</span>
                <pre className="text-xs text-text-main font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {typeof selectedApproval.output_full === 'object' 
                    ? JSON.stringify(selectedApproval.output_full, null, 2)
                    : selectedApproval.output_full}
                </pre>
              </div>

              {selectedApproval.reviewer_notes && (
                <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-xl">
                  <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block">Reviewer Notes / Instructions</span>
                  <p className="text-xs text-text-sub font-medium mt-1 leading-relaxed">{selectedApproval.reviewer_notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border-main bg-bg-panel flex justify-between items-center gap-4">
              <button 
                onClick={() => setSelectedApproval(null)}
                className="crm-btn crm-btn-secondary py-2 px-4 text-xs font-bold"
              >
                Close Output Detail
              </button>
              
              {selectedApproval.status === 'pending' && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const notes = reviewerNotes[selectedApproval.id] || '';
                      if (!notes.trim()) {
                        setActiveRevisionId(selectedApproval.id);
                        showInfo('Please fill out the notes box below the card for revision.');
                        setSelectedApproval(null);
                        return;
                      }
                      handleRequestRevision(selectedApproval.id);
                    }}
                    className="crm-btn crm-btn-secondary py-2 px-4 text-xs font-bold"
                  >
                    <FaEye /> Request Revision
                  </button>
                  <button 
                    onClick={() => handleApprove(selectedApproval.id)}
                    className="crm-btn crm-btn-primary py-2 px-4 text-xs font-bold"
                  >
                    <FaCheck /> Approve & Publish
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalQueue;