import React, { useState, useEffect } from 'react';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiBriefcase, 
  FiActivity,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';

const MetricCard = ({ title, value, change, icon: Icon, color = 'blue' }) => {
  const colors = {
    blue: 'bg-primary-light text-primary border-primary/10',
    green: 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20',
    purple: 'bg-yellow-500/10 text-yellow-500 dark:text-yellow-400 border-yellow-500/20',
    orange: 'bg-amber-600/10 text-amber-600 dark:text-amber-500 border-amber-600/20'
  };

  return (
    <div className="crm-card flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-sub">{title}</p>
          <p className="text-3xl font-extrabold text-text-main mt-2">{value}</p>
          {change && (
            <p className={`text-xs font-semibold mt-3 flex items-center gap-1 ${change >= 0 ? 'text-primary' : 'text-text-muted'}`}>
              {change >= 0 ? '+' : ''}{change}% <span className="text-text-muted font-normal">from last month</span>
            </p>
          )}
        </div>
        <div className={`p-3.5 rounded-lg border text-xl ${colors[color]}`}>
          <Icon />
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, children }) => (
  <div className="crm-card">
    <h3 className="text-lg font-bold text-text-main mb-6 border-b border-border-main pb-3">{title}</h3>
    {children}
  </div>
);

const SimpleBarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="flex items-end justify-between h-48 space-x-3 pt-4 px-2">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center h-full justify-end">
          <div 
            className="w-full bg-primary rounded-t transition-all duration-300 hover:bg-primary-hover"
            style={{ 
              height: `${(item.value / maxValue) * 100}%`,
              minHeight: '4px'
            }}
          />
          <p className="text-xs text-text-sub mt-3.5 text-center font-medium">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

const ActivityFeed = ({ activities }) => (
  <div className="space-y-4">
    {activities.map((activity, index) => (
      <div key={index} className="flex items-start space-x-3 p-2 hover:bg-bg-panel/40 rounded transition-colors">
        <div className="p-2 rounded-full border shrink-0 bg-primary-light border-primary/10 text-primary">
          {activity.type === 'success' ? (
            <FiCheckCircle className="w-4 h-4" />
          ) : (
            <FiActivity className="w-4 h-4" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-main truncate">{activity.title}</p>
          <p className="text-xs text-text-muted mt-0.5">{activity.time}</p>
        </div>
      </div>
    ))}
  </div>
);

const AnalyticsDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalClients: 0,
    activeProjects: 0,
    completedTasks: 0,
    revenue: 0
  });

  const [chartData, setChartData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setMetrics({
        totalClients: 24,
        activeProjects: 12,
        completedTasks: 156,
        revenue: 45600
      });

      setChartData([
        { label: 'Jan', value: 65 },
        { label: 'Feb', value: 78 },
        { label: 'Mar', value: 90 },
        { label: 'Apr', value: 85 },
        { label: 'May', value: 95 },
        { label: 'Jun', value: 88 }
      ]);

      setActivities([
        {
          type: 'success',
          title: 'Project "E-commerce Redesign" completed',
          time: '2 hours ago'
        },
        {
          type: 'activity',
          title: 'New client "TechStart Inc" onboarded',
          time: '4 hours ago'
        },
        {
          type: 'success',
          title: 'Agent "MarketingBot" processed 50 leads',
          time: '6 hours ago'
        },
        {
          type: 'activity',
          title: 'Payment received from "DesignStudio"',
          time: '1 day ago'
        }
      ]);

      setLoading(false);
    };

    loadData();
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
      {/* Header */}
      <div className="border-b border-border-main pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-main">Analytics Dashboard</h1>
        <p className="text-text-sub mt-1 text-sm md:text-base">Track your automation performance, client acquisition, and operations insights.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <MetricCard
          title="Total Clients"
          value={metrics.totalClients}
          change={12}
          icon={FiUsers}
          color="blue"
        />
        <MetricCard
          title="Active Projects"
          value={metrics.activeProjects}
          change={8}
          icon={FiBriefcase}
          color="green"
        />
        <MetricCard
          title="Completed Tasks"
          value={metrics.completedTasks}
          change={23}
          icon={FiCheckCircle}
          color="purple"
        />
        <MetricCard
          title="Revenue (USD)"
          value={`$${metrics.revenue.toLocaleString()}`}
          change={15}
          icon={FiDollarSign}
          color="orange"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <ChartCard title="Performance Trends">
            <SimpleBarChart data={chartData} />
          </ChartCard>
        </div>

        {/* Activity Feed */}
        <div>
          <ChartCard title="Recent Milestones">
            <ActivityFeed activities={activities} />
          </ChartCard>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ChartCard title="Agent Performance Accuracy">
          <div className="space-y-6 pt-2">
            <div>
              <div className="flex justify-between items-center text-sm mb-2 font-semibold">
                <span className="text-text-main">MarketingBot</span>
                <span className="text-primary">95%</span>
              </div>
              <div className="w-full bg-bg-panel border border-border-main rounded-full h-3 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center text-sm mb-2 font-semibold">
                <span className="text-text-main">ContentBot</span>
                <span className="text-primary">87%</span>
              </div>
              <div className="w-full bg-bg-panel border border-border-main rounded-full h-3 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center text-sm mb-2 font-semibold">
                <span className="text-text-main">AnalyticsBot</span>
                <span className="text-primary">92%</span>
              </div>
              <div className="w-full bg-bg-panel border border-border-main rounded-full h-3 overflow-hidden">
                <div className="bg-amber-600 h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Operations Actions">
          <div className="flex flex-col gap-4 pt-2">
            <button className="crm-btn crm-btn-primary py-3.5 text-sm">
              Generate PDF Performance Report
            </button>
            <button className="crm-btn crm-btn-secondary py-3.5 text-sm">
              Export Operations CSV Data
            </button>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;