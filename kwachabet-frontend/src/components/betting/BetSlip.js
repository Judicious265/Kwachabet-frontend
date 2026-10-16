/**
 * BetSlip.js — Standalone bet slip component
 * - Up to 72 selections (accumulator)
 * - WHT: 20% on NET PROFIT (Malawi Gaming Board rule)
 * - Quick stake buttons
 * - Wired to useBetSlipStore
 */
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useBetSlipStore, useAuthStore, useWalletStore } from '../../store';
import { fmt } from '../../utils/helpers';

const MAX_SELS  = 72;
const WHT_RATE  = 0.20;
const QUICK     = [500, 1000, 2000, 5000, 10000];
const API_BASE  = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

function fmtMWK(n) {
  return 'MWK ' + parseFloat(n || 0).toLocaleString('en-MW', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function BetSlip() {
  const router = useRouter();
  const { selections, stake, removeSelection, clearSlip, setStake } = useBetSlipStore();
  const { isAuthenticated, token } = useAuthStore();
  const { available, bonusBalance } = useWalletStore();

  const [loading, setLoading]   = useState(false);
  const [result,  setResult]    = useState(null); // { ok, msg, ticket }
  const [useBonus, setUseBonus] = useState(false);

  // Calculations
  const stakeVal   = parseFloat(stake) || 0;
  const totalOdds  = selections.length
    ? parseFloat(selections.reduce((a, s) => a * parseFloat(s.odds || 1), 1).toFixed(3))
    : 0;
  const grossWin   = stakeVal * totalOdds;
  const profit     = grossWin - stakeVal;
  const wht        = profit > 0 ? profit * WHT_RATE : 0;
  const netWin     = grossWin - wht;
  const betType    = selections.length === 1 ? 'Single' : `Accumulator (${selections.length} legs)`;

  async function placeBet() {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (stakeVal < 50)    { setResult({ ok: false, msg: 'Minimum stake is MWK 50' }); return; }

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/bets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          selections: selections.map(s => ({
            market_id: s.market_id || s.id,
            event_id:  s.event_id,
            selection: s.selection,
            odds:      parseFloat(s.odds),
          })),
          stake:     stakeVal,
          use_bonus: useBonus,
          bet_type:  selections.length === 1 ? 'single' : 'accumulator',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Bet failed');
      setResult({ ok: true, msg: 'Bet placed!', ticket: data.ticket_code || data.ticket });
      clearSlip();
    } catch (err) {
      setResult({ ok: false, msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  // ── Success screen
  if (result?.ok) {
    return (
      <div style={{ background: '#0D1F16', border: '1px solid #1a3a26', borderRadius: 16, padding: 24, textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,230,100,0.15)', border: '2px solid #00E664', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>✓</div>
        <p style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Bet Placed!</p>
        <p style={{ color: '#888', fontSize: 13, marginBottom: 16 }}>Good luck! 🤞</p>
        {result.ticket && (
          <p style={{ color: '#00E664', fontFamily: 'monospace', fontWeight: 700, marginBottom: 16 }}>#{result.ticket}</p>
        )}
        <button onClick={() => setResult(null)} style={{ width: '100%', padding: '12px 0', borderRadius: 10, background: '#00E664', color: '#000', fontWeight: 700, border: 'none', cursor: 'pointer', marginBottom: 8 }}>
          Place Another Bet
        </button>
        <Link href="/tickets" style={{ color: '#888', fontSize: 13, textDecoration: 'none', display: 'block' }}>View My Tickets →</Link>
      </div>
    );
  }

  // ── Empty state
  if (selections.length === 0) {
    return (
      <div style={{ background: '#0D1F16', border: '1px solid #1a3a26', borderRadius: 16, padding: 32, textAlign: 'center' }}>
        <p style={{ fontSize: 32, marginBottom: 8 }}>🎯</p>
        <p style={{ color: '#fff', fontWeight: 600, marginBottom: 4 }}>Bet Slip Empty</p>
        <p style={{ color: '#666', fontSize: 13 }}>Click any odds to add a selection</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#0D1F16', border: '1px solid #1a3a26', borderRadius: 16, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #1a3a26' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Bet Slip</span>
          <span style={{ background: '#00E664', color: '#000', fontSize: 11, fontWeight: 900, width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {selections.length}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#666', fontSize: 12 }}>{betType}</span>
          <button onClick={clearSlip} style={{ color: '#666', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}>
            Clear all
          </button>
        </div>
      </div>

      {/* Selections list */}
      <div style={{ maxHeight: 320, overflowY: 'auto', padding: '8px 12px' }}>
        {selections.map((sel, i) => (
          <div key={sel.market_id || sel.id || i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: '#111d16', borderRadius: 10, padding: '10px 12px', marginBottom: 6 }}>
            {/* Number bubble */}
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#00E664', color: '#000', fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
              {i + 1}
            </span>
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Pick — team name or "Draw" in green */}
              <p style={{ color: '#00E664', fontSize: 13, fontWeight: 700, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {sel.selection}
              </p>
              {/* Match context — "Man United vs Liverpool" */}
              <p style={{ color: '#ccc', fontSize: 11, margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {sel.event_label || (sel.home_team ? `${sel.home_team} vs ${sel.away_team}` : sel.label)}
              </p>
              {/* Market label */}
              <p style={{ color: '#555', fontSize: 10, margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {sel.market_type ? sel.market_type.replace(/_/g, ' ') : 'Match Result'}
              </p>
            </div>
            {/* Odds + remove */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <span style={{ color: '#00E664', fontWeight: 700, fontSize: 14 }}>
                {parseFloat(sel.odds || 0).toFixed(2)}
              </span>
              <button
                onClick={() => removeSelection(sel.market_id || sel.id)}
                style={{ color: '#555', fontSize: 18, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                ×
              </button>
            </div>
          </div>
        ))}

        {selections.length >= MAX_SELS && (
          <p style={{ color: '#f59e0b', fontSize: 12, textAlign: 'center', padding: 8 }}>
            ⚠ Maximum {MAX_SELS} selections reached
          </p>
        )}
      </div>

      {/* Combined odds (accumulator) */}
      {selections.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 16px', background: 'rgba(0,230,100,0.04)', borderTop: '1px solid #1a3a26' }}>
          <span style={{ color: '#888', fontSize: 12 }}>Combined odds</span>
          <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: 13 }}>{totalOdds.toFixed(2)}</span>
        </div>
      )}

      {/* Stake input */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid #1a3a26' }}>
        <label style={{ color: '#888', fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
          Stake (MWK)
        </label>
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#666', fontSize: 13, pointerEvents: 'none' }}>MWK</span>
          <input
            type="number"
            value={stake}
            onChange={e => setStake(e.target.value)}
            placeholder="0"
            min="50"
            style={{ width: '100%', background: '#111d16', border: '1px solid #1a3a26', borderRadius: 10, padding: '11px 12px 11px 52px', color: '#fff', fontSize: 15, fontWeight: 700, boxSizing: 'border-box', outline: 'none', textAlign: 'right' }}
          />
        </div>

        {/* Quick stake buttons */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {QUICK.map(a => (
            <button
              key={a}
              onClick={() => setStake(String(a))}
              style={{ flex: '1 1 auto', padding: '6px 4px', background: stake === String(a) ? 'rgba(0,230,100,0.15)' : '#111d16', border: `1px solid ${stake === String(a) ? '#00E664' : '#1a3a26'}`, borderRadius: 8, color: stake === String(a) ? '#00E664' : '#888', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              {a >= 1000 ? (a / 1000) + 'K' : a}
            </button>
          ))}
        </div>

        {/* Balance */}
        {isAuthenticated && (
          <p style={{ color: '#666', fontSize: 12, marginBottom: bonusBalance > 0 ? 6 : 12 }}>
            Available: <span style={{ color: '#fff', fontWeight: 600 }}>{fmtMWK(available)}</span>
            {bonusBalance > 0 && <span style={{ color: '#00E664', marginLeft: 8 }}>+{fmtMWK(bonusBalance)} bonus</span>}
          </p>
        )}

        {/* Bonus toggle */}
        {isAuthenticated && bonusBalance > 0 && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 12 }}>
            <input type="checkbox" checked={useBonus} onChange={e => setUseBonus(e.target.checked)} style={{ accentColor: '#00E664' }} />
            <span style={{ color: '#aaa', fontSize: 12 }}>Use bonus ({fmtMWK(bonusBalance)})</span>
          </label>
        )}

        {/* Winnings breakdown */}
        {stakeVal >= 50 && (
          <div style={{ background: '#111d16', borderRadius: 12, padding: '12px 14px', marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#888', fontSize: 12 }}>Stake</span>
              <span style={{ color: '#fff', fontSize: 12 }}>{fmtMWK(stakeVal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#888', fontSize: 12 }}>Gross Winnings</span>
              <span style={{ color: '#fff', fontSize: 12 }}>{fmtMWK(grossWin)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#f59e0b', fontSize: 12 }}>WHT (20% on profit)</span>
              <span style={{ color: '#f59e0b', fontSize: 12 }}>− {fmtMWK(wht)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1a3a26', paddingTop: 8 }}>
              <span style={{ color: '#00E664', fontSize: 14, fontWeight: 700 }}>Net Winnings</span>
              <span style={{ color: '#00E664', fontSize: 14, fontWeight: 700 }}>{fmtMWK(netWin)}</span>
            </div>
          </div>
        )}

        {/* Error message */}
        {result && !result.ok && (
          <p style={{ color: '#f87171', fontSize: 12, textAlign: 'center', marginBottom: 10 }}>{result.msg}</p>
        )}

        {/* Place bet button */}
        <button
          onClick={placeBet}
          disabled={loading || stakeVal < 50}
          style={{
            width: '100%', padding: '14px 0', borderRadius: 12,
            background: loading || stakeVal < 50 ? '#1a3a26' : '#00E664',
            color: loading || stakeVal < 50 ? '#555' : '#000',
            fontWeight: 700, fontSize: 15, border: 'none', cursor: loading || stakeVal < 50 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {loading ? 'Placing...' : isAuthenticated ? `Place Bet — ${fmtMWK(stakeVal)}` : 'Login to Bet'}
        </button>
        <p style={{ color: '#555', fontSize: 11, textAlign: 'center', marginTop: 8 }}>18+ · Bet Responsibly</p>
      </div>
    </div>
  );
}
