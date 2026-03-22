import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { admin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const navLinks = [
    { label: 'Home',          href: '/#home' },
    { label: 'About',         href: '/#about' },
    { label: 'Courses',       href: '/#courses' },
    { label: 'Faculty',       href: '/#faculty' },
    { label: 'Announcements', href: '/#announcements' },
    { label: 'Contact',       href: '/#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900">
            SKILL<span className="text-primary">SPHERE</span>
          </span>
        </Link>

        {/* Desktop links */}
        {!admin && (
          <ul className="hidden lg:flex items-center gap-6">
            {navLinks.map(l => (
              <li key={l.label}>
                <a href={l.href} className="text-slate-600 hover:text-primary text-sm font-medium transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
        {admin && (
          <span className="hidden md:block text-slate-500 text-sm">
            Welcome, <span className="text-primary font-semibold">{admin.name}</span>
          </span>
        )}

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {!admin ? (
            <>
              <Link to="/admin/login" className="text-slate-500 hover:text-primary text-sm font-medium transition-colors">Admin</Link>
              <a href="/#courses" className="btn-primary py-2 px-5 text-sm">Explore Academy</a>
            </>
          ) : (
            <>
              <Link to="/admin" className="text-slate-500 hover:text-primary text-sm font-medium transition-colors">Dashboard</Link>
              <button onClick={handleLogout} className="btn-outline py-2 px-4 text-sm">Logout</button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors" onClick={() => setOpen(!open)}>
          <div className="w-5 space-y-1.5">
            <span className={`block h-0.5 bg-slate-700 transition-all ${open ? 'rotate-45 translate-y-2' : ''}`}/>
            <span className={`block h-0.5 bg-slate-700 transition-all ${open ? 'opacity-0' : ''}`}/>
            <span className={`block h-0.5 bg-slate-700 transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`}/>
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-200 shadow-lg px-4 py-4 flex flex-col gap-2">
          {!admin ? (
            <>
              {navLinks.map(l => (
                <a key={l.label} href={l.href} onClick={() => setOpen(false)}
                   className="text-slate-600 text-sm font-medium py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                  {l.label}
                </a>
              ))}
              <Link to="/admin/login" onClick={() => setOpen(false)} className="text-slate-500 text-sm py-2 px-3">Admin Login</Link>
              <a href="/#courses" onClick={() => setOpen(false)} className="btn-primary text-center text-sm py-2.5 mt-1">Explore Academy</a>
            </>
          ) : (
            <>
              <Link to="/admin" onClick={() => setOpen(false)} className="text-slate-600 text-sm py-2 px-3 rounded-lg hover:bg-slate-50">Dashboard</Link>
              <button onClick={() => { handleLogout(); setOpen(false); }} className="btn-outline text-sm py-2 mt-1">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
