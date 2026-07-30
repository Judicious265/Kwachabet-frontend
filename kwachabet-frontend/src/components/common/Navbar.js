import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore, useBetSlipStore } from '../../store';

const NAV_LINKS = [
  { href: '/',           label: 'Sports',     icon: '⚽' },
  { href: '/live',       label: 'Live',       icon: '🔴', live: true },
  { href: '/casino',     label: 'Casino',     icon: '🎰' },
  { href: '/aviator',    label: 'Aviator',    icon: '✈️' },
  { href: '/virtuals',   label: 'Virtuals',   icon: '🎮' },
  { href: '/promotions', label: 'Promotions', icon: '🎁' },
];

// Mobile bottom nav items
const BOTTOM_NAV = [
  { href: '/',           label: 'Sports',   icon: '⚽' },
  { href: '/live',       label: 'Live',     icon: '🔴', live: true },
  { href: '/promotions', label: 'Promos',   icon: '🎁' },
  { href: '/wallet',     label: 'Wallet',   icon: '💰', authOnly: true },
  { href: '/login',      label: 'Account',  icon: '👤', guestOnly: true },
];

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { selections } = useBetSlipStore();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [router.pathname]);

  return (
    <>
      {/* ── Top Navbar ────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background:    scrolled ? 'rgba(10,20,12,0.98)' : '#0a140c',
          borderBottom:  '1px solid rgba(0,200,83,0.15)',
          backdropFilter:'blur(12px)',
        }}>
        <div className="px-3 md:px-6 h-14 md:h-16 flex items-center justify-between gap-2 max-w-7xl mx-auto">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center font-black text-black text-base md:text-lg"
              style={{ background: '#00c853' }}>K</div>
            <span className="text-white font-black text-lg md:text-xl">
              Kwacha<span style={{ color: '#00c853' }}>Bet</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => {
              const isActive = router.pathname === link.href;
              return (
                <Link key={link.href} href={link.href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all relative"
                  style={{
                    color:      isActive ? '#00c853' : 'rgba(255,255,255,0.75)',
                    background: isActive ? 'rgba(0,200,83,0.1)' : 'transparent',
                  }}>
                  {link.live && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                      style={{ background: '#00c853' }} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Search — hidden on mobile to save space */}
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="hidden md:flex w-9 h-9 rounded-lg items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              🔍
            </button>

            {/* Promos — desktop only */}
            <Link href="/promotions"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ color: '#ffd700', background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)' }}>
              🎁 Promos
            </Link>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-1.5">
                {/* Bet slip badge */}
                {selections.length > 0 && (
                  <div className="relative">
                    <button className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
                      style={{ background: 'rgba(0,200,83,0.15)', border: '1px solid rgba(0,200,83,0.3)' }}>
                      🎯
                    </button>
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center text-black"
                      style={{ background: '#00c853' }}>{selections.length}</span>
                  </div>
                )}

                {/* Wallet — desktop */}
                <Link href="/wallet"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold"
                  style={{ background: 'rgba(0,200,83,0.12)', border: '1px solid rgba(0,200,83,0.25)', color: '#00c853' }}>
                  💰 Wallet
                </Link>

                {/* Avatar with dropdown — desktop */}
                <div className="hidden md:block relative group">
                  <button className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-black"
                    style={{ background: '#00c853' }}>
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </button>
                  <div className="absolute right-0 top-11 w-44 rounded-xl border py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
                    style={{ background: '#0f1f12', border: '1px solid rgba(0,200,83,0.2)', zIndex: 100 }}>
                    <div className="px-3 py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                      <p className="text-white text-xs font-semibold truncate">{user.full_name}</p>
                      <p className="text-gray-500 text-xs font-mono">{user.phone}</p>
                    </div>
                    {[
                      { href: '/wallet',  icon: '💰', label: 'My Wallet' },
                      { href: '/bets',    icon: '🎯', label: 'My Bets' },
                      { href: '/profile', icon: '👤', label: 'Profile' },
                    ].map(item => (
                      <Link key={item.href} href={item.href}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                        {item.icon} {item.label}
                      </Link>
                    ))}
                    <button onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-900/20 transition-all border-t"
                      style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link href="/login"
                  className="hidden md:flex px-4 py-2 rounded-lg text-sm font-semibold text-white border border-white/20 hover:border-white/40 transition-all">
                  Login
                </Link>
                <Link href="/register"
                  className="px-4 py-2 rounded-lg text-sm font-bold text-black transition-all"
                  style={{ background: '#00c853', boxShadow: '0 4px 15px rgba(0,200,83,0.3)' }}>
                  Join Free
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all text-lg">
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t px-4 py-3" style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#0a140c' }}>
            <div className="max-w-lg mx-auto relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
              <input autoFocus value={searchVal} onChange={e => setSearchVal(e.target.value)}
                placeholder="Search matches, teams, leagues..."
                className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <button onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">✕</button>
            </div>
          </div>
        )}

        {/* Mobile slide-down menu */}
        {menuOpen && (
          <div className="lg:hidden border-t" style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#0a140c' }}>
            {/* Search on mobile */}
            <div className="px-3 pt-3 pb-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
                <input value={searchVal} onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search matches..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>
            </div>
            <div className="px-3 py-2 grid grid-cols-2 gap-1.5">
              {NAV_LINKS.map(link => {
                const isActive = router.pathname === link.href;
                return (
                  <Link key={link.href} href={link.href}
                    className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      color:      isActive ? '#00c853' : 'rgba(255,255,255,0.8)',
                      background: isActive ? 'rgba(0,200,83,0.1)' : 'rgba(255,255,255,0.04)',
                      border:     isActive ? '1px solid rgba(0,200,83,0.3)' : '1px solid rgba(255,255,255,0.06)',
                    }}>
                    <span className="text-base">{link.icon}</span>
                    <span>{link.label}</span>
                    {link.live && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                  </Link>
                );
              })}
            </div>
            {isAuthenticated ? (
              <div className="px-3 pb-3 flex gap-2">
                <Link href="/wallet"
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-center"
                  style={{ background: 'rgba(0,200,83,0.12)', border: '1px solid rgba(0,200,83,0.3)', color: '#00c853' }}>
                  💰 My Wallet
                </Link>
                <button onClick={logout}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-center text-red-400"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className="px-3 pb-3 flex gap-2">
                <Link href="/login"
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-center text-white"
                  style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                  Login
                </Link>
                <Link href="/register"
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-center text-black"
                  style={{ background: '#00c853' }}>
                  Join Free
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* ── Mobile Bottom Navigation ───────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
        style={{ background: 'rgba(10,20,12,0.98)', borderColor: 'rgba(0,200,83,0.15)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center justify-around px-2 py-1.5">
          {BOTTOM_NAV.map(item => {
            if (item.authOnly && !isAuthenticated) return null;
            if (item.guestOnly && isAuthenticated) return null;
            const isActive = router.pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative"
                style={{ minWidth: '52px' }}>
                <span className={`text-xl relative ${isActive ? 'scale-110' : 'opacity-60'} transition-all`}>
                  {item.icon}
                  {item.live && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                  {item.label === 'Account' && isAuthenticated && user && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-black"
                      style={{ background: '#00c853', fontSize: '9px' }}>
                      {user.full_name ? user.full_name.charAt(0) : 'U'}
                    </span>
                  )}
                </span>
                <span className="text-xs font-semibold transition-all"
                  style={{ color: isActive ? '#00c853' : 'rgba(255,255,255,0.45)', fontSize: '10px' }}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: '#00c853' }} />
                )}
              </Link>
            );
          })}
        </div>
        {/* Safe area for iPhone */}
        <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
      </div>

      {/* Bottom nav spacer on mobile */}
      <div className="lg:hidden" style={{ height: '60px' }} />
    </>
  );
}
