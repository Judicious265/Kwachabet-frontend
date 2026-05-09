import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/common/Navbar';
import { Footer, PageLayout } from '../components/common';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';
export default function ReferralPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [copied, setCopied] = useState(false);
  if (!isAuthenticated) { if (typeof window !== 'undefined') router.push('/login'); return null; }
  const referralUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://kwachabet.mw'}/register?ref=${user?.referral_code}`;
  function copyCode() {
    navigator.clipboard.writeText(referralUrl).then(() => { setCopied(true); toast.success('Referral link copied!'); setTimeout(() => setCopied(false), 3000); });
  }
  const HOW = [
    { n:'1', title:'Share your link', desc:'Send your unique referral link to friends and family.' },
    { n:'2', title:'Friend registers', desc:'They sign up using your referral link or code.' },
    { n:'3', title:'Friend deposits', desc:'They make their first deposit of at least MWK 500.' },
    { n:'4', title:'You both earn', desc:'You get MWK 2,000 instantly credited to your wallet.' },
  ];
  return (
    <>
      <Head><title>Refer & Earn — Kwacha Bet</title></Head>
      <div className="min-h-screen bg-dark">
        <Navbar />
        <PageLayout title="Refer & Earn" subtitle="Earn MWK 2,000 for every friend you refer">
          <div className="max-w-lg space-y-4">
            <div className="card p-6 text-center border-brand/30 bg-brand/5">
              <p className="text-5xl font-black text-brand mb-1">MWK 2,000</p>
              <p className="text-gray-400 text-sm">earned per successful referral</p>
            </div>
            <div className="card p-5">
              <h3 className="text-white font-semibold mb-3">Your Referral Code</h3>
              <div className="bg-dark-surface border border-dark-border rounded-xl p-4 text-center mb-4">
                <p className="text-3xl font-black font-mono text-brand tracking-widest">{user?.referral_code}</p>
              </div>
              <div className="bg-dark-surface border border-dark-border rounded-lg px-3 py-2 flex items-center gap-2 mb-3">
                <p className="text-xs text-gray-400 flex-1 truncate font-mono">{referralUrl}</p>
                <button onClick={copyCode} className={`text-xs font-medium px-3 py-1 rounded-lg transition-all flex-shrink-0 ${copied ? 'bg-brand text-black' : 'bg-dark-card border border-dark-border text-gray-300 hover:border-brand hover:text-brand'}`}>{copied ? '✓ Copied' : 'Copy'}</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => window.open(`https://wa.me/?text=Join me on Kwacha Bet! ${referralUrl}`,'_blank')} className="btn-secondary text-sm py-2.5 justify-center">📱 WhatsApp</button>
                <button onClick={() => window.open(`sms:?body=Join Kwacha Bet: ${referralUrl}`,'_blank')} className="btn-ghost text-sm py-2.5 justify-center">💬 SMS</button>
              </div>
            </div>
            <div className="card p-5">
              <h3 className="text-white font-semibold mb-4">How It Works</h3>
              <div className="space-y-3">
                {HOW.map(s => (
                  <div key={s.n} className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-brand rounded-full flex items-center justify-center flex-shrink-0"><span className="text-black font-black text-xs">{s.n}</span></div>
                    <div><p className="text-white text-sm font-medium">{s.title}</p><p className="text-gray-500 text-xs">{s.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PageLayout>
        <Footer />
      </div>
    </>
  );
}
