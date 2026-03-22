import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const LINKS = [
  { to: '/admin',                 label: 'Dashboard',      icon: '📊' },
  { to: '/admin/courses',         label: 'Courses',        icon: '📚' },
  { to: '/admin/faculty',         label: 'Faculty',        icon: '👨‍🏫' },
  { to: '/admin/registrations',   label: 'Registrations',  icon: '📋' },
  { to: '/admin/announcements',   label: 'Announcements',  icon: '📢' },
];

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-200">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900">
            SKILL<span className="text-primary">SPHERE</span>
          </span>
        </Link>
      </div>

      {/* Admin info */}
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs">
            {admin?.name?.split(' ').map(n => n[0]).join('').slice(0,2)}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 text-xs truncate">{admin?.name}</div>
            <div className="text-primary text-xs capitalize">{admin?.role}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {LINKS.map(l => (
          <Link key={l.to} to={l.to} onClick={() => setSideOpen(false)}
            className={`sidebar-link ${location.pathname === l.to ? 'active' : ''}`}>
            <span className="text-base">{l.icon}</span>
            <span>{l.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-200">
        <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span>Logout</span>
        </button>
        <Link to="/" className="sidebar-link mt-1 text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span>View Site</span>
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-col bg-white border-r border-slate-200 shrink-0">
        <SidebarContent/>
      </aside>

      {/* Mobile sidebar overlay */}
      {sideOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSideOpen(false)}/>
          <aside className="relative z-10 w-60 flex flex-col bg-white h-full shadow-xl">
            <SidebarContent/>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center justify-between shrink-0">
          <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors" onClick={() => setSideOpen(true)}>
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <div className="hidden md:block">
            <h1 className="font-bold text-slate-900 text-sm">
              {LINKS.find(l => l.to === location.pathname)?.label || 'Admin Panel'}
            </h1>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="hidden sm:block text-xs text-slate-400">{admin?.email}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
