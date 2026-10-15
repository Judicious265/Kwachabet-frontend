/**
 * MatchList.js — Full football match list section
 * Matches the Frame 1 mockup: Today / Tomorrow / Live / Competitions tabs
 * Grouped by league, odds columns, BetSlip integration
 */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useBetSlipStore } from '../../store';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// ── Mock data so the page renders even when backend is down ─────────────────
const MOCK_LEAGUES = [
  {
    id: 'pl', name: 'Premier League', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    matches: [
      { id: 'm1', time: '17:30', home: 'Man United',  home_icon: '🔴', away: 'Liverpool',  away_icon: '🔴', odds: { home: '2.45', draw: '3.40', away: '2.80' }, markets: 120 },
      { id: 'm2', time: '20:15', home: 'Arsenal',     home_icon: '🔴', away: 'Chelsea',    away_icon: '🔵', odds: { home: '2.10', draw: '3.60', away: '2.90' }, markets: 118 },
    ],
  },
  {
    id: 'laliga', name: 'La Liga', country: 'Spain', flag: '🇪🇸',
    matches: [
      { id: 'm3', time: '20:00', home: 'Barcelona',   home_icon: '🔵', away: 'Real Madrid', away_icon: '⚪', odds: { home: '2.10', draw: '3.75', away: '2.90' }, markets: 112 },
    ],
  },
  {
    id: 'seriea', name: 'Serie A', country: 'Italy', flag: '🇮🇹',
    matches: [
      { id: 'm4', time: '19:45', home: 'AC Milan',    home_icon: '🔴', away: 'Inter Milan', away_icon: '🔵', odds: { home: '2.50', draw: '3.30', away: '2.70' }, markets: 115 },
    ],
  },
  {
    id: 'bundes', name: 'Bundesliga', country: 'Germany', flag: '🇩🇪',
    matches: [
      { id: 'm5', time: '18:30', home: 'Bayern Munich', home_icon: '🔴', away: 'Dortmund', away_icon: '🟡', odds: { home: '1.75', draw: '4.20', away: '4.50' }, markets: 108 },
    ],
  },
];

const TABS = ['Today', 'Tomorrow', 'Live', 'Competitions'];

// Odds button — highlights when selection active
function OddsBtn({ matchId, label, odds, market }) {
  const { selections, addSelection, removeSelection } = useBetSlipStore();
  const key      = `${matchId}-${market}`;
  const isActive = selections.some(s => s.id === key);

  function toggle() {
    if (isActive) {
      removeSelection(key);
    } else {
      addSelection({
        id:       key,
        matchId,
        market,
        label,
        odds:     parseFloat(odds),
        stake:    0,
      });
    }
  }

  return (
    <button
      onClick={toggle}
      className="flex flex-col items-center justify-center rounded-lg transition-all active:scale-95"
      style={{
        minWidth:   52,
        padding:    '6px 10px',
        background: isActive ? '#00E664' : 'rgba(255,255,255,0.05)',
        border:     `1px solid ${isActive ? '#00E664' : '#1E3024'}`,
        color:      isActive ? '#000' : '#fff',
      }}
    >
      <span style={{ fontSize: 11, color: isActive ? '#003d1a' : '#4A6B56', fontWeight: 600 }}>{market.toUpperCase()}</span>
      <span style={{ fontSize: 14, fontWeight: 800 }}>{odds}</span>
    </button>
  );
}

