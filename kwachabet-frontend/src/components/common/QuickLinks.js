import Link from 'next/link';
import { useRouter } from 'next/router';

const LINKS = [
  { href: '/',           icon: '🏆', label: 'Top',      sub: 'Top Matches',  color: '#00c853', bg: 'rgba(0,200,83,0.12)'   },
  { href: '/live',       icon: '📡', label: 'Live',     sub: 'Live Now',     color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  live: true },
  { href: '/promotions', icon: '⚡', label: 'Boosts',   sub: 'Odds Boost',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { href: '/#acca',      icon: '📋', label: 'Acca',     sub: 'Accumulator',  color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  { href: '/casino',     icon: '🎰', label: 'Casino',   sub: 'Slots & more', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  { href: '/aviator',    icon: '✈️', label: 'Aviator',  sub: 'Fly & win',    color: '#ff6a00', bg: 'rgba(255,106,0,0.12)'  },
];

export default function QuickLinks() {
  const router = useRouter();
  return (
    <section style={{ background: '#0a140c', borderBottom: '1px solid rgba(0,200,83,0.1)' }}>
      <div className="max-w-7xl mx-auto px-3 py-2.5">
        {/* Mobile — horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-1 md:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {LINKS.map(link => {
            const active = router.pathname === link.href.split('#')[0];
            return (
              <Link key={link.href} href={link.href}
                className="flex-shrink-0 flex flex-col items-center gap-1 py-2.5 px-3.5 rounded-xl border transition-all"
                style={{
                  background:  active ? link.bg : 'rgba(255,255,255,0.04)',
                  borderColor: active ? link.color + '50' : 'rgba(255,255,255,0.07)',
                  minWidth: '70px',
                }}>
                <div className="relative w-9 h-9 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: link.bg }}>
                  {link.icon}
                  {link.live && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 animate-pulse"
                      style={{ background: '#ef4444', borderColor: '#0a140c' }} />
                  )}
                </div>
                <span className="text-xs font-bold" style={{ color: active ? link.color : 'rgba(255,255,255,0.8)' }}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Desktop — grid */}
        <div className="hidden md:grid grid-cols-6 gap-2">
          {LINKS.map(link => {
            const active = router.pathname === link.href.split('#')[0];
            return (
              <Link key={link.href} href={link.href}
                className="flex items-center gap-3 py-3 px-3 rounded-xl border transition-all hover:-translate-y-0.5"
                style={{
                  background:  active ? link.bg : 'rgba(255,255,255,0.03)',
                  borderColor: active ? link.color + '50' : 'rgba(255,255,255,0.07)',
                }}>
                <div className="relative w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: link.bg }}>
                  {link.icon}
                  {link.live && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 animate-pulse"
                      style={{ background: '#ef4444', borderColor: '#0a140c' }} />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: active ? link.color : '#fff' }}>{link.label}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{link.sub}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
