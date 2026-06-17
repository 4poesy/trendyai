// Advanced Analytics and Insights System
// Provides comprehensive analytics for user behavior, agent performance, and system optimization

export class AnalyticsSystem {
  constructor() {
    this.events = [];
    this.metrics = new Map();
    this.insights = new Map();
    this.reports = new Map();
    this.dashboards = new Map();
    this.alerts = new Map();
    this.dataRetentionDays = 90;
  }

  // Event Tracking
  trackEvent(eventType, eventData, userId = null, agentId = null) {
    const event = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: eventType,
      data: eventData,
      userId,
      agentId,
      timestamp: Date.now(),
      sessionId: eventData.sessionId || null,
      metadata: eventData.metadata || {}
    };

    this.events.push(event);
    this.updateMetrics(event);
    this.checkAlerts(event);
    this.cleanupOldEvents();

    return event;
  }

  // Metric Updates
  updateMetrics(event) {
    const { type, data, userId, agentId } = event;
    
    // Update global metrics
    this.updateGlobalMetrics(type, data);
    
    // Update user-specific metrics
    if (userId) {
      this.updateUserMetrics(userId, type, data);
    }
    
    // Update agent-specific metrics
    if (agentId) {
      this.updateAgentMetrics(agentId, type, data);
    }
    
    // Update session metrics
    if (data.sessionId) {
      this.updateSessionMetrics(data.sessionId, type, data);
    }
  }

  updateGlobalMetrics(eventType, data) {
    const globalMetrics = this.metrics.get('global') || {
      totalEvents: 0,
      eventsByType: {},
      activeUsers: new Set(),
      activeAgents: new Set(),
      systemPerformance: {
        averageResponseTime: 0,
        errorRate: 0,
        throughput: 0
      }
    };

    globalMetrics.totalEvents++;
    globalMetrics.eventsByType[eventType] = (globalMetrics.eventsByType[eventType] || 0) + 1;

    // Update active users/agents
    if (data.userId) globalMetrics.activeUsers.add(data.userId);
    if (data.agentId) globalMetrics.activeAgents.add(data.agentId);

    // Update performance metrics
    if (data.responseTime) {
      globalMetrics.systemPerformance.averageResponseTime = 
        (globalMetrics.systemPerformance.averageResponseTime * (globalMetrics.totalEvents - 1) + data.responseTime) / 
        globalMetrics.totalEvents;
    }

    if (data.error) {
      globalMetrics.systemPerformance.errorRate = 
        (globalMetrics.systemPerformance.errorRate * (globalMetrics.totalEvents - 1) + 1) / 
        globalMetrics.totalEvents;
    }

    this.metrics.set('global', globalMetrics);
  }

  updateUserMetrics(userId, eventType, data) {
    const userMetrics = this.metrics.get(`user_${userId}`) || {
      userId,
      totalEvents: 0,
      eventsByType: {},
      sessions: new Set(),
      lastActivity: null,
      preferences: {},
      performance: {
        averageSessionDuration: 0,
        tasksCompleted: 0,
        successRate: 0
      }
    };

    userMetrics.totalEvents++;
    userMetrics.eventsByType[eventType] = (userMetrics.eventsByType[eventType] || 0) + 1;
    userMetrics.lastActivity = Date.now();

    if (data.sessionId) {
      userMetrics.sessions.add(data.sessionId);
    }

    // Update performance metrics
    if (data.sessionDuration) {
      userMetrics.performance.averageSessionDuration = 
        (userMetrics.performance.averageSessionDuration * (userMetrics.totalEvents - 1) + data.sessionDuration) / 
        userMetrics.totalEvents;
    }

    if (data.taskCompleted) {
      userMetrics.performance.tasksCompleted++;
    }

    if (data.taskSuccess !== undefined) {
      userMetrics.performance.successRate = 
        (userMetrics.performance.successRate * (userMetrics.performance.tasksCompleted - 1) + (data.taskSuccess ? 1 : 0)) / 
        userMetrics.performance.tasksCompleted;
    }

    this.metrics.set(`user_${userId}`, userMetrics);
  }

  updateAgentMetrics(agentId, eventType, data) {
    const agentMetrics = this.metrics.get(`agent_${agentId}`) || {
      agentId,
      totalEvents: 0,
      eventsByType: {},
      tasksCompleted: 0,
      performance: {
        averageResponseTime: 0,
        successRate: 0,
        userSatisfaction: 0,
        utilization: 0
      },
      lastActivity: null
    };

    agentMetrics.totalEvents++;
    agentMetrics.eventsByType[eventType] = (agentMetrics.eventsByType[eventType] || 0) + 1;
    agentMetrics.lastActivity = Date.now();

    // Update performance metrics
    if (data.responseTime) {
      agentMetrics.performance.averageResponseTime = 
        (agentMetrics.performance.averageResponseTime * (agentMetrics.totalEvents - 1) + data.responseTime) / 
        agentMetrics.totalEvents;
    }

    if (data.taskCompleted) {
      agentMetrics.tasksCompleted++;
    }

    if (data.taskSuccess !== undefined) {
      agentMetrics.performance.successRate = 
        (agentMetrics.performance.successRate * (agentMetrics.tasksCompleted - 1) + (data.taskSuccess ? 1 : 0)) / 
        agentMetrics.tasksCompleted;
    }

    if (data.userSatisfaction !== undefined) {
      agentMetrics.performance.userSatisfaction = 
        (agentMetrics.performance.userSatisfaction * (agentMetrics.totalEvents - 1) + data.userSatisfaction) / 
        agentMetrics.totalEvents;
    }

    this.metrics.set(`agent_${agentId}`, agentMetrics);
  }

  updateSessionMetrics(sessionId, eventType, data) {
    const sessionMetrics = this.metrics.get(`session_${sessionId}`) || {
      sessionId,
      startTime: Date.now(),
      totalEvents: 0,
      eventsByType: {},
      duration: 0,
      userInteractions: 0,
      agentInteractions: 0
    };

    sessionMetrics.totalEvents++;
    sessionMetrics.eventsByType[eventType] = (sessionMetrics.eventsByType[eventType] || 0) + 1;
    sessionMetrics.duration = Date.now() - sessionMetrics.startTime;

    if (eventType === 'user_interaction') {
      sessionMetrics.userInteractions++;
    } else if (eventType === 'agent_interaction') {
      sessionMetrics.agentInteractions++;
    }

    this.metrics.set(`session_${sessionId}`, sessionMetrics);
  }

  // Insights Generation
  generateInsights(timeRange = '24h') {
    const insights = {
      timestamp: Date.now(),
      timeRange,
      userInsights: this.generateUserInsights(timeRange),
      agentInsights: this.generateAgentInsights(timeRange),
      systemInsights: this.generateSystemInsights(timeRange),
      recommendations: this.generateRecommendations(timeRange)
    };

    this.insights.set(`insights_${Date.now()}`, insights);
    return insights;
  }

  generateUserInsights(timeRange) {
    const userMetrics = Array.from(this.metrics.entries())
      .filter(([key]) => key.startsWith('user_'))
      .map(([key, metrics]) => metrics);

    const insights = {
      totalActiveUsers: userMetrics.length,
      averageSessionDuration: 0,
      mostActiveUsers: [],
      userEngagementTrends: {},
      popularFeatures: {}
    };

    if (userMetrics.length > 0) {
      insights.averageSessionDuration = userMetrics.reduce((sum, metrics) => 
        sum + metrics.performance.averageSessionDuration, 0) / userMetrics.length;

      insights.mostActiveUsers = userMetrics
        .sort((a, b) => b.totalEvents - a.totalEvents)
        .slice(0, 10)
        .map(metrics => ({
          userId: metrics.userId,
          totalEvents: metrics.totalEvents,
          lastActivity: metrics.lastActivity
        }));

      // Analyze engagement trends
      userMetrics.forEach(metrics => {
        Object.keys(metrics.eventsByType).forEach(eventType => {
          insights.userEngagementTrends[eventType] = 
            (insights.userEngagementTrends[eventType] || 0) + metrics.eventsByType[eventType];
        });
      });
    }

    return insights;
  }

  generateAgentInsights(timeRange) {
    const agentMetrics = Array.from(this.metrics.entries())
      .filter(([key]) => key.startsWith('agent_'))
      .map(([key, metrics]) => metrics);

    const insights = {
      totalActiveAgents: agentMetrics.length,
      averageSuccessRate: 0,
      topPerformingAgents: [],
      agentUtilization: {},
      performanceTrends: {}
    };

    if (agentMetrics.length > 0) {
      insights.averageSuccessRate = agentMetrics.reduce((sum, metrics) => 
        sum + metrics.performance.successRate, 0) / agentMetrics.length;

      insights.topPerformingAgents = agentMetrics
        .sort((a, b) => b.performance.successRate - a.performance.successRate)
        .slice(0, 5)
        .map(metrics => ({
          agentId: metrics.agentId,
          successRate: metrics.performance.successRate,
          tasksCompleted: metrics.tasksCompleted,
          averageResponseTime: metrics.performance.averageResponseTime
        }));

      // Analyze utilization
      agentMetrics.forEach(metrics => {
        insights.agentUtilization[metrics.agentId] = {
          tasksCompleted: metrics.tasksCompleted,
          lastActivity: metrics.lastActivity,
          utilization: metrics.performance.utilization
        };
      });
    }

    return insights;
  }

  generateSystemInsights(timeRange) {
    const globalMetrics = this.metrics.get('global');
    const recentEvents = this.getEventsInTimeRange(timeRange);

    const insights = {
      systemHealth: {
        averageResponseTime: globalMetrics?.systemPerformance.averageResponseTime || 0,
        errorRate: globalMetrics?.systemPerformance.errorRate || 0,
        throughput: recentEvents.length / this.getTimeRangeInHours(timeRange)
      },
      eventDistribution: {},
      performanceTrends: {},
      resourceUtilization: {}
    };

    // Analyze event distribution
    recentEvents.forEach(event => {
      insights.eventDistribution[event.type] = 
        (insights.eventDistribution[event.type] || 0) + 1;
    });

    return insights;
  }

  generateRecommendations(timeRange) {
    const recommendations = [];
    const userInsights = this.generateUserInsights(timeRange);
    const agentInsights = this.generateAgentInsights(timeRange);
    const systemInsights = this.generateSystemInsights(timeRange);

    // User engagement recommendations
    if (userInsights.averageSessionDuration < 300000) { // 5 minutes
      recommendations.push({
        type: 'user_engagement',
        priority: 'high',
        title: 'Low User Engagement',
        description: 'Average session duration is below optimal levels',
        suggestion: 'Consider improving onboarding and feature discovery'
      });
    }

    // Agent performance recommendations
    if (agentInsights.averageSuccessRate < 0.8) {
      recommendations.push({
        type: 'agent_performance',
        priority: 'medium',
        title: 'Agent Performance Optimization',
        description: 'Average agent success rate could be improved',
        suggestion: 'Review agent training data and response patterns'
      });
    }

    // System performance recommendations
    if (systemInsights.systemHealth.errorRate > 0.05) {
      recommendations.push({
        type: 'system_health',
        priority: 'high',
        title: 'High Error Rate Detected',
        description: 'System error rate exceeds acceptable threshold',
        suggestion: 'Investigate error patterns and implement fixes'
      });
    }

    return recommendations;
  }

  // Report Generation
  generateReport(reportType, parameters = {}) {
    const report = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: reportType,
      parameters,
      generatedAt: Date.now(),
      data: null
    };

    switch (reportType) {
      case 'user_activity':
        report.data = this.generateUserActivityReport(parameters);
        break;
      case 'agent_performance':
        report.data = this.generateAgentPerformanceReport(parameters);
        break;
      case 'system_health':
        report.data = this.generateSystemHealthReport(parameters);
        break;
      case 'workflow_analytics':
        report.data = this.generateWorkflowAnalyticsReport(parameters);
        break;
      default:
        throw new Error(`Unknown report type: ${reportType}`);
    }

    this.reports.set(report.id, report);
    return report;
  }

  generateUserActivityReport(parameters) {
    const { timeRange = '7d', userId = null } = parameters;
    const events = this.getEventsInTimeRange(timeRange);
    
    const userEvents = userId ? 
      events.filter(event => event.userId === userId) : 
      events.filter(event => event.userId);

    return {
      totalUsers: new Set(userEvents.map(event => event.userId)).size,
      totalSessions: new Set(userEvents.map(event => event.data.sessionId)).size,
      averageSessionDuration: this.calculateAverageSessionDuration(userEvents),
      mostActiveFeatures: this.getMostActiveFeatures(userEvents),
      userRetention: this.calculateUserRetention(userEvents),
      engagementMetrics: this.calculateEngagementMetrics(userEvents)
    };
  }

  generateAgentPerformanceReport(parameters) {
    const { timeRange = '7d', agentId = null } = parameters;
    const events = this.getEventsInTimeRange(timeRange);
    
    const agentEvents = agentId ? 
      events.filter(event => event.agentId === agentId) : 
      events.filter(event => event.agentId);

    return {
      totalAgents: new Set(agentEvents.map(event => event.agentId)).size,
      averageSuccessRate: this.calculateAverageSuccessRate(agentEvents),
      responseTimeAnalysis: this.analyzeResponseTimes(agentEvents),
      taskDistribution: this.getTaskDistribution(agentEvents),
      performanceTrends: this.getPerformanceTrends(agentEvents)
    };
  }

  generateSystemHealthReport(parameters) {
    const { timeRange = '24h' } = parameters;
    const events = this.getEventsInTimeRange(timeRange);
    const globalMetrics = this.metrics.get('global');

    return {
      systemUptime: this.calculateSystemUptime(events),
      errorAnalysis: this.analyzeErrors(events),
      performanceMetrics: globalMetrics?.systemPerformance || {},
      resourceUtilization: this.getResourceUtilization(events),
      capacityPlanning: this.getCapacityPlanning(events)
    };
  }

  generateWorkflowAnalyticsReport(parameters) {
    const { timeRange = '7d', workflowId = null } = parameters;
    const events = this.getEventsInTimeRange(timeRange);
    
    const workflowEvents = workflowId ? 
      events.filter(event => event.data.workflowId === workflowId) : 
      events.filter(event => event.data.workflowId);

    return {
      totalWorkflows: new Set(workflowEvents.map(event => event.data.workflowId)).size,
      successRate: this.calculateWorkflowSuccessRate(workflowEvents),
      averageExecutionTime: this.calculateAverageExecutionTime(workflowEvents),
      workflowTypes: this.getWorkflowTypeDistribution(workflowEvents),
      bottleneckAnalysis: this.analyzeWorkflowBottlenecks(workflowEvents)
    };
  }

  // Dashboard Management
  createDashboard(dashboardId, config) {
    const dashboard = {
      id: dashboardId,
      name: config.name,
      description: config.description,
      widgets: config.widgets || [],
      layout: config.layout || 'grid',
      refreshInterval: config.refreshInterval || 30000,
      createdAt: Date.now(),
      lastUpdated: Date.now()
    };

    this.dashboards.set(dashboardId, dashboard);
    return dashboard;
  }

  updateDashboard(dashboardId, updates) {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) return null;

    Object.assign(dashboard, updates, { lastUpdated: Date.now() });
    return dashboard;
  }

  getDashboardData(dashboardId) {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) return null;

    const data = {
      dashboard,
      widgets: []
    };

    dashboard.widgets.forEach(widget => {
      const widgetData = this.getWidgetData(widget);
      data.widgets.push({
        ...widget,
        data: widgetData
      });
    });

    return data;
  }

  getWidgetData(widget) {
    switch (widget.type) {
      case 'metric':
        return this.getMetricData(widget.metricKey);
      case 'chart':
        return this.getChartData(widget.chartType, widget.parameters);
      case 'table':
        return this.getTableData(widget.tableType, widget.parameters);
      case 'insight':
        return this.getInsightData(widget.insightType);
      default:
        return null;
    }
  }

  // Alert System
  createAlert(alertId, config) {
    const alert = {
      id: alertId,
      name: config.name,
      condition: config.condition,
      threshold: config.threshold,
      action: config.action,
      isActive: true,
      createdAt: Date.now(),
      lastTriggered: null,
      triggerCount: 0
    };

    this.alerts.set(alertId, alert);
    return alert;
  }

  checkAlerts(event) {
    this.alerts.forEach(alert => {
      if (!alert.isActive) return;

      const shouldTrigger = this.evaluateAlertCondition(alert, event);
      if (shouldTrigger) {
        this.triggerAlert(alert, event);
      }
    });
  }

  evaluateAlertCondition(alert, event) {
    const { condition, threshold } = alert;
    
    switch (condition.type) {
      case 'event_count':
        const eventCount = this.getEventCountInTimeRange(condition.eventType, condition.timeRange);
        return eventCount >= threshold;
      
      case 'error_rate':
        const errorRate = this.calculateErrorRate(condition.timeRange);
        return errorRate >= threshold;
      
      case 'response_time':
        const avgResponseTime = this.calculateAverageResponseTime(condition.timeRange);
        return avgResponseTime >= threshold;
      
      default:
        return false;
    }
  }

  calculateErrorRate(timeRange) {
    const eventsInRange = this.getEventsInTimeRange(timeRange);
    if (eventsInRange.length === 0) return 0;
    
    const errorEvents = eventsInRange.filter(event => 
      event.type === 'error' || event.data?.status === 'error'
    );
    
    return errorEvents.length / eventsInRange.length;
  }

  calculateAverageResponseTime(timeRange) {
    const eventsInRange = this.getEventsInTimeRange(timeRange);
    const responseTimeEvents = eventsInRange.filter(event => 
      event.data?.responseTime || event.data?.duration
    );
    
    if (responseTimeEvents.length === 0) return 0;
    
    const totalResponseTime = responseTimeEvents.reduce((sum, event) => {
      return sum + (event.data?.responseTime || event.data?.duration || 0);
    }, 0);
    
    return totalResponseTime / responseTimeEvents.length;
  }

  getEventCountInTimeRange(eventType, timeRange) {
    const eventsInRange = this.getEventsInTimeRange(timeRange);
    return eventsInRange.filter(event => event.type === eventType).length;
  }

  triggerAlert(alert, event) {
    alert.lastTriggered = Date.now();
    alert.triggerCount++;

    // Execute alert action
    if (alert.action.type === 'notification') {
      this.sendNotification(alert.action.config, event);
    } else if (alert.action.type === 'webhook') {
      this.sendWebhook(alert.action.config, event);
    }
  }

  sendNotification(config, event) {
    // Create a notification event
    const notificationEvent = {
      type: 'alert_notification',
      timestamp: Date.now(),
      data: {
        alertId: event.alertId,
        message: config.message,
        severity: config.severity || 'warning',
        event: event
      }
    };
    
    this.trackEvent('alert_notification', notificationEvent.data);
    
    // In a real implementation, this would send to a notification service
    console.log('Alert Notification:', config.message, event);
  }

  sendWebhook(config, event) {
    // In a real implementation, this would send to a webhook URL
    console.log('Webhook Alert:', config.url, event);
    
    // Track webhook event
    this.trackEvent('webhook_sent', {
      url: config.url,
      alertId: event.alertId,
      status: 'sent'
    });
  }

  // Utility Methods
  getEventsInTimeRange(timeRange) {
    const now = Date.now();
    const timeRangeMs = this.getTimeRangeInMs(timeRange);
    const cutoffTime = now - timeRangeMs;
    
    return this.events.filter(event => event.timestamp >= cutoffTime);
  }

  getTimeRangeInMs(timeRange) {
    const timeRangeMap = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    
    return timeRangeMap[timeRange] || timeRangeMap['24h'];
  }

  getTimeRangeInHours(timeRange) {
    return this.getTimeRangeInMs(timeRange) / (60 * 60 * 1000);
  }

  cleanupOldEvents() {
    const cutoffTime = Date.now() - (this.dataRetentionDays * 24 * 60 * 60 * 1000);
    this.events = this.events.filter(event => event.timestamp >= cutoffTime);
  }

  // Export/Import
  exportAnalyticsData() {
    return {
      events: this.events,
      metrics: Array.from(this.metrics.entries()),
      insights: Array.from(this.insights.entries()),
      reports: Array.from(this.reports.entries()),
      dashboards: Array.from(this.dashboards.entries()),
      alerts: Array.from(this.alerts.entries())
    };
  }

  importAnalyticsData(data) {
    if (data.events) this.events = data.events;
    if (data.metrics) this.metrics = new Map(data.metrics);
    if (data.insights) this.insights = new Map(data.insights);
    if (data.reports) this.reports = new Map(data.reports);
    if (data.dashboards) this.dashboards = new Map(data.dashboards);
    if (data.alerts) this.alerts = new Map(data.alerts);
  }
}

// Initialize the global analytics system
export const globalAnalyticsSystem = new AnalyticsSystem();

// Pre-configured alert types
export const alertTypes = {
  'high_error_rate': {
    name: 'High Error Rate',
    condition: { type: 'error_rate', timeRange: '1h' },
    threshold: 0.05,
    action: { type: 'notification', config: { message: 'Error rate has exceeded 5%' } }
  },
  
  'slow_response_time': {
    name: 'Slow Response Time',
    condition: { type: 'response_time', timeRange: '1h' },
    threshold: 5000,
    action: { type: 'notification', config: { message: 'Average response time is above 5 seconds' } }
  },
  
  'low_user_engagement': {
    name: 'Low User Engagement',
    condition: { type: 'event_count', eventType: 'user_interaction', timeRange: '1h' },
    threshold: 10,
    action: { type: 'notification', config: { message: 'User engagement is below expected levels' } }
  }
};

// Register default alerts
Object.entries(alertTypes).forEach(([alertId, config]) => {
  globalAnalyticsSystem.createAlert(alertId, config);
}); 