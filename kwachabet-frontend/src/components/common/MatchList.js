/**
 * MatchList.js — Multi-sport match list
 * Sports: Football, Basketball, Tennis, Baseball, Ice Hockey, American Football
 * Up to 72 selections · Mobile team names fixed · WHT-aware BetSlip integration
 */
import { useState } from 'react';
import { useBetSlipStore } from '../../store';

const MAX_SELS = 72;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// ── Sport definitions ────────────────────────────────────────────────────────
const SPORTS = [
  { id: 'football',         label: 'Football',         emoji: '⚽', noDrawMode: false },
  { id: 'basketball',       label: 'Basketball',       emoji: '🏀', noDrawMode: true  },
  { id: 'tennis',           label: 'Tennis',           emoji: '🎾', noDrawMode: true  },
  { id: 'baseball',         label: 'Baseball',         emoji: '⚾', noDrawMode: true  },
  { id: 'ice_hockey',       label: 'Ice Hockey',       emoji: '🏒', noDrawMode: false },
  { id: 'american_football',label: 'Am. Football',     emoji: '🏈', noDrawMode: true  },
];

const TABS = ['Today', 'Tomorrow', 'Live', 'Competitions'];

// ── Mock leagues per sport ───────────────────────────────────────────────────
const MOCK = {
  football: [
    { id: 'pl', name: 'Premier League', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      matches: [
        { id: 'f1', time: '17:30', home: 'Man United',   away: 'Liverpool',    odds: { home:'2.45', draw:'3.40', away:'2.80' }, markets: 120 },
        { id: 'f2', time: '20:15', home: 'Arsenal',      away: 'Chelsea',      odds: { home:'2.10', draw:'3.60', away:'2.90' }, markets: 118 },
      ]},
    { id: 'laliga', name: 'La Liga', country: 'Spain', flag: '🇪🇸',
      matches: [
        { id: 'f3', time: '20:00', home: 'Barcelona',    away: 'Real Madrid',  odds: { home:'2.10', draw:'3.75', away:'2.90' }, markets: 112 },
        { id: 'f4', time: '22:00', home: 'Atletico',     away: 'Sevilla',      odds: { home:'1.90', draw:'3.50', away:'3.80' }, markets: 96  },
      ]},
    { id: 'seriea', name: 'Serie A', country: 'Italy', flag: '🇮🇹',
      matches: [
        { id: 'f5', time: '19:45', home: 'AC Milan',     away: 'Inter Milan',  odds: { home:'2.50', draw:'3.30', away:'2.70' }, markets: 115 },
        { id: 'f6', time: '21:00', home: 'Juventus',     away: 'Napoli',       odds: { home:'2.20', draw:'3.40', away:'3.10' }, markets: 110 },
      ]},
    { id: 'bundes', name: 'Bundesliga', country: 'Germany', flag: '🇩🇪',
      matches: [
        { id: 'f7', time: '18:30', home: 'Bayern Munich',away: 'Dortmund',     odds: { home:'1.75', draw:'4.20', away:'4.50' }, markets: 108 },
      ]},
    { id: 'afcon', name: 'AFCON', country: 'Africa', flag: '🌍',
      matches: [
        { id: 'f8', time: '16:00', home: 'Senegal',      away: 'Morocco',      odds: { home:'2.30', draw:'3.20', away:'2.80' }, markets: 88 },
        { id: 'f9', time: '19:00', home: 'Nigeria',      away: 'Ivory Coast',  odds: { home:'2.60', draw:'3.10', away:'2.50' }, markets: 84 },
      ]},
  ],
  basketball: [
    { id: 'nba', name: 'NBA', country: 'USA', flag: '🇺🇸',
      matches: [
        { id: 'b1', time: '01:00', home: 'LA Lakers',    away: 'Golden State', odds: { home:'1.85', away:'1.95' }, markets: 65 },
        { id: 'b2', time: '03:30', home: 'Boston Celtics',away: 'Miami Heat',  odds: { home:'1.65', away:'2.20' }, markets: 60 },
        { id: 'b3', time: '02:00', home: 'Chicago Bulls', away: 'NY Knicks',   odds: { home:'2.10', away:'1.75' }, markets: 58 },
      ]},
    { id: 'euroleague', name: 'EuroLeague', country: 'Europe', flag: '🇪🇺',
      matches: [
        { id: 'b4', time: '19:00', home: 'CSKA Moscow',  away: 'Real Madrid B',odds: { home:'1.95', away:'1.85' }, markets: 45 },
      ]},
  ],
  tennis: [
    { id: 'atp', name: 'ATP Tour', country: 'Global', flag: '🌍',
      matches: [
        { id: 't1', time: '14:00', home: 'Djokovic',     away: 'Alcaraz',      odds: { home:'1.55', away:'2.40' }, markets: 35 },
        { id: 't2', time: '16:00', home: 'Sinner',       away: 'Medvedev',     odds: { home:'1.80', away:'2.00' }, markets: 32 },
      ]},
    { id: 'wta', name: 'WTA Tour', country: 'Global', flag: '🌍',
      matches: [
        { id: 't3', time: '13:00', home: 'Swiatek',      away: 'Sabalenka',    odds: { home:'1.70', away:'2.10' }, markets: 30 },
      ]},
  ],
  baseball: [
    { id: 'mlb', name: 'MLB', country: 'USA', flag: '🇺🇸',
      matches: [
        { id: 'bb1', time: '00:00', home: 'NY Yankees',  away: 'Boston Red Sox',odds: { home:'1.80', away:'2.00' }, markets: 40 },
        { id: 'bb2', time: '02:00', home: 'LA Dodgers',  away: 'San Francisco', odds: { home:'1.65', away:'2.20' }, markets: 38 },
      ]},
  ],
  ice_hockey: [
    { id: 'nhl', name: 'NHL', country: 'USA/CAN', flag: '🇺🇸',
      matches: [
        { id: 'h1', time: '02:00', home: 'Toronto Maple Leafs', away: 'Montreal Canadiens', odds: { home:'1.90', draw:'4.50', away:'3.50' }, markets: 48 },
        { id: 'h2', time: '04:00', home: 'Vegas Golden Knights', away: 'Edmonton Oilers',   odds: { home:'2.00', draw:'4.20', away:'3.20' }, markets: 45 },
      ]},
  ],
  american_football: [
    { id: 'nfl', name: 'NFL', country: 'USA', flag: '🇺🇸',
      matches: [
        { id: 'nf1', time: '21:20', home: 'Kansas City Chiefs', away: 'Buffalo Bills',  odds: { home:'1.70', away:'2.15' }, markets: 80 },
        { id: 'nf2', time: '18:00', home: 'Dallas Cowboys',     away: 'Philadelphia Eagles', odds: { home:'2.10', away:'1.75' }, markets: 76 },
      ]},
  ],
};

