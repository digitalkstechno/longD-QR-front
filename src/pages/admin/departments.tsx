import React from 'react';
import Head from 'next/head';
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
  Activity,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { storage, Ticket, Department } from '@/utils/storage';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';
import { PageLoader } from '@/components/ui/PageLoader';

export default function DepartmentManagementPage() {
  const [loading, setLoading] = React.useState(true);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [search, setSearch] = React.useState('');
  const [totalPages, setTotalPages] = React.useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit'>('create');
  const [editingDeptId, setEditingDeptId] = React.useState('');
  const [deptFormName, setDeptFormName] = React.useState('');

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.getDepartments(page, limit, search);
      setDepartments(res.data || []);
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchDepartments();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search]);

  React.useEffect(() => {
    setTickets(storage.getTickets());
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setDeptFormName('');
    setIsModalOpen(true);
  };

  const openEditModal = async (dept: Department) => {
    try {
      const liveDept = await api.getDepartmentById(dept.id);
      setModalMode('edit');
      setEditingDeptId(liveDept.id);
      setDeptFormName(liveDept.name);
      setIsModalOpen(true);
    } catch (err) {
      toast.error('Failed to load department details');
    }
  };

  const handleSave = async () => {
    if (!deptFormName.trim()) return;

    try {
      if (modalMode === 'create') {
        await api.createDepartment({ name: deptFormName, isActive: true });
        toast.success('Department created successfully!');
      } else {
        await api.updateDepartment(editingDeptId, { name: deptFormName });
        toast.success('Department updated successfully!');
      }
      fetchDepartments();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Error saving department');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        await api.deleteDepartment(id);
        toast.success('Department deleted!');
        fetchDepartments();
      } catch (err) {
        console.error(err);
        toast.error('Error deleting department');
      }
    }
  };

  const toggleActive = async (dept: Department) => {
    try {
      await api.updateDepartment(dept.id, { isActive: !dept.isActive });
      toast.success(`Department ${dept.isActive ? 'deactivated' : 'activated'}`);
      fetchDepartments();
    } catch (err) {
      console.error(err);
      toast.error('Error updating department');
    }
  };

  return (
    <>
      <Head>
        <title>Department Management | Admin Panel</title>
      </Head>

      {loading ? (
        <PageLoader />
      ) : (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Departments</h1>
            <p className="text-text-muted text-sm">Configure organizational units and monitor service efficiency.</p>
          </div>
          <div className="flex items-center space-x-4">
            <input 
              type="text" 
              placeholder="Search departments..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="px-4 py-2 bg-bg-dark border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-brand-primary text-white"
            />
            <Button className="space-x-2" onClick={openCreateModal}>
              <Plus className="w-4 h-4" />
              <span>Create Department</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {departments.map((dept, i) => {
            const deptTickets = tickets.filter(t => t.departmentId === dept.id);
            const activeTickets = deptTickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
            const usersCount = storage.getUsers().filter(u => u.departmentId === dept.id).length;

            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`p-0 overflow-hidden group ${!dept.isActive ? 'opacity-50 grayscale' : ''}`}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center group-hover:bg-brand-primary/20 transition-all">
                          <Building2 className="w-6 h-6 text-brand-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{dept.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-text-muted font-mono bg-brand-primary/10 px-2 py-0.5 rounded">{dept.description || 'No description'}</span>
                            <Users className="w-3.5 h-3.5 text-text-muted" />
                            <span className="text-xs text-text-muted font-bold uppercase">{usersCount} Active Members</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => openEditModal(dept)} className="p-2 text-text-muted  transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(dept.id)} className="p-2 text-danger  rounded transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-3 bg-bg-dark border border-border-subtle rounded-lg">
                        <p className="text-[9px] text-text-muted uppercase font-bold mb-1">Active Tickets</p>
                        <p className="text-lg font-bold text-white">{activeTickets}</p>
                      </div>
                      <div className="p-3 bg-bg-dark border border-border-subtle rounded-lg">
                        <p className="text-[9px] text-text-muted uppercase font-bold mb-1">Status</p>
                        <p className={`text-lg font-bold ${dept.isActive ? 'text-success' : 'text-danger'}`}>
                          {dept.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-bg-dark/50 border-t border-border-subtle flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleActive(dept)}
                        className="text-[10px] font-bold text-text-muted  uppercase tracking-wider flex items-center transition-colors"
                      >
                        <Settings2 className="w-3 h-3 mr-1.5" />
                        {dept.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                    <div className="text-xs text-text-muted font-mono bg-bg-card px-2 py-1 rounded border border-border-subtle truncate" title={`submit-query?${dept.slug || dept.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      submit-query?{dept.slug || dept.name.toLowerCase().replace(/\s+/g, '-')}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}

          <button onClick={openCreateModal} className="border-2 border-dashed border-border-subtle rounded-xl p-8 flex flex-col items-center justify-center text-text-muted hover:text-brand-primary hover:border-brand-primary/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-bg-card flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">Create New Department</span>
          </button>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 bg-bg-card p-4 rounded-xl border border-border-subtle">
            <Button 
              variant="outline" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-text-muted">Page {page} of {totalPages}</span>
            <Button 
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Create Department' : 'Edit Department'}
      >
        <div className="space-y-4">
          <Input
            label="Department Name"
            placeholder="e.g. IT Support Services"
            value={deptFormName}
            onChange={(e) => setDeptFormName(e.target.value)}
          />
          <div className="flex justify-end space-x-3 pt-4 border-t border-border-subtle">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>
              {modalMode === 'create' ? 'Create' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
