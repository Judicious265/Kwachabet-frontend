import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore, useBetSlipStore } from '../../store';

const NAV_LINKS = [
  { href: '/',           label: 'Sports',     icon: '⚽', active: true },
  { href: '/live',       label: 'Live',       icon: '🔴', live: true },
  { href: '/casino',     label: 'Casino',     icon: '🎰' },
  { href: '/aviator',    label: 'Aviator',    icon: '✈️' },
  { href: '/virtuals',   label: 'Virtuals',   icon: '🎮' },
  { href: '/promotions', label: 'Promotions', icon: '🎁' },
];

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { selections } = useBetSlipStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(10,20,12,0.98)' : '#0a140c',
          borderBottom: '1px solid rgba(0,200,83,0.15)',
          backdropFilter: 'blur(12px)',
        }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-black text-lg"
              style={{ background: '#00c853' }}>K</div>
            <span className="text-white font-black text-xl hidden sm:block">
              Kwacha<span style={{ color: '#00c853' }}>Bet</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => {
              const isActive = router.pathname === link.href;
              return (
                <Link key={link.href} href={link.href}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all relative"
                  style={{
                    color: isActive ? '#00c853' : 'rgba(255,255,255,0.75)',
                    background: isActive ? 'rgba(0,200,83,0.1)' : 'transparent',
                  }}>
                  {link.live && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  )}
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                      style={{ background: '#00c853' }} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              🔍
            </button>

            {/* Promotions shortcut */}
            <Link href="/promotions"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ color: '#ffd700', background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)' }}>
              🎁 Promos
            </Link>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                {/* Bet slip count */}
                {selections.length > 0 && (
                  <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-white"
                    style={{ background: 'rgba(0,200,83,0.15)', border: '1px solid rgba(0,200,83,0.3)' }}>
                    🎯
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center text-black"
                      style={{ background: '#00c853' }}>{selections.length}</span>
                  </button>
                )}
                {/* Wallet */}
                <Link href="/wallet"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                  style={{ background: 'rgba(0,200,83,0.12)', border: '1px solid rgba(0,200,83,0.25)', color: '#00c853' }}>
                  💰 Wallet
                </Link>
                {/* Avatar */}
                <div className="relative group">
                  <button className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-black"
                    style={{ background: '#00c853' }}>
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 top-12 w-44 rounded-xl border py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
                    style={{ background: '#0f1f12', border: '1px solid rgba(0,200,83,0.2)', zIndex: 100 }}>
                    <div className="px-3 py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                      <p className="text-white text-xs font-semibold truncate">{user.full_name}</p>
                      <p className="text-gray-500 text-xs font-mono">{user.phone}</p>
                    </div>
                    <Link href="/wallet" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-all">💰 My Wallet</Link>
                    <Link href="/bets" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-all">🎯 My Bets</Link>
                    <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-all">👤 Profile</Link>
                    <button onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-900/20 transition-all border-t"
                      style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all">
                  Login
                </Link>
                <Link href="/register"
                  className="px-4 py-2 rounded-lg text-sm font-bold text-black transition-all hover:-translate-y-px hover:shadow-lg"
                  style={{ background: '#00c853', boxShadow: '0 4px 15px rgba(0,200,83,0.3)' }}>
                  Join Free
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t px-4 py-3" style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#0a140c' }}>
            <div className="max-w-lg mx-auto relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
              <input
                autoFocus
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search matches, teams, leagues..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <button onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs">
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t" style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#0a140c' }}>
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map(link => {
                const isActive = router.pathname === link.href;
                return (
                  <Link key={link.href} href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      color: isActive ? '#00c853' : 'rgba(255,255,255,0.75)',
                      background: isActive ? 'rgba(0,200,83,0.1)' : 'transparent',
                    }}>
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                    {link.live && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse ml-auto" />}
                  </Link>
                );
              })}
              {isAuthenticated ? (
                <>
                  <Link href="/wallet" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold"
                    style={{ color: '#00c853', background: 'rgba(0,200,83,0.1)' }}>
                    💰 My Wallet
                  </Link>
                  <button onClick={() => { logout(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400">
                    🚪 Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link href="/login" onClick={() => setMenuOpen(false)}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-center border border-white/20 text-white">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-center text-black"
                    style={{ background: '#00c853' }}>
                    Join Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
