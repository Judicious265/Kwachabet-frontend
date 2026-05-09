import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/common/Navbar';
import { BetSlip } from '../components/betting';
export default function BetSlipPage() {
  const router = useRouter();
  return (
    <>
      <Head><title>Bet Slip — Kwacha Bet</title></Head>
      <div className="min-h-screen bg-dark">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-6">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-white text-sm mb-4 block">← Back to Events</button>
          <BetSlip />
        </div>
      </div>
    </>
  );
}
