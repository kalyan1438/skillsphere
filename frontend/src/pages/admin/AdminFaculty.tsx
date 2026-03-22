import { useState, useEffect, useCallback } from 'react';
import { adminGetFaculty, createFaculty, updateFaculty, deleteFaculty } from '@/api';
import type { Faculty, ApiError } from '@/types';
import toast from 'react-hot-toast';

const EMPTY = { name: '', qualification: '', experience: '', expertise: '', bio: '' };

const AdminFaculty = () => {
  const [faculty, setFaculty]   = useState<Faculty[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<Faculty | null>(null);
  const [form, setForm]         = useState({ ...EMPTY });
  const [saving, setSaving]     = useState(false);

  const load = useCallback(() => {
    adminGetFaculty().then(r => setFaculty(r.data.data || [])).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setEditing(null); setForm({ ...EMPTY }); setShowForm(true); };
  const openEdit = (f: Faculty) => {
    setEditing(f);
    setForm({ name: f.name, qualification: f.qualification, experience: f.experience, expertise: f.expertise?.join(', ') || '', bio: f.bio || '' });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.qualification || !form.experience) { toast.error('Name, qualification, experience required'); return; }
    setSaving(true);
    const payload = { ...form, expertise: form.expertise.split(',').map(s => s.trim()).filter(Boolean) };
    try {
      if (editing) { await updateFaculty(editing._id, payload); toast.success('Faculty updated!'); }
      else          { await createFaculty(payload); toast.success('Faculty added!'); }
      setShowForm(false); load();
    } catch (err) { toast.error((err as ApiError).response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this faculty member?')) return;
    try { await deleteFaculty(id); toast.success('Faculty removed'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Faculty</h2>
          <p className="text-slate-500 text-sm mt-0.5">{faculty.length} faculty members</p>
        </div>
        <button onClick={openAdd} className="btn-primary py-2 px-5 text-sm">+ Add Faculty</button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)}/>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-slate-900">{editing ? 'Edit Faculty' : 'Add Faculty'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="label">Full Name *</label><input className="input" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} placeholder="Dr. Ramesh Kumar" required/></div>
              <div><label className="label">Qualification *</label><input className="input" value={form.qualification} onChange={e => setForm(p=>({...p,qualification:e.target.value}))} placeholder="Ph.D Computer Science, IIT" required/></div>
              <div><label className="label">Experience *</label><input className="input" value={form.experience} onChange={e => setForm(p=>({...p,experience:e.target.value}))} placeholder="8 Years" required/></div>
              <div><label className="label">Expertise (comma separated)</label><input className="input" value={form.expertise} onChange={e => setForm(p=>({...p,expertise:e.target.value}))} placeholder="Python, ML, Data Science"/></div>
              <div><label className="label">Bio</label><textarea className="input resize-none h-20" value={form.bio} onChange={e => setForm(p=>({...p,bio:e.target.value}))} placeholder="Short bio..."/></div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1 py-2.5 text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 py-2.5 text-sm">{saving ? 'Saving...' : editing ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(4)].map((_,i) => <div key={i} className="bg-slate-100 rounded-2xl h-40 animate-pulse"/>)}
        </div>
      ) : faculty.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
          <div className="text-4xl mb-3">👨‍🏫</div>
          <p className="text-slate-500 text-sm">No faculty added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {faculty.map(f => (
            <div key={f._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-xs">
                    {f.name.split(' ').map(n => n[0]).slice(0,2).join('')}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{f.name}</div>
                    <div className="text-primary text-xs">{f.experience} exp</div>
                  </div>
                </div>
                <span className={f.isActive ? 'badge-green' : 'badge-red'}>{f.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <p className="text-slate-500 text-xs mb-1">{f.qualification}</p>
              {f.bio && <p className="text-slate-400 text-xs line-clamp-2 mb-3">{f.bio}</p>}
              <div className="flex flex-wrap gap-1 mb-4">
                {f.expertise?.map(e => <span key={e} className="text-xs bg-blue-50 text-primary border border-blue-200 px-2 py-0.5 rounded-full">{e}</span>)}
              </div>
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button onClick={() => openEdit(f)} className="flex-1 text-center text-xs text-primary hover:bg-blue-50 py-1.5 rounded-lg transition-colors font-medium">Edit</button>
                <button onClick={() => handleDelete(f._id)} className="flex-1 text-center text-xs text-red-500 hover:bg-red-50 py-1.5 rounded-lg transition-colors font-medium">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFaculty;
