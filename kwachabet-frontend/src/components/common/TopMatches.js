import { useState, useEffect } from 'react';
import Link from 'next/link';
import { oddsAPI } from '../../utils/api';
import { useBetSlipStore } from '../../store';

const TEAM_COLORS = {
  'Manchester United':    '#da291c',
  'Liverpool':            '#c8102e',
  'Arsenal':              '#ef0107',
  'Chelsea':              '#034694',
  'Manchester City':      '#6cabdd',
  'Real Madrid':          '#febe10',
  'Barcelona':            '#a50044',
  'Bayern Munich':        '#dc052d',
  'Nyasa big Bullets':    '#00c853',
  'Mighty Wanderers':     '#e30613',
  'Big Bullets':          '#00c853',
  'Blue Eagle':           '#003399',
};

function TeamInitials(name) {
  if (!name) return 'TM';
  const words = name.split(' ');
  if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

function TeamBadge({ name, size = 36 }) {
  const color = TEAM_COLORS[name] || '#374151';
  return (
    <div className="rounded-full flex items-center justify-center font-black text-white flex-shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.32 }}>
      {TeamInitials(name)}
    </div>
  );
}

function MatchCard({ event }) {
  const { addSelection, isSelected } = useBetSlipStore();
  const markets = event.markets || [];
  const home = markets.find(m => m.market_type === 'h2h' && m.outcome === event.home_team);
  const draw = markets.find(m => m.market_type === 'h2h' && m.outcome === 'Draw');
  const away = markets.find(m => m.market_type === 'h2h' && m.outcome === event.away_team);

  const kickoff = new Date(event.commence_time);
  const timeStr = kickoff.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const dateStr = kickoff.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  const isToday = new Date().toDateString() === kickoff.toDateString();
  const isLive  = event.status === 'live';

  function handleOdd(market, outcome, odds) {
    if (!market) return;
    addSelection({
      event_id:    event.id,
      market_id:   market.id,
      market_type: 'h2h',
      selection:   outcome,
      odds:        odds,
      event_name:  `${event.home_team} vs ${event.away_team}`,
      league:      event.league,
    });
  }

  return (
    <div className="rounded-2xl border flex-shrink-0 overflow-hidden transition-all hover:border-opacity-50 cursor-pointer"
      style={{
        background:  'rgba(255,255,255,0.04)',
        borderColor: 'rgba(255,255,255,0.08)',
        width:       'clamp(240px, 72vw, 280px)',
      }}>
      {/* Header */}
      <div className="px-3 py-2 flex items-center justify-between border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
        <span className="text-xs font-medium truncate" style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '70%' }}>
          {event.league}
        </span>
        {isLive ? (
          <span className="flex items-center gap-1 text-xs font-bold" style={{ color: '#ef4444' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            LIVE {event.home_score !== null ? `${event.home_score}-${event.away_score}` : ''}
          </span>
        ) : (
          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {isToday ? timeStr : `${dateStr} ${timeStr}`}
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="px-3 py-3">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <TeamBadge name={event.home_team} size={32} />
            <span className="text-sm font-semibold text-white truncate">{event.home_team}</span>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-lg mx-2 flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>VS</span>
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
            <span className="text-sm font-semibold text-white truncate text-right">{event.away_team}</span>
            <TeamBadge name={event.away_team} size={32} />
          </div>
        </div>

        {/* Odds buttons */}
        {(home || draw || away) ? (
          <div className="flex gap-1.5">
            {[
              { m: home, label: '1', outcome: event.home_team },
              { m: draw, label: 'X', outcome: 'Draw' },
              { m: away, label: '2', outcome: event.away_team },
            ].map((btn, i) => {
              const sel = btn.m && isSelected(btn.m.id, btn.outcome);
              return (
                <button key={i}
                  onClick={() => handleOdd(btn.m, btn.outcome, btn.m?.odds)}
                  disabled={!btn.m}
                  className="flex-1 py-2 rounded-xl text-center transition-all active:scale-95 border"
                  style={{
                    background:  sel ? '#00c853' : btn.m ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                    borderColor: sel ? '#00c853' : 'rgba(255,255,255,0.1)',
                    cursor:      btn.m ? 'pointer' : 'not-allowed',
                  }}>
                  <div className="text-xs mb-0.5" style={{ color: sel ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.35)' }}>
                    {btn.label}
                  </div>
                  <div className="text-sm font-black" style={{ color: sel ? '#000' : '#fff' }}>
                    {btn.m ? parseFloat(btn.m.odds).toFixed(2) : '—'}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-2 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Odds coming soon
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 pb-2.5">
        <Link href={`/match/${event.id}`}
          className="block w-full text-center text-xs py-2 rounded-xl border transition-all"
          style={{ borderColor: 'rgba(0,200,83,0.25)', color: '#00c853', background: 'rgba(0,200,83,0.06)' }}>
          +{(event.markets || []).length} Markets
        </Link>
      </div>
    </div>
  );
}

export default function TopMatches() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sport, setSport] = useState('all');

  const SPORT_TABS = [
    { id: 'all',        label: 'All',        icon: '🏆' },
    { id: 'football',   label: 'Football',   icon: '⚽' },
    { id: 'basketball', label: 'Basketball', icon: '🏀' },
    { id: 'tennis',     label: 'Tennis',     icon: '🎾' },
  ];

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = { status: 'upcoming', limit: 12 };
        if (sport !== 'all') params.sport = sport;
        const r = await oddsAPI.getEvents(params);
        setEvents(r.data.events || []);
      } catch {}
      finally { setLoading(false); }
    }
    load();
  }, [sport]);

  return (
    <section className="py-5 md:py-6" style={{ background: '#0a140c' }}>
      <div className="max-w-7xl mx-auto px-3 md:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base md:text-lg font-black text-white">Today&apos;s Top Matches</h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {events.length} matches available
            </p>
          </div>
          <Link href="/sports"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
            style={{ color: '#00c853', borderColor: 'rgba(0,200,83,0.3)', background: 'rgba(0,200,83,0.08)' }}>
            View all →
          </Link>
        </div>

        {/* Sport tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {SPORT_TABS.map(tab => (
            <button key={tab.id} onClick={() => setSport(tab.id)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={{
                background:  sport === tab.id ? '#00c853' : 'rgba(255,255,255,0.05)',
                borderColor: sport === tab.id ? '#00c853' : 'rgba(255,255,255,0.1)',
                color:       sport === tab.id ? '#000' : 'rgba(255,255,255,0.6)',
              }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Match cards — horizontal scroll on mobile, grid on desktop */}
        {loading ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 rounded-2xl animate-pulse"
                style={{ width: 'clamp(240px, 72vw, 280px)', height: 160, background: 'rgba(255,255,255,0.05)' }} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border"
            style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <p className="text-3xl mb-3">⚽</p>
            <p className="text-white font-semibold mb-1">No matches available</p>
            <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Add matches via the admin dashboard
            </p>
            <Link href="/sports"
              className="inline-block px-5 py-2 rounded-xl text-sm font-semibold border"
              style={{ color: '#00c853', borderColor: 'rgba(0,200,83,0.3)' }}>
              Show all sports
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile — horizontal scroll */}
            <div className="flex gap-3 overflow-x-auto pb-3 md:hidden" style={{ scrollbarWidth: 'none' }}>
              {events.map(event => <MatchCard key={event.id} event={event} />)}
            </div>
            {/* Desktop — grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {events.map(event => <MatchCard key={event.id} event={event} />)}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
