'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Layers, Check, X, Loader2 } from 'lucide-react';
import { Category } from '@/types/database';
import { useToast } from '@/context/ToastContext';

interface CategoriesClientProps {
  initialCategories: Category[];
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('Headphones');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);

  const openCreateModal = () => {
    setEditingCat(null);
    setName('');
    setNameBn('');
    setSlug('');
    setIcon('Headphones');
    setImageUrl('');
    setDescription('');
    setSortOrder(categories.length + 1);
    setIsActive(true);
    setIsFeatured(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setNameBn(cat.name_bn || '');
    setSlug(cat.slug);
    setIcon(cat.icon || 'Headphones');
    setImageUrl(cat.image_url || '');
    setDescription(cat.description || '');
    setSortOrder(cat.sort_order || 0);
    setIsActive(cat.is_active);
    setIsFeatured(cat.is_featured);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    const payload = {
      name: name.trim(),
      name_bn: nameBn.trim() || null,
      slug: slug.trim() || name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
      icon,
      image_url: imageUrl.trim() || null,
      description: description.trim() || null,
      sort_order: Number(sortOrder) || 0,
      is_active: isActive,
      is_featured: isFeatured,
    };

    try {
      const endpoint = editingCat ? `/api/admin/categories/${editingCat.id}` : '/api/admin/categories';
      const method = editingCat ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (editingCat) {
          setCategories(prev => prev.map(c => c.id === editingCat.id ? data.category : c));
          toast('Category updated!', 'success');
        } else {
          setCategories(prev => [...prev, data.category]);
          toast('Category created!', 'success');
        }
        setIsModalOpen(false);
      } else {
        toast(data.error || 'Failed to save category', 'error');
      }
    } catch {
      toast('Network error saving category', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== id));
        toast('Category deleted', 'info');
      } else {
        toast('Failed to delete category', 'error');
      }
    } catch {
      toast('Error deleting category', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header action */}
      <div className="flex justify-end">
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0B5D36] hover:bg-[#074528] text-white text-xs font-semibold rounded-2xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Category List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4">Order</th>
              <th className="py-3.5 px-4">Category Name</th>
              <th className="py-3.5 px-4">Bengali Name</th>
              <th className="py-3.5 px-4">Slug</th>
              <th className="py-3.5 px-4 text-center">Featured</th>
              <th className="py-3.5 px-4 text-center">Active</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-gray-400">
                  {cat.sort_order}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0B5D36] flex items-center justify-center font-bold shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{cat.name}</p>
                      {cat.description && (
                        <p className="text-[11px] text-gray-400 truncate max-w-xs">{cat.description}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-bengali text-gray-600 font-medium">
                  {cat.name_bn || '—'}
                </td>
                <td className="py-3.5 px-4 font-mono text-gray-500">
                  {cat.slug}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    cat.is_featured ? 'bg-emerald-50 text-[#0B5D36]' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {cat.is_featured ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    cat.is_active ? 'bg-emerald-50 text-[#0B5D36]' : 'bg-red-50 text-red-600'
                  }`}>
                    {cat.is_active ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 text-gray-400 hover:text-[#0B5D36] hover:bg-emerald-50 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-heading font-bold text-base text-gray-900">
                {editingCat ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Electronics"
                  className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Bengali Name</label>
                <input
                  type="text"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="e.g. ইলেকট্রনিক্স"
                  className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36] font-bengali"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="electronics"
                  className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short department summary..."
                  className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Display Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden"
                  />
                </div>
                <div className="flex flex-col justify-end space-y-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 accent-[#0B5D36]"
                    />
                    <span>Featured</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 accent-[#0B5D36]"
                    />
                    <span>Active</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 rounded-xl bg-[#0B5D36] hover:bg-[#074528] text-white text-xs font-semibold flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
