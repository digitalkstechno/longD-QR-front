import React from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Calendar,
  TrendingUp,
  X,
  Trophy,
  Medal,
  Loader2,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area
} from 'recharts';

import { api, API_URL } from '@/utils/api';
import { PageLoader } from '@/components/ui/PageLoader';
import toast from 'react-hot-toast';

// ─── Custom Range Modal ───────────────────────────────────────────────────────
function CustomRangeModal({
  open,
  onClose,
  onApply
}: {
  open: boolean;
  onClose: () => void;
  onApply: (from: string, to: string) => void;
}) {
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-bg-card border border-border-subtle rounded-2xl w-full max-w-sm p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-brand-primary" />
            <h3 className="text-base font-semibold text-white">Custom Date Range</h3>
          </div>
          <button onClick={onClose} className="text-text-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">From</label>
            <input
              type="date"
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="w-full bg-bg-dark border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">To</label>
            <input
              type="date"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="w-full bg-bg-dark border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary transition-all"
            />
          </div>
        </div>
        <div className="flex items-center justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => {
              if (!from || !to) { toast.error('Please select both dates'); return; }
              if (new Date(from) > new Date(to)) { toast.error('From date must be before To date'); return; }
              onApply(from, to);
              onClose();
            }}
          >
            Apply Filter
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Leaderboard Modal ────────────────────────────────────────────────────────
const RANK_COLORS = ['#F59E0B', '#94A3B8', '#CD7C2F'];
const RANK_LABELS = ['🥇 1st Place', '🥈 2nd Place', '🥉 3rd Place'];

