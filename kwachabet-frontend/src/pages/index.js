import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import HeroSlideshow from '../components/HeroSlideshow';
import QuickLinks from '../components/common/QuickLinks';
import TopMatches from '../components/common/TopMatches';
import { Footer, LiveTicker, EmptyState } from '../components/common';
import { EventCard, BetSlip } from '../components/betting';
import { useOddsStore, useBetSlipStore } from '../store';
import { useOddsWS } from '../hooks/useOddsWS';
import { oddsAPI } from '../utils/api';
import { SPORTS_META } from '../utils/helpers';
import toast from 'react-hot-toast';

const SPORTS = [
  { id: 'all', label: 'All Sports', emoji: '🏆' },
  ...Object.entries(SPORTS_META).map(([id, v]) => ({ id, ...v })),
];

export default function HomePage() {
  const [sport, setSport]       = useState('all');
  const [liveOnly, setLiveOnly] = useState(false);
  const [loading, setLoading]   = useState(true);
  const { events, setEvents }   = useOddsStore();
  const { selections }          = useBetSlipStore();
  useOddsWS();

  useEffect(() => { load(); }, [sport, liveOnly]);

  async function load() {
    setLoading(true);
    try {
      const params = { status: liveOnly ? 'live' : 'upcoming' };
      if (sport !== 'all') params.sport = sport;
      const r = await oddsAPI.getEvents(params);
      setEvents(r.data.events || []);
    } catch { toast.error('Could not load events'); }
    finally { setLoading(false); }
  }

  return (
    <>
      <Head>
        <title>KwachaBet — Malawi Sports Betting</title>
        <meta name="description" content="Bet on football, basketball, tennis and more with Airtel Money and TNM Mpamba." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen" style={{ background: '#0a140c' }}>
        <Navbar />
        <HeroSlideshow />
        <QuickLinks />
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

        {/* Today's Top Matches */}
        <TopMatches />

        {/* All Events Section */}
        <section className="max-w-7xl mx-auto px-3 md:px-6 py-6">

          {/* Section header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base md:text-lg font-black text-white">
              {liveOnly ? '🔴 Live Events' : '📅 All Upcoming Events'}
            </h2>
          </div>

          {/* Sport + Live filters */}
          <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-2"
            style={{ scrollbarWidth: 'none' }}>
            {SPORTS.map(s => (
              <button key={s.id} onClick={() => setSport(s.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 border"
                style={{
                  background:  sport === s.id ? '#00c853' : 'rgba(255,255,255,0.05)',
                  borderColor: sport === s.id ? '#00c853' : 'rgba(255,255,255,0.1)',
                  color:       sport === s.id ? '#000' : 'rgba(255,255,255,0.6)',
                }}>
                <span>{s.emoji}</span>{s.label}
              </button>
            ))}
            <button onClick={() => setLiveOnly(!liveOnly)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 border ml-auto"
              style={{
                background:  liveOnly ? '#ef4444' : 'rgba(255,255,255,0.05)',
                borderColor: liveOnly ? '#ef4444' : 'rgba(255,255,255,0.1)',
                color:       liveOnly ? '#fff' : 'rgba(255,255,255,0.6)',
              }}>
              <span className={`w-1.5 h-1.5 rounded-full bg-red-400 ${liveOnly ? 'animate-pulse' : ''}`} />
              LIVE
            </button>
          </div>

          {/* Events + BetSlip */}
          <div className="flex gap-5">
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-2xl p-4 animate-pulse"
                      style={{ background: 'rgba(255,255,255,0.04)', height: 120 }} />
                  ))}
                </div>
              ) : events.length === 0 ? (
                <div className="rounded-2xl border py-14 text-center"
                  style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                  <p className="text-4xl mb-3">⚽</p>
                  <p className="text-white font-semibold mb-1">No events available</p>
                  <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {liveOnly ? 'No live events right now.' : 'No upcoming events for this sport.'}
                  </p>
                  <button onClick={() => { setSport('all'); setLiveOnly(false); }}
                    className="px-5 py-2 rounded-xl text-sm font-semibold border"
                    style={{ color: '#00c853', borderColor: 'rgba(0,200,83,0.3)' }}>
                    Show all sports
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map(e => <EventCard key={e.id} event={e} />)}
                </div>
              )}
            </div>

            {/* BetSlip — desktop sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-20">
                <BetSlip />
              </div>
            </div>
          </div>
        </section>

        {/* Mobile BetSlip sticky button */}
        {selections.length > 0 && (
          <div className="fixed bottom-20 left-3 right-3 lg:hidden z-40">
            <Link href="/betslip"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-bold text-black shadow-2xl"
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
