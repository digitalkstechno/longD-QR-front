import React from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  Clock, 
  AlertTriangle, 
  Settings2, 
  Plus, 
  ArrowRight,
  ShieldAlert,
  Save,
  Trash2,
  ChevronDown,
  CheckCircle2,
  Edit,
  Bell,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const slaRules = [
  { category: 'Technical Support', priority: 'Critical', response: '15m', resolution: '2h', escalation: 'Immediate' },
  { category: 'Technical Support', priority: 'High', response: '30m', resolution: '4h', escalation: '2h' },
  { category: 'Customer Ops', priority: 'Critical', response: '10m', resolution: '30m', escalation: 'Immediate' },
  { category: 'Facilities', priority: 'High', response: '1h', resolution: '6h', escalation: '4h' },
  { category: 'Facilities', priority: 'Medium', response: '4h', resolution: '12h', escalation: '8h' },
];

export default function SLAManagementPage() {
  return (
    <DashboardLayout>
      <Head>
        <title>SLA Management | Admin Panel</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Service Level Agreements</h1>
            <p className="text-text-muted text-sm">Configure response times and automated escalation policies.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" className="space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Rule</span>
            </Button>
            <Button className="space-x-2">
              <Save className="w-4 h-4" />
              <span>Save Policies</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Global Config */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-0 overflow-hidden">
              <div className="p-4 border-b border-border-subtle bg-bg-dark/30">
                <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center">
                  <Settings2 className="w-3.5 h-3.5 mr-2 text-brand-primary" />
                  Global Defaults
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-text-muted uppercase font-bold">Standard Resolution Time</label>
                  <div className="relative">
                    <select className="w-full bg-bg-dark border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-brand-primary/50">
                      <option>24 Hours</option>
                      <option>48 Hours</option>
                      <option>72 Hours</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-text-muted uppercase font-bold">Escalation Threshold</label>
                  <div className="relative">
                    <select className="w-full bg-bg-dark border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-brand-primary/50">
                      <option>90% of SLA time</option>
                      <option>100% of SLA time</option>
                      <option>120% of SLA time</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  </div>
                </div>

                <div className="pt-6 border-t border-border-subtle space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShieldAlert className="w-4 h-4 text-brand-primary" />
                      <span className="text-xs font-bold text-white uppercase">Auto-Escalation</span>
                    </div>
                    <div className="w-10 h-5 bg-brand-primary/20 rounded-full relative cursor-pointer border border-brand-primary/30">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-brand-primary rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-text-muted" />
                      <span className="text-xs font-bold text-text-muted uppercase">Push Alerts</span>
                    </div>
                    <div className="w-10 h-5 bg-white/5 rounded-full relative cursor-pointer border border-border-subtle">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-text-muted rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-brand-primary/5 border-brand-primary/10">
              <h4 className="text-[10px] font-bold text-brand-primary mb-2 uppercase">SLA Logic</h4>
              <p className="text-[11px] text-text-muted leading-relaxed">
                Rules are evaluated from top to bottom. The first matching category and priority rule will be applied to the new query.
              </p>
            </Card>
          </div>

          {/* Rules Matrix */}
          <div className="lg:col-span-8">
            <Card className="p-0 overflow-hidden">
              <div className="p-4 border-b border-border-subtle bg-bg-dark/30 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Policy Matrix</h3>
                <Badge variant="outline">5 Active Rules</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-bg-dark text-text-muted text-[10px] uppercase tracking-widest font-bold border-b border-border-subtle">
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Priority</th>
                      <th className="px-6 py-4">Response</th>
                      <th className="px-6 py-4">Resolution</th>
                      <th className="px-6 py-4">Escalation</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {slaRules.map((rule, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-white uppercase">{rule.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={rule.priority === 'Critical' ? 'danger' : rule.priority === 'High' ? 'warning' : 'info'}>
                            {rule.priority}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-3 h-3 text-text-muted" />
                            <span className="text-xs text-white font-mono">{rule.response}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-3 h-3 text-success" />
                            <span className="text-xs text-white font-bold font-mono">{rule.resolution}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 text-danger">
                            <ShieldAlert className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase">{rule.escalation}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-danger hover:bg-danger/10">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-bg-dark/30 text-center border-t border-border-subtle">
                <button className="text-[10px] font-bold text-brand-primary hover:text-brand-light uppercase tracking-widest transition-colors">
                  + Add Policy Rule
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
