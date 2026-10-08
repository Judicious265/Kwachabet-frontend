import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useBetSlipStore } from '../../store';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const LEAGUE_FLAGS = {
  'UEFA Champions League': '🏆',
  'UEFA Europa League':    '🏆',
  'Premier League':        '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'La Liga':               '🇪🇸',
  'Serie A':               '🇮🇹',
  'Bundesliga':            '🇩🇪',
  'Ligue 1':               '🇫🇷',
  'Eredivisie':            '🇳🇱',
  'TNM Super League':      '🇲🇼',
  'NBA':                   '🏀',
  'ATP Tour':              '🎾',
};
function leagueFlag(league) {
  return LEAGUE_FLAGS[league] || '⚽';
}

const TEAM_COLORS = {
  'Manchester United': '#DA291C', 'Liverpool':    '#C8102E',
  'Arsenal':           '#EF0107', 'Chelsea':      '#034694',
  'Manchester City':   '#6CABDD', 'Tottenham':    '#132257',
  'Real Madrid':       '#FEBE10', 'Barcelona':    '#A50044',
  'Bayern Munich':     '#DC052D', 'Dortmund':     '#FDE100',
  'Inter Milan':       '#010E80', 'AC Milan':     '#FB090B',
  'Juventus':          '#000000', 'PSG':          '#004170',
  'Atletico Madrid':   '#CB3524', 'Ajax':         '#D2122E',
  'Nyasa big Bullets': '#00C853', 'Mighty Wanderers': '#E30613',
  'Silver Strikers':   '#C0C0C0', 'Blue Eagles':  '#003399',
};
const DARK_COLORS = ['#000000','#132257','#010E80','#034694','#003399','#004170'];

function getInitials(name) {
  if (!name) return '??';
  const w = name.trim().split(' ');
  return w.length >= 2 ? (w[0][0] + w[w.length-1][0]).toUpperCase() : name.slice(0,2).toUpperCase();
}

function TeamBadge({ name, size }) {
  const color = TEAM_COLORS[name] || '#2D4A35';
  const light = DARK_COLORS.includes(color) || color === '#C0C0C0';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: size * 0.3, color: light ? '#fff' : '#000',
      boxShadow: `0 2px 10px ${color}55`,
      border: '2px solid rgba(255,255,255,0.1)',
    }}>
      {getInitials(name)}
    </div>
  );
}

