import Head from 'next/head';
import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import { Footer, Spinner, EmptyState, PageLayout } from '../components/common';
import { oddsAPI } from '../utils/api';
import { fmt, SPORTS_META } from '../utils/helpers';
import toast from 'react-hot-toast';
export default function ResultsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sport, setSport] = useState('all');
  useEffect(() => {
    setLoading(true);
    const params = { status: 'finished' };
    if (sport !== 'all') params.sport = sport;
    oddsAPI.getEvents(params).then(r => setEvents(r.data.events || [])).catch(() => toast.error('Could not load results')).finally(() => setLoading(false));
  }, [sport]);
  const SPORTS = [{ id:'all',label:'All',emoji:'🏆' }, ...Object.entries(SPORTS_META).map(([id,v]) => ({id,...v}))];
  return (
    <>
      <Head><title>Results — Kwacha Bet</title></Head>
      <div className="min-h-screen bg-dark">
        <Navbar />
        <PageLayout title="Results" subtitle="Recent match results">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {SPORTS.map(s => (
              <button key={s.id} onClick={() => setSport(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${sport===s.id?'bg-brand text-black':'bg-dark-card border border-dark-border text-gray-400 hover:border-gray-500'}`}>
                <span>{s.emoji}</span>{s.label}
              </button>
            ))}
          </div>
          {loading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          : events.length === 0 ? <div className="card"><EmptyState icon="📋" title="No results yet" subtitle="Finished match results will appear here." /></div>
          : (
            <div className="space-y-2">
              {events.map(e => (
                <div key={e.id} className="card p-4">
                  <p className="text-xs text-gray-500 mb-2">{fmt.datetime(e.commence_time)} · {e.league}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${e.result==='home'?'text-brand':'text-white'}`}>{e.home_team}</p>
                      <p className={`text-sm font-semibold mt-1 ${e.result==='away'?'text-brand':'text-gray-400'}`}>{e.away_team}</p>
                    </div>
                    <div className="bg-dark-surface border border-dark-border rounded-xl px-4 py-2 text-center ml-4">
                      <p className="text-white font-black text-lg tabular-nums">{e.home_score??'-'} – {e.away_score??'-'}</p>
                      <p className="text-xs text-gray-500">Full Time</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </PageLayout>
        <Footer />
      </div>
    </>
  );
}
