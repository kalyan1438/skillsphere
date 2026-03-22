import { useState, useEffect, useCallback } from 'react';
import { adminGetAnnouncements, createAnnouncement, deleteAnnouncement } from '@/api';
import type { Announcement, ApiError } from '@/types';
import toast from 'react-hot-toast';

const AdminAnnouncements = () => {
  const [list,    setList]    = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({ title: '', description: '', sendEmail: true });

  const load = useCallback(() => {
    adminGetAnnouncements().then(r => setList(r.data.data || [])).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) { toast.error('Title and description required'); return; }
    setSaving(true);
    try {
      const res = await createAnnouncement(form);
      toast.success(res.data.message || 'Announcement posted!');
      setForm({ title: '', description: '', sendEmail: true });
      load();
    } catch (err) { toast.error((err as ApiError).response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    try { await deleteAnnouncement(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Announcements</h2>
        <p className="text-slate-500 text-sm mt-0.5">Post updates visible on the home page and optionally email all registered students</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm sticky top-0">
            <h3 className="font-bold text-slate-900 mb-4">New Announcement</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="label">Title *</label>
                <input className="input" value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))}
                  placeholder="e.g. New Batch Starting June 2025" required/>
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea className="input resize-none h-32" value={form.description}
                  onChange={e => setForm(p=>({...p,description:e.target.value}))}
                  placeholder="Write announcement details here..." required/>
              </div>
              <label className="flex items-center gap-3 cursor-pointer bg-slate-50 border border-slate-200 rounded-xl p-3 hover:border-primary/40 transition-colors">
                <input type="checkbox" checked={form.sendEmail} onChange={e => setForm(p=>({...p,sendEmail:e.target.checked}))}
                  className="w-4 h-4 accent-primary rounded"/>
                <div>
                  <div className="text-sm font-medium text-slate-800">Send email to students</div>
                  <div className="text-xs text-slate-400">Blast to all registered & verified emails</div>
                </div>
              </label>
              <button type="submit" disabled={saving} className="btn-primary w-full py-3 text-sm">
                {saving ? 'Posting...' : '📢 Post Announcement'}
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-3 space-y-3">
          {loading ? (
            [...Array(3)].map((_,i) => <div key={i} className="bg-slate-100 rounded-2xl h-28 animate-pulse"/>)
          ) : list.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
              <div className="text-4xl mb-3">📢</div>
              <p className="text-slate-500 text-sm">No announcements yet.</p>
            </div>
          ) : (
            list.map(a => (
              <div key={a._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{a.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{a.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-slate-400 text-xs">
                        {new Date(a.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                      </span>
                      <span className={a.isActive ? 'badge-green' : 'badge-gray'}>{a.isActive ? 'Active' : 'Hidden'}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(a._id)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncements;
