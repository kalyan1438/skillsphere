import { useState } from 'react';
import { requestRegistration, verifyOTP, resendOTP } from '@/api';
import type { Course, ApiError } from '@/types';
import toast from 'react-hot-toast';

interface Props {
  course: Course;
  onClose: () => void;
}

type Step = 'form' | 'otp' | 'success';

const RegisterModal = ({ course, onClose }: Props) => {
  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);
  const [registrationId, setRegistrationId] = useState('');
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const startResendTimer = () => {
    setResendTimer(30);
    const iv = setInterval(() => {
      setResendTimer(p => { if (p <= 1) { clearInterval(iv); return 0; } return p - 1; });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error('All fields are required'); return;
    }
    setLoading(true);
    try {
      const res = await requestRegistration({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), courseId: course._id });
      setRegistrationId(res.data.registrationId);
      setStep('otp');
      startResendTimer();
      toast.success(`OTP sent to ${form.email}`);
    } catch (err) {
      toast.error((err as ApiError).response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 6) { toast.error('Enter 6-digit OTP'); return; }
    setLoading(true);
    try {
      await verifyOTP({ registrationId, otp: otp.trim() });
      setStep('success');
      toast.success('Registration confirmed! 🎉');
    } catch (err) {
      toast.error((err as ApiError).response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      await resendOTP({ registrationId });
      startResendTimer();
      toast.success('New OTP sent!');
    } catch (err) {
      toast.error((err as ApiError).response?.data?.message || 'Failed to resend');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={step === 'success' ? onClose : undefined}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              {step === 'form' ? 'Register for Course' : step === 'otp' ? 'Verify Email' : 'Registration Confirmed!'}
            </h2>
            <p className="text-sm text-primary font-medium mt-0.5">{course.title}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Step: Form */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700">
              <strong>{course.title}</strong> · {course.duration} · ₹{course.price.toLocaleString()}
            </div>
            <div>
              <label className="label">Full Name *</label>
              <input className="input" placeholder="Your full name" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required/>
            </div>
            <div>
              <label className="label">Email Address *</label>
              <input className="input" type="email" placeholder="you@email.com" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required/>
              <p className="text-xs text-slate-400 mt-1">OTP will be sent to this email</p>
            </div>
            <div>
              <label className="label">Phone Number *</label>
              <input className="input" placeholder="+91 XXXXX XXXXX" value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} required/>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Sending OTP...' : 'Send OTP →'}
            </button>
          </form>
        )}

        {/* Step: OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="text-center py-3">
              <div className="w-14 h-14 bg-blue-50 border-2 border-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <p className="text-slate-600 text-sm">OTP sent to</p>
              <p className="font-semibold text-slate-900">{form.email}</p>
            </div>
            <div>
              <label className="label">Enter 6-Digit OTP</label>
              <input
                className="input text-center text-2xl font-bold tracking-[0.5em] py-4"
                placeholder="------"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
              />
              <p className="text-xs text-slate-400 mt-1 text-center">Valid for 10 minutes</p>
            </div>
            <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary w-full py-3">
              {loading ? 'Verifying...' : 'Verify & Register'}
            </button>
            <div className="text-center">
              <button type="button" onClick={handleResend} disabled={resendTimer > 0 || loading}
                className="text-sm text-primary hover:underline disabled:text-slate-400 disabled:no-underline transition-colors">
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </div>
            <button type="button" onClick={() => setStep('form')} className="w-full text-sm text-slate-500 hover:text-slate-700 transition-colors">
              ← Change email
            </button>
          </form>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">You're Registered!</h3>
              <p className="text-slate-500 text-sm mt-1">
                Thanks, <strong>{form.name}</strong>! Your registration for <strong>{course.title}</strong> is confirmed.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-sm space-y-1">
              <p className="text-slate-500">Check your email <strong>{form.email}</strong> for confirmation details.</p>
              <p className="text-slate-500">Our team will contact you at <strong>{form.phone}</strong> within 24 hours.</p>
            </div>
            <button onClick={onClose} className="btn-primary w-full py-3">Done</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterModal;
