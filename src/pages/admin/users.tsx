import React from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  MoreHorizontal, 
  Mail, 
  Shield, 
  Building2, 
  Activity,
  Edit,
  Trash2,
  Lock,
  Search,
  Filter,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const users = [
  { name: 'James Sterling', email: 'j.sterling@company.com', dept: 'Operations', role: 'Super Admin', status: 'Active', queries: 0 },
  { name: 'David Chen', email: 'd.chen@company.com', dept: 'IT Support', role: 'Admin', status: 'Active', queries: 12 },
  { name: 'Maria Garcia', email: 'm.garcia@company.com', dept: 'Customer Service', role: 'Manager', status: 'Active', queries: 25 },
  { name: 'James Wilson', email: 'j.wilson@company.com', dept: 'Maintenance', role: 'Executive', status: 'Active', queries: 18 },
  { name: 'Sarah Jenkins', email: 's.jenkins@company.com', dept: 'Front Desk', role: 'Executive', status: 'Away', queries: 8 },
  { name: 'Robert Fox', email: 'r.fox@company.com', dept: 'Facilities', role: 'Executive', status: 'Inactive', queries: 0 },
];

export default function UserManagementPage() {
  return (
    <DashboardLayout>
      <Head>
        <title>User Management | Admin Panel</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">User Management</h1>
            <p className="text-text-muted text-sm">Manage administrative access and team assignments.</p>
          </div>
          <Button className="space-x-2">
            <UserPlus className="w-4 h-4" />
            <span>Add New User</span>
          </Button>
        </div>

        <Card className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search by name, email or department..." 
                className="w-full bg-bg-dark border border-border-subtle rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-primary/50"
              />
            </div>
            
            <div className="flex items-center space-x-3 overflow-x-auto pb-2 lg:pb-0">
              <select className="bg-bg-dark border border-border-subtle rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-primary/50">
                <option>All Departments</option>
                <option>Operations</option>
                <option>IT Support</option>
                <option>Maintenance</option>
              </select>
              <select className="bg-bg-dark border border-border-subtle rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-primary/50">
                <option>All Roles</option>
                <option>Super Admin</option>
                <option>Admin</option>
                <option>Manager</option>
                <option>Executive</option>
              </select>
              <Button variant="secondary" size="sm" className="h-[34px]">
                <Filter className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-bg-dark text-text-muted text-[10px] uppercase tracking-widest font-bold border-b border-border-subtle">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Active Workload</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {users.map((user) => (
                  <tr key={user.email} className="hover:bg-white/5 transition-colors group text-sm">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-bg-dark border border-border-subtle flex items-center justify-center font-bold text-brand-primary">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-white font-bold">{user.name}</p>
                          <p className="text-[11px] text-text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-text-muted">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{user.dept}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        user.role === 'Super Admin' ? 'gold' :
                        user.role === 'Admin' ? 'info' :
                        user.role === 'Manager' ? 'warning' : 'outline'
                      }>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {user.status === 'Active' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-text-muted" />
                        )}
                        <span className={`text-xs font-bold uppercase ${user.status === 'Active' ? 'text-success' : 'text-text-muted'}`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white font-bold font-mono">
                      {user.queries} Queries
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Lock className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-danger hover:text-danger hover:bg-danger/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
