import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { Shield, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

interface MatrixPerms {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

interface Role {
  id: string;
  name: string;
  permissions: {
    dashboard: MatrixPerms;
    query: MatrixPerms;
    users: MatrixPerms;
    departments: MatrixPerms;
    sla: MatrixPerms;
    escalations: MatrixPerms;
    reports: MatrixPerms;
    settings: MatrixPerms;
  };
  isSystem: boolean;
}

const defaultMatrix = { view: false, create: false, edit: false, delete: false };

const defaultPermissions = {
  dashboard: { ...defaultMatrix },
  query: { ...defaultMatrix },
  users: { ...defaultMatrix },
  departments: { ...defaultMatrix },
  sla: { ...defaultMatrix },
  escalations: { ...defaultMatrix },
  reports: { ...defaultMatrix },
  settings: { ...defaultMatrix }
};

const moduleLabels: Record<keyof typeof defaultPermissions, string> = {
  dashboard: 'DASHBOARD',
  query: 'QUERY MANAGEMENT',
  users: 'USER MANAGEMENT',
  departments: 'DEPARTMENT MGMT',
  sla: 'SLA CONFIGURATION',
  escalations: 'ESCALATION CENTER',
  reports: 'REPORTS & ANALYTICS',
  settings: 'SYSTEM SETTINGS'
};

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  const [editingRoleId, setEditingRoleId] = useState('');
  const [formName, setFormName] = useState('');
  const [formPermissions, setFormPermissions] = useState<typeof defaultPermissions>(defaultPermissions);

  const fetchRoles = async () => {
    try {
      const data = await api.getRoles();
      setRoles(data);
    } catch (err) {
      toast.error('Failed to load roles');
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setFormName('');
    setFormPermissions(JSON.parse(JSON.stringify(defaultPermissions)));
    setIsModalOpen(true);
  };

  const openEditModal = async (role: Role) => {
    try {
      const liveRole = await api.getRoleById(role.id);
      setModalMode('edit');
      setEditingRoleId(liveRole.id);
      setFormName(liveRole.name);
      
      // Ensure all keys exist in case of old data
      const mergedPerms = JSON.parse(JSON.stringify(defaultPermissions));
      if (liveRole.permissions) {
        Object.keys(liveRole.permissions).forEach(k => {
          if (mergedPerms[k]) {
            mergedPerms[k] = { ...mergedPerms[k], ...liveRole.permissions[k] };
          }
        });
      }
      setFormPermissions(mergedPerms);
      setIsModalOpen(true);
    } catch (err) {
      toast.error('Failed to load role details');
    }
  };

  const handleToggle = (moduleKey: keyof typeof defaultPermissions, action: keyof MatrixPerms) => {
    setFormPermissions(prev => {
      const updated = { ...prev };
      updated[moduleKey] = {
        ...updated[moduleKey],
        [action]: !updated[moduleKey][action]
      };
      return updated;
    });
  };

  const handleSave = async () => {
    if (!formName.trim()) return toast.error('Role name is required');

    try {
      if (modalMode === 'create') {
        await api.createRole({ name: formName, permissions: formPermissions });
        toast.success('Role created successfully!');
      } else {
        await api.updateRole(editingRoleId, { name: formName, permissions: formPermissions });
        toast.success('Role updated successfully!');
      }
      fetchRoles();
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Error saving role');
    }
  };

  const handleDelete = async (role: Role) => {
    if (role.isSystem) return toast.error('Cannot delete a system role');
    if (confirm(`Are you sure you want to delete the role ${role.name}?`)) {
      try {
        await api.deleteRole(role.id);
        toast.success('Role deleted!');
        fetchRoles();
      } catch (err) {
        toast.error('Error deleting role');
      }
    }
  };

  const renderIcon = (isActive: boolean, onClick?: () => void) => {
    if (isActive) {
      return (
        <button 
          onClick={onClick}
          type="button"
          className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
            onClick ? 'cursor-pointer hover:bg-green-100 hover:scale-105' : 'cursor-default'
          } bg-green-50 border-green-200 text-green-500 shadow-sm`}
        >
          <Check className="w-4 h-4 stroke-[3]" />
        </button>
      );
    }
    return (
      <button 
        onClick={onClick}
        type="button"
        className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
          onClick ? 'cursor-pointer hover:bg-red-100 hover:scale-105' : 'cursor-default'
        } bg-red-50 border-red-200 text-red-400 shadow-sm`}
      >
        <X className="w-4 h-4 stroke-[3]" />
      </button>
    );
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Roles & Permissions | Admin Panel</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Roles & Permissions</h1>
            <p className="text-text-muted text-sm">Define access control and operational boundaries.</p>
          </div>
          <Button className="space-x-2" onClick={openCreateModal}>
            <Plus className="w-4 h-4" />
            <span>Create Role</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {roles.map((role) => (
            <Card key={role.id} className="p-0 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                        <span>{role.name}</span>
                        {role.isSystem && (
                          <span className="text-[10px] bg-brand-primary/20 text-brand-primary px-2 py-0.5 rounded-full uppercase font-bold">System</span>
                        )}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => openEditModal(role)} className="p-2 text-text-muted transition-colors" title="Edit Role">
                      <Edit className="w-4 h-4" />
                    </button>
                    {!role.isSystem && (
                      <button onClick={() => handleDelete(role)} className="p-2 text-danger hover:bg-danger/80 rounded transition-colors" title="Delete Role">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mt-4 text-center">
                  <p className="text-sm text-text-muted font-medium bg-bg-dark py-3 rounded-xl border border-border-subtle">
                    Click Edit to view Matrix Permissions
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-bg-card w-full max-w-4xl rounded-2xl border border-border-subtle shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-border-subtle flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {modalMode === 'create' ? 'Create Role' : 'Edit Role'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-text-muted transition-colors rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-[#F9F7F3]"> {/* Light background for the matrix area similar to screenshot */}
              <div className="mb-6 max-w-sm">
                <label className="block text-sm font-bold text-gray-700 mb-2">Role Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Manager" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  disabled={modalMode === 'edit' && roles.find(r => r.id === editingRoleId)?.isSystem}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary disabled:opacity-50"
                />
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-gray-200 bg-[#FAF9F6]">
                        <th className="py-4 px-6 text-[11px] font-bold text-gray-500 tracking-wider uppercase">Module Name</th>
                        <th className="py-4 px-6 text-[11px] font-bold text-gray-500 tracking-wider uppercase text-center w-24">View</th>
                        <th className="py-4 px-6 text-[11px] font-bold text-gray-500 tracking-wider uppercase text-center w-24">Create</th>
                        <th className="py-4 px-6 text-[11px] font-bold text-gray-500 tracking-wider uppercase text-center w-24">Edit</th>
                        <th className="py-4 px-6 text-[11px] font-bold text-gray-500 tracking-wider uppercase text-center w-24">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(Object.keys(moduleLabels) as Array<keyof typeof defaultPermissions>).map((modKey) => (
                        <tr key={modKey} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6">
                            <span className="text-xs font-bold text-gray-800 tracking-wide">{moduleLabels[modKey]}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex justify-center">
                              {renderIcon(formPermissions[modKey].view, () => handleToggle(modKey, 'view'))}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex justify-center">
                              {renderIcon(formPermissions[modKey].create, () => handleToggle(modKey, 'create'))}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex justify-center">
                              {renderIcon(formPermissions[modKey].edit, () => handleToggle(modKey, 'edit'))}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex justify-center">
                              {renderIcon(formPermissions[modKey].delete, () => handleToggle(modKey, 'delete'))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border-subtle bg-bg-card flex justify-end space-x-3">
              <Button  onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>
                {modalMode === 'create' ? 'Create Role' : 'Save Changes'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