// ── Odds Button ──────────────────────────────────────────────────────────────
function OddsBtn({ match, sport, label, oddsVal, market }) {
  const { selections, addSelection, removeSelection } = useBetSlipStore();
  const key      = `${match.id}-${market}`;
  const isActive = selections.some(s => (s.id || s.market_id) === key);
  const atLimit  = !isActive && selections.length >= MAX_SELS;

  // Human-readable pick label: team name for 1/2, "Draw" for X
  const pickLabel = label === '1' ? match.home : label === '2' ? match.away : 'Draw';

  function toggle() {
    if (atLimit) return;
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
    <button
      onClick={toggle}
      disabled={atLimit}
      style={{
        flex: 1,
        padding: '7px 4px',
        borderRadius: 8,
        border: `1px solid ${isActive ? '#00E664' : '#1a3a26'}`,
        background: isActive ? 'rgba(0,230,100,0.15)' : '#111d16',
        color: isActive ? '#00E664' : '#fff',
        fontWeight: 700,
        fontSize: 14,
        cursor: atLimit ? 'not-allowed' : 'pointer',
        opacity: atLimit ? 0.4 : 1,
        transition: 'all 0.15s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        minWidth: 0,
      }}
    >
      <span style={{ color: isActive ? '#00E664' : '#888', fontSize: 10 }}>{label}</span>
      <span>{oddsVal}</span>
    </button>
  );
}

// ── Sport pill ───────────────────────────────────────────────────────────────
function SportPill({ sport, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '6px 14px', borderRadius: 20, border: 'none',
        background: active ? '#00E664' : '#111d16',
        color: active ? '#000' : '#aaa',
        fontWeight: active ? 700 : 500,
        fontSize: 13,
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: 15 }}>{sport.emoji}</span>
      <span className="hidden sm:inline">{sport.label}</span>
    </button>
  );
}