function OddsButton({ market, label, outcome, accentColor, onClick }) {
  const { isSelected } = useBetSlipStore();
  const sel = market && isSelected(market.id, outcome);
  const ac  = accentColor || '#00E664';
  return (
    <button
      onClick={onClick}
      disabled={!market}
      style={{
        flex: 1, padding: '7px 4px', borderRadius: 8, border: 'none',
        background: sel ? ac : 'rgba(255,255,255,0.06)',
        outline: sel ? 'none' : '1px solid rgba(255,255,255,0.1)',
        cursor: market ? 'pointer' : 'default',
        transition: 'all .15s', textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 9, color: sel ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.38)', fontWeight: 600, marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: sel ? '#000' : '#fff', fontFamily: 'monospace' }}>
        {market ? parseFloat(market.odds).toFixed(2) : '—'}
      </div>
    </button>
  );
}

function MatchCard({ match }) {
  const { addSelection } = useBetSlipStore();
  const markets  = match.markets || [];
  const h2h      = markets.filter(m => m.market_type === 'h2h');
  const home     = h2h.find(m => m.outcome === match.home_team);
  const draw     = h2h.find(m => m.outcome === 'Draw');
  const away     = h2h.find(m => m.outcome === match.away_team);
  const isLive   = match.status === 'live';
  const timeStr  = new Date(match.commence_time).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
  const ac       = '#00E664';

  function pick(market, outcome) {
    if (!market) return;
    addSelection({
      event_id:    match.id,
      market_id:   market.id,
      market_type: 'h2h',
      selection:   outcome,
      odds:        parseFloat(market.odds),
      event_name:  `${match.home_team} vs ${match.away_team}`,
      league:      match.league,
    });
  }

  return (
    <div className="match-card">
      {/* Boost badge */}
      {match.is_boosted && (
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: '#F5A623', color: '#000',
          fontSize: 9, fontWeight: 800, padding: '2px 7px',
          borderRadius: 20, letterSpacing: '.05em',
          zIndex: 1,
        }}>
          {match.boost_label || '🔥 BOOSTED'}
        </div>
      )}

      {/* Header — league + time */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', borderBottom: '1px solid #1E3024',
        background: 'rgba(0,0,0,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
          <span style={{ fontSize: 13, flexShrink: 0 }}>{leagueFlag(match.league)}</span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {match.league}
          </span>
        </div>
        {isLive ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#EF4444', display: 'inline-block', animation: 'pulse-dot 1.2s ease infinite' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#EF4444' }}>
              LIVE {match.home_score != null ? `${match.home_score}–${match.away_score}` : ''}
            </span>
          </div>
        ) : (
          <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>{timeStr}</span>
        )}
      </div>

      {/* Teams */}
      <div style={{ padding: '14px 12px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 0 }}>
            <TeamBadge name={match.home_team} size={44} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
              {match.home_team.split(' ').slice(-1)[0]}
            </span>
          </div>
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.2)' }}>VS</span>
            {isLive && match.home_score != null && (
              <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>
                {match.home_score}–{match.away_score}
              </span>
            )}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 0 }}>
            <TeamBadge name={match.away_team} size={44} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
              {match.away_team.split(' ').slice(-1)[0]}
            </span>
          </div>
        </div>

        {/* Odds */}
        <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
          <OddsButton market={home} label="1" outcome={match.home_team} accentColor={ac} onClick={() => pick(home, match.home_team)} />
          <OddsButton market={draw} label="X" outcome="Draw"            accentColor={ac} onClick={() => pick(draw, 'Draw')} />
          <OddsButton market={away} label="2" outcome={match.away_team} accentColor={ac} onClick={() => pick(away, match.away_team)} />
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 6 }}>
          <Link href={`/match/${match.id}`} className="btn-betnow">Bet Now</Link>
          <Link href={`/match/${match.id}`} className="btn-markets">
            More Markets <span style={{ fontSize: 9, marginLeft: 2 }}>▾</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TodaysMatches() {
  const [matches, setMatches]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [pinned,  setPinned]    = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API_BASE}/featured-matches`)
      .then(r => r.json())
      .then(data => {
        setMatches(data.matches || []);
        setPinned(data.pinned_count || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    // Refresh every 5 minutes
    const t = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, [load]);

  if (!loading && matches.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes pulse-dot {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:.45;transform:scale(1.4)}
        }
        .tm-section { background:#060D0A; padding:24px 0 20px; }
        .tm-inner   { max-width:1280px; margin:0 auto; padding:0 24px; }
        @media(max-width:768px){ .tm-inner{ padding:0 14px; } }

        .tm-header {
          display:flex; align-items:center;
          justify-content:space-between; margin-bottom:16px;
        }
        .tm-title {
          display:flex; align-items:center; gap:8px;
          font-size:17px; font-weight:800; color:#fff;
          letter-spacing:-.3px; margin:0;
        }
        @media(max-width:480px){ .tm-title{ font-size:14px; } }

        .tm-view-all {
          display:flex; align-items:center; gap:4px;
          font-size:13px; font-weight:600; color:#00E664;
          text-decoration:none; white-space:nowrap;
        }
        .tm-view-all:hover{ text-decoration:underline; }

        /* Cards grid */
        .tm-grid {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:12px;
        }
        @media(max-width:1024px){ .tm-grid{ grid-template-columns:repeat(2,1fr); } }
        @media(max-width:480px) { .tm-grid{ grid-template-columns:repeat(1,1fr); gap:8px; } }

        /* Individual card */
        .match-card {
          position:relative;
          background:#0D1911;
          border:1px solid #1E3024;
          border-radius:12px;
          overflow:hidden;
          transition:border-color .15s, box-shadow .15s;
        }
        .match-card:hover {
          border-color:rgba(0,230,100,.3);
          box-shadow:0 4px 20px rgba(0,230,100,.08);
        }

        /* Bet Now button */
        .btn-betnow {
          flex:1; display:block; text-align:center;
          padding:9px 0; border-radius:8px;
          font-size:12px; font-weight:700; color:#000;
          background:#00E664; text-decoration:none;
          transition:filter .15s;
        }
        .btn-betnow:hover{ filter:brightness(1.1); }

        /* More Markets button */
        .btn-markets {
          flex:1; display:flex; align-items:center;
          justify-content:center;
          padding:9px 0; border-radius:8px;
          font-size:12px; font-weight:600; color:#8A9E97;
          background:rgba(255,255,255,0.05);
          border:1px solid #1E3024; text-decoration:none;
          transition:background .15s, color .15s;
        }
        .btn-markets:hover{ background:rgba(255,255,255,.08); color:#fff; }

        /* Skeleton */
        .tm-skeleton {
          background:rgba(255,255,255,.04);
          border:1px solid #1E3024;
          border-radius:12px; height:220px;
          animation:tm-shimmer 1.4s ease infinite;
        }
        @keyframes tm-shimmer{ 0%,100%{opacity:1}50%{opacity:.45} }

        /* Auto badge */
        .auto-badge {
          display:inline-flex; align-items:center; gap:4px;
          font-size:10px; font-weight:600; color:#4A6B56;
          margin-left:8px;
        }
      `}</style>

      <section className="tm-section">
        <div className="tm-inner">
          <div className="tm-header">
            <h2 className="tm-title">
              🔥 TODAY'S BIGGEST MATCHES
              {pinned === 0 && matches.length > 0 && (
                <span className="auto-badge">· Auto</span>
              )}
            </h2>
            <Link href="/competitions" className="tm-view-all">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="tm-grid">
              {[...Array(4)].map((_, i) => <div key={i} className="tm-skeleton" />)}
            </div>
          ) : (
            <div className="tm-grid">
              {matches.slice(0, 8).map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