// Single match row
function MatchRow({ match, leagueId }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-3 border-b transition-all hover:bg-white/[0.02]"
      style={{ borderColor: '#0D1A10' }}
    >
      {/* Time */}
      <span className="text-xs w-10 flex-shrink-0 font-mono" style={{ color: '#4A6B56' }}>
        {match.time}
      </span>

      {/* Teams */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-sm">{match.home_icon}</span>
          <span className="text-sm font-semibold text-white truncate">{match.home}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{match.away_icon}</span>
          <span className="text-sm font-semibold text-white truncate">{match.away}</span>
        </div>
      </div>

      {/* Odds */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <OddsBtn matchId={match.id} label={`${match.home} to Win`} odds={match.odds.home} market="1" />
        <OddsBtn matchId={match.id} label="Draw"                    odds={match.odds.draw} market="X" />
        <OddsBtn matchId={match.id} label={`${match.away} to Win`} odds={match.odds.away} market="2" />
      </div>

      {/* More markets link */}
      <Link
        href={`/match/${match.id}`}
        className="text-xs flex-shrink-0 px-2 py-1 rounded-lg transition-all hover:bg-white/10"
        style={{ color: '#4A6B56', whiteSpace: 'nowrap' }}
      >
        +{match.markets}
      </Link>
    </div>
  );
}

// League group
function LeagueGroup({ league, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-1 rounded-xl overflow-hidden" style={{ border: '1px solid #1E3024' }}>
      {/* League header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2.5 transition-all hover:bg-white/[0.02]"
        style={{ background: '#0A160E' }}
      >
        <span className="text-base">{league.flag}</span>
        <div className="flex-1 text-left">
          <span className="text-xs font-bold text-white">{league.name}</span>
          <span className="text-xs ml-2" style={{ color: '#4A6B56' }}>{league.country}</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,230,100,0.1)', color: '#00E664' }}>
          {league.matches.length}
        </span>
        {/* 1 X 2 header labels — desktop only */}
        <div className="hidden md:flex gap-1 mr-8" style={{ minWidth: 172 }}>
          {['1', 'X', '2'].map(h => (
            <span key={h} className="text-xs text-center font-bold" style={{ width: 52, color: '#4A6B56' }}>{h}</span>
          ))}
        </div>
        <span className="text-xs" style={{ color: '#4A6B56' }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Match rows */}
      {open && (
        <div>
          {league.matches.map(m => (
            <MatchRow key={m.id} match={m} leagueId={league.id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MatchList() {
  const [activeTab, setActiveTab] = useState('Today');
  const [leagues, setLeagues]     = useState(MOCK_LEAGUES);
  const [loading, setLoading]     = useState(false);
  const [showCount, setShowCount] = useState(4);

  // Fetch real matches when tab changes
  useEffect(() => {
    setLoading(true);
    const tab = activeTab.toLowerCase();
    fetch(`${API_BASE}/odds/events?status=${tab === 'live' ? 'live' : 'upcoming'}&day=${tab}`)
      .then(r => r.json())
      .then(data => {
        if (data && data.leagues && data.leagues.length > 0) {
          setLeagues(data.leagues);
        }
        // If backend is down, keep mock data silently
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <section style={{ background: '#060D0A' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <span className="text-base font-black text-white tracking-tight">FOOTBALL</span>
            <button className="ml-1" style={{ color: '#4A6B56' }}>▾</button>
          </div>
          <Link
            href="/competitions"
            className="text-xs font-semibold transition-all"
            style={{ color: '#00E664' }}
          >
            View All Competitions →
          </Link>
        </div>

        {/* Tabs: Today / Tomorrow / Live / Competitions */}
        <div className="flex gap-1 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(tab => {
            const isLive = tab === 'Live';
            const active = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setShowCount(4); }}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                style={{
                  background:  active ? '#00E664' : 'rgba(255,255,255,0.05)',
                  color:       active ? '#000' : '#8A9E97',
                  border:      `1px solid ${active ? '#00E664' : '#1E3024'}`,
                }}
              >
                {isLive && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                {tab}
              </button>
            );
          })}
        </div>

        {/* Competitions tab → redirect */}
        {activeTab === 'Competitions' ? (
          <div className="text-center py-12">
            <p className="text-white font-bold mb-3">Browse all competitions</p>
            <Link
              href="/competitions"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-black"
              style={{ background: '#00E664' }}
            >
              View All Competitions →
            </Link>
          </div>
        ) : loading ? (
          <div className="text-center py-12" style={{ color: '#4A6B56' }}>
            <div className="text-3xl mb-2 animate-pulse">⚽</div>
            <p className="text-sm">Loading matches…</p>
          </div>
        ) : (
          <>
            {/* League groups */}
            {leagues.slice(0, showCount).map((league, i) => (
              <LeagueGroup key={league.id} league={league} defaultOpen={i === 0} />
            ))}

            {/* Show more */}
            {showCount < leagues.length && (
              <button
                onClick={() => setShowCount(c => c + 4)}
                className="w-full mt-3 py-3 rounded-xl text-sm font-bold border transition-all hover:bg-white/5"
                style={{ color: '#00E664', borderColor: '#1E3024' }}
              >
                Show More Matches ▾
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
