import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useBetSlipStore, useAuthStore, useWalletStore } from '../../store';
import { bettingAPI, walletAPI } from '../../utils/api';
import { fmt } from '../../utils/helpers';
import { Spinner } from '../common';
import toast from 'react-hot-toast';

// ── OddsButton ────────────────────────────────────────────────────────────────
function OddsButton({ market, event, selectionKey, label }) {
  const { addSelection, isSelected } = useBetSlipStore();
  const selected = isSelected(market.id, selectionKey);

  return (
    <button
      onClick={() => addSelection({
        market_id:   market.id,
        event_id:    event.id,
        market_type: market.market_type,
        selection:   selectionKey,
        odds:        parseFloat(market.odds),
        home_team:   event.home_team,
        away_team:   event.away_team,
        event_label: `${event.home_team} vs ${event.away_team}`,
      })}
      className={`odds-btn ${selected ? 'selected' : ''}`}>
      <span className="text-xs text-gray-500 truncate w-full text-center">{label}</span>
      <span className={`text-sm font-bold ${selected ? 'text-brand' : 'text-white'}`}>{fmt.odds(market.odds)}</span>
    </button>
  );
}

// ── EventCard ─────────────────────────────────────────────────────────────────
export function EventCard({ event }) {
  const mkts = event.markets || [];
  const home = mkts.find(m => m.market_type === 'h2h' && m.outcome === event.home_team);
  const draw = mkts.find(m => m.market_type === 'h2h' && (m.outcome === 'Draw' || m.outcome === 'X'));
  const away = mkts.find(m => m.market_type === 'h2h' && m.outcome === event.away_team);
  const isLive = event.status === 'live';

  return (
    <div className={`card p-4 hover:border-gray-600 transition-all ${isLive ? 'border-red-900/50' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isLive
            ? <span className="badge badge-pending animate-pulse text-red-400 border-red-800 bg-red-900/40">● LIVE</span>
            : <span className="text-xs text-gray-500">{fmt.datetime(event.commence_time)}</span>}
          {event.league && <span className="text-xs text-gray-600 truncate max-w-[140px]">{event.league}</span>}
        </div>
        {isLive && event.home_score !== null && (
          <span className="text-sm font-bold text-white tabular-nums">{event.home_score} – {event.away_score}</span>
        )}
      </div>
      <div className="mb-3">
        <p className="text-sm font-semibold text-white truncate">{event.home_team}</p>
        <p className="text-sm font-semibold text-gray-300 truncate">{event.away_team}</p>
      </div>
      <div className="flex gap-2">
        {home && <OddsButton market={home} event={event} selectionKey={event.home_team} label="1" />}
        {draw && <OddsButton market={draw} event={event} selectionKey="Draw" label="X" />}
        {away && <OddsButton market={away} event={event} selectionKey={event.away_team} label="2" />}
        {!home && !draw && !away && <p className="text-xs text-gray-600 text-center w-full py-2">Odds not yet available</p>}
      </div>
    </div>
  );
}

// ── BetSlip ───────────────────────────────────────────────────────────────────
const QUICK = [500, 1000, 2000, 5000, 10000];

export function BetSlip() {
  const router = useRouter();
  const { selections, stake, useBonus, removeSelection, clearSlip, setStake, setUseBonus, getTotalOdds, getPotentialWin } = useBetSlipStore();
  const { isAuthenticated } = useAuthStore();
  const { balance, bonusBalance, available, setWallet } = useWalletStore();
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(null);

  const totalOdds = getTotalOdds();
  const potWin = getPotentialWin();
  const betType = selections.length === 1 ? 'Single' : `Accumulator (${selections.length} legs)`;

  async function placeBet() {
    if (!isAuthenticated) return router.push('/login');
    if (!stake || parseFloat(stake) < 50) return toast.error('Minimum stake is MWK 50');
    if (parseFloat(stake) > available) return toast.error('Insufficient balance');
    setLoading(true);
    try {
      const res = await bettingAPI.placeBet({
        selections: selections.map(s => ({ market_id: s.market_id, selection: s.selection })),
        stake: parseFloat(stake),
        use_bonus: useBonus,
      });
      setPlaced(res.data.ticket);
      clearSlip();
      walletAPI.getBalance().then(r => setWallet(r.data));
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
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
            ['Ticket', placed.ticket_code, 'font-mono text-brand font-bold'],
            ['Stake', fmt.mwk(placed.stake), 'text-white'],
            ['Odds', fmt.odds(placed.total_odds), 'text-yellow-400 font-bold'],
            ['Potential Win', fmt.mwk((placed.potential_win || 0) * 0.8), 'text-brand font-bold'],
          ].map(([label, val, cls]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-500">{label}</span>
              <span className={cls}>{val}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setPlaced(null)} className="btn-primary w-full mb-3">Place Another Bet</button>
        <Link href="/tickets" className="text-sm text-gray-500 hover:text-white transition-colors block">View My Tickets →</Link>
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
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-sm">Bet Slip</span>
          <span className="bg-brand text-black text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">{selections.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{betType}</span>
          <button onClick={clearSlip} className="text-xs text-gray-500 hover:text-red-400 transition-colors">Clear</button>
        </div>
      </div>

      <div className="p-3 space-y-2 max-h-56 overflow-y-auto">
        {selections.map(sel => (
          <div key={sel.market_id} className="bg-dark-surface rounded-lg p-3 flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{sel.selection === 'Draw' ? 'Draw' : sel.selection}</p>
              <p className="text-gray-500 text-xs truncate">{sel.event_label}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-brand font-bold text-sm">{fmt.odds(sel.odds)}</span>
              <button onClick={() => removeSelection(sel.market_id)} className="text-gray-600 hover:text-red-400 transition-colors text-xl leading-none">×</button>
            </div>
          </div>
        ))}
      </div>

      {selections.length > 1 && (
        <div className="px-4 pb-2 flex items-center justify-between text-xs">
          <span className="text-gray-500">Total odds</span>
          <span className="text-yellow-400 font-bold">{fmt.odds(totalOdds)}</span>
        </div>
      )}

      <div className="px-4 pb-3 border-t border-dark-border pt-3 space-y-3">
        <div>
          <label className="input-label">Stake (MWK)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">MWK</span>
            <input type="number" value={stake} onChange={e => setStake(e.target.value)}
              placeholder="0.00" min="50" className="input pl-14 text-right font-bold" />
          </div>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {QUICK.map(a => (
              <button key={a} onClick={() => setStake(a.toString())}
                className="text-xs px-2 py-1 bg-dark-surface border border-dark-border rounded-md hover:border-brand hover:text-brand text-gray-500 transition-all">
                {a >= 1000 ? `${a/1000}K` : a}
              </button>
            ))}
          </div>
        </div>

        {isAuthenticated && <p className="text-xs text-gray-600">Available: <span className="text-white font-medium">{fmt.mwk(available)}</span></p>}

        {isAuthenticated && bonusBalance > 0 && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={useBonus} onChange={e => setUseBonus(e.target.checked)} className="w-4 h-4 accent-brand" />
            <span className="text-xs text-gray-400">Use bonus ({fmt.mwk(bonusBalance)})</span>
          </label>
        )}

        {stake && parseFloat(stake) >= 50 && (
          <div className="bg-dark-surface rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between text-xs"><span className="text-gray-500">Stake</span><span className="text-white">{fmt.mwk(stake)}</span></div>
            <div className="flex justify-between text-xs"><span className="text-gray-500">Odds</span><span className="text-yellow-400 font-bold">{fmt.odds(totalOdds)}</span></div>
            <div className="flex justify-between text-sm border-t border-dark-border pt-1.5">
              <span className="text-gray-400 font-medium">Potential Win</span>
              <span className="text-brand font-bold">{fmt.mwk(potWin)}</span>
            </div>
            <p className="text-xs text-gray-700">After 20% withholding tax</p>
          </div>
        )}
      </div>

      <div className="p-4 pt-0">
        <button onClick={placeBet} disabled={loading || !stake || parseFloat(stake) < 50} className="btn-primary w-full text-sm py-3">
          {loading ? <><Spinner size="sm" /><span className="ml-2">Placing...</span></>
            : isAuthenticated ? `Place Bet — ${fmt.mwk(stake || 0)}`
            : 'Login to Bet'}
        </button>
        <p className="text-center text-xs text-gray-700 mt-2">18+ · Bet Responsibly</p>
      </div>
    </div>
  );
}