function LeaderboardModal({
  open,
  onClose,
  agents
}: {
  open: boolean;
  onClose: () => void;
  agents: { name: string; resolved: number; rate: number }[];
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="bg-bg-card border border-border-subtle rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-border-subtle flex items-center justify-between bg-gradient-to-r from-brand-primary/10 to-transparent">
          <div className="flex items-center space-x-3">
            <Trophy className="w-6 h-6 text-brand-primary" />
            <div>
              <h3 className="text-base font-bold text-white">Full Agent Leaderboard</h3>
              <p className="text-xs text-text-muted">Ranked by resolved tickets</p>
            </div>
          </div>
          <button onClick={onClose} className="text-text-muted  transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top 3 podium */}
        {agents.length >= 1 && (
          <div className="px-6 pt-5 pb-2">
            <div className="flex items-end justify-center gap-3">
              {/* 2nd */}
              {agents[1] && (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#94A3B8]/20 flex items-center justify-center text-[#94A3B8] text-lg font-bold mb-1">
                    {agents[1].name.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-xs text-white font-medium truncate max-w-[70px] text-center">{agents[1].name}</p>
                  <p className="text-[10px] text-text-muted">{agents[1].resolved} resolved</p>
                  <div className="mt-1 h-12 w-16 rounded-t-lg bg-[#94A3B8]/20 border-t border-x border-[#94A3B8]/30 flex items-end justify-center pb-1">
                    <span className="text-[10px] text-[#94A3B8] font-bold">2nd</span>
                  </div>
                </div>
              )}
              {/* 1st */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B] text-xl font-bold mb-1 ring-2 ring-[#F59E0B]/40">
                  {agents[0].name.charAt(0).toUpperCase()}
                </div>
                <p className="text-xs text-white font-bold truncate max-w-[80px] text-center">{agents[0].name}</p>
                <p className="text-[10px] text-text-muted">{agents[0].resolved} resolved</p>
                <div className="mt-1 h-16 w-16 rounded-t-lg bg-[#F59E0B]/20 border-t border-x border-[#F59E0B]/30 flex items-end justify-center pb-1">
                  <span className="text-[10px] text-[#F59E0B] font-bold">1st</span>
                </div>
              </div>
              {/* 3rd */}
              {agents[2] && (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#CD7C2F]/20 flex items-center justify-center text-[#CD7C2F] text-lg font-bold mb-1">
                    {agents[2].name.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-xs text-white font-medium truncate max-w-[70px] text-center">{agents[2].name}</p>
                  <p className="text-[10px] text-text-muted">{agents[2].resolved} resolved</p>
                  <div className="mt-1 h-8 w-16 rounded-t-lg bg-[#CD7C2F]/20 border-t border-x border-[#CD7C2F]/30 flex items-end justify-center pb-1">
                    <span className="text-[10px] text-[#CD7C2F] font-bold">3rd</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full list */}
        <div className="px-6 pb-6 space-y-2 mt-3 max-h-60 overflow-y-auto">
          {agents.map((agent, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl border border-border-subtle hover:border-brand-primary/30 transition-all"
              style={{ background: i < 3 ? `${RANK_COLORS[i]}08` : undefined }}
            >
              <div className="flex items-center space-x-3">
                <span
                  className="text-sm font-bold w-6 text-center"
                  style={{ color: i < 3 ? RANK_COLORS[i] : '#64748b' }}
                >
                  #{i + 1}
                </span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{
                    background: i < 3 ? `${RANK_COLORS[i]}20` : 'rgba(100,116,139,0.15)',
                    color: i < 3 ? RANK_COLORS[i] : '#94a3b8'
                  }}
                >
                  {agent.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{agent.name}</p>
                  <p className="text-xs text-text-muted">{agent.resolved} cases resolved</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold" style={{ color: agent.rate >= 90 ? '#10b981' : agent.rate >= 70 ? '#F59E0B' : '#EF4444' }}>
                  {agent.rate}%
                </p>
                <p className="text-xs text-text-muted">compliance</p>
              </div>
            </div>
          ))}
          {agents.length === 0 && (
            <p className="text-center text-text-muted text-sm py-6">No agent data yet</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ReportsAnalyticsPage() {
  const [loading, setLoading] = React.useState(true);
  const [tickets, setTickets] = React.useState<any[]>([]);
  const [generatingReport, setGeneratingReport] = React.useState(false);

  // Modal states
  const [showLeaderboard, setShowLeaderboard] = React.useState(false);
  const [showRangeModal, setShowRangeModal] = React.useState(false);

  // Date range filter
  const [dateRange, setDateRange] = React.useState<{ from: string; to: string } | null>(null);

  const fetchTickets = React.useCallback(async (from?: string, to?: string) => {
    setLoading(true);
    try {
      const res = await api.getTickets(1, 1000);
      let data: any[] = res.data || res;

      if (from && to) {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        data = data.filter(t => {
          const d = new Date(t.createdAt);
          return d >= fromDate && d <= toDate;
        });
      }
      setTickets(data);
    } catch (err) {
      console.error('Error fetching tickets for reports', err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTickets();
  }, []);

  const handleApplyRange = (from: string, to: string) => {
    setDateRange({ from, to });
    fetchTickets(from, to);
    toast.success(`Filtered: ${from} → ${to}`);
  };

  const handleClearRange = () => {
    setDateRange(null);
    fetchTickets();
    toast.success('Date filter cleared');
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (dateRange) {
        params.set('from', dateRange.from);
        params.set('to', dateRange.to);
      }
      const res = await fetch(`${API_URL}/tickets/export?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${dateRange ? `${dateRange.from}-to-${dateRange.to}` : 'all'}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Report downloaded successfully!');
    } catch (err) {
      toast.error('Failed to generate report');
    } finally {
      setGeneratingReport(false);
    }
  };

  // ── Data computations ───────────────────────────────────────────────────────
  const getQueryData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = days.map(day => ({ name: day, new: 0, resolved: 0 }));
    tickets.forEach(ticket => {
      if (!ticket.createdAt) return;
      const dayName = days[new Date(ticket.createdAt).getDay()];
      const d = data.find(d => d.name === dayName);
      if (d) { d.new += 1; if (ticket.status === 'Resolved') d.resolved += 1; }
    });
    const sun = data.shift();
    if (sun) data.push(sun);
    return data;
  };

  const getResolutionData = () => {
    let withinSLA = 0, breached = 0;
    tickets.forEach(t => {
      if (t.status === 'Time Expired' || t.status === 'Escalated') breached++;
      else withinSLA++;
    });
    const total = withinSLA + breached;
    if (total === 0) return [{ name: 'No Data', value: 1, color: '#64748b' }];
    return [
      { name: 'Within SLA', value: withinSLA, color: '#3B82F6' },
      { name: 'Breached', value: breached, color: '#EF4444' }
    ].filter(d => d.value > 0);
  };

  const getAgentPerformance = () => {
    const agents: Record<string, { name: string; resolved: number; total: number }> = {};
    tickets.forEach(ticket => {
      if (ticket.assignedStaffId) {
        const name = ticket.assignedStaffId.name || 'Unknown';
        if (!agents[name]) agents[name] = { name, resolved: 0, total: 0 };
        agents[name].total += 1;
        if (ticket.status === 'Resolved') agents[name].resolved += 1;
      }
    });
    const result = Object.values(agents)
      .map(a => ({ name: a.name, resolved: a.resolved, rate: a.total > 0 ? Math.round((a.resolved / a.total) * 100) : 0 }))
      .sort((a, b) => b.resolved - a.resolved);
    if (result.length === 0) return [{ name: 'No Agents Assigned', resolved: 0, rate: 0 }];
    return result;
  };

  const getDepartmentalSLA = () => {
    const depts: Record<string, { name: string; breached: number; total: number }> = {};
    tickets.forEach(t => {
      const name = t.departmentId?.name || 'Unknown';
      if (!depts[name]) depts[name] = { name, breached: 0, total: 0 };
      depts[name].total += 1;
      if (t.status === 'Time Expired' || t.status === 'Escalated') depts[name].breached += 1;
    });
    const result = Object.values(depts).map(dept => {
      const compliance = dept.total > 0 ? Math.round(((dept.total - dept.breached) / dept.total) * 100) : 100;
      return {
        name: dept.name,
        avg: 'N/A',
        compliance,
        status: compliance >= 90 ? 'success' : compliance >= 80 ? 'warning' : 'danger'
      };
    }).slice(0, 6);
    if (result.length === 0) return [{ name: 'No Departments', avg: '-', compliance: 100, status: 'success' }];
    return result;
  };

  const queryData = getQueryData();
  const resolutionData = getResolutionData();
  const agentPerformance = getAgentPerformance();
  const departmentalSLA = getDepartmentalSLA();
  const top4Agents = agentPerformance.slice(0, 4);
  const totalSLA = resolutionData.reduce((acc, curr) => acc + curr.value, 0);
  const withinSLA = resolutionData.find(d => d.name === 'Within SLA')?.value || 0;
  const inSLAPercentage = totalSLA > 0 && resolutionData[0].name !== 'No Data'
    ? Math.round((withinSLA / totalSLA) * 100)
    : 0;

  if (loading) return <><PageLoader /></>;

  return (
    <>
      <Head>
        <title>Operational Reports | Admin Panel</title>
      </Head>

      {/* Modals */}
      <AnimatePresence>
        {showRangeModal && (
          <CustomRangeModal
            open={showRangeModal}
            onClose={() => setShowRangeModal(false)}
            onApply={handleApplyRange}
          />
        )}
        {showLeaderboard && (
          <LeaderboardModal
            open={showLeaderboard}
            onClose={() => setShowLeaderboard(false)}
            agents={agentPerformance}
          />
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-main mb-1">Reports & Analytics</h1>
            <p className="text-text-muted text-sm">
              In-depth operational analysis and performance metrics.
              {dateRange && (
                <span className="ml-2 inline-flex items-center space-x-1 text-brand-primary">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{dateRange.from} → {dateRange.to}</span>
                  <button onClick={handleClearRange} className="ml-1 text-text-muted hover:text-white text-xs underline">clear</button>
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              className="space-x-2 h-9 text-xs"
              onClick={() => setShowRangeModal(true)}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateRange ? 'Change Range' : 'Custom Range'}</span>
            </Button>
            <Button
              className="space-x-2 h-9 text-xs"
              onClick={handleGenerateReport}
              disabled={generatingReport}
            >
              {generatingReport ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{generatingReport ? 'Generating...' : 'Generate Report'}</span>
            </Button>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Main Chart */}
          <Card className="lg:col-span-8 p-0 overflow-hidden">
            <div className="p-4 border-b border-border-subtle bg-bg-dark/30 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Query Resolution Velocity</h3>
              <div className="flex items-center space-x-2 text-success">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">+12.5% Effectiveness</span>
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
              <h3 className="text-sm font-semibold text-white">SLA Compliance Distribution</h3>
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
                  <p className="text-2xl font-bold text-white">{inSLAPercentage}%</p>
                  <p className="text-[10px] text-text-muted">In-SLA</p>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                {resolutionData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2 bg-bg-dark border border-border-subtle rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-text-muted">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Agent Performance */}
          <Card className="lg:col-span-5 p-0 overflow-hidden">
            <div className="p-4 border-b border-border-subtle bg-bg-dark/30 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Agent Efficiency Ranking</h3>
              <Button
                size="sm"
                className="h-7 text-xs"
                onClick={() => setShowLeaderboard(true)}
              >
                View Full Leaderboard
              </Button>
            </div>
            <div className="p-6 space-y-4">
              {top4Agents.map((agent, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-bg-dark border border-border-subtle rounded-xl hover:border-brand-primary/30 transition-all cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-sm flex-shrink-0">
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{agent.name}</p>
                      <p className="text-xs text-text-muted">{agent.resolved} Resolved Cases</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-success">{agent.rate}%</p>
                    <p className="text-xs text-text-muted">Compliance</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Dept SLA Health */}
          <Card className="lg:col-span-7 p-0 overflow-hidden">
            <div className="p-4 border-b border-border-subtle bg-bg-dark/30 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Departmental SLA Health</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-xs text-text-muted">Global Target: 2h</span>
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
                      <p className="text-sm font-medium text-white">{dept.name}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs text-text-muted">Avg Time: <span className="text-white">{dept.avg}</span></span>
                        <div className="w-px h-2 bg-border-subtle" />
                        <span className="text-xs text-text-muted">SLA: <span className="text-white">{dept.compliance}%</span></span>
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
    </>
  );
}

