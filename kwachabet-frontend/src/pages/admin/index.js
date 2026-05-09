import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { adminAPI } from '../../utils/api';
import { useAuthStore } from '../../store';
import { Spinner, StatusBadge, EmptyState } from '../../components/common';
import { fmt } from '../../utils/helpers';
import toast from 'react-hot-toast';

const TABS = [{id:'dashboard',label:'Dashboard',icon:'📊'},{id:'users',label:'Users',icon:'👥'},{id:'tickets',label:'Tickets',icon:'🎯'},{id:'withdrawals',label:'Withdrawals',icon:'💸'},{id:'fraud',label:'Fraud',icon:'🛡️'},{id:'bonus',label:'Bonus',icon:'🎁'}];

function Stat({ label, value, sub, color='text-white' }) {
  return <div className="bg-dark-card border border-dark-border rounded-xl p-4"><p className="text-xs text-gray-500 mb-1">{label}</p><p className={`text-2xl font-black ${color}`}>{value??'—'}</p>{sub&&<p className="text-xs text-gray-600 mt-1">{sub}</p>}</div>;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [tab, setTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user?.is_admin) { router.push('/'); return; }
    load(tab);
  }, [tab, isAuthenticated]);

  async function load(t) {
    setLoading(true);
    try {
      let r;
      if (t==='dashboard')   r = await adminAPI.getDashboard();
      if (t==='users')       r = await adminAPI.getUsers({ limit: 50 });
      if (t==='tickets')     r = await adminAPI.getTickets({ limit: 50 });
      if (t==='withdrawals') r = await adminAPI.getPendingWithdrawals();
      if (t==='fraud')       r = await adminAPI.getFraudDashboard();
      if (t==='bonus')       r = await adminAPI.getCampaigns();
      setData(d => ({ ...d, [t]: r?.data }));
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  }

  async function handleSuspend(id, isSuspended) {
    try {
      if (isSuspended) { await adminAPI.unsuspendUser(id); toast.success('Unsuspended'); }
      else { const r = prompt('Reason:'); if (!r) return; await adminAPI.suspendUser(id, r); toast.success('Suspended'); }
      load('users');
    } catch { toast.error('Failed'); }
  }

  async function handleWithdrawal(id, approve) {
    try {
      if (approve) { await adminAPI.approveWithdrawal(id); toast.success('Approved'); }
      else { const r = prompt('Reason:'); if (!r) return; await adminAPI.rejectWithdrawal(id, r); toast.success('Rejected'); }
      load('withdrawals');
    } catch { toast.error('Failed'); }
  }

  const d = data[tab] || {};
  const SEV = { low:'text-gray-400', medium:'text-yellow-400', high:'text-orange-400', critical:'text-red-400' };

  return (
    <>
      <Head><title>Admin — Kwacha Bet</title></Head>
      <div className="min-h-screen bg-dark flex">
        <aside className="w-52 bg-dark-surface border-r border-dark-border flex-shrink-0 flex flex-col">
          <div className="p-4 border-b border-dark-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center"><span className="text-black font-black text-xs">K</span></div>
              <div><p className="text-white font-bold text-sm">KwachaBet</p><p className="text-xs text-brand">Admin</p></div>
            </div>
          </div>
          <nav className="flex-1 p-2 space-y-0.5">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${tab===t.id?'bg-brand/10 text-brand':'text-gray-400 hover:text-white hover:bg-dark-hover'}`}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-dark-border">
            <a href="/" className="text-xs text-gray-600 hover:text-brand transition-colors">← Back to site</a>
          </div>
        </aside>

        <main className="flex-1 overflow-auto p-6">
          {tab==='dashboard' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-black text-white">Dashboard</h1>
              {loading ? <div className="flex justify-center py-10"><Spinner /></div> : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Stat label="Total Users" value={d.users?.total?.toLocaleString()} sub={`+${d.users?.new_today??0} today`} color="text-brand" />
                  <Stat label="Active Tickets" value={d.bets?.active_tickets?.toLocaleString()} color="text-yellow-400" />
                  <Stat label="Deposits Today" value={fmt.mwk(d.finance?.deposits_today)} color="text-green-400" />
                  <Stat label="Withdrawals Today" value={fmt.mwk(d.finance?.withdrawals_today)} color="text-red-400" />
                  <Stat label="Pending Withdrawals" value={d.finance?.pending_withdrawals} color="text-orange-400" />
                  <Stat label="Wallet Balance" value={fmt.mwk(d.finance?.total_wallet_balance)} />
                  <Stat label="Fraud Flags" value={d.fraud?.open_flags} color={d.fraud?.open_flags>0?'text-red-400':'text-gray-400'} />
                </div>
              )}
            </div>
          )}

          {tab==='users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-white">Users</h1>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search phone or name..." className="bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white w-56 focus:outline-none focus:border-brand" />
              </div>
              {loading ? <div className="flex justify-center py-10"><Spinner /></div> : (
                <div className="card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-dark-surface border-b border-dark-border">
                      <tr>{['Phone','Name','Balance','Risk','Status','Joined',''].map(h => <th key={h} className="text-left px-3 py-3 text-xs text-gray-500 font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-dark-border">
                      {(d.users||[]).filter(u => !search||u.phone?.includes(search)||u.full_name?.toLowerCase().includes(search.toLowerCase())).map(u => (
                        <tr key={u.id} className="hover:bg-dark-hover transition-colors">
                          <td className="px-3 py-3 font-mono text-xs text-gray-400">{u.phone}</td>
                          <td className="px-3 py-3 text-white text-xs">{u.full_name}</td>
                          <td className="px-3 py-3 text-green-400 text-xs">{fmt.mwk(u.wallet?.balance)}</td>
                          <td className="px-3 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded ${u.risk_score>=70?'bg-red-900/40 text-red-400':u.risk_score>=40?'bg-yellow-900/40 text-yellow-400':'bg-dark-surface text-gray-500'}`}>{u.risk_score}</span></td>
                          <td className="px-3 py-3"><StatusBadge status={u.is_suspended?'suspended':'active'} /></td>
                          <td className="px-3 py-3 text-xs text-gray-600">{fmt.date(u.created_at)}</td>
                          <td className="px-3 py-3"><button onClick={() => handleSuspend(u.id,u.is_suspended)} className={`text-xs px-2 py-1 rounded transition-colors ${u.is_suspended?'text-green-400 hover:bg-green-900/20':'text-red-400 hover:bg-red-900/20'}`}>{u.is_suspended?'Unsuspend':'Suspend'}</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab==='tickets' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-black text-white">Tickets</h1>
              {loading ? <div className="flex justify-center py-10"><Spinner /></div> : (
                <div className="card overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-dark-surface border-b border-dark-border">
                      <tr>{['Code','User','Stake','Odds','Pot. Win','Status','Date'].map(h => <th key={h} className="text-left px-3 py-3 text-gray-500 font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-dark-border">
                      {(d.tickets||[]).map(t => (
                        <tr key={t.id} className={`hover:bg-dark-hover transition-colors ${t.status==='won'?'border-l-2 border-brand':''}`}>
                          <td className="px-3 py-3 font-mono text-brand font-bold">{t.ticket_code}</td>
                          <td className="px-3 py-3 text-gray-400">{t.user?.phone}</td>
                          <td className="px-3 py-3 text-white">{fmt.mwk(t.stake)}</td>
                          <td className="px-3 py-3 text-yellow-400 font-bold">{fmt.odds(t.total_odds)}</td>
                          <td className="px-3 py-3 text-gray-300">{fmt.mwk(t.potential_win)}</td>
                          <td className="px-3 py-3"><StatusBadge status={t.status} /></td>
                          <td className="px-3 py-3 text-gray-600">{fmt.datetime(t.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab==='withdrawals' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-black text-white">Pending Withdrawals</h1>
              {loading ? <div className="flex justify-center py-10"><Spinner /></div>
                : !(d.withdrawals?.length) ? <div className="card"><EmptyState icon="✅" title="No pending withdrawals" /></div>
                : <div className="space-y-3">{(d.withdrawals||[]).map(w => (
                  <div key={w.id} className={`card p-4 ${w.status==='flagged'?'border-red-800/50 bg-red-900/5':''}`}>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2"><span className="text-white font-bold">{fmt.mwk(w.amount)}</span><StatusBadge status={w.status} />{w.fraud_score>0&&<span className="text-xs text-orange-400">Risk: {w.fraud_score}/100</span>}</div>
                        <p className="text-sm text-gray-400">{w.user?.full_name} · {w.user?.phone}</p>
                        <p className="text-xs text-gray-500">To: {w.destination} via {w.payment_method?.toUpperCase()}</p>
                        <p className="text-xs text-gray-600">{fmt.datetime(w.created_at)}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleWithdrawal(w.id,true)} className="btn-primary text-xs py-1.5 px-3">Approve</button>
                        <button onClick={() => handleWithdrawal(w.id,false)} className="text-xs border border-red-800 text-red-400 rounded-lg px-3 py-1.5 hover:bg-red-900/20 transition-colors">Reject</button>
                      </div>
                    </div>
                  </div>
                ))}</div>}
            </div>
          )}

          {tab==='fraud' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-black text-white">Fraud Dashboard</h1>
              {loading ? <div className="flex justify-center py-10"><Spinner /></div>
                : !(d.flags?.rows?.length) ? <div className="card"><EmptyState icon="🎉" title="No active fraud flags" /></div>
                : <div className="space-y-3">{(d.flags?.rows||[]).map(flag => (
                  <div key={flag.id} className="card p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2"><span className={`text-xs font-bold ${SEV[flag.severity]||'text-gray-400'}`}>{flag.severity?.toUpperCase()}</span><code className="text-xs text-gray-500 font-mono bg-dark-surface px-1.5 py-0.5 rounded">{flag.rule_code}</code></div>
                        <p className="text-sm text-white">{flag.description}</p>
                        <p className="text-xs text-gray-400">{flag.user?.full_name} · {flag.user?.phone}</p>
                      </div>
                      <button onClick={async () => { const n=prompt('Notes:'); if(n===null) return; try { await adminAPI.resolveFraudFlag(flag.id,n); toast.success('Resolved'); load('fraud'); } catch { toast.error('Failed'); } }} className="text-xs border border-dark-border text-gray-300 rounded-lg px-3 py-1.5 hover:border-brand hover:text-brand transition-colors">Resolve</button>
                    </div>
                  </div>
                ))}</div>}
            </div>
          )}

          {tab==='bonus' && (
            <div className="space-y-5">
              <h1 className="text-2xl font-black text-white">Bonus Management</h1>
              <div className="card p-5">
                <h3 className="text-white font-semibold mb-4">Assign Free Bet</h3>
                <form onSubmit={async e => { e.preventDefault(); const fd=new FormData(e.target); try { await adminAPI.assignFreeBet({user_id:fd.get('user_id'),amount:parseFloat(fd.get('amount')),expiry_days:parseInt(fd.get('days'))}); toast.success('Free bet assigned!'); e.target.reset(); } catch { toast.error('Failed'); } }} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input name="user_id" required placeholder="User ID (UUID)" className="bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
                  <input name="amount" type="number" min="100" required placeholder="Amount (MWK)" className="bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
                  <input name="days" type="number" min="1" max="30" defaultValue="7" placeholder="Expiry days" className="bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
                  <button type="submit" className="btn-primary text-sm">Assign Free Bet</button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
