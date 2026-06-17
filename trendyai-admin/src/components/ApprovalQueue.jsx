import React, { useState } from 'react';
import { FaClipboardCheck, FaCheck, FaTimes, FaEye, FaFilter, FaClock, FaUser, FaFileAlt } from 'react-icons/fa';
import { useToast } from './Toast';

const ApprovalQueue = () => {
  const { showSuccess, showInfo } = useToast();
  const [approvals, setApprovals] = useState([
    {
      id: 1,
      task: 'Review Blog Post - "10 Marketing Trends"',
      clientId: 1,
      clientName: 'Acme Corporation',
      status: 'Pending',
      type: 'Content Review',
      submittedBy: 'Content Creator',
      submittedAt: '2024-03-15 14:30',
      priority: 'High',
      description: 'Blog post about marketing trends for Q1 2024'
    },
    {
      id: 2,
      task: 'Approve Ad Copy - Social Media Campaign',
      clientId: 2,
      clientName: 'TechStart Solutions',
      status: 'Approved',
      type: 'Ad Copy',
      submittedBy: 'Marketing Specialist',
      submittedAt: '2024-03-14 16:45',
      priority: 'Medium',
      description: 'Facebook and Instagram ad copy for new product launch'
    },
    {
      id: 3,
      task: 'Check Email Sequence - Welcome Series',
      clientId: 1,
      clientName: 'Acme Corporation',
      status: 'Rejected',
      type: 'Email Marketing',
      submittedBy: 'Email Specialist',
      submittedAt: '2024-03-13 11:20',
      priority: 'Low',
      description: 'Welcome email sequence for new subscribers'
    },
    {
      id: 4,
      task: 'Review Landing Page - Product Launch',
      clientId: 3,
      clientName: 'Global Innovations',
      status: 'Revisions Requested',
      type: 'Web Design',
      submittedBy: 'UI Designer',
      submittedAt: '2024-03-12 09:15',
      priority: 'High',
      description: 'Landing page for new product launch campaign'
    }
  ]);

  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const updateStatus = (id, newStatus) => {
    setApprovals(approvals.map(approval => 
      approval.id === id ? { ...approval, status: newStatus } : approval
    ));
    showSuccess(`Task status marked as ${newStatus}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'badge-warning';
      case 'Approved': return 'badge-success';
      case 'Rejected': return 'badge-danger';
      case 'Revisions Requested': return 'badge-info';
      default: return 'badge-info';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20';
      case 'Low': return 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20';
      default: return 'bg-bg-panel text-text-sub border border-border-main';
    }
  };

  const filteredApprovals = approvals.filter(approval => {
    const matchesFilter = filter === 'All' || approval.status === filter;
    const matchesSearch = approval.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="border-b border-border-main pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-main flex items-center gap-2">
          <FaClipboardCheck className="text-primary" />
          Approval Queue
        </h1>
        <p className="text-text-sub mt-1 text-sm md:text-base">Audit generated copies, designs, and templates before publishing to client channels.</p>
      </div>

      {/* Filters and Search */}
      <div className="crm-card space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex items-center gap-2 text-text-sub text-sm font-bold uppercase tracking-wider shrink-0">
            <FaFilter />
            <span>Filter Status</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', 'Pending', 'Approved', 'Rejected', 'Revisions Requested'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`crm-btn py-1 px-3 text-xs ${
                  filter === status
                    ? 'crm-btn-primary'
                    : 'crm-btn-secondary'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search approvals by client or task name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="crm-input text-sm"
          />
        </div>
      </div>

      {/* Approval Tasks List */}
      <div className="space-y-6">
        {filteredApprovals.map((approval) => (
          <div key={approval.id} className="crm-card flex flex-col justify-between">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border-main pb-4 mb-4">
              <div className="space-y-1">
                <span className={`badge ${getStatusColor(approval.status)}`}>
                  {approval.status}
                </span>
                <span className={`badge ${getPriorityColor(approval.priority)} ml-2`}>
                  Priority: {approval.priority}
                </span>
                <h3 className="text-lg font-bold text-text-main pt-1.5">{approval.task}</h3>
                <p className="text-xs text-text-sub font-semibold">
                  Client: <span className="text-text-main">{approval.clientName}</span> | Submitted by: <span className="text-text-main">{approval.submittedBy}</span>
                </p>
              </div>

              <div className="text-xs text-text-muted text-right font-mono flex items-center gap-1.5">
                <FaClock /> {approval.submittedAt}
              </div>
            </div>

            <p className="text-text-sub text-sm mb-6 leading-relaxed">
              {approval.description}
            </p>

            <div className="flex justify-between items-center border-t border-border-main pt-4 mt-2">
              <span className="text-xs text-text-muted bg-bg-panel border border-border-main px-2.5 py-1 rounded">
                Type: {approval.type}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateStatus(approval.id, 'Approved')}
                  disabled={approval.status === 'Approved'}
                  className="crm-btn crm-btn-primary py-1.5 px-3 text-xs"
                >
                  <FaCheck /> Approve
                </button>
                <button
                  onClick={() => updateStatus(approval.id, 'Revisions Requested')}
                  disabled={approval.status === 'Revisions Requested'}
                  className="crm-btn crm-btn-secondary py-1.5 px-3 text-xs"
                >
                  <FaEye /> Request Edits
                </button>
                <button
                  onClick={() => updateStatus(approval.id, 'Rejected')}
                  disabled={approval.status === 'Rejected'}
                  className="crm-btn crm-btn-danger py-1.5 px-3 text-xs"
                >
                  <FaTimes /> Reject
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredApprovals.length === 0 && (
          <div className="text-center py-16 text-text-muted">
            <div className="text-5xl mb-3">✅</div>
            <p className="text-base font-semibold">No pending approvals found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalQueue;