import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import { Footer, LiveTicker, EmptyState } from '../components/common';
import { EventCard, BetSlip } from '../components/betting';
import { useOddsStore, useBetSlipStore } from '../store';
import { useOddsWS } from '../hooks/useOddsWS';
import { oddsAPI } from '../utils/api';
import { SPORTS_META } from '../utils/helpers';
import toast from 'react-hot-toast';

const SPORTS = [{ id: 'all', label: 'All Sports', emoji: '🏆' }, ...Object.entries(SPORTS_META).map(([id, v]) => ({ id, ...v }))];

export default function HomePage() {
  const [sport, setSport] = useState('all');
  const [liveOnly, setLiveOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const { events, setEvents, connected } = useOddsStore();
  const { selections } = useBetSlipStore();
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
        <title>Kwacha Bet — Malawi Sports Betting</title>
        <meta name="description" content="Bet on football, basketball, tennis and more with Airtel Money and TNM Mpamba." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-dark">
        <Navbar />
        <LiveTicker events={events} />
        <div className="bg-dark-surface border-b border-dark-border">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">Bet Smarter. <span className="text-brand">Win More.</span></h1>
                <p className="text-gray-400">Malawi&apos;s #1 platform · Airtel Money · TNM Mpamba · Instant payouts</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`w-2 h-2 rounded-full ${connected ? 'bg-brand animate-pulse' : 'bg-gray-600'}`} />
                  <span className="text-xs text-gray-500">{connected ? 'Live odds updating' : 'Connecting...'}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/register" className="btn-primary">🎁 Join — 100% Bonus</Link>
                <Link href="/wallet?tab=deposit" className="btn-secondary hidden sm:flex">Deposit</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-brand/10 to-transparent border-b border-brand/20">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <p className="text-sm text-white">🎁 <strong>Welcome Bonus:</strong> 100% match up to MWK 50,000 on your first deposit!</p>
            <Link href="/register" className="text-brand text-xs font-bold hover:underline whitespace-nowrap ml-4">Claim Now →</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                {SPORTS.map(s => (
                  <button key={s.id} onClick={() => setSport(s.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${sport === s.id ? 'bg-brand text-black' : 'bg-dark-card border border-dark-border text-gray-400 hover:border-gray-500 hover:text-white'}`}>
                    <span>{s.emoji}</span>{s.label}
                  </button>
                ))}
                <button onClick={() => setLiveOnly(!liveOnly)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ml-auto ${liveOnly ? 'bg-red-600 text-white' : 'bg-dark-card border border-dark-border text-gray-400 hover:border-red-700'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full bg-red-400 ${liveOnly ? 'animate-pulse' : ''}`} />LIVE
                </button>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="card p-4 animate-pulse">
                      <div className="h-3 bg-dark-border rounded w-32 mb-3" />
                      <div className="h-4 bg-dark-border rounded w-48 mb-1.5" />
                      <div className="h-4 bg-dark-border rounded w-40 mb-3" />
                      <div className="flex gap-2">{[1,2,3].map(j => <div key={j} className="h-12 bg-dark-border rounded flex-1" />)}</div>
                    </div>
                  ))}
                </div>
              ) : events.length === 0 ? (
                <div className="card">
                  <EmptyState icon="⚽" title="No events available"
                    subtitle={liveOnly ? 'No live events right now.' : 'No upcoming events for this sport.'}
                    action={<button onClick={() => { setSport('all'); setLiveOnly(false); }} className="btn-secondary text-sm">Show all sports</button>} />
                </div>
              ) : (
                <div className="space-y-3">{events.map(e => <EventCard key={e.id} event={e} />)}</div>
              )}
            </div>
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-20"><BetSlip /></div>
            </div>
          </div>
        </div>
        {selections.length > 0 && (
          <div className="fixed bottom-4 left-4 right-4 lg:hidden z-40">
            <Link href="/betslip" className="btn-primary w-full py-4 text-base shadow-xl shadow-brand/20 justify-center">
              🎯 Bet Slip ({selections.length}) — Place Bet →
            </Link>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
}