// ── League group (collapsible) ───────────────────────────────────────────────
function LeagueGroup({ league, sport, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const noDrawMode = SPORTS.find(s => s.id === sport)?.noDrawMode;

  return (
    <div style={{ marginBottom: 8 }}>
      {/* League header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '9px 14px', background: '#0a1a12', border: 'none', cursor: 'pointer',
          borderRadius: open ? '10px 10px 0 0' : 10, color: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>{league.flag}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#e5e7eb' }}>{league.name}</span>
          <span style={{ fontSize: 11, color: '#666', background: '#1a2e20', padding: '2px 7px', borderRadius: 10 }}>
            {league.matches.length}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Column headers — desktop only */}
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

      {/* Matches */}
      {open && (
        <div style={{ border: '1px solid #1a3a26', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
          {league.matches.map((match, idx) => (
            <div
              key={match.id}
              style={{
                display: 'flex', alignItems: 'center',
                padding: '10px 12px',
                borderTop: idx > 0 ? '1px solid #0f1e15' : 'none',
                gap: 8,
                background: '#0d1a12',
              }}
            >
              {/* Time */}
              <span style={{ color: '#666', fontSize: 11, width: 36, flexShrink: 0, textAlign: 'center' }}>{match.time}</span>

              {/* Teams */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', display: 'block' }}>
                    {match.home}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', display: 'block' }}>
                    {match.away}
                  </span>
                </div>
              </div>

              {/* Odds buttons */}
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <OddsBtn match={match} sport={sport} label="1" oddsVal={match.odds.home} market="home" />
                {!noDrawMode && match.odds.draw && (
                  <OddsBtn match={match} sport={sport} label="X" oddsVal={match.odds.draw} market="draw" />
                )}
                <OddsBtn match={match} sport={sport} label="2" oddsVal={match.odds.away} market="away" />
              </div>

              {/* More markets — hidden on mobile */}
              <a
                href={`/event/${match.id}`}
                className="hidden sm:block"
                style={{ color: '#00E664', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0, textDecoration: 'none' }}
              >
                +{match.markets}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function MatchList() {
  const [activeSport, setActiveSport] = useState('football');
  const [activeTab,   setActiveTab]   = useState('Today');
  const { selections } = useBetSlipStore();

  const leagues = MOCK[activeSport] || [];

  return (
    <div style={{ paddingBottom: 80 }}>

      {/* Sport pills */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '12px 0 8px', scrollbarWidth: 'none' }}>
        {SPORTS.map(sp => (
          <SportPill
            key={sp.id}
            sport={sp}
            active={activeSport === sp.id}
            onClick={() => setActiveSport(sp.id)}
          />
        ))}
      </div>

      {/* Time tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #1a3a26', marginBottom: 10 }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 16px', background: 'none', border: 'none',
              borderBottom: `2px solid ${activeTab === tab ? '#00E664' : 'transparent'}`,
              color: activeTab === tab ? '#00E664' : '#888',
              fontWeight: activeTab === tab ? 700 : 500,
              fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {tab}
            {tab === 'Live' && <span style={{ marginLeft: 4, width: 6, height: 6, borderRadius: '50%', background: '#ef4444', display: 'inline-block', verticalAlign: 'middle' }} />}
          </button>
        ))}
      </div>

      {/* Bet slip count bar */}
      {selections.length > 0 && (
        <div style={{ background: 'rgba(0,230,100,0.08)', border: '1px solid rgba(0,230,100,0.2)', borderRadius: 10, padding: '8px 14px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#00E664', fontSize: 13, fontWeight: 600 }}>🎯 {selections.length} selection{selections.length > 1 ? 's' : ''} in slip</span>
          <span style={{ color: '#888', fontSize: 12 }}>{MAX_SELS - selections.length} remaining</span>
        </div>
      )}

      {/* League groups */}
      {leagues.length > 0 ? (
        leagues.map((lg, i) => (
          <LeagueGroup key={lg.id} league={lg} sport={activeSport} defaultOpen={i < 2} />
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#555' }}>
          <p style={{ fontSize: 24, marginBottom: 8 }}>🏆</p>
          <p>No matches available right now</p>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .hidden.sm\\:inline { display: none !important; }
          .hidden.sm\\:block  { display: none !important; }
        }
        @media (min-width: 641px) {
          .hidden.sm\\:inline { display: inline !important; }
          .hidden.sm\\:block  { display: block !important; }
        }
        @media (min-width: 768px) {
          .hidden.md\\:flex { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
