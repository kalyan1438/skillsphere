import { useState, useEffect, useCallback } from 'react';
import { getRegistrations, updateRegistrationStatus } from '@/api';
import type { Registration } from '@/types';
import toast from 'react-hot-toast';

const STATUS_BADGE: Record<string, string> = { Pending: 'badge-yellow', Confirmed: 'badge-green', Cancelled: 'badge-red' };

const AdminRegistrations = () => {
  const [regs,    setRegs]    = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('');

  const load = useCallback(() => {
    getRegistrations().then(r => setRegs(r.data.data || [])).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatus = async (id: string, status: string) => {
    try { await updateRegistrationStatus(id, { status }); toast.success(`Marked as ${status}`); load(); }
    catch { toast.error('Update failed'); }
  };

  const filtered = filter ? regs.filter(r => r.status === filter) : regs;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Student Registrations</h2>
          <p className="text-slate-500 text-sm mt-0.5">{regs.length} total verified registrations</p>
        </div>
        <select className="input w-auto text-sm py-2"
          value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Summary pills */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: 'Total',     val: regs.length,                                                cls: 'badge-blue' },
          { label: 'Pending',   val: regs.filter(r=>r.status==='Pending').length,   cls: 'badge-yellow' },
          { label: 'Confirmed', val: regs.filter(r=>r.status==='Confirmed').length, cls: 'badge-green' },
          { label: 'Cancelled', val: regs.filter(r=>r.status==='Cancelled').length, cls: 'badge-red' },
        ].map(s => (
          <button key={s.label} onClick={() => setFilter(s.label === 'Total' ? '' : s.label)}
            className={`${s.cls} cursor-pointer hover:opacity-80 transition-opacity`}>
            {s.label}: {s.val}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_,i) => <div key={i} className="bg-slate-100 rounded-xl h-16 animate-pulse"/>)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-slate-500 text-sm">{filter ? `No ${filter} registrations` : 'No registrations yet'}</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="table-head">Student</th>
                  <th className="table-head">Contact</th>
                  <th className="table-head">Course</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Date</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r._id} className="table-row">
                    <td className="table-cell">
                      <div className="font-semibold text-slate-900">{r.name}</div>
                    </td>
                    <td className="table-cell">
                      <div className="text-slate-600 text-xs">{r.email}</div>
                      <div className="text-slate-400 text-xs">{r.phone}</div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm">{r.course?.title}</div>
                      <div className="text-slate-400 text-xs">{r.course?.duration}</div>
                    </td>
                    <td className="table-cell">
                      <span className={STATUS_BADGE[r.status] || 'badge-gray'}>{r.status}</span>
                    </td>
                    <td className="table-cell text-slate-400 text-xs">
                      {new Date(r.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {r.status === 'Pending' && (
                          <>
                            <button onClick={() => handleStatus(r._id, 'Confirmed')}
                              className="text-xs bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-2 py-1 rounded-lg transition-colors font-medium">
                              Confirm
                            </button>
                            <button onClick={() => handleStatus(r._id, 'Cancelled')}
                              className="text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2 py-1 rounded-lg transition-colors font-medium">
                              Cancel
                            </button>
                          </>
                        )}
                        {r.status === 'Confirmed' && (
                          <button onClick={() => handleStatus(r._id, 'Cancelled')}
                            className="text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2 py-1 rounded-lg transition-colors font-medium">
                            Cancel
                          </button>
                        )}
                        {r.status === 'Cancelled' && (
                          <button onClick={() => handleStatus(r._id, 'Pending')}
                            className="text-xs bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 px-2 py-1 rounded-lg transition-colors font-medium">
                            Restore
                          </button>
                        )}
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

export default AdminRegistrations;
