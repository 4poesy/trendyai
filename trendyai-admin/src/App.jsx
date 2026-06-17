import React, { Suspense, useEffect } from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import LoadingSpinner, { PageLoader } from './components/LoadingSpinner';
import Layout from './components/Layout';
import { ThemeProvider } from './contexts/ThemeContext';
import { initializeAgentTraining } from './utils/agentTrainingSystem';

// Lazy load admin components for better performance
const LazyDashboard = React.lazy(() => import('./components/Dashboard'));
const LazyAnalytics = React.lazy(() => import('./components/AnalyticsDashboard'));
const LazyAgentTraining = React.lazy(() => import('./components/AgentTrainingDashboard'));
const ClientsPage = React.lazy(() => import('./components/ClientsPage'));
const ProjectsPage = React.lazy(() => import('./components/ProjectsPage'));
const ApprovalQueue = React.lazy(() => import('./components/ApprovalQueue'));
const AuditLogs = React.lazy(() => import('./components/AuditLogs'));
const AgentStatus = React.lazy(() => import('./components/AgentStatus'));
const StudioMode = React.lazy(() => import('./components/StudioMode'));
const AgentGridNew = React.lazy(() => import('./components/AgentGridNew'));
const LazyLogin = React.lazy(() => import('./components/UnifiedLogin'));

// Lazy load client portal components
const LazyClientDashboard = React.lazy(() => import('./components/ClientDashboard'));
const LazyClientProjectTracker = React.lazy(() => import('./components/ClientProjectTracker'));
const LazyClientRequestPanel = React.lazy(() => import('./components/ClientRequestPanel'));
const LazyClientDeliverables = React.lazy(() => import('./components/ClientDeliverables'));

// Main App with routing for TrendyAI Admin
const App = () => {
  // Initialize agent training system on app start
  useEffect(() => {
    initializeAgentTraining();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <Suspense fallback={<PageLoader message="Loading application..." />}>
              <Routes>
                {/* Full screen login */}
                <Route path="/login" element={<LazyLogin />} />
                
                {/* Main layout wraps all pages */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<LazyDashboard />} />
                  <Route path="clients" element={<ClientsPage />} />
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route path="approval-queue" element={<ApprovalQueue />} />
                  <Route path="audit-logs" element={<AuditLogs />} />
                  <Route path="agent-status" element={<AgentStatus />} />
                  <Route path="studio-mode" element={<StudioMode />} />
                  <Route path="agent-grid" element={<AgentGridNew />} />
                  <Route path="analytics" element={<LazyAnalytics />} />
                  <Route path="agent-training" element={<LazyAgentTraining />} />
                  
                  {/* Client Portal Routes */}
                  <Route path="client" element={<LazyClientDashboard />} />
                  <Route path="client/projects" element={<LazyClientProjectTracker />} />
                  <Route path="client/requests" element={<LazyClientRequestPanel />} />
                  <Route path="client/deliverables" element={<LazyClientDeliverables />} />
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;

