import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/common/Navbar';
import HeroSlideshow from '../components/HeroSlideshow';
import TodaysMatches from '../components/common/TodaysMatches';
import MatchList from '../components/common/MatchList';
import BetSlip from '../components/betting/BetSlip';
import Footer from '../components/common/Footer';
import { useBetSlipStore } from '../store';
import { useOddsWS } from '../hooks/useOddsWS';

export default function HomePage() {
  useOddsWS();
  const { selections } = useBetSlipStore();

  return (
    <>
      <Head>
        <title>KwachaBet — Malawi Sports Betting</title>
        <meta name="description" content="Malawi's most trusted sports betting platform. Bet on football, basketball, tennis and more with Airtel Money and TNM Mpamba." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ background: '#060D0A', minHeight: '100vh' }}>
        <Navbar />
        <HeroSlideshow />
        <TodaysMatches />

        {/* Welcome Bonus Banner */}
        <div style={{ background: 'rgba(0,230,100,0.06)', borderBottom: '1px solid rgba(0,230,100,0.12)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <p style={{ color: '#fff', fontSize: 14, margin: 0 }}>
              🎁 <strong>Welcome Bonus:</strong> 100% match up to <span style={{ color: '#00E664', fontWeight: 800 }}>MWK 50,000</span> on your first deposit!
            </p>
            <Link href="/register" style={{ color: '#00E664', fontSize: 13, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', background: 'rgba(0,230,100,0.12)', padding: '6px 16px', borderRadius: 8, border: '1px solid rgba(0,230,100,0.25)' }}>
              Claim Now →
            </Link>
          </div>
        </div>

        {/* Main layout: match list + sidebar bet slip */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px' }}>
          <div className="main-layout">
            <div style={{ flex: 1, minWidth: 0 }}>
              <MatchList />
            </div>
            <div className="betslip-col">
              <div style={{ position: 'sticky', top: 72 }}>
                <BetSlip />
              </div>
            </div>
          </div>
        </div>

        <Footer />

        {/* Mobile floating bet slip CTA */}
        {selections.length > 0 && (
          <div style={{ position: 'fixed', bottom: 68, left: 12, right: 12, zIndex: 40 }}>
            <Link href="/betslip" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '14px 20px', borderRadius: 16,
              fontSize: 15, fontWeight: 700, color: '#000', textDecoration: 'none',
              background: '#00E664', boxShadow: '0 8px 32px rgba(0,230,100,0.45)',
              boxSizing: 'border-box',
            }}>
              <span>🎯 Bet Slip ({selections.length})</span>
              <span>Place Bet →</span>
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .main-layout {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          padding-top: 8px;
        }
        .betslip-col {
          display: none;
          width: 300px;
          flex-shrink: 0;
        }
        @media (min-width: 1280px) {
          .betslip-col { display: block; }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
