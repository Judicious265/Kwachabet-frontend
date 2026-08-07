import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const DEFAULT_SLIDES = [
  {
    id: 0,
    bg: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1400&q=80&fit=crop',
    badge: '🟢 Live Betting',
    badgeColor: '#00c853',
    headline: 'Bet Smarter.',
    accent: 'Win More.',
    sub: "Malawi's #1 Sports Betting Platform",
    detail: 'Airtel Money · TNM Mpamba · Instant Payouts',
    league: 'TNM Super League · Today',
    match: 'Nyasa Big Bullets vs Mighty Wanderers',
    promo: 'Odds Boost',
    promoVal: '+20%',
    cta: 'Join Free',
    ctaHref: '/register',
    cta2: 'Deposit Now',
    cta2Href: '/wallet',
    accentColor: '#00c853',
    odds: [
      { label: '1', val: '1.50', name: 'Bullets' },
      { label: 'X', val: '3.51', name: 'Draw' },
      { label: '2', val: '2.51', name: 'Wanderers' },
    ],
  },
  {
    id: 1,
    bg: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1400&q=80&fit=crop',
    badge: '⚽ Premier League',
    badgeColor: '#3b82f6',
    headline: 'Premier League',
    accent: 'Weekend Special.',
    sub: 'Best odds on all EPL matches',
    detail: 'Bet on your favourite English teams',
    league: 'Premier League · Weekend',
    match: 'Manchester United vs Liverpool',
    promo: 'Odds Boost',
    promoVal: '+20%',
    cta: 'Bet Now',
    ctaHref: '/sports',
    cta2: 'All Markets',
    cta2Href: '/sports',
    accentColor: '#3b82f6',
    isLive: true,
    odds: [
      { label: '1', val: '3.20', name: 'Man Utd' },
      { label: 'X', val: '3.50', name: 'Draw' },
      { label: '2', val: '2.10', name: 'Liverpool' },
    ],
  },
  {
    id: 2,
    bg: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1400&q=80&fit=crop',
    badge: '🏆 Champions League',
    badgeColor: '#f59e0b',
    headline: 'UEFA Champions',
    accent: 'League.',
    sub: "Europe's biggest competition",
    detail: 'Best odds guaranteed on all UCL matches',
    league: 'UCL · Quarter Final',
    match: 'Real Madrid vs Bayern Munich',
    promo: 'Best Odds',
    promoVal: 'Guaranteed',
    cta: 'Bet Now',
    ctaHref: '/sports',
    cta2: 'UCL Markets',
    cta2Href: '/sports',
    accentColor: '#f59e0b',
    odds: [
      { label: '1', val: '2.05', name: 'Real Madrid' },
      { label: 'X', val: '3.80', name: 'Draw' },
      { label: '2', val: '3.40', name: 'Bayern' },
    ],
  },
  {
    id: 3,
    bg: 'https://images.unsplash.com/photo-1607457561901-e6ec3a6d16cf?w=1400&q=80&fit=crop',
    badge: '💰 Mega Jackpot',
    badgeColor: '#ffd700',
    headline: 'Win up to',
    accent: 'MWK 50,000,000',
    sub: 'KwachaBet Mega Jackpot',
    detail: 'Pick all winners · New jackpot every week',
    league: 'Mega Jackpot · This Week',
    match: 'MWK 50,000,000 Prize Pool',
    promo: 'Entry from',
    promoVal: 'MWK 200',
    cta: 'Join Today',
    ctaHref: '/jackpot',
    cta2: 'How It Works',
    cta2Href: '/jackpot',
    accentColor: '#ffd700',
    isJackpot: true,
  },
  {
    id: 4,
    bg: 'https://images.unsplash.com/photo-1551958219-acbc595b5de6?w=1400&q=80&fit=crop',
    badge: '🎁 Weekend Bonus',
    badgeColor: '#00c853',
    headline: 'Weekend Acca',
    accent: 'Bonus.',
    sub: '15% bonus on 5+ selections',
    detail: 'Auto-applied every weekend · No code needed',
    league: 'Accumulator Bonus',
    match: '15% Bonus on 5+ Selections',
    promo: 'Max bonus',
    promoVal: 'MWK 500,000',
    cta: 'Build Acca',
    ctaHref: '/sports',
    cta2: 'View Fixtures',
    cta2Href: '/sports',
    accentColor: '#00c853',
  },
];

