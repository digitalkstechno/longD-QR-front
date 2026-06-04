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

const queryData = [
  { name: 'Mon', new: 45, resolved: 38 },
  { name: 'Tue', new: 52, resolved: 42 },
  { name: 'Wed', new: 48, resolved: 45 },
  { name: 'Thu', new: 70, resolved: 55 },
  { name: 'Fri', new: 65, resolved: 60 },
  { name: 'Sat', new: 85, resolved: 72 },
  { name: 'Sun', new: 75, resolved: 68 },
];

const resolutionData = [
  { name: 'Within SLA', value: 85, color: '#3B82F6' },
  { name: 'Near Breach', value: 10, color: '#F59E0B' },
  { name: 'Breached', value: 5, color: '#EF4444' },
];

export default function ReportsAnalyticsPage() {
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
                  <p className="text-2xl font-bold text-white tracking-tighter">95%</p>
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
              {[
                { name: 'David Chen', resolved: 145, rate: 99, img: 'David' },
                { name: 'Maria Garcia', resolved: 132, rate: 97, img: 'Maria' },
                { name: 'James Wilson', resolved: 118, rate: 95, img: 'James' },
                { name: 'Sarah Jenkins', resolved: 105, rate: 92, img: 'Sarah' },
              ].map((agent, i) => (
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
              {[
                { name: 'Customer Ops', avg: '42m', target: '30m', status: 'warning', compliance: 96 },
                { name: 'IT Support', avg: '28m', target: '45m', status: 'success', compliance: 99 },
                { name: 'Facilities Mgmt', avg: '1h 15m', target: '1h', status: 'danger', compliance: 85 },
                { name: 'Tech Maintenance', avg: '55m', target: '1h', status: 'success', compliance: 92 },
              ].map((dept, i) => (
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
