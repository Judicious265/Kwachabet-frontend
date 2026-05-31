import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useBetSlipStore, useAuthStore, useWalletStore } from '../../store';
import { bettingAPI, walletAPI } from '../../utils/api';
import { fmt } from '../../utils/helpers';
import { Spinner } from '../common';
import toast from 'react-hot-toast';

// ── Market tab definitions ────────────────────────────────────────────────────
const MARKET_TABS = [
  { id: 'h2h',          label: '1X2',         short: '1X2'   },
  { id: 'totals',       label: 'Over/Under',  short: 'O/U'   },
  { id: 'btts',         label: 'BTTS',        short: 'BTTS'  },
  { id: 'spreads',      label: 'Handicap',    short: 'HCP'   },
  { id: 'htft',         label: 'HT/FT',       short: 'HT/FT' },
  { id: 'correct_score',label: 'Score',       short: 'Score' },
];

// ── OddsButton ────────────────────────────────────────────────────────────────
function OddsButton({ market, event, label, compact = false }: any) {
  const { addSelection, isSelected } = useBetSlipStore();
  const selected = isSelected(market.id, market.outcome);

  function handleClick() {
    addSelection({
      market_id:   market.id,
      event_id:    event.id,
      market_type: market.market_type,
      selection:   market.outcome,
      odds:        parseFloat(market.odds),
      home_team:   event.home_team,
      away_team:   event.away_team,
      event_label: `${event.home_team} vs ${event.away_team}`,
      label:       `${label} — ${event.home_team} vs ${event.away_team}`,
    });
  }

  return (
    <button
      onClick={handleClick}
      className={`odds-btn ${selected ? 'selected' : ''} ${compact ? 'py-1.5' : 'py-2.5'}`}
    >
      <span className={`text-gray-500 truncate w-full text-center ${compact ? 'text-xs' : 'text-xs'} leading-tight`}>
        {label}
      </span>
      <span className={`font-bold ${selected ? 'text-brand' : 'text-white'} ${compact ? 'text-xs' : 'text-sm'}`}>
        {fmt.odds(market.odds)}
      </span>
    </button>
  );
}

