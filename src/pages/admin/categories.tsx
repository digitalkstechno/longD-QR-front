import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plus, Edit2, Trash2, Tags, Building2, Loader2 } from 'lucide-react';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';
import { PageLoader } from '@/components/ui/PageLoader';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

const DEPT_PAGE_SIZE = 10; // categories per department per load

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', departmentId: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');

  // Per-department scroll pagination
  const [deptVisibleCount, setDeptVisibleCount] = useState<Record<string, number>>({});

  // Confirm Delete State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingCatId, setDeletingCatId] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, deptRes] = await Promise.all([
        api.getCategories(undefined, 1, 1000, search),
        api.getDepartments(1, 1000)
      ]);
      setCategories(catRes.data || []);
      setDepartments(deptRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => { fetchData(); }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Scroll sentinel per department
  const sentinelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleSentinelIntersect = useCallback((deptId: string, entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting) {
      setDeptVisibleCount(prev => ({
        ...prev,
        [deptId]: (prev[deptId] || DEPT_PAGE_SIZE) + DEPT_PAGE_SIZE
      }));
    }
  }, []);

  useEffect(() => {
    const observers: Record<string, IntersectionObserver> = {};
    departments.forEach(dept => {
      const el = sentinelRefs.current[dept.id];
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => handleSentinelIntersect(dept.id, entries),
        { threshold: 0.1 }
      );
      obs.observe(el);
      observers[dept.id] = obs;
    });
    return () => { Object.values(observers).forEach(o => o.disconnect()); };
  }, [departments, handleSentinelIntersect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('departmentId', formData.departmentId);
      if (imageFile) payload.append('image', imageFile);

      if (editingId) {
        await api.updateCategory(editingId, payload);
        toast.success('Category updated successfully');
      } else {
        await api.createCategory(payload);
        toast.success('Category created successfully');
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save category');
    }
  };

  const requestDelete = (id: string) => {
    setDeletingCatId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await api.deleteCategory(deletingCatId);
      toast.success('Category deleted successfully');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete category');
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
      setDeletingCatId('');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', departmentId: '' });
    setEditingId(null);
    setImageFile(null);
    setImagePreviewUrl('');
  };

  const renderCategoryTable = (cats: any[], deptId: string, deptName: string, count: number) => {
    const visibleCount = deptVisibleCount[deptId] || DEPT_PAGE_SIZE;
    const visible = cats.slice(0, visibleCount);
    const hasMore = visibleCount < cats.length;

    return (
      <Card className="p-0 overflow-hidden flex flex-col h-[400px]">
        {/* Card header — same style as Assignments page */}
        <div className="p-4 border-b border-border-subtle flex items-center justify-between shrink-0">
          <h3 className="text-md font-bold text-text-main flex items-center">
            <span className="w-2 h-6 bg-brand-primary rounded mr-3"></span>
            {deptName}
            <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary">
              {count}
            </span>
          </h3>
        </div>
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm relative">
            <thead className="sticky top-0 z-10">
              <tr className="bg-bg-dark text-text-muted text-sm font-semibold border-b border-border-subtle">
                <th className="px-6 py-3 w-20">Image</th>
                <th className="px-6 py-3">Category Name</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {visible.map((cat) => (
                <tr key={cat.id} className="hover:bg-brand-primary/5 transition-colors">
                  <td className="px-6 py-2">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shadow-sm p-1 border border-border-subtle">
                      <img src={cat.imageUrl || '/logo.webp'} alt="" className="w-full h-full object-contain" />
                    </div>
                  </td>
                  <td className="px-6 py-2 w-full">
                    <div className="flex items-center space-x-3">
                      <Tags className="w-4 h-4 text-brand-primary flex-shrink-0" />
                      <span className="font-medium text-text-main">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-2 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        className="p-2"
                        onClick={() => {
                          setEditingId(cat.id);
                          const dId = cat.departmentId?._id || cat.departmentId?.id || cat.departmentId;
                          setFormData({ name: cat.name, departmentId: dId ? String(dId) : '' });
                          setImageFile(null);
                          setImagePreviewUrl(cat.imageUrl || '');
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button className="p-2" onClick={() => requestDelete(cat.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {cats.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-text-muted text-xs">
                    No categories in this department
                  </td>
                </tr>
              )}

              {/* Scroll sentinel for infinite loading */}
              {hasMore && (
                <tr>
                  <td colSpan={3}>
                    <div
                      ref={el => { sentinelRefs.current[deptId] = el; }}
                      className="flex items-center justify-center py-3 text-text-muted"
                    >
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span className="text-xs">Loading more...</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    );
  };

  return (
    <>
      <Head>
        <title>Categories | Admin</title>
      </Head>

      {loading ? (
        <PageLoader />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-main mb-1">Categories</h1>
              <p className="text-text-muted text-sm">Manage categories for each department.</p>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 bg-bg-dark border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-brand-primary text-white"
              />
              <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </Button>
            </div>
          </div>

          {departments.length === 0 && categories.length === 0 && (
            <Card className="p-12 text-center text-text-muted">
              No departments or categories found.
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {departments.map((dept) => {
              const deptCategories = categories.filter(c => {
                const cDeptId = c.departmentId?._id || c.departmentId?.id || c.departmentId;
                return String(cDeptId) === String(dept.id);
              });

              return (
                <div key={dept.id}>
                  {renderCategoryTable(deptCategories, dept.id, dept.name, deptCategories.length)}
                </div>
              );
            })}

            {(() => {
              const unassigned = categories.filter(c => {
                const cDeptId = c.departmentId?._id || c.departmentId?.id || c.departmentId;
                return !departments.some(d => String(d.id) === String(cDeptId));
              });
              if (unassigned.length === 0) return null;
              return (
                <div>
                  {renderCategoryTable(unassigned, 'unassigned', 'Unassigned', unassigned.length)}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-text-main mb-6">
              {editingId ? 'Edit Category' : 'Add Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Image</label>
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-white shadow-sm p-1 border border-border-subtle flex items-center justify-center">
                    <img src={imagePreviewUrl || '/logo.webp'} alt="" className="w-full h-full object-contain" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setImageFile(f);
                      setImagePreviewUrl(f ? URL.createObjectURL(f) : imagePreviewUrl);
                    }}
                    className="text-sm text-text-muted"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-bg-dark border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary/50 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Department</label>
                <select
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="w-full bg-bg-dark border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary/50 transition-all"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setDeletingCatId(''); }}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </>
  );
}
