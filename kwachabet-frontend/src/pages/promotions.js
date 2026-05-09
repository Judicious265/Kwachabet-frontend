import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/common/Navbar';
import { Footer, PageLayout } from '../components/common';
const PROMOS = [
  { id:1, emoji:'🎁', title:'100% Welcome Bonus', desc:'Double your first deposit up to MWK 50,000. Minimum deposit MWK 500.', badge:'New Members', color:'border-brand/40 bg-brand/5', terms:['Min deposit: MWK 500','5x wagering requirement','Min odds 1.5','Expires in 30 days'], cta:'Claim Now', href:'/register' },
  { id:2, emoji:'👫', title:'Refer & Earn MWK 2,000', desc:'Share your unique referral code. Earn MWK 2,000 for every friend who joins and deposits.', badge:'Ongoing', color:'border-purple-800/40 bg-purple-900/5', terms:['Friend must register with your code','Friend must make first deposit','No wagering on referral bonus','Paid instantly'], cta:'Get Your Code', href:'/referral' },
  { id:3, emoji:'⚽', title:'Weekend Football Special', desc:'Get enhanced odds on selected Premier League matches every weekend.', badge:'Weekly', color:'border-yellow-800/40 bg-yellow-900/5', terms:['Selected matches only','Max stake MWK 5,000','Single bets only','Check site for eligible matches'], cta:'View Matches', href:'/?sport=football' },
  { id:4, emoji:'📱', title:'Airtel Money Boost', desc:'Get 5% extra on every deposit made via Airtel Money. Valid all month.', badge:'Limited', color:'border-red-800/40 bg-red-900/5', terms:['Airtel Money deposits only','Min deposit MWK 1,000','2x wagering on bonus','One per customer per month'], cta:'Deposit Now', href:'/wallet?tab=deposit' },
];
export default function PromotionsPage() {
  return (
    <>
      <Head><title>Promotions — Kwacha Bet</title></Head>
      <div className="min-h-screen bg-dark">
        <Navbar />
        <PageLayout title="Promotions & Bonuses" subtitle="Exclusive offers for Kwacha Bet players">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROMOS.map(p => (
              <div key={p.id} className={`card p-5 border ${p.color}`}>
                <div className="flex items-start justify-between mb-3"><span className="text-3xl">{p.emoji}</span><span className="text-xs bg-dark-surface border border-dark-border px-2 py-0.5 rounded-full text-gray-400">{p.badge}</span></div>
                <h3 className="text-white font-bold text-lg mb-2">{p.title}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{p.desc}</p>
                <div className="bg-dark-surface rounded-xl p-3 mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">Key Terms</p>
                  <ul className="space-y-1">{p.terms.map((t,i) => <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5"><span className="text-brand mt-0.5">·</span>{t}</li>)}</ul>
                </div>
                <Link href={p.href} className="btn-primary w-full justify-center text-sm py-2.5">{p.cta}</Link>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-700 text-center mt-8">All promotions subject to full terms and conditions. 18+ only.</p>
        </PageLayout>
        <Footer />
      </div>
    </>
  );
}
