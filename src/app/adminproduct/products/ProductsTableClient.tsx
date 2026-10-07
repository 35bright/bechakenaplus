'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, PlusCircle, Edit3, Trash2, Copy, 
  ExternalLink, Eye, MousePointerClick, Check, X
} from 'lucide-react';
import { Product, Category } from '@/types/database';
import { useToast } from '@/context/ToastContext';

interface ProductsTableClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ProductsTableClient({ initialProducts, categories }: ProductsTableClientProps) {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Filtered products
  const filtered = products.filter(p => {
    if (selectedCategory !== 'all' && p.category_id !== selectedCategory) return false;
    if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q));
  });

  // Inline status toggle
  const toggleStatus = async (product: Product) => {
    const newStatus = product.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: newStatus } : p));
        toast(`Product status changed to ${newStatus}`, 'success');
      }
    } catch {
      toast('Failed to update status', 'error');
    }
  };

  // Inline featured toggle
  const toggleFeatured = async (product: Product) => {
    const newFeatured = !product.is_featured;
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: newFeatured }),
      });
      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_featured: newFeatured } : p));
        toast(`Featured updated`, 'success');
      }
    } catch {
      toast('Failed to update featured flag', 'error');
    }
  };

  // Duplicate product
  const handleDuplicate = async (product: Product) => {
    try {
      const { id: _, ...restProduct } = product;
      const duplicatePayload = {
        ...restProduct,
        name: `${product.name} (Copy)`,
        slug: `${product.slug}-copy-${Date.now().toString().slice(-4)}`,
        status: 'draft' as const,
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicatePayload),
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts(prev => [data.product, ...prev]);
        toast('Product duplicated as draft!', 'success');
      } else {
        toast(data.error || 'Failed to duplicate', 'error');
      }
    } catch {
      toast('Error duplicating product', 'error');
    }
  };

  // Delete product
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        toast('Product deleted successfully', 'info');
      } else {
        toast('Failed to delete product', 'error');
      }
    } catch {
      toast('Error deleting product', 'error');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title or brand..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-2xl text-xs text-gray-900 outline-hidden focus:border-[#0B5D36] focus:bg-white transition-all font-medium"
          />
        </div>

        {/* Category & Status Selectors */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 md:flex-initial px-3 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-2xl text-xs text-gray-700 outline-hidden cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="flex-1 md:flex-initial px-3 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-2xl text-xs text-gray-700 outline-hidden cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="archived">Archived</option>
          </select>

          <Link
            href="/adminproduct/products/new"
            className="px-4 py-2.5 bg-[#0B5D36] hover:bg-[#074528] text-white text-xs font-semibold rounded-2xl flex items-center gap-2 transition-colors whitespace-nowrap shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Product</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Price (BDT)</th>
                <th className="py-3.5 px-4 font-semibold text-center">Featured</th>
                <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                <th className="py-3.5 px-4 font-semibold text-center">Clicks</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length > 0 ? (
                filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Product Cell */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.primary_image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-contain bg-[#f8faf9] border border-gray-100 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs sm:max-w-sm">
                          <Link
                            href={`/adminproduct/products/${product.id}/edit`}
                            className="font-bold text-gray-900 hover:text-[#0B5D36] transition-colors truncate block"
                          >
                            {product.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5">
                            {product.brand && (
                              <span className="text-[10px] text-gray-500 font-medium">{product.brand}</span>
                            )}
                            {product.badges && product.badges.length > 0 && (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                                {product.badges[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category Cell */}
                    <td className="py-3.5 px-4 text-gray-600 font-medium">
                      {product.category?.name || 'Unassigned'}
                    </td>

                    {/* Price Cell */}
                    <td className="py-3.5 px-4">
                      <p className="font-heading font-bold text-gray-900">৳{product.price.toLocaleString()}</p>
                      {Boolean(product.original_price && product.original_price > product.price) && (
                        <p className="text-[10px] text-gray-400 line-through">৳{product.original_price?.toLocaleString()}</p>
                      )}
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleFeatured(product)}
                        className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-colors ${
                          product.is_featured
                            ? 'bg-emerald-100 text-[#0B5D36]'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                        title={product.is_featured ? 'Featured on home' : 'Click to feature'}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Status Pill / Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleStatus(product)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                          product.status === 'published'
                            ? 'bg-emerald-50 text-[#0B5D36] border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {product.status}
                      </button>
                    </td>

                    {/* Clicks */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-gray-700">
                      {product.daraz_clicks_count || 0}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          title="View on Storefront"
                          className="p-1.5 text-gray-400 hover:text-[#0B5D36] hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(product)}
                          title="Duplicate Product"
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/adminproduct/products/${product.id}/edit`}
                          title="Edit Product"
                          className="p-1.5 text-gray-400 hover:text-[#0B5D36] hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={isDeleting === product.id}
                          title="Delete Product"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No products found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
