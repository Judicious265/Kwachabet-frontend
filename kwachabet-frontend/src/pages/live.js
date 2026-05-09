import Head from 'next/head';
import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import { Footer, EmptyState, Spinner } from '../components/common';
import { EventCard, BetSlip } from '../components/betting';
import { useOddsStore } from '../store';
import { useOddsWS } from '../hooks/useOddsWS';
import { oddsAPI } from '../utils/api';
import toast from 'react-hot-toast';
export default function LivePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { connected } = useOddsStore();
  useOddsWS();
  useEffect(() => {
    oddsAPI.getEvents({ status: 'live' }).then(r => setEvents(r.data.events || [])).catch(() => toast.error('Could not load live events')).finally(() => setLoading(false));
  }, []);
  return (
    <>
      <Head><title>Live Betting — Kwacha Bet</title></Head>
      <div className="min-h-screen bg-dark">
        <Navbar />
        <div className="bg-red-900/20 border-b border-red-900/40">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /><span className="text-red-400 font-bold text-sm">LIVE BETTING</span>{events.length > 0 && <span className="text-xs text-gray-500">{events.length} live now</span>}</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-brand' : 'bg-gray-600'}`} />{connected ? 'Odds updating' : 'Reconnecting...'}</div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            <div className="flex-1 min-w-0">
              {loading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div>
                : events.length === 0 ? <div className="card"><EmptyState icon="📺" title="No live events right now" subtitle="Check back soon or browse upcoming matches." action={<a href="/" className="btn-secondary text-sm">Browse Upcoming →</a>} /></div>
                : <div className="space-y-3">{events.map(e => <EventCard key={e.id} event={e} />)}</div>}
            </div>
            <div className="hidden lg:block w-80 flex-shrink-0"><div className="sticky top-20"><BetSlip /></div></div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
