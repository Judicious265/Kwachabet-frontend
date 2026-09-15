import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore, useWalletStore, useBetSlipStore } from '../../store';
import { walletAPI } from '../../utils/api';

const NAV_LINKS = [
  { href: '/',           label: 'Sports',    icon: '⚽' },
  { href: '/live',       label: 'Live',      icon: '🔴', live: true },
  { href: '/casino',     label: 'Casino',    icon: '🎰' },
  { href: '/aviator',    label: 'Aviator',   icon: '✈️' },
  { href: '/virtuals',   label: 'Virtuals',  icon: '🎮' },
  { href: '/promotions', label: 'Promotions',icon: '🎁' },
  { href: '/jackpot',    label: 'Jackpot',   icon: '💰' },
];

const BOTTOM_NAV = [
  { href: '/',           label: 'Sports',  icon: '⚽' },
  { href: '/live',       label: 'Live',    icon: '🔴', live: true },
  { href: '/promotions', label: 'Promos',  icon: '🎁' },
  { href: '/jackpot',    label: 'Jackpot', icon: '💰' },
  { href: '/profile',    label: 'Account', icon: '👤', authOnly: true },
  { href: '/login',      label: 'Login',   icon: '👤', guestOnly: true },
];

function formatBalance(val) {
  return parseFloat(val || 0).toLocaleString('en-MW', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { balance, setWallet }            = useWalletStore();
  const { selections }                    = useBetSlipStore();

  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchVal,    setSearchVal]    = useState('');
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const profileRef = useRef(null);

  // Fetch wallet balance when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    walletAPI.getBalance()
      .then(r => setWallet(r.data))
      .catch(() => {});
  }, [isAuthenticated]);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setNotifOpen(false);
  }, [router.pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (href) => {
    if (href === '/') return router.pathname === '/';
    return router.pathname.startsWith(href);
  };

  return (
    <>
      {/* ── TOP NAVBAR ─────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 w-full transition-all duration-200"
        style={{
          background:     scrolled ? 'rgba(6,13,10,0.98)' : '#060D0A',
          borderBottom:   '1px solid #1E3024',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none flex-shrink-0 mr-1">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-xs"
                style={{ background: '#00E664' }}
              >
                KB
              </div>
              <span className="font-black text-white text-base tracking-tight hidden sm:block">
                Kwacha<span style={{ color: '#00E664' }}>Bet</span>
              </span>
            </div>
            <span
              className="hidden sm:block text-xs ml-10"
              style={{ color: '#4A6B56', marginTop: '-1px', fontSize: 10 }}
            >
              Bet Smart. Win More.
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1">
            {NAV_LINKS.map(link => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5"
                  style={{
                    color:      active ? '#00E664' : '#8A9E97',
                    background: active ? 'rgba(0,230,100,0.08)' : 'transparent',
                  }}
                >
                  {link.live && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                  )}
                  {link.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                      style={{ background: '#00E664' }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1.5 ml-auto">

            {/* Search */}
            <button
              onClick={() => setSearchOpen(s => !s)}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
              style={{ color: '#8A9E97' }}
              aria-label="Search"
            >
              🔍
            </button>

            {isAuthenticated && user ? (
              <>
                {/* Wallet balance */}
                <Link
                  href="/wallet"
                  className="hidden md:flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-bold transition-all"
                  style={{ background: '#0D1911', border: '1px solid #1E3024', color: '#00E664' }}
                >
                  <span style={{ color: '#4A6B56', fontSize: 10 }}>MWK</span>
                  <span>{formatBalance(balance)}</span>
                </Link>

                {/* Deposit button */}
                <Link
                  href="/wallet?tab=deposit"
                  className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg text-lg font-black text-black transition-all hover:brightness-110"
                  style={{ background: '#00E664' }}
                  aria-label="Deposit"
                >
                  +
                </Link>

                {/* Promos icon */}
                <Link
                  href="/promotions"
                  className="w-9 h-9 rounded-lg hidden md:flex items-center justify-center text-lg transition-all"
                  style={{ color: '#8A9E97' }}
                  aria-label="Promotions"
                >
                  🎁
                </Link>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen(n => !n)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg relative transition-all"
                    style={{ color: '#8A9E97' }}
                    aria-label="Notifications"
                  >
                    🔔
                    <span
                      className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2"
                      style={{ background: '#EF4444', borderColor: '#060D0A' }}
                    />
                  </button>
                  {notifOpen && (
                    <div
                      className="absolute right-0 top-11 w-64 rounded-xl border py-2 z-50"
                      style={{ background: '#0D1911', borderColor: '#1E3024' }}
                    >
                      <p
                        className="px-4 pb-2 text-xs font-bold text-white border-b mb-1"
                        style={{ borderColor: '#1E3024' }}
                      >
                        Notifications
                      </p>
                      <div className="px-4 py-5 text-center text-xs" style={{ color: '#4A6B56' }}>
                        No new notifications
                      </div>
                    </div>
                  )}
                </div>

                {/* Bet slip count */}
                {selections.length > 0 && (
                  <Link
                    href="/betslip"
                    className="relative w-9 h-9 rounded-lg flex items-center justify-center text-lg lg:hidden"
                    style={{ background: 'rgba(0,230,100,0.12)', border: '1px solid rgba(0,230,100,0.25)' }}
                  >
                    🎯
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-black font-black flex items-center justify-center"
                      style={{ background: '#00E664', fontSize: 9 }}
                    >
                      {selections.length}
                    </span>
                  </Link>
                )}

                {/* Avatar dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(p => !p)}
                    className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-black transition-all hover:brightness-110"
                    style={{ background: '#00E664' }}
                    aria-label="Profile"
                  >
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </button>

                  {profileOpen && (
                    <div
                      className="absolute right-0 top-11 w-52 rounded-xl border z-50 overflow-hidden"
                      style={{ background: '#0D1911', borderColor: '#1E3024' }}
                    >
                      <div className="px-4 py-3 border-b" style={{ borderColor: '#1E3024' }}>
                        <p className="text-white text-xs font-bold truncate">{user.full_name}</p>
                        <p className="text-xs font-mono mt-0.5" style={{ color: '#4A6B56' }}>{user.phone}</p>
                        <p className="text-xs font-bold mt-1" style={{ color: '#00E664' }}>
                          MWK {formatBalance(balance)}
                        </p>
                      </div>
                      <div className="py-1">
                        {[
                          { href: '/wallet',   label: '💰  My Wallet' },
                          { href: '/bets',     label: '🎯  My Bets' },
                          { href: '/profile',  label: '👤  Profile & PIN' },
                          { href: '/referral', label: '🎁  Refer & Earn' },
                        ].map(item => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-2.5 text-xs transition-all hover:bg-white/5"
                            style={{ color: '#8A9E97' }}
                          >
                            {item.label}
                          </Link>
                        ))}
                        <button
                          onClick={() => { setProfileOpen(false); logout(); }}
                          className="w-full text-left px-4 py-2.5 text-xs border-t transition-all hover:bg-red-900/20"
                          style={{ color: '#EF4444', borderColor: '#1E3024' }}
                        >
                          🚪  Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:flex px-4 h-9 rounded-lg items-center text-sm font-semibold border transition-all hover:border-white/30"
                  style={{ color: '#8A9E97', borderColor: '#1E3024' }}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex px-4 h-9 rounded-lg items-center text-sm font-bold text-black transition-all hover:brightness-110"
                  style={{ background: '#00E664' }}
                >
                  Join free
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-xl"
              style={{ color: '#8A9E97' }}
              aria-label="Menu"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t px-4 py-2.5" style={{ borderColor: '#1E3024', background: '#060D0A' }}>
            <div className="max-w-xl mx-auto relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#4A6B56' }}>🔍</span>
              <input
                autoFocus
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search matches, teams, leagues…"
                className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm text-white outline-none"
                style={{ background: '#0D1911', border: '1px solid #1E3024' }}
              />
              <button
                onClick={() => { setSearchOpen(false); setSearchVal(''); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: '#4A6B56' }}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t" style={{ borderColor: '#1E3024', background: '#060D0A' }}>
            {/* Balance row on mobile */}
            {isAuthenticated && user && (
              <div
                className="px-4 py-3 flex items-center justify-between border-b"
                style={{ borderColor: '#1E3024' }}
              >
                <div>
                  <p className="text-xs" style={{ color: '#4A6B56' }}>Balance</p>
                  <p className="text-sm font-bold" style={{ color: '#00E664' }}>
                    MWK {formatBalance(balance)}
                  </p>
                </div>
                <Link
                  href="/wallet?tab=deposit"
                  className="px-4 py-2 rounded-lg text-sm font-bold text-black"
                  style={{ background: '#00E664' }}
                  onClick={() => setMobileOpen(false)}
                >
                  + Deposit
                </Link>
              </div>
            )}

            {/* Nav links grid */}
            <div className="grid grid-cols-2 gap-1.5 p-3">
              {NAV_LINKS.map(link => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-semibold border transition-all"
                    style={{
                      color:       active ? '#00E664' : '#8A9E97',
                      background:  active ? 'rgba(0,230,100,0.08)' : 'rgba(255,255,255,0.03)',
                      borderColor: active ? 'rgba(0,230,100,0.3)' : '#1E3024',
                    }}
                  >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                    {link.live && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Auth buttons */}
            {!isAuthenticated ? (
              <div className="px-3 pb-3 flex gap-2">
                <Link
                  href="/login"
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-center text-white border"
                  style={{ borderColor: '#1E3024' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-center text-black"
                  style={{ background: '#00E664' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Join free
                </Link>
              </div>
            ) : (
              <div className="px-3 pb-3">
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="w-full py-3 rounded-xl text-sm font-semibold border text-center"
                  style={{ color: '#EF4444', borderColor: '#1E3024' }}
                >
                  🚪 Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── MOBILE BOTTOM NAV ──────────────────────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
        style={{
          background:     'rgba(6,13,10,0.98)',
          borderColor:    '#1E3024',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center justify-around px-1 py-1.5">
          {BOTTOM_NAV.map(item => {
            if (item.authOnly  && !isAuthenticated) return null;
            if (item.guestOnly && isAuthenticated)  return null;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all relative"
                style={{ minWidth: 48 }}
              >
                {active && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                    style={{ background: '#00E664' }}
                  />
                )}
                <span
                  className="text-xl transition-all"
                  style={{
                    opacity:   active ? 1 : 0.45,
                    transform: active ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {item.icon}
                  {item.live && (
                    <span
                      className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"
                    />
                  )}
                </span>
                <span
                  className="font-semibold"
                  style={{
                    fontSize: 10,
                    color: active ? '#00E664' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Bet slip badge */}
          {isAuthenticated && selections.length > 0 && (
            <Link
              href="/betslip"
              className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl relative"
              style={{ minWidth: 48 }}
            >
              <span className="text-xl">🎯</span>
              <span
                className="absolute top-0.5 right-1 w-4 h-4 rounded-full flex items-center justify-center font-black text-black"
                style={{ background: '#00E664', fontSize: 9 }}
              >
                {selections.length}
              </span>
              <span className="font-semibold" style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                Slip
              </span>
            </Link>
          )}
        </div>
        <div style={{ height: 'env(safe-area-inset-bottom,0px)' }} />
      </nav>

      {/* Bottom nav spacer */}
      <div className="lg:hidden" style={{ height: 64 }} />
    </>
  );
}
