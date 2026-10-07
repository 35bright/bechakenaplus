'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, FileText, Loader2, X, ExternalLink } from 'lucide-react';
import { BlogPost } from '@/types/database';
import { useToast } from '@/context/ToastContext';
import { ImageUploader } from '@/components/admin/ImageUploader';

interface BlogClientProps {
  initialPosts: BlogPost[];
}

export function BlogClient({ initialPosts }: BlogClientProps) {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('Audio & Tech');
  const [tagsText, setTagsText] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [readTime, setReadTime] = useState('4 min read');
  const [author, setAuthor] = useState('Bechakena+ Editorial Team');

  const openCreateModal = () => {
    setEditingPost(null);
    setTitle('');
    setTitleBn('');
    setSlug('');
    setSummary('');
    setContent('');
    setCoverImage('');
    setCategory('Audio & Tech');
    setTagsText('gadgets, review, buying guide');
    setIsPublished(true);
    setReadTime('4 min read');
    setAuthor('Bechakena+ Editorial Team');
    setIsModalOpen(true);
  };

  const openEditModal = (p: BlogPost) => {
    setEditingPost(p);
    setTitle(p.title);
    setTitleBn(p.title_bn || '');
    setSlug(p.slug);
    setSummary(p.summary || '');
    setContent(p.content);
    setCoverImage(p.cover_image || '');
    setCategory(p.category || 'Tech');
    setTagsText(p.tags?.join(', ') || '');
    setIsPublished(p.is_published);
    setReadTime(p.read_time || '4 min read');
    setAuthor(p.author || 'Bechakena+ Editorial Team');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast('Title and content are required', 'error');
      return;
    }

    setIsSaving(true);
    const tags = tagsText.split(',').map(t => t.trim()).filter(Boolean);
    const payload = {
      title: title.trim(),
      title_bn: titleBn.trim() || null,
      slug: slug.trim() || title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
      summary: summary.trim() || null,
      content: content.trim(),
      cover_image: coverImage.trim() || null,
      category: category.trim() || null,
      tags,
      is_published: isPublished,
      read_time: readTime,
      author: author.trim() || 'Bechakena+ Editorial Team',
    };

    try {
      const endpoint = editingPost ? `/api/admin/blog/${editingPost.id}` : '/api/admin/blog';
      const method = editingPost ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (editingPost) {
          setPosts(prev => prev.map(p => p.id === editingPost.id ? data.post : p));
          toast('Article updated!', 'success');
        } else {
          setPosts(prev => [data.post, ...prev]);
          toast('Article published!', 'success');
        }
        setIsModalOpen(false);
      } else {
        toast(data.error || 'Failed to save post', 'error');
      }
    } catch {
      toast('Network error saving post', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete post "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== id));
        toast('Post deleted', 'info');
      }
    } catch {
      toast('Failed to delete post', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0B5D36] hover:bg-[#074528] text-white text-xs font-semibold rounded-2xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Buying Guide</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4">Article</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Author</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-12 h-10 object-cover rounded-xl border border-gray-100 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-10 rounded-xl bg-emerald-50 text-[#0B5D36] flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0 max-w-sm sm:max-w-md">
                      <p className="font-bold text-gray-900 truncate">{post.title}</p>
                      {post.title_bn && <p className="font-bengali text-[11px] text-gray-400 truncate">{post.title_bn}</p>}
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-gray-600 font-medium">
                  {post.category || 'General'}
                </td>
                <td className="py-3.5 px-4 text-gray-500">
                  {post.author}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    post.is_published ? 'bg-emerald-50 text-[#0B5D36]' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {post.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-400 hover:text-[#0B5D36] hover:bg-emerald-50 rounded-lg"
                      title="View Article"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => openEditModal(post)}
                      className="p-1.5 text-gray-400 hover:text-[#0B5D36] hover:bg-emerald-50 rounded-lg"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-heading font-bold text-base text-gray-900">
                {editingPost ? 'Edit Article' : 'Write New Buying Guide'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Best Wireless Earbuds Under ৳2,000"
                  className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Bengali Title</label>
                  <input
                    type="text"
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    placeholder="e.g. ২ হাজার টাকার মধ্যে সেরা ইয়ারবাডস"
                    className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden font-bengali"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="best-wireless-earbuds"
                    className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Summary / Excerpt</label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Short introductory summary for card snippets..."
                  className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cover Image (ImgBB)</label>
                <ImageUploader
                  primaryImage={coverImage}
                  onPrimaryImageChange={setCoverImage}
                  galleryImages={[]}
                  onGalleryImagesChange={() => {}}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Article Content (HTML supported) *</label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="<h3>Overview</h3><p>Detailed analysis...</p>"
                  className="w-full p-4 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden font-mono leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Read Time</label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="gadgets, audio, reviews"
                  className="w-full px-3.5 py-2 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="publishedCheck"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 accent-[#0B5D36]"
                />
                <label htmlFor="publishedCheck" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Publish Article Live
                </label>
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
                  <span>Save Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
