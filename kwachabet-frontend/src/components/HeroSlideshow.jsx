import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const SLIDES = [
  {
    id: 0,
    bg: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1400&q=80&fit=crop',
    badge: '🟢 Live Betting',
    badgeColor: '#00c853',
    headline: 'Bet Smarter.',
    headlineAccent: 'Win More.',
    sub: "Malawi's #1 Sports Betting Platform",
    subDetail: 'Airtel Money · TNM Mpamba · Instant Payouts',
    league: 'TNM Super League · Today',
    match: 'Nyasa Big Bullets vs Mighty Wanderers',
    promo: 'Odds Boost',
    promoVal: '+20%',
    cta: '🟢 Join Free',
    ctaHref: '/register',
    cta2: 'Deposit Now',
    cta2Href: '/wallet',
    accentColor: '#00c853',
    odds: [
      { label: '1 — Bullets', val: '1.50' },
      { label: 'X — Draw',   val: '3.51' },
      { label: '2 — Wanderers', val: '2.51' },
    ],
    oddsTitle: 'Match Betting · 1X2',
  },
  {
    id: 1,
    bg: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1400&q=80&fit=crop',
    badge: '⚽ Premier League',
    badgeColor: '#3b82f6',
    headline: 'Premier League',
    headlineAccent: 'Weekend Special.',
    sub: 'Best odds on all Premier League matches',
    subDetail: 'Bet on your favourite English teams',
    league: 'Premier League · This Weekend',
    match: 'Manchester United vs Liverpool',
    promo: 'Odds Boost',
    promoVal: '+20%',
    cta: 'Bet Now',
    ctaHref: '/sports',
    cta2: 'View All Markets',
    cta2Href: '/sports',
    accentColor: '#3b82f6',
    odds: [
      { label: '1 — Man Utd', val: '3.20' },
      { label: 'X — Draw',   val: '3.50' },
      { label: '2 — Liverpool', val: '2.10' },
    ],
    oddsTitle: 'Match Betting · 1X2',
    isLive: true,
  },
  {
    id: 2,
    bg: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1400&q=80&fit=crop',
    badge: '🏆 Champions League',
    badgeColor: '#f59e0b',
    headline: 'UEFA Champions',
    headlineAccent: 'League.',
    sub: 'Europe\'s biggest club competition',
    subDetail: 'Best odds guaranteed on all UCL matches',
    league: 'UEFA Champions League · Quarter Final',
    match: 'Real Madrid vs Bayern Munich',
    promo: 'Best Odds',
    promoVal: 'Guaranteed',
    cta: 'Bet Now',
    ctaHref: '/sports',
    cta2: 'All UCL Markets',
    cta2Href: '/sports',
    accentColor: '#f59e0b',
    odds: [
      { label: '1 — Real Madrid', val: '2.05' },
      { label: 'X — Draw',       val: '3.80' },
      { label: '2 — Bayern',     val: '3.40' },
    ],
    oddsTitle: 'Match Betting · 1X2',
  },
  {
    id: 3,
    bg: 'https://images.unsplash.com/photo-1607457561901-e6ec3a6d16cf?w=1400&q=80&fit=crop',
    badge: '💰 Mega Jackpot',
    badgeColor: '#ffd700',
    headline: 'Win up to',
    headlineAccent: 'MWK 50,000,000',
    sub: 'KwachaBet Mega Jackpot — Pick all winners',
    subDetail: 'New jackpot every week · Easy to enter',
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
    headline: 'Weekend',
    headlineAccent: 'Accumulator Bonus.',
    sub: 'Get 15% bonus on all 5+ selection accumulators',
    subDetail: 'Auto-applied to your bet slip every weekend',
    league: 'Weekend Accumulator · Bonus',
    match: '15% Bonus on 5+ Selections',
    promo: 'Max bonus',
    promoVal: 'MWK 500,000',
    cta: 'Build Your Acca',
    ctaHref: '/sports',
    cta2: 'View Fixtures',
    cta2Href: '/sports',
    accentColor: '#00c853',
    isAcca: true,
  },
];

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef(null);
  const [jackpotTime, setJackpotTime] = useState(7473);

  const goTo = (n) => {
    if (transitioning) return;
    const next = (n + SLIDES.length) % SLIDES.length;
    if (next === current) return;
    setTransitioning(true);
    setPrev(current);
    setCurrent(next);
    setTimeout(() => { setPrev(null); setTransitioning(false); }, 800);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => goToAuto(), 5000);
  };

  const goToAuto = () => {
    setCurrent(c => (c + 1) % SLIDES.length);
  };

  useEffect(() => {
    timerRef.current = setInterval(goToAuto, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Jackpot countdown
  useEffect(() => {
    const t = setInterval(() => setJackpotTime(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
  };

  const slide = SLIDES[current];

  return (
    <section className="relative w-full overflow-hidden" style={{ height: '540px' }}>

      {/* Slide backgrounds */}
      {SLIDES.map((s, i) => (
        <div key={s.id} className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: 0 }}>
          <div className="absolute inset-0" style={{
            backgroundImage: `url(${s.bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(1px) brightness(0.4)',
            transform: 'scale(1.05)',
          }} />
          {/* Color overlay matching slide accent */}
          <div className="absolute inset-0" style={{
            background: `linear-gradient(135deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.35) 100%)`,
          }} />
          {/* Accent glow */}
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: s.accentColor, opacity: 0.6 }} />
        </div>
      ))}

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute rounded-full animate-pulse" style={{
            width: Math.random() > 0.5 ? 2 : 3,
            height: Math.random() > 0.5 ? 2 : 3,
            background: slide.accentColor,
            left: `${(i * 8.3) + Math.random() * 5}%`,
            top: `${20 + Math.random() * 60}%`,
            opacity: 0.3 + Math.random() * 0.4,
            animationDuration: `${2 + Math.random() * 3}s`,
          }} />
        ))}
      </div>

      {/* Main content */}
      <div className="absolute inset-0 flex items-center" style={{ zIndex: 2 }}>
        <div className="w-full max-w-7xl mx-auto px-8 flex items-center justify-between gap-8">

          {/* Left content */}
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-5 tracking-wide"
              style={{ color: slide.accentColor, borderColor: slide.accentColor + '60', background: slide.accentColor + '18' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: slide.accentColor }} />
              {slide.badge}
            </div>

            {/* Headline */}
            <h1 className="font-black leading-none mb-3" style={{ fontSize: '52px', color: '#fff', letterSpacing: '-0.02em' }}>
              {slide.headline}<br />
              <span style={{ color: slide.accentColor }}>{slide.headlineAccent}</span>
            </h1>

            {/* Sub */}
            <p className="text-base font-medium mb-1" style={{ color: 'rgba(255,255,255,0.75)' }}>{slide.sub}</p>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>{slide.subDetail}</p>

            {/* Event card */}
            <div className="inline-block rounded-xl px-4 py-3 mb-7 border"
              style={{ background: slide.accentColor + '12', borderColor: slide.accentColor + '35' }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-1"
                style={{ color: slide.accentColor }}>{slide.league}</div>
              <div className="text-lg font-bold text-white mb-1">{slide.match}</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {slide.promo}{' '}
                <strong style={{ color: slide.accentColor }}>{slide.promoVal}</strong>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 flex-wrap">
              <Link href={slide.ctaHref}
                className="px-8 py-3.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  background: slide.accentColor === '#ffd700' ? '#ffd700' : slide.accentColor,
                  color: '#000',
                  boxShadow: `0 4px 20px ${slide.accentColor}40`,
                }}>
                {slide.cta}
              </Link>
              <Link href={slide.cta2Href}
                className="px-8 py-3.5 rounded-xl text-sm font-semibold border transition-all hover:bg-white/10"
                style={{ borderColor: 'rgba(255,255,255,0.25)', color: '#fff' }}>
                {slide.cta2}
              </Link>
            </div>
          </div>

          {/* Right — odds / jackpot card */}
          <div className="hidden lg:block flex-shrink-0 w-72">
            {slide.isJackpot ? (
              <div className="rounded-2xl border p-6 text-center"
                style={{ background: 'rgba(0,0,0,0.55)', borderColor: 'rgba(255,215,0,0.25)', backdropFilter: 'blur(12px)' }}>
                <div className="text-xs text-white/40 uppercase tracking-widest mb-2">Current Jackpot</div>
                <div className="text-3xl font-black mb-1" style={{ color: '#ffd700' }}>MWK</div>
                <div className="text-4xl font-black mb-1" style={{ color: '#ffd700' }}>50,000,000</div>
                <div className="text-xs text-white/30 mb-5">Pick 13 correct scores to win</div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="text-xs text-white/30 mb-1">Entries</div>
                    <div className="text-xl font-bold text-white">14,829</div>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="text-xs text-white/30 mb-1">Closes in</div>
                    <div className="text-xl font-bold" style={{ color: '#ff6a00' }}>{formatTime(jackpotTime)}</div>
                  </div>
                </div>
                <Link href="/jackpot"
                  className="block w-full py-3 rounded-xl text-sm font-bold text-center transition-all"
                  style={{ background: '#ffd700', color: '#000' }}>
                  Enter Jackpot Now
                </Link>
              </div>
            ) : slide.isAcca ? (
              <div className="rounded-2xl border p-5"
                style={{ background: 'rgba(0,0,0,0.55)', borderColor: 'rgba(0,200,83,0.2)', backdropFilter: 'blur(12px)' }}>
                <div className="text-xs text-white/40 uppercase tracking-widest mb-3">Your Accumulator</div>
                {[
                  { team: 'Nyasa Big Bullets', odds: '1.50' },
                  { team: 'Man Utd to Win', odds: '3.20' },
                  { team: 'Real Madrid Win', odds: '2.05' },
                  { team: 'BTTS — Arsenal', odds: '1.75' },
                  { team: 'Over 2.5 — PSG', odds: '1.90' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b text-xs"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <span className="text-white/50">{row.team}</span>
                    <span className="font-bold text-white">{row.odds}</span>
                  </div>
                ))}
                <div className="mt-3 p-3 rounded-xl flex justify-between items-center"
                  style={{ background: 'rgba(0,200,83,0.1)', border: '1px solid rgba(0,200,83,0.2)' }}>
                  <div>
                    <div className="text-xs text-white/40">Total odds + 15%</div>
                    <div className="text-2xl font-black" style={{ color: '#00c853' }}>31.85x</div>
                  </div>
                  <Link href="/sports"
                    className="px-4 py-2 rounded-lg text-xs font-bold"
                    style={{ background: '#00c853', color: '#000' }}>
                    Bet
                  </Link>
                </div>
              </div>
            ) : slide.odds ? (
              <div className="rounded-2xl border p-5"
                style={{ background: 'rgba(0,0,0,0.55)', borderColor: `${slide.accentColor}30`, backdropFilter: 'blur(12px)' }}>
                {slide.isLive && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold mb-3"
                    style={{ color: '#ff6060', borderColor: 'rgba(255,60,60,0.4)', background: 'rgba(255,40,40,0.1)' }}>
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                    LIVE ODDS
                  </div>
                )}
                <div className="text-xs text-white/40 uppercase tracking-widest mb-1">{slide.oddsTitle}</div>
                <div className="text-sm text-white/60 mb-4">{slide.match.length > 30 ? slide.match.substring(0, 28) + '…' : slide.match}</div>
                <div className="space-y-2">
                  {slide.odds.map((o, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02]"
                      style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
                      <span className="text-xs text-white/50">{o.label}</span>
                      <span className="text-lg font-bold text-white">{o.val}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-center text-white/20">Tap odds to add to bet slip</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Left arrow */}
      <button onClick={() => goTo(current - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-xl text-white transition-all border hover:scale-110"
        style={{ zIndex: 10, background: 'rgba(0,0,0,0.5)', borderColor: 'rgba(255,255,255,0.15)' }}
        aria-label="Previous slide">
        &#8249;
      </button>
      <button onClick={() => goTo(current + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-xl text-white transition-all border hover:scale-110"
        style={{ zIndex: 10, background: 'rgba(0,0,0,0.5)', borderColor: 'rgba(255,255,255,0.15)' }}
        aria-label="Next slide">
        &#8250;
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 10 }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className="h-2 rounded-full border-none cursor-pointer transition-all duration-300"
            style={{
              width: i === current ? 28 : 8,
              background: i === current ? slide.accentColor : 'rgba(255,255,255,0.25)',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ zIndex: 10, background: 'rgba(255,255,255,0.1)' }}>
        <div className="h-full" style={{
          background: slide.accentColor,
          width: `${((current + 1) / SLIDES.length) * 100}%`,
          transition: 'width 0.3s ease',
        }} />
      </div>
    </section>
  );
}
