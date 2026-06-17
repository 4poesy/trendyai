import React, { useState, useEffect } from 'react';
import { FaDatabase, FaUsers, FaFolder, FaChartBar, FaCog, FaSync, FaTrash, FaDownload, FaUpload, FaEye, FaEyeSlash, FaShieldAlt, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const PuterIntegrationDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [systemStats, setSystemStats] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [files, setFiles] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Load all dashboard data
  const loadDashboardData = async () => {
    setIsLoading(true);
    
    try {
      // Load system stats
      const statsResult = await fetch('/api/system-stats');
      if (statsResult.ok) {
        const stats = await statsResult.json();
        setSystemStats(stats);
      }

      // Load audit logs
      const logsResult = await fetch('/api/audit-logs?limit=50');
      if (logsResult.ok) {
        const logs = await logsResult.json();
        setAuditLogs(logs);
      }

      // Load files
      const filesResult = await fetch('/api/files');
      if (filesResult.ok) {
        const files = await filesResult.json();
        setFiles(files);
      }

      // Load clients
      const clientsResult = await fetch('/api/clients');
      if (clientsResult.ok) {
        const clients = await clientsResult.json();
        setClients(clients);
      }

      // Load projects
      const projectsResult = await fetch('/api/projects');
      if (projectsResult.ok) {
        const projects = await projectsResult.json();
        setProjects(projects);
      }
    } catch (error) {
      console.error('❌ Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all data
  const handleClearAllData = async () => {
    setIsLoading(true);
    
    try {
      const result = await fetch('/api/clear-all-data', {
        method: 'POST'
      });
      if (result.ok) {
        setSystemStats(null);
        setAuditLogs([]);
        setFiles([]);
        setClients([]);
        setProjects([]);
        setShowConfirmClear(false);
      }
    } catch (error) {
      console.error('❌ Failed to clear data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Export data
  const handleExportData = async () => {
    setIsLoading(true);
    
    try {
      const exportData = {
        stats: systemStats,
        clients,
        projects,
        auditLogs,
        exportDate: new Date().toISOString()
      };
      
      const fileName = `trendyai_export_${new Date().toISOString().split('T')[0]}.json`;
      const result = await fetch('/api/save-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileName, data: JSON.stringify(exportData, null, 2) })
      });
      
      if (result.ok) {
        console.log('✅ Data exported successfully');
      }
    } catch (error) {
      console.error('❌ Failed to export data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Log action
  const handleLogAction = async (action, details) => {
    try {
      const result = await fetch('/api/log-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, details })
      });
      if (result.ok) {
        // Reload audit logs
        loadDashboardData();
      }
    } catch (error) {
      console.error('❌ Failed to log action:', error);
    }
  };

  // Render overview tab
  const renderOverview = () => (
    <div className="space-y-6">
      {/* System Status */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-cyan-500 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-navy-900">System Status</h3>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              systemStats ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm text-navy-900/70">
              {systemStats ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        {systemStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
              <div className="text-2xl font-bold text-cyan-600">{systemStats.totalClients}</div>
              <div className="text-sm text-cyan-700">Total Clients</div>
            </div>
            <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
              <div className="text-2xl font-bold text-cyan-600">{systemStats.totalProjects}</div>
              <div className="text-sm text-cyan-700">Total Projects</div>
            </div>
            <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
              <div className="text-2xl font-bold text-cyan-600">{systemStats.totalLogEntries}</div>
              <div className="text-sm text-cyan-700">Audit Logs</div>
            </div>
            <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
              <div className="text-2xl font-bold text-cyan-600">{files.length}</div>
              <div className="text-sm text-cyan-700">Files</div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-cyan-500 p-6">
        <h3 className="text-lg font-semibold text-navy-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {auditLogs.slice(0, 5).map((log, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg border border-cyan-200">
              <div>
                <div className="font-medium text-navy-900">{log.action}</div>
                <div className="text-sm text-navy-900/70">{log.details}</div>
              </div>
              <div className="text-xs text-navy-900/50">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render clients tab
  const renderClients = () => (
    <div className="bg-white rounded-xl shadow-lg border-2 border-cyan-500 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-navy-900">Clients</h3>
        <button
          onClick={() => handleLogAction('view_clients', { count: clients.length })}
          className="px-4 py-2 bg-cyan-500 text-navy-900 rounded-lg hover:bg-cyan-400 transition-colors"
        >
          Refresh
        </button>
      </div>
      
      <div className="space-y-3">
        {clients.map((client) => (
          <div key={client.id} className="flex items-center justify-between p-4 border border-cyan-200 rounded-lg">
            <div>
              <div className="font-medium text-navy-900">{client.name || client.id}</div>
              <div className="text-sm text-navy-900/70">{client.email || 'No email'}</div>
            </div>
            <div className="text-xs text-navy-900/50">
              {new Date(client.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
        
        {clients.length === 0 && (
          <div className="text-center py-8 text-navy-900/70">
            No clients found
          </div>
        )}
      </div>
    </div>
  );

  // Render projects tab
  const renderProjects = () => (
    <div className="bg-white rounded-xl shadow-lg border-2 border-cyan-500 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-navy-900">Projects</h3>
        <button
          onClick={() => handleLogAction('view_projects', { count: projects.length })}
          className="px-4 py-2 bg-cyan-500 text-navy-900 rounded-lg hover:bg-cyan-400 transition-colors"
        >
          Refresh
        </button>
      </div>
      
      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center justify-between p-4 border border-cyan-200 rounded-lg">
            <div>
              <div className="font-medium text-navy-900">{project.name || project.id}</div>
              <div className="text-sm text-navy-900/70">{project.description || 'No description'}</div>
            </div>
            <div className="text-xs text-navy-900/50">
              {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
        
        {projects.length === 0 && (
          <div className="text-center py-8 text-navy-900/70">
            No projects found
          </div>
        )}
      </div>
    </div>
  );

  // Render files tab
  const renderFiles = () => (
    <div className="bg-white rounded-xl shadow-lg border-2 border-cyan-500 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-navy-900">Files</h3>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-cyan-500 text-navy-900 rounded-lg hover:bg-cyan-400 transition-colors"
        >
          Refresh
        </button>
      </div>
      
      <div className="space-y-3">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-4 border border-cyan-200 rounded-lg">
            <div className="flex items-center gap-3">
              <FaFolder className="text-cyan-500" />
              <div>
                <div className="font-medium text-navy-900">{file.name}</div>
                <div className="text-sm text-navy-900/70">{file.path}</div>
              </div>
            </div>
            <div className="text-xs text-navy-900/50">
              {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown size'}
            </div>
          </div>
        ))}
        
        {files.length === 0 && (
          <div className="text-center py-8 text-navy-900/70">
            No files found
          </div>
        )}
      </div>
    </div>
  );

  // Render audit logs tab
  const renderAuditLogs = () => (
    <div className="bg-white rounded-xl shadow-lg border-2 border-cyan-500 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-navy-900">Audit Logs</h3>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-cyan-500 text-navy-900 rounded-lg hover:bg-cyan-400 transition-colors"
        >
          Refresh
        </button>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {auditLogs.map((log, index) => (
          <div key={index} className="p-4 border border-cyan-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-navy-900">{log.action}</div>
              <div className="text-xs text-navy-900/50">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
            <div className="text-sm text-navy-900/70">{log.details}</div>
            <div className="text-xs text-navy-900/50 mt-1">User: {log.userId}</div>
          </div>
        ))}
        
        {auditLogs.length === 0 && (
          <div className="text-center py-8 text-navy-900/70">
            No audit logs found
          </div>
        )}
      </div>
    </div>
  );

  // Render settings tab
  const renderSettings = () => (
    <div className="space-y-6">
      {/* Data Management */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-cyan-500 p-6">
        <h3 className="text-lg font-semibold text-navy-900 mb-4">Data Management</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-cyan-200 rounded-lg">
            <div>
              <div className="font-medium text-navy-900">Export All Data</div>
              <div className="text-sm text-navy-900/70">Download all data as JSON file</div>
            </div>
            <button
              onClick={handleExportData}
              disabled={isLoading}
              className="px-4 py-2 bg-cyan-500 text-navy-900 rounded-lg hover:bg-cyan-400 transition-colors disabled:bg-gray-300"
            >
              {isLoading ? 'Exporting...' : 'Export'}
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-cyan-200 rounded-lg">
            <div>
              <div className="font-medium text-navy-900">Clear All Data</div>
              <div className="text-sm text-navy-900/70">⚠️ This action cannot be undone</div>
            </div>
            <button
              onClick={() => setShowConfirmClear(true)}
              disabled={isLoading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-colors disabled:bg-gray-300"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-cyan-500 p-6">
        <h3 className="text-lg font-semibold text-navy-900 mb-4">System Information</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-navy-900/70">System Status:</span>
            <span className={`font-medium ${
              systemStats ? 'text-green-600' : 'text-red-600'
            }`}>
              {systemStats ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-navy-900/70">Last Updated:</span>
            <span className="text-navy-900">
              {systemStats?.lastUpdated ? new Date(systemStats.lastUpdated).toLocaleString() : 'Never'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Tab navigation
  const tabs = [
    { id: 'overview', name: 'Overview', icon: <FaChartBar /> },
    { id: 'clients', name: 'Clients', icon: <FaUsers /> },
    { id: 'projects', name: 'Projects', icon: <FaFolder /> },
    { id: 'files', name: 'Files', icon: <FaDatabase /> },
    { id: 'audit', name: 'Audit Logs', icon: <FaEye /> },
    { id: 'settings', name: 'Settings', icon: <FaCog /> }
  ];

  return (
    <div className="min-h-screen bg-navy-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <FaShieldAlt className="text-2xl text-cyan-500" />
          <h1 className="text-2xl font-bold text-white">Puter.js Integration Dashboard</h1>
        </div>
        <p className="text-white/80">Monitor and manage your Puter.js data and system status</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-cyan-500 mb-6">
        <div className="flex border-b border-cyan-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-cyan-500 border-b-2 border-cyan-500'
                  : 'text-navy-900/70 hover:text-navy-900'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'clients' && renderClients()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'files' && renderFiles()}
        {activeTab === 'audit' && renderAuditLogs()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* Confirm Clear Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg border-2 border-cyan-500 p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationTriangle className="text-2xl text-red-500" />
              <h3 className="text-lg font-semibold text-navy-900">Clear All Data</h3>
            </div>
            
            <p className="text-navy-900/70 mb-6">
              This action will permanently delete all clients, projects, files, and audit logs. 
              This cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleClearAllData}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-colors disabled:bg-gray-300"
              >
                {isLoading ? 'Clearing...' : 'Yes, Clear All'}
              </button>
              <button
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-navy-900 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PuterIntegrationDashboard; 