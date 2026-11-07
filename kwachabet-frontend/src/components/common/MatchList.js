/**
 * MatchList.js
 * Fetches live odds from the KwachaBet backend (/api/v1/odds/events).
 * No hardcoded teams or scores — all data comes from The Odds API
 * via ODDS_API_KEY set in Render environment variables.
 *
 * Backend response shape:
 * GET /odds/events?sport=football&status=upcoming
 * → { events: [ { id, sport_id, home_team, away_team, league,
 *                 commence_time, status, markets: [...] } ] }
 */
import { useState, useEffect, useCallback } from 'react';
import { useBetSlipStore } from '../../store';
import { oddsAPI } from '../../utils/api';

const MAX_SELS = 72;

// ── Sport catalogue (sport_id matches backend SPORT_MAP keys) ────────────────
const SPORTS = [
  { id: 'football',          label: 'Football',     emoji: '⚽', noDrawMode: false },
  { id: 'basketball',        label: 'Basketball',   emoji: '🏀', noDrawMode: true  },
  { id: 'tennis',            label: 'Tennis',       emoji: '🎾', noDrawMode: true  },
  { id: 'baseball',          label: 'Baseball',     emoji: '⚾', noDrawMode: true  },
  { id: 'ice_hockey',        label: 'Ice Hockey',   emoji: '🏒', noDrawMode: false },
  { id: 'american_football', label: 'Am. Football', emoji: '🏈', noDrawMode: true  },
];

const TABS = [
  { label: 'Today',        status: 'upcoming' },
  { label: 'Tomorrow',     status: 'upcoming_tomorrow' },
  { label: 'Live',         status: 'live'     },
  { label: 'Competitions', status: 'upcoming' },
];

// ── League display metadata (Odds API sport key → human label + flag) ────────
const LEAGUE_META = {
  soccer_epl:                   { name: 'Premier League',       flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  soccer_spain_la_liga:         { name: 'La Liga',               flag: '🇪🇸' },
  soccer_italy_serie_a:         { name: 'Serie A',               flag: '🇮🇹' },
  soccer_germany_bundesliga:    { name: 'Bundesliga',            flag: '🇩🇪' },
  soccer_france_ligue_one:      { name: 'Ligue 1',               flag: '🇫🇷' },
  soccer_uefa_champs_league:    { name: 'Champions League',      flag: '🇪🇺' },
  soccer_africa_cup_of_nations: { name: 'AFCON',                 flag: '🌍' },
  soccer_usa_mls:               { name: 'MLS',                   flag: '🇺🇸' },
  basketball_nba:               { name: 'NBA',                   flag: '🇺🇸' },
  basketball_euroleague:        { name: 'EuroLeague',            flag: '🇪🇺' },
  tennis_atp_french_open:       { name: 'ATP Tour',              flag: '🎾' },
  tennis_wta:                   { name: 'WTA Tour',              flag: '🎾' },
  baseball_mlb:                 { name: 'MLB',                   flag: '🇺🇸' },
  icehockey_nhl:                { name: 'NHL',                   flag: '🇺🇸' },
  americanfootball_nfl:         { name: 'NFL',                   flag: '🇺🇸' },
};

function leagueMeta(key) {
  return LEAGUE_META[key] || { name: key || 'Other', flag: '🏆' };
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
}

/** Pull h2h (1X2) odds out of the markets array the backend returns */
function extractH2H(event) {
  if (!event.markets) return { home: null, draw: null, away: null };
  const h2hMarkets = event.markets.filter(m => m.market_type === 'h2h');
  const find = (name) => h2hMarkets.find(m => m.outcome === name || m.outcome === name);
  const home = h2hMarkets.find(m => m.outcome === event.home_team);
  const away = h2hMarkets.find(m => m.outcome === event.away_team);
  const draw = h2hMarkets.find(m => m.outcome === 'Draw');
  return {
    home: home ? parseFloat(home.odds).toFixed(2) : null,
    away: away ? parseFloat(away.odds).toFixed(2) : null,
    draw: draw ? parseFloat(draw.odds).toFixed(2) : null,
  };
}

/** Count distinct market types available for an event */
function countMarkets(event) {
  if (!event.markets) return 0;
  return new Set(event.markets.map(m => m.market_type)).size;
}

/** Group events by their league key */
function groupByLeague(events) {
  const map = {};
  events.forEach(ev => {
    const key = ev.league || 'other';
    if (!map[key]) {
      const meta = leagueMeta(key);
      map[key] = { id: key, name: meta.name, flag: meta.flag, matches: [] };
    }
    map[key].matches.push({
      id:      ev.id,
      time:    formatTime(ev.commence_time),
      home:    ev.home_team,
      away:    ev.away_team,
      odds:    extractH2H(ev),
      markets: countMarkets(ev),
      live:    ev.status === 'live',
    });
  });
  // Sort leagues by match count descending (biggest leagues first)
  return Object.values(map).sort((a, b) => b.matches.length - a.matches.length);
}

// ── Odds Button ──────────────────────────────────────────────────────────────
function OddsBtn({ match, label, oddsVal, market }) {
  const { selections, addSelection, removeSelection } = useBetSlipStore();
  const key      = `${match.id}-${market}`;
  const isActive = selections.some(s => (s.id || s.market_id) === key);
  const atLimit  = !isActive && selections.length >= MAX_SELS;
  const pickLabel = label === '1' ? match.home : label === '2' ? match.away : 'Draw';

  function toggle() {
    if (atLimit || !oddsVal) return;
    if (isActive) {
      removeSelection(key);
    } else {
      addSelection({
        id:          key,
        market_id:   key,
        event_id:    match.id,
        market_type: 'h2h',
        selection:   pickLabel,
        odds:        parseFloat(oddsVal),
        event_label: `${match.home} vs ${match.away}`,
        home_team:   match.home,
        away_team:   match.away,
        label:       `${pickLabel} @ ${oddsVal}`,
      });
    }
  }

  return (
    <button onClick={toggle} disabled={atLimit || !oddsVal}
      title={atLimit ? `Max ${MAX_SELS} selections` : undefined}
      style={{
        flex: 1, minWidth: 48, padding: '7px 4px', borderRadius: 8,
        border: `1px solid ${isActive ? '#00E664' : '#1a3a26'}`,
        background: isActive ? 'rgba(0,230,100,0.15)' : '#111d16',
        color: isActive ? '#00E664' : !oddsVal ? '#333' : '#fff',
        fontWeight: 700, fontSize: 13,
        cursor: atLimit || !oddsVal ? 'not-allowed' : 'pointer',
        opacity: atLimit ? 0.4 : 1, transition: 'all 0.15s',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      }}>
      <span style={{ color: isActive ? '#00E664' : '#888', fontSize: 10 }}>{label}</span>
      <span>{oddsVal ?? '—'}</span>
    </button>
  );
}

// ── Sport Pill ───────────────────────────────────────────────────────────────
function SportPill({ sport, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '6px 14px', borderRadius: 20, border: 'none',
      background: active ? '#00E664' : '#111d16',
      color: active ? '#000' : '#aaa',
      fontWeight: active ? 700 : 500, fontSize: 13,
      cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s', whiteSpace: 'nowrap',
    }}>
      <span style={{ fontSize: 15 }}>{sport.emoji}</span>
      <span className="hidden sm:inline">{sport.label}</span>
    </button>
  );
}

