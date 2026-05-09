import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore, useWalletStore, useBetSlipStore } from '../../store';
import { walletAPI } from '../../utils/api';
import { fmt } from '../../utils/helpers';

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { balance, setWallet } = useWalletStore();
  const { selections } = useBetSlipStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) walletAPI.getBalance().then(r => setWallet(r.data)).catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const navLinks = [
    { href: '/', label: 'Sports' },
    { href: '/live', label: 'Live', live: true },
    { href: '/results', label: 'Results' },
    { href: '/promotions', label: 'Promotions' },
    { href: '/tickets', label: 'My Tickets', auth: true },
  ];

  return (
    <nav className="bg-dark-surface border-b border-dark-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center shadow-lg shadow-brand/20">
              <span className="text-black font-black text-sm">K</span>
            </div>
            <span className="text-white font-black text-lg tracking-tight hidden sm:block">
              Kwacha<span className="text-brand">Bet</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map(link => {
              if (link.auth && !isAuthenticated) return null;
              const active = router.pathname === link.href;
              return (
                <Link key={link.href} href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${active ? 'bg-brand/10 text-brand' : 'text-gray-400 hover:text-white hover:bg-dark-hover'}`}>
                  {link.live && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link href="/wallet" className="hidden sm:flex items-center gap-2 bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 hover:border-brand/50 transition-colors">
                  <div className="w-1.5 h-1.5 bg-brand rounded-full" />
                  <span className="text-white font-bold text-sm">{fmt.mwk(balance)}</span>
                </Link>
                <Link href="/wallet?tab=deposit" className="btn-primary text-sm py-2 px-3 hidden sm:flex">+ Deposit</Link>
                {selections.length > 0 && (
                  <Link href="/betslip" className="relative flex items-center gap-1.5 bg-brand text-black font-bold rounded-lg px-3 py-2 text-sm">
                    🎯
                    <span className="bg-black/20 text-black text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">{selections.length}</span>
                  </Link>
                )}
                <div className="relative" ref={menuRef}>
                  <button onClick={() => setMenuOpen(!menuOpen)}
                    className="w-9 h-9 bg-brand/20 border border-brand/30 rounded-full flex items-center justify-center hover:border-brand/60 transition-colors">
                    <span className="text-brand text-xs font-black">{fmt.initials(user?.full_name)}</span>
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-dark-card border border-dark-border rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-up">
                      <div className="px-4 py-3 border-b border-dark-border bg-dark-surface">
                        <p className="text-white font-semibold text-sm truncate">{user?.full_name}</p>
                        <p className="text-gray-500 text-xs">{user?.phone}</p>
                        <p className="text-brand text-xs font-bold mt-0.5">{fmt.mwk(balance)}</p>
                      </div>
                      <div className="py-1">
                        {[{h:'/wallet',l:'💰 My Wallet'},{h:'/tickets',l:'🎯 My Tickets'},{h:'/profile',l:'👤 Profile & PIN'},{h:'/referral',l:'🎁 Refer & Earn'},{h:'/promotions',l:'🏆 Promotions'}].map(item => (
                          <Link key={item.h} href={item.h}
                            className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-dark-hover transition-colors"
                            onClick={() => setMenuOpen(false)}>{item.l}</Link>
                        ))}
                        {user?.is_admin && (
                          <Link href="/admin" className="block px-4 py-2.5 text-sm text-brand hover:bg-dark-hover border-t border-dark-border" onClick={() => setMenuOpen(false)}>⚙️ Admin Panel</Link>
                        )}
                        <button onClick={() => { setMenuOpen(false); logout(); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/10 border-t border-dark-border">🚪 Logout</button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">Login</Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-4">Join Free</Link>
              </>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-dark-border hover:border-gray-500 transition-colors">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-dark-border py-3 space-y-1 animate-slide-up">
            {isAuthenticated && (
              <div className="flex items-center justify-between px-2 py-2 mb-2 bg-dark-card rounded-lg">
                <span className="text-gray-400 text-sm">Balance</span>
                <span className="text-brand font-bold text-sm">{fmt.mwk(balance)}</span>
              </div>
            )}
            {navLinks.map(link => {
              if (link.auth && !isAuthenticated) return null;
              return (
                <Link key={link.href} href={link.href}
                  className="flex items-center gap-2 px-2 py-2.5 text-sm text-gray-300 hover:text-white rounded-lg hover:bg-dark-hover"
                  onClick={() => setMobileOpen(false)}>
                  {link.live && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
                  {link.label}
                </Link>
              );
            })}
            {!isAuthenticated ? (
              <div className="flex gap-2 pt-2">
                <Link href="/login" className="btn-ghost flex-1 text-sm py-2" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link href="/register" className="btn-primary flex-1 text-sm py-2" onClick={() => setMobileOpen(false)}>Join Free</Link>
              </div>
            ) : (
              <div className="pt-2 flex gap-2">
                <Link href="/wallet?tab=deposit" className="btn-primary flex-1 text-sm py-2" onClick={() => setMobileOpen(false)}>+ Deposit</Link>
                <button onClick={() => { setMobileOpen(false); logout(); }} className="btn-ghost flex-1 text-sm py-2 !text-red-400 !border-red-900">Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
