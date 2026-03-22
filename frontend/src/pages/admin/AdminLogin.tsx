import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginAdmin } from '@/api';
import { useAuth } from '@/context/AuthContext';
import type { Admin, ApiError } from '@/types';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [show, setShow]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Enter email and password'); return; }
    setLoading(true);
    try {
      const res = await loginAdmin(form);
      login(res.data.token, res.data.data as Admin);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      toast.error((err as ApiError).response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </div>
            <span className="font-extrabold text-xl text-slate-900">SKILL<span className="text-primary">SPHERE</span></span>
          </Link>
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            Admin Portal
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Sign in to Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Manage courses, faculty, and registrations</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input className="input" type="email" placeholder="admin@skillsphere.in"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required/>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input className="input pr-10" type={show ? 'text' : 'password'} placeholder="••••••••"
                  value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required/>
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {show
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  }
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-slate-400 text-xs mt-4">
            <Link to="/" className="hover:text-primary transition-colors">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