export default function HeroSlideshow() {
  const [slides] = useState(DEFAULT_SLIDES);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const [jackpotTime, setJackpotTime] = useState(7473);
  const [imgErrors, setImgErrors] = useState({});

  const goTo = (n) => {
    setCurrent((n + slides.length) % slides.length);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length);
    }, 5000);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  useEffect(() => {
    const t = setInterval(() => setJackpotTime(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  if (!slides.length) return null;
  const slide = slides[current];

  // Fallback gradient backgrounds if image fails
  const FALLBACK_BG = [
    'linear-gradient(135deg, #0a2e12 0%, #1a4a1e 50%, #0a2e12 100%)',
    'linear-gradient(135deg, #0a0e2e 0%, #1a1e4a 50%, #0a0e2e 100%)',
    'linear-gradient(135deg, #2e1a0a 0%, #4a2e1a 50%, #2e1a0a 100%)',
    'linear-gradient(135deg, #2e2a0a 0%, #4a421a 50%, #2e2a0a 100%)',
    'linear-gradient(135deg, #0a2e12 0%, #1a4a1e 50%, #0a2e12 100%)',
  ];

  return (
    <section className="relative w-full overflow-hidden"
      style={{ height: 'clamp(400px, 55vw, 540px)', background: '#0a140c' }}>

      {/* Backgrounds */}
      {slides.map((s, i) => (
        <div key={s.id} className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: 0 }}>
          {/* Real photo bg */}
          {!imgErrors[i] ? (
            <div className="absolute inset-0">
              <img
                src={s.bg}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'brightness(0.35) blur(1px)', transform: 'scale(1.05)' }}
                onError={() => setImgErrors(prev => ({ ...prev, [i]: true }))}
              />
            </div>
          ) : (
            // Fallback gradient if image fails to load
            <div className="absolute inset-0" style={{ background: FALLBACK_BG[i] }} />
          )}
          {/* Dark overlay */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(160deg,rgba(0,0,0,0.9) 0%,rgba(0,0,0,0.55) 55%,rgba(0,0,0,0.3) 100%)',
          }} />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-20"
            style={{ background: 'linear-gradient(to top,rgba(10,20,12,0.95),transparent)' }} />
          {/* Accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5"
            style={{ background: s.accentColor, opacity: 0.6 }} />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center" style={{ zIndex: 2 }}>
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-12 flex items-center gap-8 lg:gap-16">

          {/* Left — main content */}
          <div className="flex-1 min-w-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold mb-3"
              style={{
                color:       slide.accentColor,
                borderColor: slide.accentColor + '55',
                background:  slide.accentColor + '18',
              }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: slide.accentColor }} />
              {slide.badge}
            </div>

            {/* Headline */}
            <h1 className="font-black leading-none mb-2 text-white"
              style={{ fontSize: 'clamp(26px, 5.5vw, 54px)', letterSpacing: '-0.02em' }}>
              {slide.headline}<br />
              <span style={{ color: slide.accentColor }}>{slide.accent}</span>
            </h1>

            {/* Subtext */}
            <p className="font-medium mb-1 text-white/75"
              style={{ fontSize: 'clamp(12px, 1.8vw, 15px)' }}>
              {slide.sub}
            </p>
            <p className="mb-4 text-white/40 text-xs hidden sm:block">{slide.detail}</p>

            {/* Event card */}
            <div className="inline-block rounded-xl px-3 py-2.5 mb-4 border"
              style={{
                background:  slide.accentColor + '12',
                borderColor: slide.accentColor + '35',
              }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-0.5"
                style={{ color: slide.accentColor }}>{slide.league}</div>
              <div className="font-bold text-white mb-0.5"
                style={{ fontSize: 'clamp(12px, 2.2vw, 16px)' }}>{slide.match}</div>
              <div className="text-xs text-white/40">
                {slide.promo}{' '}
                <strong style={{ color: slide.accentColor }}>{slide.promoVal}</strong>
              </div>
            </div>

            {/* Mobile odds */}
            {slide.odds && (
              <div className="flex gap-2 mb-4 lg:hidden">
                {slide.odds.map((o, i) => (
                  <div key={i} className="flex-1 rounded-xl border py-2 text-center"
                    style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)' }}>
                    <div className="text-xs mb-0.5 text-white/35">{o.label}</div>
                    <div className="text-sm font-black text-white">{o.val}</div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-2.5 flex-wrap">
              <Link href={slide.ctaHref}
                className="inline-flex items-center px-5 md:px-7 py-2.5 md:py-3 rounded-xl font-bold text-black transition-all active:scale-95"
                style={{
                  background:  slide.accentColor === '#ffd700' ? '#ffd700' : slide.accentColor,
                  fontSize:    'clamp(12px, 1.8vw, 14px)',
                  boxShadow:   `0 4px 16px ${slide.accentColor}40`,
                }}>
                {slide.cta}
              </Link>
              <Link href={slide.cta2Href}
                className="inline-flex items-center px-5 md:px-7 py-2.5 md:py-3 rounded-xl font-semibold text-white border transition-all"
                style={{
                  borderColor: 'rgba(255,255,255,0.25)',
                  fontSize:    'clamp(12px, 1.8vw, 14px)',
                }}>
                {slide.cta2}
              </Link>
            </div>
          </div>

          {/* Right card — desktop only */}
          <div className="hidden lg:block flex-shrink-0 w-68" style={{ width: '270px' }}>
            {slide.isJackpot ? (
              <div className="rounded-2xl border p-5 text-center"
                style={{ background: 'rgba(0,0,0,0.65)', borderColor: 'rgba(255,215,0,0.2)', backdropFilter: 'blur(16px)' }}>
                <div className="text-xs text-white/40 uppercase tracking-widest mb-1">Current Jackpot</div>
                <div className="font-black" style={{ fontSize: 28, color: '#ffd700' }}>MWK</div>
                <div className="font-black mb-1" style={{ fontSize: 36, color: '#ffd700', lineHeight: 1 }}>50,000,000</div>
                <div className="text-xs text-white/30 mb-4">Pick 13 correct scores to win</div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="text-xs text-white/30 mb-0.5">Entries</div>
                    <div className="text-xl font-bold text-white">14,829</div>
                  </div>
                  <div className="rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="text-xs text-white/30 mb-0.5">Closes in</div>
                    <div className="text-base font-bold" style={{ color: '#ff6a00' }}>{fmt(jackpotTime)}</div>
                  </div>
                </div>
                <Link href="/jackpot"
                  className="block w-full py-3 rounded-xl text-sm font-bold text-black text-center"
                  style={{ background: '#ffd700' }}>
                  Enter Jackpot
                </Link>
              </div>
            ) : slide.odds ? (
              <div className="rounded-2xl border p-4"
                style={{ background: 'rgba(0,0,0,0.65)', borderColor: `${slide.accentColor}25`, backdropFilter: 'blur(16px)' }}>
                {slide.isLive && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold mb-3"
                    style={{ color: '#ff6060', borderColor: 'rgba(255,60,60,0.4)', background: 'rgba(255,40,40,0.1)' }}>
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                    LIVE ODDS
                  </div>
                )}
                <div className="text-xs text-white/40 uppercase tracking-widest mb-1">Match Betting</div>
                <div className="text-sm text-white/60 mb-4 truncate">{slide.match}</div>
                <div className="space-y-2 mb-2">
                  {slide.odds.map((o, i) => (
                    <div key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.02]"
                      style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
                      <div>
                        <span className="text-xs text-white/35">{o.label} · </span>
                        <span className="text-xs text-white/55">{o.name}</span>
                      </div>
                      <span className="text-lg font-black text-white">{o.val}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-center text-white/20">Tap odds to add to slip</p>
              </div>
            ) : (
              <div className="rounded-2xl border p-4"
                style={{ background: 'rgba(0,0,0,0.65)', borderColor: `${slide.accentColor}25`, backdropFilter: 'blur(16px)' }}>
                <div className="text-xs text-white/40 uppercase tracking-widest mb-3">Weekend Accumulator</div>
                {[
                  { team: 'Nyasa Bullets', odds: '1.50' },
                  { team: 'Man Utd Win', odds: '3.20' },
                  { team: 'Real Madrid', odds: '2.05' },
                  { team: 'BTTS Arsenal', odds: '1.75' },
                  { team: 'Over 2.5 PSG', odds: '1.90' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between py-1.5 text-xs border-b"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <span className="text-white/45">{row.team}</span>
                    <span className="font-bold text-white">{row.odds}</span>
                  </div>
                ))}
                <div className="mt-3 p-3 rounded-xl flex justify-between items-center"
                  style={{ background: 'rgba(0,200,83,0.1)', border: '1px solid rgba(0,200,83,0.2)' }}>
                  <div>
                    <div className="text-xs text-white/35">Total + 15%</div>
                    <div className="text-2xl font-black" style={{ color: '#00c853' }}>31.85x</div>
                  </div>
                  <Link href="/sports"
                    className="px-4 py-2 rounded-lg text-xs font-bold text-black"
                    style={{ background: '#00c853' }}>Bet</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Left arrow */}
      <button onClick={() => goTo(current - 1)}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white text-xl transition-all border"
        style={{ zIndex: 10, background: 'rgba(0,0,0,0.5)', borderColor: 'rgba(255,255,255,0.15)' }}
        aria-label="Previous slide">
        ‹
      </button>

      {/* Right arrow */}
      <button onClick={() => goTo(current + 1)}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white text-xl transition-all border"
        style={{ zIndex: 10, background: 'rgba(0,0,0,0.5)', borderColor: 'rgba(255,255,255,0.15)' }}
        aria-label="Next slide">
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5" style={{ zIndex: 10 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className="h-1.5 rounded-full border-none cursor-pointer transition-all duration-300"
            style={{
              width:      i === current ? 24 : 6,
              background: i === current ? slide.accentColor : 'rgba(255,255,255,0.3)',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ zIndex: 10, background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full transition-all duration-500"
          style={{
            background: slide.accentColor,
            width:      `${((current + 1) / slides.length) * 100}%`,
          }} />
      </div>
    </section>
  );
}
