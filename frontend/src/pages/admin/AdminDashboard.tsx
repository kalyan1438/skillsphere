import { useState, useEffect } from 'react';
import { getDashboard } from '@/api';
import type { DashboardStats, Registration } from '@/types';

const STATUS_BADGE: Record<string, string> = {
  Pending:   'badge-yellow',
  Confirmed: 'badge-green',
  Cancelled: 'badge-red',
};

const StatCard = ({ icon, label, value, sub, color }: { icon: string; label: string; value: number; sub?: string; color: string }) => (
  <div className={`bg-white border rounded-2xl p-5 shadow-sm ${color}`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-2xl">{icon}</span>
      {sub && <span className="text-xs text-slate-400">{sub}</span>}
    </div>
    <div className="text-3xl font-extrabold text-slate-900">{value}</div>
    <div className="text-slate-500 text-sm mt-1">{label}</div>
  </div>
);

const AdminDashboard = () => {
  const [stats,   setStats]   = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard().then(r => setStats(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_,i) => <div key={i} className="bg-slate-200 rounded-2xl h-28"/>)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500 text-sm mt-1">Welcome to the SkillSphere admin panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon="📚" label="Active Courses"       value={stats?.courses       ?? 0} color="border-blue-100" />
        <StatCard icon="📋" label="Total Registrations"  value={stats?.registrations ?? 0} color="border-slate-200" />
        <StatCard icon="⏳" label="Pending"              value={stats?.pending       ?? 0} color="border-yellow-100" sub="needs review"/>
        <StatCard icon="✅" label="Confirmed"            value={stats?.confirmed     ?? 0} color="border-green-100" />
        <StatCard icon="📢" label="Announcements"        value={stats?.announcements ?? 0} color="border-purple-100" />
      </div>

      {/* Recent registrations */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Recent Registrations</h3>
          <a href="/admin/registrations" className="text-primary text-xs font-medium hover:underline">View all →</a>
        </div>
        {!stats?.recentReg?.length ? (
          <div className="text-center py-10 text-slate-400 text-sm">No registrations yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="table-head">Name</th>
                  <th className="table-head">Email</th>
                  <th className="table-head">Course</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentReg.map((r: Registration) => (
                  <tr key={r._id} className="table-row">
                    <td className="table-cell font-medium">{r.name}</td>
                    <td className="table-cell text-slate-500">{r.email}</td>
                    <td className="table-cell">{r.course?.title}</td>
                    <td className="table-cell"><span className={STATUS_BADGE[r.status] || 'badge-gray'}>{r.status}</span></td>
                    <td className="table-cell text-slate-400">{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
