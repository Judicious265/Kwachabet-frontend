import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../components/common/Navbar';
import { Footer, Spinner, EmptyState, StatusBadge, PageLayout } from '../components/common';
import { bettingAPI } from '../utils/api';
import { useAuthStore } from '../store';
import { fmt } from '../utils/helpers';
import toast from 'react-hot-toast';

const STATUS_TABS = ['all','pending','won','lost','cancelled'];

export default function TicketsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    load();
  }, [isAuthenticated, status, page]);

  async function load() {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (status !== 'all') params.status = status;
      const r = await bettingAPI.getTickets(params);
      setTickets(r.data.tickets || []);
      setTotalPages(r.data.pagination?.pages || 1);
    } catch { toast.error('Could not load tickets'); }
    finally { setLoading(false); }
  }

  return (
    <>
      <Head><title>My Tickets — Kwacha Bet</title></Head>
      <div className="min-h-screen bg-dark">
        <Navbar />
        <PageLayout title="My Tickets" subtitle="Track all your bets">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {STATUS_TABS.map(s => (
              <button key={s} onClick={() => { setStatus(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap capitalize transition-all ${status === s ? 'bg-brand text-black' : 'bg-dark-card border border-dark-border text-gray-400 hover:border-gray-500'}`}>
                {s === 'all' ? 'All Bets' : s}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : tickets.length === 0 ? (
            <div className="card">
              <EmptyState icon="🎯" title="No tickets found"
                subtitle={status === 'all' ? "You haven't placed any bets yet." : `No ${status} bets found.`}
                action={<Link href="/" className="btn-primary text-sm">Browse Events →</Link>} />
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map(t => (
                <div key={t.id} className={`card overflow-hidden ${t.status === 'won' ? 'border-brand/40' : ''}`}>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-brand font-bold text-sm">{t.ticket_code}</span>
                      <StatusBadge status={t.status} />
                      <span className="text-xs text-gray-500 capitalize">{t.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{fmt.datetime(t.created_at)}</span>
                      <button onClick={() => setExpanded(expanded?.id === t.id ? null : t)}
                        className="text-xs text-gray-500 hover:text-white transition-colors">
                        {expanded?.id === t.id ? '▲ Hide' : '▼ Details'}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 px-4 py-3">
                    {[
                      ['Stake', fmt.mwk(t.stake), 'text-white'],
                      ['Odds', fmt.odds(t.total_odds), 'text-yellow-400'],
                      ['Potential', fmt.mwk(t.potential_win), 'text-gray-300'],
                      [t.status === 'won' ? 'Won' : 'Return', t.actual_win ? fmt.mwk(t.actual_win) : '—', t.status === 'won' ? 'text-brand' : 'text-gray-600'],
                    ].map(([label, val, cls]) => (
                      <div key={label}>
                        <p className="text-xs text-gray-500">{label}</p>
                        <p className={`text-sm font-bold ${cls}`}>{val}</p>
                      </div>
                    ))}
                  </div>
                  {expanded?.id === t.id && t.selections && (
                    <div className="border-t border-dark-border">
                      {t.selections.map((sel, i) => (
                        <div key={sel.id} className={`flex items-center justify-between px-4 py-2.5 text-sm ${i > 0 ? 'border-t border-dark-border' : ''}`}>
                          <div className="flex-1 min-w-0 mr-4">
                            <p className="text-white font-medium text-xs truncate">{sel.event?.home_team} vs {sel.event?.away_team}</p>
                            <p className="text-gray-500 text-xs">{sel.selection} · {sel.market_type}</p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-yellow-400 font-bold text-xs">{fmt.odds(sel.odds)}</span>
                            <StatusBadge status={sel.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-6">
              <button disabled={page === 1} onClick={() => setPage(p => p-1)} className="btn-ghost text-sm py-2 px-4 disabled:opacity-30">← Prev</button>
              <span className="text-gray-500 text-sm flex items-center">{page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p+1)} className="btn-ghost text-sm py-2 px-4 disabled:opacity-30">Next →</button>
            </div>
          )}
        </PageLayout>
        <Footer />
      </div>
    </>
  );
}
