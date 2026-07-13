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
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    phone:         '+265',
    full_name:     '',
    date_of_birth: '',
    email:         '',
    pin:           '',
    confirm_pin:   '',
    referral_code: router.query.ref || '',
    age_ok:        false,
    terms_ok:      false,
  });

  const maxDob = new Date(Date.now() - 18 * 365.25 * 24 * 3600 * 1000)
    .toISOString().split('T')[0];

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleRegister(e) {
    e.preventDefault();

    if (!/^\+265[89]\d{8}$/.test(form.phone)) {
      return toast.error('Enter a valid Malawian phone number (+265)');
    }
    if (!form.full_name.trim()) {
      return toast.error('Full name is required');
    }
    if (!form.date_of_birth) {
      return toast.error('Date of birth is required');
    }
    if (!/^\d{4}$/.test(form.pin)) {
      return toast.error('PIN must be exactly 4 digits');
    }
    if (form.pin !== form.confirm_pin) {
      return toast.error('PINs do not match');
    }
    if (!form.age_ok) {
      return toast.error('You must confirm you are 18+');
    }
    if (!form.terms_ok) {
      return toast.error('Please accept the terms');
    }

    setLoading(true);
    try {
      const res = await authAPI.initiateRegister({
        phone:         form.phone,
        full_name:     form.full_name.trim(),
        date_of_birth: form.date_of_birth,
        pin:           form.pin,
        email:         form.email || undefined,
        referral_code: form.referral_code || undefined,
      });

      login(res.data.user, res.data.token);

      try {
        const wr = await walletAPI.getBalance();
        setWallet(wr.data);
      } catch {}

      toast.success('Welcome to Kwacha Bet! 🎉');
      router.push('/wallet?tab=deposit');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  // PIN input — only allow digits
  function handlePinChange(val, field) {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    set(field, digits);
  }

  return (
    <>
      <Head><title>Register — Kwacha Bet</title></Head>
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/30">
            <span className="text-black font-black text-xl">K</span>
          </div>
          <span className="text-white font-black text-2xl">
            Kwacha<span className="text-brand">Bet</span>
          </span>
        </Link>

        <div className="w-full max-w-md">
          <div className="card p-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <h1 className="text-xl font-bold text-white mb-2">Create your account</h1>

              {/* Full Name */}
              <div>
                <label className="input-label">Full Name</label>
                <input
                  value={form.full_name}
                  onChange={e => set('full_name', e.target.value)}
                  placeholder="Your full name"
                  required
                  className="input"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="input-label">Malawian Phone Number</label>
                <input
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  placeholder="+265XXXXXXXXX"
                  required
                  className="input font-mono"
                />
                <p className="text-xs text-gray-600 mt-1">Airtel (+2659...) or TNM (+2658...) only</p>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="input-label">Date of Birth</label>
                <input
                  type="date"
                  value={form.date_of_birth}
                  onChange={e => set('date_of_birth', e.target.value)}
                  required
                  max={maxDob}
                  className="input"
                />
                <p className="text-xs text-gray-600 mt-1">Must be 18 years or older</p>
              </div>

              {/* Email */}
              <div>
                <label className="input-label">Email (Optional)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="your@email.com"
                  className="input"
                />
              </div>

              {/* 4-digit PIN */}
              <div>
                <label className="input-label">4-Digit PIN</label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={form.pin}
                    onChange={e => handlePinChange(e.target.value, 'pin')}
                    placeholder="Enter 4-digit PIN"
                    required
                    maxLength={4}
                    inputMode="numeric"
                    className="input pr-12 tracking-widest text-lg font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs"
                  >
                    {showPin ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-1">Use this PIN to login and confirm bets</p>
              </div>

              {/* Confirm PIN */}
              <div>
                <label className="input-label">Confirm PIN</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirm_pin}
                    onChange={e => handlePinChange(e.target.value, 'confirm_pin')}
                    placeholder="Repeat your 4-digit PIN"
                    required
                    maxLength={4}
                    inputMode="numeric"
                    className="input pr-12 tracking-widest text-lg font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs"
                  >
                    {showConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Referral Code */}
              <div>
                <label className="input-label">Referral Code (Optional)</label>
                <input
                  value={form.referral_code}
                  onChange={e => set('referral_code', e.target.value)}
                  placeholder="Enter referral code"
                  className="input"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-2.5 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.age_ok}
                    onChange={e => set('age_ok', e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-brand flex-shrink-0"
                  />
                  <span className="text-xs text-gray-400 leading-relaxed">
                    I confirm I am 18 years of age or older and am located in Malawi.
                  </span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.terms_ok}
                    onChange={e => set('terms_ok', e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-brand flex-shrink-0"
                  />
                  <span className="text-xs text-gray-400 leading-relaxed">
                    I agree to the{' '}
                    <Link href="/terms" className="text-brand hover:underline">Terms</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-brand hover:underline">Privacy Policy</Link>.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm"
              >
                {loading
                  ? <><Spinner size="sm" /><span className="ml-2">Creating account...</span></>
                  : 'Create Account 🎉'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link href="/login" className="text-brand hover:underline">Login</Link>
              </p>
            </form>
          </div>

          <div className="mt-4 card p-3 border-brand/20 bg-brand/5 text-center">
            <p className="text-xs text-white">
              🎁 Get <span className="text-brand font-bold">100% bonus</span> up to MWK 50,000 on your first deposit!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