// ── EventCard ────────────────────────────────────────────────────────────────
export function EventCard({ event }: { event: any }) {
  const [activeTab, setActiveTab] = useState('h2h');
  const [showAllScores, setShowAllScores] = useState(false);
  const markets: any[] = event.markets || [];
  const isLive = event.status === 'live';

  // Group markets by type
  const byType: Record<string, any[]> = {};
  markets.forEach(m => {
    if (!byType[m.market_type]) byType[m.market_type] = [];
    byType[m.market_type].push(m);
  });

  // Which tabs have data
  const availableTabs = MARKET_TABS.filter(t => byType[t.id]?.length > 0);

  // H2H markets
  const h2hHome = byType['h2h']?.find(m => m.outcome === event.home_team);
  const h2hDraw = byType['h2h']?.find(m => m.outcome === 'Draw');
  const h2hAway = byType['h2h']?.find(m => m.outcome === event.away_team);

  // Over/Under markets
  const totals = byType['totals'] || [];
  const over25  = totals.find(m => m.outcome === 'Over 2.5');
  const under25 = totals.find(m => m.outcome === 'Under 2.5');
  const over15  = totals.find(m => m.outcome === 'Over 1.5');
  const under15 = totals.find(m => m.outcome === 'Under 1.5');

  // BTTS
  const bttsYes = byType['btts']?.find(m => m.outcome === 'Yes');
  const bttsNo  = byType['btts']?.find(m => m.outcome === 'No');

  // Handicap
  const spreads = byType['spreads'] || [];

  // HT/FT
  const htft = byType['htft'] || [];

  // Correct Score
  const scores = byType['correct_score'] || [];
  const visibleScores = showAllScores ? scores : scores.slice(0, 8);

  return (
    <div className={`card overflow-hidden hover:border-gray-600 transition-all ${isLive ? 'border-red-900/50' : ''}`}>

      {/* Match header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border">
        <div className="flex items-center gap-2 min-w-0">
          {isLive ? (
            <span className="badge badge-pending animate-pulse text-red-400 border-red-800 bg-red-900/40 flex-shrink-0">● LIVE</span>
          ) : (
            <span className="text-xs text-gray-500 flex-shrink-0">{fmt.datetime(event.commence_time)}</span>
          )}
          {event.league && (
            <span className="text-xs text-gray-600 truncate">{event.league}</span>
          )}
        </div>
        {isLive && event.home_score !== null && (
          <span className="text-sm font-bold text-white tabular-nums flex-shrink-0">
            {event.home_score} – {event.away_score}
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 mr-4">
            <p className="text-sm font-semibold text-white truncate">{event.home_team}</p>
            <p className="text-sm font-semibold text-gray-400 truncate mt-0.5">{event.away_team}</p>
          </div>
          {/* Markets count badge */}
          <div className="text-xs text-gray-600 flex-shrink-0 text-right">
            <span className="text-brand font-medium">{availableTabs.length}</span> markets
          </div>
        </div>
      </div>

      {/* Market tabs - scrollable */}
      {availableTabs.length > 0 && (
        <div className="border-t border-dark-border">
          <div className="flex overflow-x-auto scrollbar-hide border-b border-dark-border">
            {availableTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-brand text-brand bg-brand/5'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.short}
              </button>
            ))}
          </div>

          <div className="p-3">

            {/* 1X2 - Match Result */}
            {activeTab === 'h2h' && (
              <div className="flex gap-2">
                {h2hHome && <OddsButton market={h2hHome} event={event} label="1" />}
                {h2hDraw && <OddsButton market={h2hDraw} event={event} label="X" />}
                {h2hAway && <OddsButton market={h2hAway} event={event} label="2" />}
                {!h2hHome && !h2hDraw && !h2hAway && (
                  <p className="text-xs text-gray-600 text-center w-full py-2">Odds not yet available</p>
                )}
              </div>
            )}

            {/* Over/Under */}
            {activeTab === 'totals' && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  {over25  && <OddsButton market={over25}  event={event} label="Over 2.5"  />}
                  {under25 && <OddsButton market={under25} event={event} label="Under 2.5" />}
                </div>
                <div className="flex gap-2">
                  {over15  && <OddsButton market={over15}  event={event} label="Over 1.5"  />}
                  {under15 && <OddsButton market={under15} event={event} label="Under 1.5" />}
                </div>
                {totals.filter(m => !['Over 2.5','Under 2.5','Over 1.5','Under 1.5'].includes(m.outcome)).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {totals
                      .filter(m => !['Over 2.5','Under 2.5','Over 1.5','Under 1.5'].includes(m.outcome))
                      .map((m: any) => (
                        <div key={m.id} className="flex-1 min-w-[80px] max-w-[120px]">
                          <OddsButton market={m} event={event} label={m.outcome} compact />
                        </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* BTTS */}
            {activeTab === 'btts' && (
              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium">Both Teams to Score</p>
                <div className="flex gap-2">
                  {bttsYes && <OddsButton market={bttsYes} event={event} label="Yes ✓" />}
                  {bttsNo  && <OddsButton market={bttsNo}  event={event} label="No ✗"  />}
                </div>
              </div>
            )}

            {/* Asian Handicap */}
            {activeTab === 'spreads' && (
              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium">Asian Handicap</p>
                <div className="flex flex-wrap gap-2">
                  {spreads.map((m: any) => (
                    <div key={m.id} className="flex-1 min-w-[100px]">
                      <OddsButton market={m} event={event} label={m.outcome} compact />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HT/FT */}
            {activeTab === 'htft' && (
              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium">Half Time / Full Time</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {htft.map((m: any) => {
                    const parts = m.outcome.split('/');
                    const htPart = parts[0]?.trim();
                    const ftPart = parts[1]?.trim();
                    // Shorten team names for display
                    const shorten = (name: string) => {
                      if (name === 'Draw') return 'Draw';
                      if (name === event.home_team) return 'Home';
                      if (name === event.away_team) return 'Away';
                      return name;
                    };
                    return (
                      <OddsButton
                        key={m.id}
                        market={m}
                        event={event}
                        label={`${shorten(htPart)}/${shorten(ftPart)}`}
                        compact
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Correct Score */}
            {activeTab === 'correct_score' && (
              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium">Correct Score</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {visibleScores.map((m: any) => (
                    <OddsButton
                      key={m.id}
                      market={m}
                      event={event}
                      label={m.outcome}
                      compact
                    />
                  ))}
                </div>
                {scores.length > 8 && (
                  <button
                    onClick={() => setShowAllScores(!showAllScores)}
                    className="text-xs text-brand hover:underline mt-2 w-full text-center"
                  >
                    {showAllScores ? 'Show less ▲' : `Show all ${scores.length} scores ▼`}
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* No markets fallback */}
      {availableTabs.length === 0 && (
        <div className="px-4 pb-3">
          <p className="text-xs text-gray-600 text-center py-2">Odds loading...</p>
        </div>
      )}

    </div>
  );
}

// ── BetSlip ───────────────────────────────────────────────────────────────────
const QUICK = [500, 1000, 2000, 5000, 10000];

export function BetSlip() {
  const router = useRouter();
  const {
    selections, stake, useBonus, removeSelection,
    clearSlip, setStake, setUseBonus,
    getTotalOdds, getPotentialWin,
  } = useBetSlipStore();
  const { isAuthenticated } = useAuthStore();
  const { balance, bonusBalance, available, setWallet } = useWalletStore();
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState<any>(null);

  const totalOdds = getTotalOdds();
  const potWin    = getPotentialWin();
  const betType   = selections.length === 1 ? 'Single' : `Accumulator (${selections.length} legs)`;

  async function placeBet() {
    if (!isAuthenticated) return router.push('/login');
    if (!stake || parseFloat(stake) < 50) return toast.error('Minimum stake is MWK 50');
    if (parseFloat(stake) > available) return toast.error('Insufficient balance');
    setLoading(true);
    try {
      const res = await bettingAPI.placeBet({
        selections: selections.map(s => ({ market_id: s.market_id, selection: s.selection })),
        stake:      parseFloat(stake),
        use_bonus:  useBonus,
      });
      setPlaced(res.data.ticket);
      clearSlip();
      walletAPI.getBalance().then(r => setWallet(r.data));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (placed) {
    return (
      <div className="card p-6 text-center animate-slide-up">
        <div className="w-14 h-14 rounded-full bg-brand/20 border-2 border-brand flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-brand">✓</span>
        </div>
        <h3 className="text-white font-bold text-lg mb-1">Bet Placed!</h3>
        <p className="text-gray-500 text-sm mb-5">Good luck! 🤞</p>
        <div className="bg-dark-surface rounded-xl p-4 text-left space-y-2.5 mb-5">
          {[
            ['Ticket',        placed.ticket_code,                          'font-mono text-brand font-bold'],
            ['Stake',         fmt.mwk(placed.stake),                       'text-white'],
            ['Odds',          fmt.odds(placed.total_odds),                  'text-yellow-400 font-bold'],
            ['Potential Win', fmt.mwk((placed.potential_win || 0) * 0.8), 'text-brand font-bold'],
          ].map(([label, val, cls]) => (
            <div key={label as string} className="flex justify-between text-sm">
              <span className="text-gray-500">{label}</span>
              <span className={cls as string}>{val}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setPlaced(null)} className="btn-primary w-full mb-3">Place Another Bet</button>
        <Link href="/tickets" className="text-sm text-gray-500 hover:text-white transition-colors block">
          View My Tickets →
        </Link>
      </div>
    );
  }

  if (selections.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-3xl mb-3">🎯</p>
        <p className="text-white font-semibold mb-1">Bet Slip Empty</p>
        <p className="text-gray-500 text-sm">Click any odds to add a selection</p>
      </div>
    );
  }

  return (
    <div className="card animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-sm">Bet Slip</span>
          <span className="bg-brand text-black text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
            {selections.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{betType}</span>
          <button onClick={clearSlip} className="text-xs text-gray-500 hover:text-red-400 transition-colors">Clear</button>
        </div>
      </div>

      {/* Selections */}
      <div className="p-3 space-y-2 max-h-56 overflow-y-auto">
        {selections.map(sel => (
          <div key={sel.market_id} className="bg-dark-surface rounded-lg p-3 flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{sel.selection}</p>
              <p className="text-gray-500 text-xs truncate">{sel.event_label}</p>
              <p className="text-gray-600 text-xs capitalize">{sel.market_type?.replace('_', ' ')}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-brand font-bold text-sm">{fmt.odds(sel.odds)}</span>
              <button
                onClick={() => removeSelection(sel.market_id)}
                className="text-gray-600 hover:text-red-400 transition-colors text-xl leading-none"
              >×</button>
            </div>
          </div>
        ))}
      </div>

      {/* Total odds for accas */}
      {selections.length > 1 && (
        <div className="px-4 pb-2 flex items-center justify-between text-xs">
          <span className="text-gray-500">Total odds</span>
          <span className="text-yellow-400 font-bold">{fmt.odds(totalOdds)}</span>
        </div>
      )}

      {/* Stake input */}
      <div className="px-4 pb-3 border-t border-dark-border pt-3 space-y-3">
        <div>
          <label className="input-label">Stake (MWK)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">MWK</span>
            <input
              type="number"
              value={stake}
              onChange={e => setStake(e.target.value)}
              placeholder="0.00"
              min="50"
              className="input pl-14 text-right font-bold"
            />
          </div>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {QUICK.map(a => (
              <button
                key={a}
                onClick={() => setStake(a.toString())}
                className="text-xs px-2 py-1 bg-dark-surface border border-dark-border rounded-md hover:border-brand hover:text-brand text-gray-500 transition-all"
              >
                {a >= 1000 ? `${a / 1000}K` : a}
              </button>
            ))}
          </div>
        </div>

        {isAuthenticated && (
          <p className="text-xs text-gray-600">
            Available: <span className="text-white font-medium">{fmt.mwk(available)}</span>
            {bonusBalance > 0 && <span className="text-brand ml-2">+{fmt.mwk(bonusBalance)} bonus</span>}
          </p>
        )}

        {isAuthenticated && bonusBalance > 0 && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useBonus}
              onChange={e => setUseBonus(e.target.checked)}
              className="w-4 h-4 accent-brand"
            />
            <span className="text-xs text-gray-400">Use bonus ({fmt.mwk(bonusBalance)})</span>
          </label>
        )}

        {stake && parseFloat(stake) >= 50 && (
          <div className="bg-dark-surface rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Stake</span>
              <span className="text-white">{fmt.mwk(stake)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Odds</span>
              <span className="text-yellow-400 font-bold">{fmt.odds(totalOdds)}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-dark-border pt-1.5">
              <span className="text-gray-400 font-medium">Potential Win</span>
              <span className="text-brand font-bold">{fmt.mwk(potWin)}</span>
            </div>
            <p className="text-xs text-gray-700">After 20% withholding tax</p>
          </div>
        )}
      </div>

      {/* Place button */}
      <div className="p-4 pt-0">
        <button
          onClick={placeBet}
          disabled={loading || !stake || parseFloat(stake) < 50}
          className="btn-primary w-full text-sm py-3"
        >
          {loading ? (
            <><Spinner size="sm" /><span className="ml-2">Placing...</span></>
          ) : isAuthenticated ? (
            `Place Bet — ${fmt.mwk(stake || 0)}`
          ) : (
            'Login to Bet'
          )}
        </button>
        <p className="text-center text-xs text-gray-700 mt-2">18+ · Bet Responsibly</p>
      </div>
    </div>
  );
}
