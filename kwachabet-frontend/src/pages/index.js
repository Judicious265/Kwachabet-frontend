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
        <div style={{
          margin: '0 16px 4px',
          maxWidth: 1280,
          marginLeft: 'auto',
          marginRight: 'auto',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 16,
          background: 'linear-gradient(135deg, #050f09 0%, #0a1f10 40%, #061208 100%)',
          border: '1px solid rgba(0,230,100,0.25)',
          boxShadow: '0 0 40px rgba(0,230,100,0.08)',
        }}>
          {/* Glow orbs */}
          <div style={{ position: 'absolute', top: -40, left: 80, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,230,100,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -30, right: 200, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,230,100,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', gap: 16, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>

            {/* Left: gift icon + text */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {/* Gift box */}
              <div style={{
                width: 72, height: 72, flexShrink: 0,
                background: 'radial-gradient(circle at 40% 35%, #1a4d2a 0%, #0a1f10 100%)',
                borderRadius: 16,
                border: '1px solid rgba(0,230,100,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 36,
                boxShadow: '0 0 20px rgba(0,230,100,0.2)',
              }}>
                🎁
              </div>

              {/* Text block */}
              <div>
                <p style={{ color: '#888', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 4px' }}>
                  Welcome Bonus
                </p>
                <p style={{ margin: '0 0 4px', lineHeight: 1.1 }}>
                  <span style={{ color: '#00E664', fontSize: 28, fontWeight: 900, letterSpacing: -0.5 }}>100% </span>
                  <span style={{ color: '#fff', fontSize: 24, fontWeight: 800 }}>MATCH BONUS</span>
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ color: '#aaa', fontSize: 14 }}>up to </span>
                  <span style={{ color: '#00E664', fontSize: 18, fontWeight: 800 }}>MWK 50,000</span>
                </p>
              </div>
            </div>

            {/* Right: CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <Link href="/register" style={{
                display: 'inline-block',
                padding: '13px 32px',
                borderRadius: 10,
                background: '#00E664',
                color: '#000',
                fontWeight: 800,
                fontSize: 15,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(0,230,100,0.4)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}>
                Claim Now
              </Link>
              <p style={{ color: '#555', fontSize: 11, margin: 0 }}>New customers only. T&amp;Cs apply.</p>
            </div>
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
