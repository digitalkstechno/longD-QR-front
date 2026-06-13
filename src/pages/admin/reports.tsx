import React from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area
} from 'recharts';

import { api } from '@/utils/api';

export default function ReportsAnalyticsPage() {
  const [loading, setLoading] = React.useState(true);
  const [tickets, setTickets] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.getTickets(1, 1000);
        setTickets(res.data || res);
      } catch (err) {
        console.error('Error fetching tickets for reports', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const getQueryData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = days.map(day => ({ name: day, new: 0, resolved: 0 }));

    tickets.forEach(ticket => {
      if (!ticket.createdAt) return;
      const date = new Date(ticket.createdAt);
      const dayName = days[date.getDay()];
      const dayData = data.find(d => d.name === dayName);
      if (dayData) {
        dayData.new += 1;
        if (ticket.status === 'Resolved') {
          dayData.resolved += 1;
        }
      }
    });

    const sun = data.shift();
    if (sun) data.push(sun);
    
    return data;
  };

  const getResolutionData = () => {
    let withinSLA = 0;
    let breached = 0;
    let nearBreach = 0;

    tickets.forEach(ticket => {
      if (ticket.status === 'Time Expired' || ticket.status === 'Escalated') {
        breached += 1;
      } else if (ticket.status === 'Resolved' || ticket.status === 'Open' || ticket.status === 'In Progress') {
        withinSLA += 1;
      }
    });

    const total = withinSLA + breached + nearBreach;
    if (total === 0) {
      return [{ name: 'No Data', value: 1, color: '#64748b' }];
    }

    return [
      { name: 'Within SLA', value: withinSLA, color: '#3B82F6' },
      { name: 'Near Breach', value: nearBreach, color: '#F59E0B' },
      { name: 'Breached', value: breached, color: '#EF4444' },
    ].filter(d => d.value > 0);
  };

  const getAgentPerformance = () => {
    const agents: Record<string, { name: string, resolved: number, total: number }> = {};
    
    tickets.forEach(ticket => {
      if (ticket.assignedStaffId) {
        const staffName = ticket.assignedStaffId.name || 'Unknown';
        if (!agents[staffName]) {
          agents[staffName] = { name: staffName, resolved: 0, total: 0 };
        }
        agents[staffName].total += 1;
        if (ticket.status === 'Resolved') {
          agents[staffName].resolved += 1;
        }
      }
    });

    let result = Object.values(agents)
      .map(agent => ({
        name: agent.name,
        resolved: agent.resolved,
        rate: agent.total > 0 ? Math.round((agent.resolved / agent.total) * 100) : 0,
        img: agent.name.split(' ')[0]
      }))
      .sort((a, b) => b.resolved - a.resolved)
      .slice(0, 4);

    if (result.length === 0) {
      return [{ name: 'No Agents Assigned', resolved: 0, rate: 0, img: 'Unknown' }];
    }
    return result;
  };

  const getDepartmentalSLA = () => {
    const depts: Record<string, { name: string, breached: number, total: number }> = {};
    
    tickets.forEach(ticket => {
      const deptName = ticket.departmentId?.name || 'Unknown';
      if (!depts[deptName]) {
        depts[deptName] = { name: deptName, breached: 0, total: 0 };
      }
      depts[deptName].total += 1;
      if (ticket.status === 'Time Expired' || ticket.status === 'Escalated') {
        depts[deptName].breached += 1;
      }
    });

    let result = Object.values(depts)
      .map(dept => {
        const compliance = dept.total > 0 ? Math.round(((dept.total - dept.breached) / dept.total) * 100) : 100;
        let status = 'success';
        if (compliance < 90) status = 'warning';
        if (compliance < 80) status = 'danger';
        
        return {
          name: dept.name,
          avg: 'N/A',
          target: '2h',
          status,
          compliance
        };
      })
      .slice(0, 4);

    if (result.length === 0) {
      return [{ name: 'No Departments', avg: '-', target: '-', status: 'success', compliance: 100 }];
    }
    return result;
  };

  const queryData = getQueryData();
  const resolutionData = getResolutionData();
  const agentPerformance = getAgentPerformance();
  const departmentalSLA = getDepartmentalSLA();

  const totalSLA = resolutionData.reduce((acc, curr) => acc + curr.value, 0);
  const withinSLA = resolutionData.find(d => d.name === 'Within SLA')?.value || 0;
  const inSLAPercentage = totalSLA > 0 && resolutionData[0].name !== 'No Data' ? Math.round((withinSLA / totalSLA) * 100) : 0;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Operational Reports | Admin Panel</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Reports & Analytics</h1>
            <p className="text-text-muted text-sm">In-depth operational analysis and performance metrics.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button className="space-x-2 h-9 text-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>Custom Range</span>
            </Button>
            <Button className="space-x-2 h-9 text-xs">
              <Download className="w-3.5 h-3.5" />
              <span>Generate Report</span>
            </Button>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Main Chart */}
          <Card className="lg:col-span-8 p-0 overflow-hidden">
            <div className="p-4 border-b border-border-subtle bg-bg-dark/30 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Query Resolution Velocity</h3>
              <div className="flex items-center space-x-2 text-success">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase">+12.5% Effectiveness</span>
              </div>
            </div>
            <div className="p-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={queryData}>
                    <defs>
                      <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ fontSize: '11px' }}
                    />
                    <Area type="monotone" dataKey="new" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorNew)" />
                    <Area type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* SLA Distribution */}
          <Card className="lg:col-span-4 p-0 overflow-hidden">
            <div className="p-4 border-b border-border-subtle bg-bg-dark/30">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">SLA Compliance Distribution</h3>
            </div>
            <div className="p-6">
              <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={resolutionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {resolutionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-2xl font-bold text-white tracking-tighter">{inSLAPercentage}%</p>
                  <p className="text-[9px] text-text-muted uppercase font-bold">In-SLA</p>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                {resolutionData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2 bg-bg-dark border border-border-subtle rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] text-text-muted uppercase font-bold">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Agent Performance */}
          <Card className="lg:col-span-5 p-0 overflow-hidden">
            <div className="p-4 border-b border-border-subtle bg-bg-dark/30 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Agent Efficiency Ranking</h3>
              <Button size="sm" className="h-7 text-[9px] uppercase font-bold">View Full Leaderboard</Button>
            </div>
            <div className="p-6 space-y-4">
              {agentPerformance.map((agent, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-bg-dark border border-border-subtle rounded-xl hover:border-brand-primary/30 transition-all cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.img}`} className="w-9 h-9 rounded-lg bg-bg-card" alt={agent.name} />
                    <div>
                      <p className="text-xs font-bold text-white">{agent.name}</p>
                      <p className="text-[9px] text-text-muted font-bold uppercase">{agent.resolved} Resolved Cases</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-success font-mono">{agent.rate}%</p>
                    <p className="text-[9px] text-text-muted uppercase font-bold">Compliance</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Dept Resolution Times */}
          <Card className="lg:col-span-7 p-0 overflow-hidden">
            <div className="p-4 border-b border-border-subtle bg-bg-dark/30 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Departmental SLA Health</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-[9px] text-text-muted uppercase font-bold">Global Target: 2h</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {departmentalSLA.map((dept, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-bg-dark border border-border-subtle rounded-xl group hover:border-brand-primary/30 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-bg-card flex items-center justify-center font-bold text-brand-primary group-hover:bg-brand-primary/10 transition-all">
                      {dept.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{dept.name}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-[9px] text-text-muted uppercase font-bold tracking-tight">Avg Time: <span className="text-white">{dept.avg}</span></span>
                        <div className="w-px h-2 bg-border-subtle" />
                        <span className="text-[9px] text-text-muted uppercase font-bold tracking-tight">SLA: <span className="text-white">{dept.compliance}%</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={dept.status === 'success' ? 'success' : dept.status === 'warning' ? 'warning' : 'danger'}>
                      {dept.status === 'success' ? 'Healthy' : dept.status === 'warning' ? 'At Risk' : 'Critical'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
