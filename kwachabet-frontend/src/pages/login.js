import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { authAPI, walletAPI } from '../utils/api';
import { useAuthStore, useWalletStore } from '../store';
import { Spinner } from '../components/common';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { setWallet } = useWalletStore();
  const [form, setForm] = useState({ phone: '+265', pin: '' });
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);

  function handlePinChange(val) {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    setForm(f => ({ ...f, pin: digits }));
  }

  async function handleLogin(e) {
    e.preventDefault();

    if (!form.phone) return toast.error('Phone number is required');
    if (!/^\d{4}$/.test(form.pin)) return toast.error('PIN must be exactly 4 digits');

    setLoading(true);
    try {
      const res = await authAPI.login({ phone: form.phone, pin: form.pin });
      login(res.data.user, res.data.token);

      try {
        const wr = await walletAPI.getBalance();
        setWallet(wr.data);
      } catch {}

      toast.success(`Welcome back, ${res.data.user.full_name.split(' ')[0]}! 👋`);
      router.push(router.query.redirect || '/');
    } catch (err) {
      toast.error(err.message || 'Login failed. Check your phone and PIN.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head><title>Login — Kwacha Bet</title></Head>
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/30">
            <span className="text-black font-black text-xl">K</span>
          </div>
          <span className="text-white font-black text-2xl">
            Kwacha<span className="text-brand">Bet</span>
          </span>
        </Link>

        <div className="w-full max-w-sm">
          <div className="card p-6">
            <h1 className="text-xl font-bold text-white mb-6">Welcome back</h1>
            <form onSubmit={handleLogin} className="space-y-4">

              {/* Phone */}
              <div>
                <label className="input-label">Phone Number</label>
                <input
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+265XXXXXXXXX"
                  required
                  className="input font-mono"
                />
              </div>

              {/* PIN */}
              <div>
                <label className="input-label">4-Digit PIN</label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={form.pin}
                    onChange={e => handlePinChange(e.target.value)}
                    placeholder="Enter your 4-digit PIN"
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
              </div>

              <button
                type="submit"
                disabled={loading || form.pin.length < 4}
                className="btn-primary w-full py-3 text-sm mt-2"
              >
                {loading
                  ? <><Spinner size="sm" /><span className="ml-2">Logging in...</span></>
                  : 'Login'}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-brand hover:underline font-medium">Join Free</Link>
            </p>
          </div>

          <div className="mt-4 card p-3 border-brand/20 bg-brand/5 text-center">
            <p className="text-xs text-gray-400">
              🎁 New? Get <span className="text-brand font-bold">100% bonus</span> up to MWK 50,000 on first deposit
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
