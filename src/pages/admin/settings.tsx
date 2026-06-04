import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Clock, Plus, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [resolutionTimes, setResolutionTimes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState('');

  // Form State
  const [formLabel, setFormLabel] = useState('');
  const [formValue, setFormValue] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  const fetchData = async () => {
    try {
      const times = await api.getResolutionTimes();
      setResolutionTimes(times);
    } catch (err) {
      toast.error('Failed to load resolution times');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setFormLabel('');
    setFormValue('');
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (time: any) => {
    setModalMode('edit');
    setEditingId(time.id);
    setFormLabel(time.label);
    setFormValue(time.timeValue);
    setFormIsActive(time.isActive);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formLabel.trim() || !formValue.trim()) {
      toast.error('Label and Value are required');
      return;
    }

    try {
      if (modalMode === 'create') {
        await api.createResolutionTime({
          label: formLabel,
          timeValue: formValue,
          isActive: formIsActive
        });
        toast.success('Resolution time created');
      } else {
        await api.updateResolutionTime(editingId, {
          label: formLabel,
          timeValue: formValue,
          isActive: formIsActive
        });
        toast.success('Resolution time updated');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this resolution time?')) {
      try {
        await api.deleteResolutionTime(id);
        toast.success('Deleted successfully');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  const toggleStatus = async (time: any) => {
    try {
      await api.updateResolutionTime(time.id, { isActive: !time.isActive });
      toast.success('Status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Settings | Admin Panel</title>
      </Head>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Resolution Settings</h1>
            <p className="text-text-muted text-sm">Manage global SLA timers and dropdown options.</p>
          </div>
          <Button className="space-x-2" onClick={openCreateModal}>
            <Plus className="w-4 h-4" />
            <span>Add New Timing</span>
          </Button>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-border-subtle bg-bg-dark/30 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
              <Clock className="w-4 h-4 mr-2 text-brand-primary" />
              Global Resolution Times
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle bg-bg-dark/50">
                  <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Label</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Time Value</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {resolutionTimes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-text-muted">
                      No resolution times configured.
                    </td>
                  </tr>
                ) : (
                  resolutionTimes.map((time) => (
                    <tr key={time.id} className={`hover:bg-white/5 transition-colors group text-sm ${!time.isActive ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-4">
                        <span className="text-white font-bold">{time.label}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-text-muted">{time.timeValue}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => toggleStatus(time)}>
                          {time.isActive ? (
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          ) : (
                            <XCircle className="w-4 h-4 text-text-muted" />
                          )}
                          <span className={`text-xs font-bold uppercase ${time.isActive ? 'text-success' : 'text-text-muted'}`}>
                            {time.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button onClick={() => openEditModal(time)} size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button onClick={() => handleDelete(time.id)} size="sm" className="h-8 w-8 p-0 text-danger hover:text-danger hover:bg-danger/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-card border border-border-subtle w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border-subtle bg-bg-dark/50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-main uppercase tracking-wider">
                {modalMode === 'create' ? 'Create Resolution Time' : 'Edit Resolution Time'}
              </h2>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <Input
                label="Display Label"
                placeholder="e.g. 24 Hours"
                value={formLabel}
                onChange={(e) => setFormLabel(e.target.value)}
              />
              <Input
                label="Time Value (Backend Format)"
                placeholder="e.g. 24"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
              />
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="status"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 text-brand-primary bg-bg-dark border-border-subtle rounded focus:ring-brand-primary/50 cursor-pointer"
                />
                <label htmlFor="status" className="text-sm text-text-main cursor-pointer select-none font-medium">
                  Active (Show in Dropdowns)
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-border-subtle bg-bg-dark/50 flex justify-end space-x-3 mt-auto">
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
