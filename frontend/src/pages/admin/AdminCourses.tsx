import { useState, useEffect, useCallback } from 'react';
import { adminGetCourses, createCourse, updateCourse, deleteCourse } from '@/api';
import type { Course, ApiError } from '@/types';
import toast from 'react-hot-toast';

const EMPTY = { title: '', description: '', duration: '', price: '', level: 'Beginner', syllabus: '', totalSeats: '30' };

const AdminCourses = () => {
  const [courses, setCourses]   = useState<Course[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<Course | null>(null);
  const [form, setForm]         = useState({ ...EMPTY });
  const [saving, setSaving]     = useState(false);

  const load = useCallback(() => {
    adminGetCourses().then(r => setCourses(r.data.data || [])).catch(() => toast.error('Failed to load courses')).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setEditing(null); setForm({ ...EMPTY }); setShowForm(true); };
  const openEdit = (c: Course) => {
    setEditing(c);
    setForm({ title: c.title, description: c.description, duration: c.duration, price: String(c.price), level: c.level, syllabus: c.syllabus?.join(', ') || '', totalSeats: String(c.totalSeats) });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.duration || !form.price) { toast.error('Fill all required fields'); return; }
    setSaving(true);
    const payload = { ...form, price: Number(form.price), totalSeats: Number(form.totalSeats), syllabus: form.syllabus.split(',').map(s => s.trim()).filter(Boolean) };
    try {
      if (editing) { await updateCourse(editing._id, payload); toast.success('Course updated!'); }
      else          { await createCourse(payload); toast.success('Course created!'); }
      setShowForm(false);
      load();
    } catch (err) { toast.error((err as ApiError).response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this course?')) return;
    try { await deleteCourse(id); toast.success('Course removed'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const LEVEL_COLORS: Record<string, string> = { Beginner: 'badge-green', Intermediate: 'badge-yellow', Advanced: 'badge-red', 'All Levels': 'badge-blue' };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Courses</h2>
          <p className="text-slate-500 text-sm mt-0.5">{courses.length} courses total</p>
        </div>
        <button onClick={openAdd} className="btn-primary py-2 px-5 text-sm">+ Add Course</button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)}/>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-slate-900">{editing ? 'Edit Course' : 'Add New Course'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">✕</button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="label">Title *</label><input className="input" value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Full Stack Web Development" required/></div>
              <div><label className="label">Description *</label><textarea className="input resize-none h-20" value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))} required/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Duration *</label><input className="input" value={form.duration} onChange={e => setForm(p=>({...p,duration:e.target.value}))} placeholder="e.g. 4 Months" required/></div>
                <div><label className="label">Price (₹) *</label><input className="input" type="number" value={form.price} onChange={e => setForm(p=>({...p,price:e.target.value}))} placeholder="25000" required/></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Level</label>
                  <select className="input" value={form.level} onChange={e => setForm(p=>({...p,level:e.target.value}))}>
                    {['Beginner','Intermediate','Advanced','All Levels'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div><label className="label">Total Seats</label><input className="input" type="number" value={form.totalSeats} onChange={e => setForm(p=>({...p,totalSeats:e.target.value}))}/></div>
              </div>
              <div><label className="label">Syllabus (comma separated)</label><input className="input" value={form.syllabus} onChange={e => setForm(p=>({...p,syllabus:e.target.value}))} placeholder="HTML, CSS, JavaScript, React"/></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1 py-2.5 text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 py-2.5 text-sm">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_,i) => <div key={i} className="bg-slate-100 rounded-xl h-16 animate-pulse"/>)}</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
          <div className="text-4xl mb-3">📚</div>
          <p className="text-slate-500 text-sm">No courses yet. Add your first course!</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="table-head">Title</th>
                  <th className="table-head">Duration</th>
                  <th className="table-head">Price</th>
                  <th className="table-head">Level</th>
                  <th className="table-head">Enrolled</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c._id} className="table-row">
                    <td className="table-cell font-semibold text-slate-900 max-w-[200px]">
                      <div className="truncate">{c.title}</div>
                      <div className="text-slate-400 text-xs truncate mt-0.5">{c.description.slice(0,60)}...</div>
                    </td>
                    <td className="table-cell">{c.duration}</td>
                    <td className="table-cell font-semibold text-primary">₹{c.price.toLocaleString()}</td>
                    <td className="table-cell"><span className={LEVEL_COLORS[c.level] || 'badge-blue'}>{c.level}</span></td>
                    <td className="table-cell">{c.enrolledCount}/{c.totalSeats}</td>
                    <td className="table-cell"><span className={c.isActive ? 'badge-green' : 'badge-red'}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(c)} className="text-primary hover:underline text-xs font-medium">Edit</button>
                        <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:underline text-xs font-medium">Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
