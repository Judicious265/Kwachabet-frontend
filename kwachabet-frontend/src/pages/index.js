import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/common/Navbar';
import HeroSlideshow from '../components/HeroSlideshow';
import QuickLinks from '../components/common/QuickLinks';
import TopMatches from '../components/common/TopMatches';
import { Footer, LiveTicker } from '../components/common';
import { BetSlip } from '../components/betting';
import { useOddsStore, useBetSlipStore } from '../store';

export default function HomePage() {
  const { events }     = useOddsStore();
  const { selections } = useBetSlipStore();

  return (
    <>
      <Head>
        <title>KwachaBet — Malawi Sports Betting</title>
        <meta name="description" content="Bet on football, basketball, tennis and more with Airtel Money and TNM Mpamba." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen" style={{ background: '#0a140c' }}>
        <Navbar />

        {/* Hero Slideshow */}
        <HeroSlideshow />

        {/* Quick Links Bar */}
        <QuickLinks />

        {/* Live Ticker */}
        <LiveTicker events={events} />

        {/* Welcome Bonus Banner */}
        <div style={{ background: 'rgba(0,200,83,0.08)', borderBottom: '1px solid rgba(0,200,83,0.15)' }}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <p className="text-sm text-white">
              🎁 <strong>Welcome Bonus:</strong> 100% match up to MWK 50,000 on your first deposit!
            </p>
            <Link href="/register"
              className="text-xs font-bold hover:underline whitespace-nowrap ml-4"
              style={{ color: '#00c853' }}>
              Claim Now →
            </Link>
          </div>
        </div>

        {/* Main Content — Sports + BetSlip */}
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-4">
          <div className="flex gap-5 items-start">

            {/* Sports section — full width on mobile, flex-1 on desktop */}
            <div className="flex-1 min-w-0">
              <TopMatches />
            </div>

            {/* BetSlip sidebar — desktop only */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-20">
                <BetSlip />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile BetSlip sticky button */}
        {selections.length > 0 && (
          <div className="fixed bottom-20 left-3 right-3 lg:hidden z-40">
            <Link href="/betslip"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-bold text-black"
              style={{ background: '#00c853', boxShadow: '0 8px 32px rgba(0,200,83,0.4)' }}>
              🎯 Bet Slip ({selections.length}) — Place Bet →
            </Link>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
}
