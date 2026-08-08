import { useState, useEffect } from 'react';
import Link from 'next/link';
import { oddsAPI } from '../../utils/api';
import { useOddsStore, useBetSlipStore } from '../../store';
import { useOddsWS } from '../../hooks/useOddsWS';

const SPORT_TABS = [
  { id: 'all',         label: 'All Sports',  emoji: '🏆' },
  { id: 'football',    label: 'Football',    emoji: '⚽' },
  { id: 'basketball',  label: 'Basketball',  emoji: '🏀' },
  { id: 'tennis',      label: 'Tennis',      emoji: '🎾' },
  { id: 'ice_hockey',  label: 'Ice Hockey',  emoji: '🏒' },
  { id: 'baseball',    label: 'Baseball',    emoji: '⚾' },
  { id: 'rugby_league',label: 'Rugby',       emoji: '🏉' },
];

const TEAM_COLORS = {
  'Manchester United':  '#da291c',
  'Liverpool':          '#c8102e',
  'Arsenal':            '#ef0107',
  'Chelsea':            '#034694',
  'Manchester City':    '#6cabdd',
  'Real Madrid':        '#febe10',
  'Barcelona':          '#a50044',
  'Bayern Munich':      '#dc052d',
  'Nyasa big Bullets':  '#00c853',
  'Mighty Wanderers':   '#e30613',
  'Big Bullets':        '#00c853',
  'Blue Eagles':        '#003399',
};

function getInitials(name) {
  if (!name) return 'TM';
  const words = name.trim().split(' ');
  if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

function TeamBadge({ name, size = 34 }) {
  const color = TEAM_COLORS[name] || '#374151';
  return (
    <div className="rounded-full flex items-center justify-center font-black text-white flex-shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.3 }}>
      {getInitials(name)}
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
      odds:        parseFloat(odds),
      event_name:  `${event.home_team} vs ${event.away_team}`,
      league:      event.league,
    });
  }

  return (
    <div className="rounded-2xl border overflow-hidden transition-all hover:border-opacity-60"
      style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>

      {/* Header */}
      <div className="px-3 py-2 flex items-center justify-between border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
        <span className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '65%' }}>
          {event.league}
        </span>
        {isLive ? (
          <span className="flex items-center gap-1 text-xs font-bold" style={{ color: '#ef4444' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            LIVE {event.home_score != null ? `${event.home_score}–${event.away_score}` : ''}
          </span>
        ) : (
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {isToday ? `Today · ${timeStr}` : `${dateStr} · ${timeStr}`}
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="px-3 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <TeamBadge name={event.home_team} size={30} />
            <span className="text-xs font-semibold text-white truncate">{event.home_team}</span>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-lg mx-1.5 flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}>
            VS
          </span>
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
            <span className="text-xs font-semibold text-white truncate text-right">{event.away_team}</span>
            <TeamBadge name={event.away_team} size={30} />
          </div>
        </div>

        {/* Odds */}
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
                  <div className="text-xs mb-0.5"
                    style={{ color: sel ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.35)' }}>
                    {btn.label}
                  </div>
                  <div className="text-sm font-black"
                    style={{ color: sel ? '#000' : '#fff' }}>
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
      <div className="px-3 pb-3">
        <Link href={`/match/${event.id}`}
          className="block w-full text-center text-xs py-1.5 rounded-xl border transition-all"
          style={{ borderColor: 'rgba(0,200,83,0.2)', color: '#00c853', background: 'rgba(0,200,83,0.05)' }}>
          +{markets.length} Markets →
        </Link>
      </div>
    </div>
  );
}

export default function TopMatches() {
  const [sport, setSport]     = useState('all');
  const [liveOnly, setLiveOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents]   = useState([]);
  const { selections }        = useBetSlipStore();
  useOddsWS();

  useEffect(() => {
    load();
  }, [sport, liveOnly]);

  async function load() {
    setLoading(true);
    try {
      const params = { status: liveOnly ? 'live' : 'upcoming' };
      if (sport !== 'all') params.sport = sport;
      const r = await oddsAPI.getEvents(params);
      setEvents(r.data.events || []);
    } catch {}
    finally { setLoading(false); }
  }

  return (
    <section className="py-4 md:py-6" style={{ background: '#0a140c' }}>
      <div className="max-w-7xl mx-auto px-3 md:px-6">

        {/* Section header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm md:text-base font-black text-white">
            {liveOnly ? '🔴 Live Events' : '🏆 Sports & Matches'}
          </h2>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {events.length} {liveOnly ? 'live' : 'upcoming'} events
          </span>
        </div>

        {/* Sport + Live tabs */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {SPORT_TABS.map(tab => (
            <button key={tab.id} onClick={() => setSport(tab.id)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={{
                background:  sport === tab.id && !liveOnly ? '#00c853' : 'rgba(255,255,255,0.05)',
                borderColor: sport === tab.id && !liveOnly ? '#00c853' : 'rgba(255,255,255,0.1)',
                color:       sport === tab.id && !liveOnly ? '#000' : 'rgba(255,255,255,0.6)',
              }}>
              {tab.emoji} {tab.label}
            </button>
          ))}

          {/* Live button */}
          <button onClick={() => setLiveOnly(!liveOnly)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ml-auto"
            style={{
              background:  liveOnly ? '#ef4444' : 'rgba(255,255,255,0.05)',
              borderColor: liveOnly ? '#ef4444' : 'rgba(255,255,255,0.1)',
              color:       liveOnly ? '#fff' : 'rgba(255,255,255,0.6)',
            }}>
            <span className={`w-1.5 h-1.5 rounded-full bg-red-400 ${liveOnly ? 'animate-pulse' : ''}`} />
            LIVE
          </button>
        </div>

        {/* Events */}
        {loading ? (
          <>
            {/* Mobile skeleton */}
            <div className="flex gap-3 overflow-x-auto pb-2 md:hidden">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex-shrink-0 rounded-2xl animate-pulse"
                  style={{ width: 'clamp(230px,70vw,270px)', height: 148, background: 'rgba(255,255,255,0.05)' }} />
              ))}
            </div>
            {/* Desktop skeleton */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl animate-pulse"
                  style={{ height: 148, background: 'rgba(255,255,255,0.05)' }} />
              ))}
            </div>
          </>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border py-14 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <p className="text-4xl mb-3">{liveOnly ? '📡' : '⚽'}</p>
            <p className="text-white font-semibold mb-1">
              {liveOnly ? 'No live events right now' : 'No upcoming events'}
            </p>
            <p className="text-xs mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {liveOnly ? 'Check back soon for live matches' : 'New matches are added regularly'}
            </p>
            <button onClick={() => { setSport('all'); setLiveOnly(false); }}
              className="px-5 py-2 rounded-xl text-sm font-semibold border"
              style={{ color: '#00c853', borderColor: 'rgba(0,200,83,0.3)' }}>
              Show all sports
            </button>
          </div>
        ) : (
          <>
            {/* Mobile — horizontal scroll */}
            <div className="flex gap-3 overflow-x-auto pb-3 md:hidden"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {events.map(event => <MatchCard key={event.id} event={event} />)}
            </div>
            {/* Desktop — grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {events.map(event => <MatchCard key={event.id} event={event} />)}
            </div>
          </>
        )}

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
      </div>
    </section>
  );
}
