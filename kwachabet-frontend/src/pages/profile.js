import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/common/Navbar';
import { Footer, Spinner, PageLayout } from '../components/common';
import { authAPI } from '../utils/api';
import { useAuthStore } from '../store';
import { fmt } from '../utils/helpers';
import toast from 'react-hot-toast';
export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [pin, setPin] = useState(['','','','']);
  const [confirmPin, setConfirmPin] = useState(['','','','']);
  const [loading, setLoading] = useState(false);
  if (!isAuthenticated) { if (typeof window !== 'undefined') router.push('/login'); return null; }
  function handlePinChange(arr, setArr, val, idx) {
    const n = [...arr]; n[idx] = val.replace(/\D/,'').slice(-1); setArr(n);
    if (val && idx < 3) document.getElementById(`${setArr === setPin ? 'pin' : 'cpin'}-${idx+1}`)?.focus();
  }
  async function handleSetPin(e) {
    e.preventDefault();
    const p = pin.join(''); const cp = confirmPin.join('');
    if (p.length !== 4) return toast.error('Enter a 4-digit PIN');
    if (p !== cp) return toast.error('PINs do not match');
    setLoading(true);
    try { await authAPI.setPin({ pin: p }); toast.success('PIN set successfully!'); setPin(['','','','']); setConfirmPin(['','','','']); }
    catch (err) { toast.error(err.message); } finally { setLoading(false); }
  }
  return (
    <>
      <Head><title>Profile — Kwacha Bet</title></Head>
      <div className="min-h-screen bg-dark">
        <Navbar />
        <PageLayout title="My Profile">
          <div className="max-w-lg space-y-4">
            <div className="card p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-brand/20 border-2 border-brand/40 rounded-full flex items-center justify-center">
                  <span className="text-brand font-black text-xl">{fmt.initials(user?.full_name)}</span>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{user?.full_name}</p>
                  <p className="text-gray-500 text-sm">{user?.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-dark-border">
                <div><p className="text-xs text-gray-500 mb-0.5">Referral Code</p><p className="text-sm font-semibold text-white font-mono">{user?.referral_code || '—'}</p></div>
                <div><p className="text-xs text-gray-500 mb-0.5">Status</p><p className="text-sm font-semibold text-green-400">Active</p></div>
              </div>
            </div>
            <div className="card p-5">
              <h3 className="text-white font-semibold mb-1">Transaction PIN</h3>
              <p className="text-gray-500 text-sm mb-4">Required for withdrawals. Keep this private.</p>
              <form onSubmit={handleSetPin} className="space-y-4">
                <div>
                  <label className="input-label">New 4-Digit PIN</label>
                  <div className="flex gap-2">{pin.map((d,i) => <input key={i} id={`pin-${i}`} type="password" maxLength={1} value={d} onChange={e => handlePinChange(pin,setPin,e.target.value,i)} className="w-12 h-12 text-center text-xl font-bold input" />)}</div>
                </div>
                <div>
                  <label className="input-label">Confirm PIN</label>
                  <div className="flex gap-2">{confirmPin.map((d,i) => <input key={i} id={`cpin-${i}`} type="password" maxLength={1} value={d} onChange={e => handlePinChange(confirmPin,setConfirmPin,e.target.value,i)} className="w-12 h-12 text-center text-xl font-bold input" />)}</div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                  {loading ? <><Spinner size="sm" /><span className="ml-2">Saving...</span></> : 'Set PIN'}
                </button>
              </form>
            </div>
          </div>
        </PageLayout>
        <Footer />
      </div>
    </>
  );
}