// ── League Group ─────────────────────────────────────────────────────────────
function LeagueGroup({ league, sportId, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const noDrawMode = SPORTS.find(s => s.id === sportId)?.noDrawMode ?? false;

  return (
    <div style={{ marginBottom: 8 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '9px 14px', background: '#0a1a12', border: 'none', cursor: 'pointer',
        borderRadius: open ? '10px 10px 0 0' : 10, color: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>{league.flag}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#e5e7eb' }}>{league.name}</span>
          <span style={{ fontSize: 11, color: '#666', background: '#1a2e20', padding: '2px 7px', borderRadius: 10 }}>
            {league.matches.length}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {open && (
            <div className="hidden md:flex" style={{ gap: 4, marginRight: 8 }}>
              {['1', noDrawMode ? null : 'X', '2'].filter(Boolean).map(h => (
                <span key={h} style={{ width: 54, textAlign: 'center', color: '#666', fontSize: 12, fontWeight: 600 }}>{h}</span>
              ))}
            </div>
          )}
          <span style={{ color: '#666', fontSize: 14 }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div style={{ border: '1px solid #1a3a26', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
          {league.matches.map((match, idx) => (
            <div key={match.id} style={{
              display: 'flex', alignItems: 'center', padding: '10px 12px',
              borderTop: idx > 0 ? '1px solid #0f1e15' : 'none',
              gap: 8, background: '#0d1a12',
            }}>
              {/* Time / Live */}
              {match.live ? (
                <span style={{ color: '#ef4444', fontSize: 10, fontWeight: 700, width: 36, flexShrink: 0, textAlign: 'center' }}>● LIVE</span>
              ) : (
                <span style={{ color: '#666', fontSize: 11, width: 36, flexShrink: 0, textAlign: 'center' }}>{match.time}</span>
              )}

              {/* Teams */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                  {match.home}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', marginTop: 2 }}>
                  {match.away}
                </span>
              </div>

              {/* Odds */}
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <OddsBtn match={match} label="1" oddsVal={match.odds?.home} market="home" />
                {!noDrawMode && (
                  <OddsBtn match={match} label="X" oddsVal={match.odds?.draw} market="draw" />
                )}
                <OddsBtn match={match} label="2" oddsVal={match.odds?.away} market="away" />
              </div>

              {/* More markets link */}
              {match.markets > 0 && (
                <a href={`/event/${match.id}`} className="hidden sm:block"
                  style={{ color: '#00E664', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0, textDecoration: 'none' }}>
                  +{match.markets}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map(n => (
        <div key={n} style={{
          height: 68, background: '#0a1a12', borderRadius: 10, marginBottom: 6,
          animation: 'kbpulse 1.4s ease-in-out infinite', opacity: 0.5 + (n % 2) * 0.1,
        }} />
      ))}
      <style>{`@keyframes kbpulse{0%,100%{opacity:.5}50%{opacity:.2}}`}</style>
    </>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function MatchList() {
  const [activeSport, setActiveSport] = useState('football');
  const [activeTab,   setActiveTab]   = useState(0);       // index into TABS
  const [leagues,     setLeagues]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const { selections } = useBetSlipStore();

  const sport = SPORTS.find(s => s.id === activeSport);
  const tab   = TABS[activeTab];

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await oddsAPI.getEvents({ sport: activeSport, status: tab.status });
      const data = res.data;
      const raw  = data?.events || data?.matches || (Array.isArray(data) ? data : []);

      // Filter by tab if needed
      let filtered = raw;
      if (tab.label === 'Tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tStr = tomorrow.toISOString().slice(0, 10);
        filtered = raw.filter(e => (e.commence_time || '').startsWith(tStr));
      } else if (tab.label === 'Today') {
        const today = new Date().toISOString().slice(0, 10);
        filtered = raw.filter(e => (e.commence_time || '').startsWith(today));
      }

      setLeagues(groupByLeague(filtered));
    } catch (err) {
      setError(err?.message || 'Could not load matches. Please try again.');
      setLeagues([]);
    } finally {
      setLoading(false);
    }
  }, [activeSport, activeTab]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const t = setInterval(fetchEvents, 60_000);
    return () => clearInterval(t);
  }, [fetchEvents]);

  return (
    <div style={{ paddingBottom: 80 }}>

      {/* Sport pills */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '12px 0 8px', scrollbarWidth: 'none' }}>
        {SPORTS.map(sp => (
          <SportPill key={sp.id} sport={sp} active={activeSport === sp.id}
            onClick={() => { setActiveSport(sp.id); setActiveTab(0); }} />
        ))}
      </div>

      {/* Time tabs + refresh */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1a3a26', marginBottom: 10 }}>
        {TABS.map((tab, i) => (
          <button key={tab.label} onClick={() => setActiveTab(i)} style={{
            padding: '10px 16px', background: 'none', border: 'none',
            borderBottom: `2px solid ${activeTab === i ? '#00E664' : 'transparent'}`,
            color: activeTab === i ? '#00E664' : '#888',
            fontWeight: activeTab === i ? 700 : 500,
            fontSize: 13, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
          }}>
            {tab.label}
            {tab.label === 'Live' && (
              <span style={{ marginLeft: 4, width: 6, height: 6, borderRadius: '50%', background: '#ef4444', display: 'inline-block', verticalAlign: 'middle' }} />
            )}
          </button>
        ))}
        <button onClick={fetchEvents} disabled={loading} title="Refresh odds"
          style={{ marginLeft: 'auto', padding: '10px 12px', background: 'none', border: 'none', color: loading ? '#333' : '#555', cursor: loading ? 'default' : 'pointer', fontSize: 14 }}>
          {loading ? '⏳' : '🔄'}
        </button>
      </div>

      {/* Bet slip count bar */}
      {selections.length > 0 && (
        <div style={{ background: 'rgba(0,230,100,0.08)', border: '1px solid rgba(0,230,100,0.2)', borderRadius: 10, padding: '8px 14px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#00E664', fontSize: 13, fontWeight: 600 }}>🎯 {selections.length} selection{selections.length !== 1 ? 's' : ''} in slip</span>
          <span style={{ color: '#888', fontSize: 12 }}>{MAX_SELS - selections.length} remaining</span>
        </div>
      )}

      {/* Content states */}
      {loading ? (
        <Skeleton />
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '48px 20px' }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>⚠️</p>
          <p style={{ color: '#888', marginBottom: 20, fontSize: 14 }}>{error}</p>
          <button onClick={fetchEvents} style={{ padding: '10px 28px', borderRadius: 10, background: '#00E664', color: '#000', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 14 }}>
            Try Again
          </button>
        </div>
      ) : leagues.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: '#555' }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>🏆</p>
          <p style={{ fontSize: 14 }}>No {tab.label.toLowerCase()} {sport?.label.toLowerCase()} matches available</p>
        </div>
      ) : (
        leagues.map((lg, i) => (
          <LeagueGroup key={lg.id} league={lg} sportId={activeSport} defaultOpen={i < 2} />
        ))
      )}

      <style>{`
        @media(max-width:640px){.hidden.sm\\:inline{display:none!important}.hidden.sm\\:block{display:none!important}}
        @media(min-width:641px){.hidden.sm\\:inline{display:inline!important}.hidden.sm\\:block{display:block!important}}
        @media(min-width:768px){.hidden.md\\:flex{display:flex!important}}
      `}</style>
    </div>
  );
}
