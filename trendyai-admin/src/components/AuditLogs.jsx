import React, { useState } from 'react';
import { FaClipboardList, FaSearch, FaFilter, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { useToast } from './Toast';

const AuditLogs = () => {
  const { showSuccess } = useToast();
  const [logs] = useState([
    {
      id: 1,
      timestamp: '2024-03-15 16:30:45',
      action: 'User Login',
      user: 'admin@trendyai.com',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'Success',
      details: 'Successful login from desktop browser',
      severity: 'Info'
    },
    {
      id: 2,
      timestamp: '2024-03-15 16:25:12',
      action: 'Project Created',
      user: 'admin@trendyai.com',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'Success',
      details: 'Created project "Social Media Campaign" for Acme Corporation',
      severity: 'Info'
    },
    {
      id: 3,
      timestamp: '2024-03-15 16:20:33',
      action: 'Client Added',
      user: 'jane@trendyai.com',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      status: 'Success',
      details: 'Added new client "Global Innovations"',
      severity: 'Info'
    },
    {
      id: 4,
      timestamp: '2024-03-15 16:15:08',
      action: 'Approval Rejected',
      user: 'admin@trendyai.com',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'Success',
      details: 'Rejected approval for "Email Sequence - Welcome Series"',
      severity: 'Warning'
    },
    {
      id: 5,
      timestamp: '2024-03-15 16:10:22',
      action: 'Failed Login Attempt',
      user: 'unknown@example.com',
      ipAddress: '203.0.113.45',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'Failed',
      details: 'Invalid password for user account',
      severity: 'Error'
    },
    {
      id: 6,
      timestamp: '2024-03-15 16:05:15',
      action: 'Agent Status Updated',
      user: 'system@trendyai.com',
      ipAddress: '127.0.0.1',
      userAgent: 'TrendyAI-System/1.0',
      status: 'Success',
      details: 'Agent "ContentCreator" status changed to "Active"',
      severity: 'Info'
    },
    {
      id: 7,
      timestamp: '2024-03-15 16:00:42',
      action: 'Data Export',
      user: 'admin@trendyai.com',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'Success',
      details: 'Exported client data to CSV format',
      severity: 'Info'
    },
    {
      id: 8,
      timestamp: '2024-03-15 15:55:18',
      action: 'Permission Denied',
      user: 'user@trendyai.com',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)',
      status: 'Failed',
      details: 'Attempted to access admin panel without proper permissions',
      severity: 'Warning'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Error': return 'badge-danger';
      case 'Warning': return 'badge-warning';
      case 'Info': return 'badge-info';
      default: return 'badge-info';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Success': return <FaCheckCircle className="text-green-500" />;
      case 'Failed': return <FaExclamationTriangle className="text-red-500" />;
      default: return <FaInfoCircle className="text-primary" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Success': return 'badge-success';
      case 'Failed': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);
    
    const matchesUser = userFilter === 'All' || log.user === userFilter;
    const matchesAction = actionFilter === 'All' || log.action === actionFilter;
    const matchesSeverity = severityFilter === 'All' || log.severity === severityFilter;
    
    return matchesSearch && matchesUser && matchesAction && matchesSeverity;
  });

  const exportLogs = () => {
    const csvContent = [
      ['ID', 'Timestamp', 'User', 'Action', 'Severity', 'Status', 'IP Address', 'Details'],
      ...filteredLogs.map(log => [
        log.id,
        log.timestamp,
        log.user,
        log.action,
        log.severity,
        log.status,
        log.ipAddress,
        log.details
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showSuccess('Audit logs exported successfully');
  };

  const uniqueUsers = Array.from(new Set(logs.map(log => log.user)));
  const uniqueActions = Array.from(new Set(logs.map(log => log.action)));
  const uniqueSeverities = Array.from(new Set(logs.map(log => log.severity)));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-main pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-main flex items-center gap-2">
            <FaClipboardList className="text-primary" />
            Audit Logs
          </h1>
          <p className="text-text-sub mt-1 text-sm md:text-base">Comprehensive audit trail of all system activities, agent requests, and login events.</p>
        </div>
        <button
          onClick={exportLogs}
          className="crm-btn crm-btn-primary"
        >
          Export Logs to CSV
        </button>
      </div>

      {/* Filters (Breathing card space) */}
      <div className="crm-card">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-sub mb-4">Filter Audit Stream</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-text-muted mb-2">Search Input</label>
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="crm-input text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-text-muted mb-2">User account</label>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="crm-input text-xs"
            >
              <option value="All">All Users</option>
              {uniqueUsers.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-text-muted mb-2">Action / Operations</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="crm-input text-xs"
            >
              <option value="All">All Actions</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-text-muted mb-2">Severity Level</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="crm-input text-xs"
            >
              <option value="All">All Severities</option>
              {uniqueSeverities.map(severity => (
                <option key={severity} value={severity}>{severity}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Log Feed List */}
      <div className="crm-card">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-sub mb-6">Logs History</h3>
        
        {filteredLogs.length === 0 ? (
          <div className="text-center py-10 text-text-muted">
            <FaClipboardList className="mx-auto text-3xl mb-3" />
            <p className="text-sm">No log entries matched your search criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map(log => (
              <div 
                key={log.id} 
                className="p-5 bg-bg-panel border border-border-main rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-text-muted">{log.timestamp}</span>
                    <h4 className="font-bold text-text-main text-sm md:text-base">{log.action}</h4>
                    <span className={`badge ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </span>
                    <span className={`badge ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </div>
                  
                  <p className="text-xs md:text-sm text-text-sub font-semibold">
                    User: <span className="font-mono font-medium text-text-main">{log.user}</span> | IP: <span className="font-mono font-medium text-text-main">{log.ipAddress}</span>
                  </p>
                  
                  <p className="text-xs text-text-sub leading-relaxed font-sans bg-bg-card border border-border-main/50 px-3 py-2 rounded">
                    {log.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;