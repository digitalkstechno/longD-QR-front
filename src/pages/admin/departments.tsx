import React from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Clock, 
  CheckCircle2, 
  Plus, 
  MoreVertical,
  Edit,
  UserPlus,
  Settings2,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const departments = [
  { 
    name: 'IT Support Services', 
    users: 8, 
    activeQueries: 12, 
    avgResolution: '1.2h', 
    slaCompliance: 98,
    icon: Building2,
  },
  { 
    name: 'Facilities Management', 
    users: 15, 
    activeQueries: 24, 
    avgResolution: '2.5h', 
    slaCompliance: 92,
    icon: Building2,
  },
  { 
    name: 'Customer Operations', 
    users: 32, 
    activeQueries: 15, 
    avgResolution: '45m', 
    slaCompliance: 99,
    icon: Building2,
  },
  { 
    name: 'Technical Maintenance', 
    users: 12, 
    activeQueries: 8, 
    avgResolution: '3.0h', 
    slaCompliance: 88,
    icon: Building2,
  },
];

export default function DepartmentManagementPage() {
  return (
    <DashboardLayout>
      <Head>
        <title>Department Management | Admin Panel</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Departments</h1>
            <p className="text-text-muted text-sm">Configure organizational units and monitor service efficiency.</p>
          </div>
          <Button className="space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Department</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map((dept, i) => (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-0 overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center group-hover:bg-brand-primary/20 transition-all">
                        <dept.icon className="w-6 h-6 text-brand-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{dept.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Users className="w-3.5 h-3.5 text-text-muted" />
                          <span className="text-xs text-text-muted font-bold uppercase">{dept.users} Active Members</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 text-text-muted hover:text-white transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-3 bg-bg-dark border border-border-subtle rounded-lg">
                      <p className="text-[9px] text-text-muted uppercase font-bold mb-1">Active</p>
                      <p className="text-lg font-bold text-white">{dept.activeQueries}</p>
                    </div>
                    <div className="p-3 bg-bg-dark border border-border-subtle rounded-lg">
                      <p className="text-[9px] text-text-muted uppercase font-bold mb-1">Compliance</p>
                      <p className={`text-lg font-bold ${dept.slaCompliance > 95 ? 'text-success' : 'text-warning'}`}>
                        {dept.slaCompliance}%
                      </p>
                    </div>
                    <div className="p-3 bg-bg-dark border border-border-subtle rounded-lg">
                      <p className="text-[9px] text-text-muted uppercase font-bold mb-1">Avg Time</p>
                      <p className="text-lg font-bold text-white">{dept.avgResolution}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-text-muted uppercase font-bold">Efficiency Rating</span>
                      <span className="text-[10px] text-white font-bold">{dept.slaCompliance}%</span>
                    </div>
                    <div className="w-full bg-bg-dark h-1.5 rounded-full overflow-hidden border border-border-subtle">
                      <div 
                        className={`h-full rounded-full ${dept.slaCompliance > 95 ? 'bg-success' : 'bg-brand-primary'}`} 
                        style={{ width: `${dept.slaCompliance}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-bg-dark/50 border-t border-border-subtle flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="text-[10px] font-bold text-text-muted hover:text-white uppercase tracking-wider flex items-center transition-colors">
                      <Edit className="w-3 h-3 mr-1.5" />
                      Settings
                    </button>
                    <button className="text-[10px] font-bold text-text-muted hover:text-white uppercase tracking-wider flex items-center transition-colors">
                      <UserPlus className="w-3 h-3 mr-1.5" />
                      Team
                    </button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                    View Reports
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
          
          {/* Add New Department Placeholder */}
          <button className="border-2 border-dashed border-border-subtle rounded-xl p-8 flex flex-col items-center justify-center text-text-muted hover:text-brand-primary hover:border-brand-primary/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-bg-card flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">Create New Department</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
