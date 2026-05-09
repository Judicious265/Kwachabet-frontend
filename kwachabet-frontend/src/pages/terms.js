import Head from 'next/head';
import Navbar from '../components/common/Navbar';
import { Footer, PageLayout } from '../components/common';
const S = [
  { t:'1. Eligibility', c:'You must be at least 18 years old and located in Malawi to use Kwacha Bet. By registering, you confirm that you meet these requirements.' },
  { t:'2. Account Registration', c:'One account per person is permitted. You must provide accurate information during registration. Use of a Malawian phone number (+265) is required.' },
  { t:'3. Deposits & Withdrawals', c:'Minimum deposit is MWK 500. Minimum withdrawal is MWK 500. Large withdrawals (over MWK 1,000,000) require manual approval within 24 hours.' },
  { t:'4. Betting Rules', c:'All bets are final once confirmed. Minimum stake is MWK 50. Maximum payout per ticket is MWK 10,000,000.' },
  { t:'5. Bonuses', c:'Bonuses are subject to wagering requirements before withdrawal. Welcome bonus requires 5x wagering at minimum odds of 1.5. Bonus abuse will result in account suspension.' },
  { t:'6. Withholding Tax', c:'As required by Malawian law, a 20% withholding tax is deducted from all winnings before they are credited to your account.' },
  { t:'7. Responsible Gambling', c:'Kwacha Bet is committed to responsible gambling. We offer self-exclusion options and deposit limits. If gambling is becoming a problem, contact support immediately.' },
  { t:'8. Governing Law', c:'These terms are governed by the laws of Malawi. Any disputes shall be resolved under Malawian jurisdiction.' },
];
export default function TermsPage() {
  return (
    <>
      <Head><title>Terms & Conditions — Kwacha Bet</title></Head>
      <div className="min-h-screen bg-dark">
        <Navbar />
        <PageLayout title="Terms & Conditions" subtitle="Last updated: January 2024">
          <div className="max-w-2xl space-y-4">
            <div className="card p-4 border-brand/20 bg-brand/5"><p className="text-sm text-gray-300 leading-relaxed">Please read these terms carefully before using Kwacha Bet. By registering, you agree to be bound by these terms.</p></div>
            {S.map(s => (<div key={s.t} className="card p-5"><h3 className="text-white font-bold mb-2">{s.t}</h3><p className="text-gray-400 text-sm leading-relaxed">{s.c}</p></div>))}
          </div>
        </PageLayout>
        <Footer />
      </div>
    </>
  );
}
