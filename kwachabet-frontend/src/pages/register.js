import Head from 'next/head';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { authAPI, walletAPI } from '../utils/api';
import { useAuthStore, useWalletStore } from '../store';
import { Spinner } from '../components/common';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { setWallet } = useWalletStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['','','','','','']);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const [form, setForm] = useState({ phone: '+265', full_name: '', date_of_birth: '', email: '', password: '', confirm_password: '', referral_code: router.query.ref || '', age_ok: false, terms_ok: false });
  const maxDob = new Date(Date.now() - 18 * 365.25 * 24 * 3600 * 1000).toISOString().split('T')[0];
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleDetails(e) {
    e.preventDefault();
    if (form.password !== form.confirm_password) return toast.error('Passwords do not match');
    if (!form.age_ok) return toast.error('You must confirm you are 18+');
    if (!form.terms_ok) return toast.error('Please accept the terms');
    setLoading(true);
    try {
      await authAPI.initiateRegister({ phone: form.phone, full_name: form.full_name.trim(), date_of_birth: form.date_of_birth, email: form.email || undefined, password: form.password });
      toast.success('OTP sent to your phone!');
      setStep(2);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  function handleOtpChange(val, idx) {
    const d = val.replace(/\D/g, '').slice(-1);
    const n = [...otp]; n[idx] = d; setOtp(n);
    if (d && idx < 5) otpRefs[idx + 1].current?.focus();
  }

  async function handleVerify(e) {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Enter the full 6-digit OTP');
    setLoading(true);
    try {
      const res = await authAPI.verifyRegister({ phone: form.phone, otp: code, referral_code: form.referral_code || undefined });
      login(res.data.user, res.data.token);
      const wr = await walletAPI.getBalance();
      setWallet(wr.data);
      toast.success('Welcome to Kwacha Bet! 🎉');
      router.push('/wallet?tab=deposit');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  return (
    <>
      <Head><title>Register — Kwacha Bet</title></Head>
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/30">
            <span className="text-black font-black text-xl">K</span>
          </div>
          <span className="text-white font-black text-2xl">Kwacha<span className="text-brand">Bet</span></span>
        </Link>
        <div className="w-full max-w-md">
          <div className="flex gap-2 mb-6">{[1,2].map(s => <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${step >= s ? 'bg-brand' : 'bg-dark-border'}`} />)}</div>
          <div className="card p-6">
            {step === 1 && (
              <form onSubmit={handleDetails} className="space-y-4">
                <h1 className="text-xl font-bold text-white mb-2">Create your account</h1>
                <div><label className="input-label">Full Name</label><input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Your full name" required className="input" /></div>
                <div>
                  <label className="input-label">Malawian Phone Number</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+265XXXXXXXXX" required pattern="^\+265[89]\d{8}$" className="input font-mono" />
                  <p className="text-xs text-gray-600 mt-1">Airtel (+2659...) or TNM (+2658...) only</p>
                </div>
                <div>
                  <label className="input-label">Date of Birth</label>
                  <input type="date" value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} required max={maxDob} className="input" />
                  <p className="text-xs text-gray-600 mt-1">Must be 18 years or older</p>
                </div>
                <div><label className="input-label">Email (Optional)</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" className="input" /></div>
                <div><label className="input-label">Password</label><input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Minimum 8 characters" required minLength={8} className="input" /></div>
                <div><label className="input-label">Confirm Password</label><input type="password" value={form.confirm_password} onChange={e => set('confirm_password', e.target.value)} placeholder="Repeat password" required className="input" /></div>
                <div><label className="input-label">Referral Code (Optional)</label><input value={form.referral_code} onChange={e => set('referral_code', e.target.value)} placeholder="Enter referral code" className="input" /></div>
                <div className="space-y-2.5 pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer"><input type="checkbox" checked={form.age_ok} onChange={e => set('age_ok', e.target.checked)} className="mt-0.5 w-4 h-4 accent-brand flex-shrink-0" /><span className="text-xs text-gray-400 leading-relaxed">I confirm I am 18 years of age or older and am located in Malawi.</span></label>
                  <label className="flex items-start gap-2.5 cursor-pointer"><input type="checkbox" checked={form.terms_ok} onChange={e => set('terms_ok', e.target.checked)} className="mt-0.5 w-4 h-4 accent-brand flex-shrink-0" /><span className="text-xs text-gray-400 leading-relaxed">I agree to the <Link href="/terms" className="text-brand hover:underline">Terms</Link> and <Link href="/privacy" className="text-brand hover:underline">Privacy Policy</Link>.</span></label>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm">
                  {loading ? <><Spinner size="sm" /><span className="ml-2">Sending OTP...</span></> : 'Continue →'}
                </button>
                <p className="text-center text-sm text-gray-500">Already have an account? <Link href="/login" className="text-brand hover:underline">Login</Link></p>
              </form>
            )}
            {step === 2 && (
              <form onSubmit={handleVerify} className="space-y-6">
                <div><h1 className="text-xl font-bold text-white mb-1">Verify your phone</h1><p className="text-gray-500 text-sm">Enter the 6-digit code sent to <strong className="text-white">{form.phone}</strong></p></div>
                <div className="flex gap-2 justify-center">
                  {otp.map((d, i) => (
                    <input key={i} ref={otpRefs[i]} type="tel" maxLength={1} value={d}
                      onChange={e => handleOtpChange(e.target.value, i)}
                      onKeyDown={e => { if (e.key === 'Backspace' && !d && i > 0) { const n=[...otp];n[i-1]='';setOtp(n);otpRefs[i-1].current?.focus(); } }}
                      className="w-11 h-14 text-center text-xl font-bold input" />
                  ))}
                </div>
                <button type="submit" disabled={loading || otp.join('').length < 6} className="btn-primary w-full py-3 text-sm">
                  {loading ? <><Spinner size="sm" /><span className="ml-2">Verifying...</span></> : 'Verify & Create Account 🎉'}
                </button>
                <div className="flex items-center justify-between text-sm">
                  <button type="button" onClick={() => setStep(1)} className="text-gray-500 hover:text-white">← Back</button>
                  <button type="button" onClick={handleDetails} className="text-brand hover:underline">Resend OTP</button>
                </div>
              </form>
            )}
          </div>
          <div className="mt-4 card p-3 border-brand/20 bg-brand/5 text-center">
            <p className="text-xs text-white">🎁 Get <span className="text-brand font-bold">100% bonus</span> up to MWK 50,000 on your first deposit!</p>
          </div>
        </div>
      </div>
    </>
  );
}
