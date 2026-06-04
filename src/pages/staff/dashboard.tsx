import React from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  Activity,
  AlertTriangle,
  Timer
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { storage, Ticket, Department } from '@/utils/storage';
import { api } from '@/utils/api';

export default function StaffDashboardPage() {
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [deptName, setDeptName] = React.useState('');

  const fetchData = async () => {
    try {
      // Simulate getting logged in user's department
      // For now, we'll just grab the first department for the demo
      const depts = await api.getDepartments();
      const myDept = depts[0]?.id || '1';
      
      const ticketsData = await api.getTickets();
      const myTickets = ticketsData.filter((t: Ticket) => t.departmentId === myDept);
      
      setTickets(myTickets);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const open = tickets.filter(t => t.status === 'Open').length;
  const inProgress = tickets.filter(t => t.status === 'In Progress').length;
  const resolved = tickets.filter(t => t.status === 'Resolved').length;
  const expired = tickets.filter(t => t.status === 'Expired').length;

  const kpis = [
    { label: 'My Open', value: open.toString(), icon: Activity, color: 'info' },
    { label: 'My In Progress', value: inProgress.toString(), icon: Timer, color: 'warning' },
    { label: 'My Resolved', value: resolved.toString(), icon: CheckCircle2, color: 'success' },
    { label: 'My Expired', value: expired.toString(), icon: AlertTriangle, color: 'danger' },
  ];

  return (
    <DashboardLayout>
      <Head>
        <title>Staff Dashboard | {deptName}</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main mb-1">Staff Dashboard</h1>
          <p className="text-text-muted text-sm">Welcome back. Viewing tickets for {deptName}.</p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-4 hover:border-brand-primary/30 transition-all cursor-pointer group hover:bg-brand-primary/[0.02]">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-bg-dark border border-border-subtle group-hover:bg-brand-primary/10 transition-colors`}>
                    <kpi.icon className={`w-4 h-4 ${kpi.color === 'danger' ? 'text-danger' : kpi.color === 'success' ? 'text-success' : kpi.color === 'info' ? 'text-info' : 'text-warning'}`} />
                  </div>
                </div>
                <div>
                  <p className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-1">{kpi.label}</p>
                  <h3 className="text-xl font-bold text-text-main">{kpi.value}</h3>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-border-subtle flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">My Department Tickets</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-bg-dark text-text-muted uppercase tracking-widest border-b border-border-subtle">
                    <th className="px-4 py-3 font-bold">ID</th>
                    <th className="px-4 py-3 font-bold">Customer</th>
                    <th className="px-4 py-3 font-bold">Subject</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {tickets.map((q) => (
                    <tr key={q.id} className={`transition-colors group ${q.status === 'Expired' ? 'bg-danger/5 hover:bg-danger/10' : 'hover:bg-brand-primary/5'}`}>
                      <td className="px-4 py-3 font-bold text-brand-primary">{q.id}</td>
                      <td className="px-4 py-3 text-text-main">{q.customerName}</td>
                      <td className="px-4 py-3 text-text-main truncate max-w-xs">{q.subject}</td>
                      <td className="px-4 py-3">
                        <Badge variant={q.status === 'Expired' ? 'danger' : q.status === 'Resolved' ? 'success' : q.status === 'In Progress' ? 'warning' : 'info'}>
                          {q.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {tickets.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-text-muted">No tickets found in your department</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
