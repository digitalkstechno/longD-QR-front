import React from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Check, 
  X, 
  Save, 
  Plus, 
  Info,
  ChevronRight,
  Lock,
  Eye,
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const modules = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'queries', name: 'Query Management' },
  { id: 'users', name: 'User Management' },
  { id: 'departments', name: 'Department Mgmt' },
  { id: 'sla', name: 'SLA Configuration' },
  { id: 'escalations', name: 'Escalation Center' },
  { id: 'reports', name: 'Reports & Analytics' },
  { id: 'settings', name: 'System Settings' },
];

const permissions = [
  { id: 'view', name: 'View' },
  { id: 'create', name: 'Create' },
  { id: 'edit', name: 'Edit' },
  { id: 'delete', name: 'Delete' },
];

const roles = [
  { id: 'super-admin', name: 'Super Admin', desc: 'Full administrative access to all modules and system settings.' },
  { id: 'admin', name: 'Administrator', desc: 'Can manage operational entities, users, and view all reports.' },
  { id: 'manager', name: 'Dept Manager', desc: 'Manages department-specific queries and agent performance.' },
  { id: 'executive', name: 'Service Executive', desc: 'Handles assigned queries and maintains service levels.' },
];

export default function RolesPermissionsPage() {
  const [activeRole, setActiveRole] = React.useState('executive');

  return (
    <DashboardLayout>
      <Head>
        <title>Roles & Permissions | Admin Panel</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Access Control</h1>
            <p className="text-text-muted text-sm">Define role-based permissions and module access levels.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" className="space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Role</span>
            </Button>
            <Button className="space-x-2">
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Panel: Roles List */}
          <div className="xl:col-span-4 space-y-4">
            <Card className="p-0 overflow-hidden">
              <div className="p-4 border-b border-border-subtle bg-bg-dark/30">
                <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center">
                  <Shield className="w-3.5 h-3.5 mr-2 text-brand-primary" />
                  Defined Roles
                </h3>
              </div>
              <div className="p-2">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setActiveRole(role.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 group mb-1 ${
                      activeRole === role.id 
                        ? 'bg-brand-primary/10 border border-brand-primary/20' 
                        : 'border border-transparent hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${activeRole === role.id ? 'text-brand-primary' : 'text-white'}`}>
                        {role.name}
                      </span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${activeRole === role.id ? 'text-brand-primary translate-x-1' : 'text-text-muted opacity-0 group-hover:opacity-100'}`} />
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed">{role.desc}</p>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-info/5 border-info/10">
              <div className="flex items-start space-x-3">
                <Info className="w-4 h-4 text-info mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white mb-1 uppercase">RBAC Policy</h4>
                  <p className="text-[10px] text-text-muted leading-relaxed">
                    Changes to role permissions are applied in real-time. This affects session access for all active users assigned to this role.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Panel: Permissions Matrix */}
          <div className="xl:col-span-8">
            <Card className="p-0 overflow-hidden">
              <div className="p-4 border-b border-border-subtle bg-bg-dark/30 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Permission Matrix</h3>
                  <p className="text-[10px] text-text-muted font-bold uppercase mt-1">
                    Configuring: <span className="text-brand-primary">{roles.find(r => r.id === activeRole)?.name}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-success" />
                    <span className="text-[9px] text-text-muted uppercase font-bold">Allowed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-danger" />
                    <span className="text-[9px] text-text-muted uppercase font-bold">Denied</span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-bg-dark text-text-muted text-[10px] uppercase tracking-widest font-bold border-b border-border-subtle">
                      <th className="px-6 py-4 min-w-[180px]">Module Name</th>
                      {permissions.map((p) => (
                        <th key={p.id} className="px-6 py-4 text-center">{p.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {modules.map((m) => (
                      <tr key={m.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-white uppercase group-hover:text-brand-primary transition-colors">
                            {m.name}
                          </span>
                        </td>
                        {permissions.map((p) => {
                          const isAllowed = 
                            activeRole === 'super-admin' || 
                            (activeRole === 'admin' && m.id !== 'settings') ||
                            (activeRole === 'manager' && ['dashboard', 'queries', 'reports'].includes(m.id)) ||
                            (activeRole === 'executive' && m.id === 'queries' && ['view', 'create', 'edit'].includes(p.id));

                          return (
                            <td key={p.id} className="px-6 py-4 text-center">
                              <button className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-all ${
                                isAllowed 
                                  ? 'bg-success/10 border border-success/20 text-success hover:bg-success/20' 
                                  : 'bg-danger/10 border border-danger/20 text-danger hover:bg-danger/20'
                              }`}>
                                {isAllowed ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
