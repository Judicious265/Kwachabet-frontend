import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/common/Navbar';
import { Footer, Spinner, EmptyState, PageLayout } from '../components/common';
import { walletAPI, authAPI } from '../utils/api';
import { useAuthStore, useWalletStore } from '../store';
import { fmt, TX_META } from '../utils/helpers';
import Link from 'next/link';
import toast from 'react-hot-toast';

const METHODS = [
  { id: 'airtel', label: 'Airtel Money' },
  { id: 'mpamba', label: 'TNM Mpamba' },
  { id: 'bank',   label: 'Bank Transfer' },
];
const QUICK = [1000, 2000, 5000, 10000, 20000, 50000];

export default function WalletPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { balance, bonusBalance, available, setWallet } = useWalletStore();
  const [tab, setTab] = useState('overview');
  const [txns, setTxns] = useState([]);
  const [txPage, setTxPage] = useState(1);
  const [txTotal, setTxTotal] = useState(1);
  const [txLoading, setTxLoading] = useState(false);
  const [dAmount, setDAmount] = useState('');
  const [dMethod, setDMethod] = useState('airtel');
  const [dPhone, setDPhone] = useState('');
  const [dLoading, setDLoading] = useState(false);
  const [wAmount, setWAmount] = useState('');
  const [wMethod, setWMethod] = useState('airtel');
  const [wDest, setWDest] = useState('');
  const [wOtp, setWOtp] = useState('');
  const [wOtpSent, setWOtpSent] = useState(false);
  const [wLoading, setWLoading] = useState(false);
  const [pinStep, setPinStep] = useState(true);
  const [pin, setPin] = useState('');
  const [pinToken, setPinToken] = useState('');

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    walletAPI.getBalance().then(r => setWallet(r.data)).catch(() => {});
    loadTxns();
  }, [isAuthenticated, txPage]);

  useEffect(() => { if (router.query.tab) setTab(router.query.tab); }, [router.query.tab]);

  async function loadTxns() {
    setTxLoading(true);
    try {
      const r = await walletAPI.getTransactions({ page: txPage, limit: 15 });
      setTxns(r.data.transactions || []);
      setTxTotal(r.data.pagination?.pages || 1);
    } catch {} finally { setTxLoading(false); }
  }

  async function handleDeposit(e) {
    e.preventDefault();
    if (parseFloat(dAmount) < 500) return toast.error('Minimum deposit is MWK 500');
    setDLoading(true);
    try {
      const r = await walletAPI.deposit({ amount: parseFloat(dAmount), method: dMethod, phone: dPhone || undefined });
      if (r.data.checkout_url) window.location.href = r.data.checkout_url;
      else toast.success(r.data.message || 'Deposit initiated!');
    } catch (err) { toast.error(err.message); } finally { setDLoading(false); }
  }

  async function verifyPin(e) {
    e.preventDefault();
    try {
      const r = await authAPI.verifyPin({ pin });
      setPinToken(r.data.pin_token);
      setPinStep(false);
      toast.success('PIN verified');
    } catch { toast.error('Incorrect PIN'); }
  }

  async function sendOtp() {
    try {
      await authAPI.requestOTP();
      setWOtpSent(true);
      toast.success('OTP sent to your phone');
    } catch (err) { toast.error(err.message); }
  }

  async function handleWithdraw(e) {
    e.preventDefault();
    if (parseFloat(wAmount) < 500) return toast.error('Minimum withdrawal is MWK 500');
    if (parseFloat(wAmount) > available) return toast.error('Insufficient balance');
    setWLoading(true);
    try {
      const r = await walletAPI.withdraw(
        { amount: parseFloat(wAmount), method: wMethod, destination: wDest, otp: wOtp },
        { headers: { 'X-Pin-Token': pinToken } }
      );
      toast.success(r.data.message);
      setWAmount(''); setWOtp(''); setWOtpSent(false); setPinStep(true); setPin('');
      walletAPI.getBalance().then(r2 => setWallet(r2.data));
    } catch (err) { toast.error(err.message); } finally { setWLoading(false); }
  }

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'deposit',  label: '+ Deposit' },
    { id: 'withdraw', label: '↓ Withdraw' },
    { id: 'history',  label: 'History' },
  ];

  return (
    <>
      <Head><title>My Wallet — Kwacha Bet</title></Head>
      <div className="min-h-screen bg-dark">
        <Navbar />
        <PageLayout title="My Wallet">
          <div className="max-w-2xl">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="card p-4">
                <p className="text-xs text-gray-500 mb-1">Real Balance</p>
                <p className="text-2xl font-black text-white">{fmt.mwk(balance)}</p>
                <p className="text-xs text-gray-600 mt-1">Available: {fmt.mwk(available)}</p>
              </div>
              <div className={`card p-4 ${bonusBalance > 0 ? 'border-brand/30 bg-brand/5' : ''}`}>
                <p className="text-xs text-gray-500 mb-1">Bonus Balance</p>
                <p className={`text-2xl font-black ${bonusBalance > 0 ? 'text-brand' : 'text-gray-600'}`}>{fmt.mwk(bonusBalance)}</p>
                <p className="text-xs text-gray-600 mt-1">{bonusBalance > 0 ? 'Wagering required' : 'No active bonus'}</p>
              </div>
            </div>

            <div className="flex bg-dark-surface border border-dark-border rounded-xl p-1 gap-1 mb-6">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === t.id ? 'bg-brand text-black' : 'text-gray-400 hover:text-white'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'deposit' && (
              <form onSubmit={handleDeposit} className="card p-5 space-y-4">
                <h2 className="text-white font-bold">Add Funds</h2>
                <div>
                  <label className="input-label">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {METHODS.map(m => (
                      <button key={m.id} type="button" onClick={() => setDMethod(m.id)}
                        className={`py-2.5 px-2 rounded-xl border text-xs font-semibold text-center transition-all ${dMethod === m.id ? 'border-brand bg-brand/10 text-brand' : 'border-dark-border text-gray-400 hover:border-gray-500'}`}>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="input-label">Amount (MWK)</label>
                  <input type="number" value={dAmount} onChange={e => setDAmount(e.target.value)} placeholder="Min. MWK 500" min="500" required className="input" />
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {QUICK.map(a => (
                      <button key={a} type="button" onClick={() => setDAmount(a.toString())}
                        className="text-xs px-2 py-1 bg-dark-surface border border-dark-border rounded-lg hover:border-brand hover:text-brand text-gray-500 transition-all">
                        {a.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
                {dMethod !== 'bank' && (
                  <div>
                    <label className="input-label">Mobile Number (optional — uses your registered number)</label>
                    <input value={dPhone} onChange={e => setDPhone(e.target.value)} placeholder="+265XXXXXXXXX" className="input" />
                  </div>
                )}
                <button type="submit" disabled={dLoading} className="btn-primary w-full py-3">
                  {dLoading ? <><Spinner size="sm" /><span className="ml-2">Processing...</span></> : `Deposit ${dAmount ? fmt.mwk(dAmount) : ''}`}
                </button>
                <p className="text-xs text-gray-600 text-center">Instant credit · Secure · Encrypted</p>
              </form>
            )}

            {tab === 'withdraw' && (
              <div className="space-y-4">
                {pinStep ? (
                  <form onSubmit={verifyPin} className="card p-5 space-y-4">
                    <h2 className="text-white font-bold">Enter your PIN</h2>
                    <p className="text-gray-500 text-sm">Enter your 4-digit transaction PIN to continue.</p>
                    <div className="flex gap-2 justify-center">
                      {[0,1,2,3].map(i => (
                        <input key={i} id={`pin-${i}`} type="password" maxLength={1}
                          value={pin[i] || ''}
                          onChange={e => {
                            const arr = pin.split('');
                            arr[i] = e.target.value.slice(-1);
                            setPin(arr.join(''));
                            if (e.target.value && i < 3) document.getElementById(`pin-${i+1}`)?.focus();
                          }}
                          className="w-12 h-14 text-center text-2xl font-bold input" />
                      ))}
                    </div>
                    <button type="submit" className="btn-primary w-full py-3">Verify PIN</button>
                    <p className="text-xs text-center text-gray-600">No PIN set? <Link href="/profile" className="text-brand hover:underline">Set one in Profile</Link></p>
                  </form>
                ) : (
                  <form onSubmit={handleWithdraw} className="card p-5 space-y-4">
                    <div className="flex items-center gap-2"><span className="text-green-400 text-sm">✓ PIN verified</span></div>
                    <h2 className="text-white font-bold">Withdraw Funds</h2>
                    <div>
                      <label className="input-label">Method</label>
                      <div className="grid grid-cols-2 gap-2">
                        {METHODS.slice(0,2).map(m => (
                          <button key={m.id} type="button" onClick={() => setWMethod(m.id)}
                            className={`py-2.5 px-2 rounded-xl border text-xs font-semibold text-center transition-all ${wMethod === m.id ? 'border-brand bg-brand/10 text-brand' : 'border-dark-border text-gray-400 hover:border-gray-500'}`}>
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="input-label">Amount (MWK)</label>
                      <input type="number" value={wAmount} onChange={e => setWAmount(e.target.value)} placeholder={`Max: ${fmt.mwk(available)}`} min="500" required className="input" />
                    </div>
                    <div>
                      <label className="input-label">Mobile Money Number</label>
                      <input value={wDest} onChange={e => setWDest(e.target.value)} placeholder="+265XXXXXXXXX" required className="input" />
                    </div>
                    {!wOtpSent ? (
                      <button type="button" onClick={sendOtp} className="btn-secondary w-full py-3">Send OTP to verify</button>
                    ) : (
                      <div>
                        <label className="input-label">OTP Code</label>
                        <input value={wOtp} onChange={e => setWOtp(e.target.value)} placeholder="6-digit OTP" maxLength={6} required className="input" />
                      </div>
                    )}
                    {wOtpSent && (
                      <button type="submit" disabled={wLoading} className="btn-primary w-full py-3">
                        {wLoading ? <><Spinner size="sm" /><span className="ml-2">Processing...</span></> : `Withdraw ${wAmount ? fmt.mwk(wAmount) : ''}`}
                      </button>
                    )}
                  </form>
                )}
              </div>
            )}

            {(tab === 'overview' || tab === 'history') && (
              <div className="card">
                <div className="px-4 py-3 border-b border-dark-border">
                  <h3 className="text-white font-semibold text-sm">Transaction History</h3>
                </div>
                {txLoading ? (
                  <div className="flex justify-center py-10"><Spinner /></div>
                ) : txns.length === 0 ? (
                  <EmptyState icon="📋" title="No transactions yet" subtitle="Your history appears here after your first deposit." />
                ) : (
                  <div className="divide-y divide-dark-border">
                    {txns.map(tx => {
                      const meta = TX_META[tx.type] || { label: tx.type, color: 'text-gray-400' };
                      return (
                        <div key={tx.id} className="flex items-center justify-between px-4 py-3 hover:bg-dark-hover transition-colors">
                          <div>
                            <p className={`text-sm font-medium ${meta.color}`}>{meta.label}</p>
                            <p className="text-xs text-gray-600">{fmt.datetime(tx.created_at)}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-sm ${parseFloat(tx.amount) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {parseFloat(tx.amount) > 0 ? '+' : ''}{fmt.mwk(Math.abs(tx.amount))}
                            </p>
                            <p className="text-xs text-gray-600">Bal: {fmt.mwk(tx.balance_after)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {txTotal > 1 && (
                  <div className="flex justify-center gap-3 p-4">
                    <button disabled={txPage === 1} onClick={() => setTxPage(p => p-1)} className="btn-ghost text-xs py-1.5 px-3 disabled:opacity-30">← Prev</button>
                    <span className="text-gray-500 text-sm flex items-center">{txPage} / {txTotal}</span>
                    <button disabled={txPage === txTotal} onClick={() => setTxPage(p => p+1)} className="btn-ghost text-xs py-1.5 px-3 disabled:opacity-30">Next →</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </PageLayout>
        <Footer />
      </div>
    </>
  );
}
