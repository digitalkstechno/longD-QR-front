import React from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ArrowUpCircle, 
  Clock, 
  User, 
  Building2,
  ChevronRight,
  Filter,
  BarChart3,
  History,
  Activity,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

const escalations = [
  { id: 'QRY-2026-001', agent: 'David Chen', dept: 'IT Support', missedBy: '45m', escalatedTo: 'Sarah J. (Manager)', level: 'L1', date: 'June 03, 11:15 AM' },
  { id: 'QRY-2026-015', agent: 'Maria Garcia', dept: 'Facilities', missedBy: '1h 12m', escalatedTo: 'James S. (Admin)', level: 'L2', date: 'June 03, 10:45 AM' },
  { id: 'QRY-2026-022', agent: 'James Wilson', dept: 'Customer Ops', missedBy: '30m', escalatedTo: 'Sarah J. (Manager)', level: 'L1', date: 'June 03, 09:30 AM' },
  { id: 'QRY-2026-008', agent: 'Robert Fox', dept: 'Technical', missedBy: '2h 05m', escalatedTo: 'James S. (Admin)', level: 'L3', date: 'June 02, 04:20 PM' },
];

export default function EscalationCenterPage() {
  return (
    <DashboardLayout>
      <Head>
        <title>Escalation Center | Admin Panel</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Escalation Center</h1>
            <p className="text-text-muted text-sm">Review and resolve queries that have breached service level agreements.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" className="space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter View</span>
            </Button>
            <Button className="space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Breach Analysis</span>
            </Button>
          </div>
        </div>

        {/* Priority Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-l-danger bg-danger/5">
            <div className="flex items-center justify-between mb-2">
              <ShieldAlert className="w-5 h-5 text-danger" />
              <Badge variant="danger" className="animate-pulse">Action Required</Badge>
            </div>
            <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Total Active</p>
            <h3 className="text-2xl font-bold text-white">12 Queries</h3>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Avg. Delay</p>
            <h3 className="text-2xl font-bold text-white">42m 15s</h3>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <ArrowUpCircle className="w-5 h-5 text-brand-primary" />
            </div>
            <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Resolution Rate</p>
            <h3 className="text-2xl font-bold text-white">85.4%</h3>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-success" />
            </div>
            <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">L3 Escalations</p>
            <h3 className="text-2xl font-bold text-white">2 Today</h3>
          </Card>
        </div>

        {/* Main Table */}
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-border-subtle bg-bg-dark/30 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Breach Incident Log</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
              <span className="text-[10px] text-text-muted uppercase font-bold">Real-time Updates Active</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-bg-dark text-text-muted text-[10px] uppercase tracking-widest font-bold border-b border-border-subtle">
                  <th className="px-6 py-4">Incident ID</th>
                  <th className="px-6 py-4">Agent / Dept</th>
                  <th className="px-6 py-4">Missed Duration</th>
                  <th className="px-6 py-4">Escalated To</th>
                  <th className="px-6 py-4">Level</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {escalations.map((esc) => (
                  <tr key={esc.id} className="hover:bg-white/5 transition-colors group text-sm">
                    <td className="px-6 py-4">
                      <Link href={`/admin/queries/${esc.id}`} className="font-mono font-bold text-brand-primary hover:underline">
                        {esc.id}
                      </Link>
                      <p className="text-[10px] text-text-muted mt-0.5">{esc.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-3.5 h-3.5 text-text-muted" />
                        <div>
                          <p className="text-white font-bold">{esc.agent}</p>
                          <p className="text-[10px] text-text-muted uppercase">{esc.dept}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-danger" />
                        <span className="font-bold text-danger font-mono">{esc.missedBy}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">{esc.escalatedTo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={esc.level === 'L3' ? 'danger' : esc.level === 'L2' ? 'warning' : 'info'}>
                        {esc.level}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/queries/${esc.id}`}>
                        <Button variant="ghost" size="sm" className="space-x-2 text-brand-primary hover:text-brand-light">
                          <span className="text-[10px] font-bold uppercase tracking-wider">Investigate</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-bg-dark/30 text-center border-t border-border-subtle">
            <button className="text-[10px] font-bold text-text-muted hover:text-white uppercase tracking-widest transition-colors flex items-center justify-center mx-auto">
              <History className="w-3.5 h-3.5 mr-2" />
              View Escalation History
            </button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
