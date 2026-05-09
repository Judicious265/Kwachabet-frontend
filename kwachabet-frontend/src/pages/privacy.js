import Head from 'next/head';
import Navbar from '../components/common/Navbar';
import { Footer, PageLayout } from '../components/common';
const S = [
  { t:'Information We Collect', c:'We collect your name, phone number, date of birth, and optionally your email when you register. We also collect device fingerprint and IP address for fraud prevention.' },
  { t:'How We Use It', c:'Your information is used to operate your account, process payments, send OTP codes and notifications via SMS, detect fraud, and comply with Malawian law.' },
  { t:'Data Security', c:'All passwords are hashed using bcrypt. PIN codes are encrypted. All communications use HTTPS/TLS. We never store your full card details.' },
  { t:'Data Sharing', c:'We share data with PayChangu for payments and Africa\'s Talking for SMS. We do not sell your personal data to any third party.' },
  { t:'Your Rights', c:'You have the right to access, correct, or request deletion of your data. Contact support@kwachabet.mw. We will respond within 30 days.' },
  { t:'Contact', c:'For privacy concerns, contact privacy@kwachabet.mw or write to Kwacha Bet, Lilongwe, Malawi.' },
];
export default function PrivacyPage() {
  return (
    <>
      <Head><title>Privacy Policy — Kwacha Bet</title></Head>
      <div className="min-h-screen bg-dark">
        <Navbar />
        <PageLayout title="Privacy Policy" subtitle="Last updated: January 2024">
          <div className="max-w-2xl space-y-4">
            {S.map(s => (<div key={s.t} className="card p-5"><h3 className="text-white font-bold mb-2">{s.t}</h3><p className="text-gray-400 text-sm leading-relaxed">{s.c}</p></div>))}
          </div>
        </PageLayout>
        <Footer />
      </div>
    </>
  );
}
