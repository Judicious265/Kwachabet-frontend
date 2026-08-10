import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ── Default slides (fallback if API is down) ──────────────────────────────────
const FALLBACK_SLIDES = [
  {
    id: 'f1',
    badge:        'TODAY\'S FOOTBALL ⚽',
    badge_color:  '#F5A623',
    headline:     'BET SMART.',
    accent:       'WIN MORE.',
    sub:          'Malawi\'s Most Trusted Sports Betting Platform.',
    bg_image_url: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1400&q=80&fit=crop',
    ambassador_url: null,
    cta_text:     'Join Now →',
    cta_href:     '/register',
    cta2_text:    'Explore Matches',
    cta2_href:    '/sports',
    boost_label:  'ODDS BOOST',
    boost_team:   'Nyasa Bullets To Win',
    boost_was:    '1.30',
    boost_now:    '1.80',
    accent_color: '#00E664',
    trust_badges: ['Fast Payouts', 'Secure & Trusted', '24/7 Support'],
  },
  {
    id: 'f2',
    badge:        'PREMIER LEAGUE ⚽',
    badge_color:  '#3B82F6',
    headline:     'BEST ODDS.',
    accent:       'GUARANTEED.',
    sub:          'Bet on Premier League, Champions League and more.',
    bg_image_url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1400&q=80&fit=crop',
    ambassador_url: null,
    cta_text:     'Bet Now →',
    cta_href:     '/sports',
    cta2_text:    'View Markets',
    cta2_href:    '/sports',
    boost_label:  'ODDS BOOST',
    boost_team:   'Man United To Win',
    boost_was:    '2.10',
    boost_now:    '2.45',
    accent_color: '#3B82F6',
    trust_badges: ['Best Odds', 'Instant Payouts', '100% Bonus'],
  },
  {
    id: 'f3',
    badge:        'MEGA JACKPOT 💰',
    badge_color:  '#FFD700',
    headline:     'WIN UP TO',
    accent:       'MWK 50,000,000',
    sub:          'Pick all winners and take home the biggest prize in Malawi.',
    bg_image_url: 'https://images.unsplash.com/photo-1607457561901-e6ec3a6d16cf?w=1400&q=80&fit=crop',
    ambassador_url: null,
    cta_text:     'Enter Jackpot →',
    cta_href:     '/jackpot',
    cta2_text:    'How It Works',
    cta2_href:    '/jackpot',
    boost_label:  'THIS WEEK',
    boost_team:   'Jackpot Prize Pool',
    boost_was:    null,
    boost_now:    'MWK 50M',
    accent_color: '#FFD700',
    trust_badges: ['Entry from MWK 200', 'Guaranteed Prize', 'New Every Week'],
  },
  {
    id: 'f4',
    badge:        'WEEKEND BONUS 🎁',
    badge_color:  '#00E664',
    headline:     '100% MATCH',
    accent:       'BONUS.',
    sub:          'Up to MWK 50,000 on your first deposit. New customers only.',
    bg_image_url: 'https://images.unsplash.com/photo-1551958219-acbc595b5de6?w=1400&q=80&fit=crop',
    ambassador_url: null,
    cta_text:     'Claim Bonus →',
    cta_href:     '/register',
    cta2_text:    'Terms Apply',
    cta2_href:    '/terms',
    boost_label:  'WELCOME OFFER',
    boost_team:   'First Deposit Bonus',
    boost_was:    null,
    boost_now:    'MWK 50,000',
    accent_color: '#00E664',
    trust_badges: ['New customers only', 'Min deposit MWK 500', 'T&Cs apply'],
  },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function HeroSlideshow() {
  const [slides, setSlides]   = useState(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded]   = useState({});
  const [paused, setPaused]   = useState(false);
  const timerRef              = useRef(null);
  const intervalRef           = useRef(5000);

  // ── Fetch slides from API ───────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API_BASE}/slides`)
      .then(r => r.json())
      .then(data => {
        if (data.slides && data.slides.length > 0) {
          setSlides(data.slides);
        }
      })
      .catch(() => {}); // silently use fallback
  }, []);

  // ── Auto-advance ────────────────────────────────────────────────────────────
  const startTimer = () => {
    clearInterval(timerRef.current);
    if (!paused) {
      timerRef.current = setInterval(() => {
        setCurrent(c => (c + 1) % slides.length);
      }, intervalRef.current);
    }
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [slides.length, paused]);

  const goTo = (n) => {
    setCurrent((n + slides.length) % slides.length);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length);
    }, intervalRef.current);
  };

  const slide = slides[current];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: 'clamp(380px, 52vw, 520px)', background: '#060D0A' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slide backgrounds ────────────────────────────────────────────── */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: 0 }}
        >
          {/* Stadium photo */}
          <img
            src={s.bg_image_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.28) saturate(1.1)', transform: 'scale(1.04)' }}
            onLoad={() => setLoaded(l => ({ ...l, [i]: true }))}
          />
          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(100deg,rgba(6,13,10,0.96) 0%,rgba(6,13,10,0.72) 55%,rgba(6,13,10,0.35) 100%)',
            }}
          />
          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24"
            style={{ background: 'linear-gradient(to top,rgba(6,13,10,1),transparent)' }}
          />
          {/* Accent colour glow bottom-left */}
          <div
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background:    `radial-gradient(circle,${s.accent_color}18 0%,transparent 70%)`,
              transform:     'translate(-30%,40%)',
            }}
          />
        </div>
      ))}

      {/* ── Ambassador image (if provided) ───────────────────────────────── */}
      {slide.ambassador_url && (
        <div
          className="absolute inset-y-0 right-0 hidden lg:flex items-end justify-center pointer-events-none"
          style={{ zIndex: 1, width: '38%' }}
        >
          <img
            src={slide.ambassador_url}
            alt="KwachaBet Ambassador"
            className="h-full object-contain object-bottom"
            style={{ filter: 'drop-shadow(0 0 32px rgba(0,230,100,0.15))' }}
          />
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center" style={{ zIndex: 2 }}>
        <div
          className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between gap-6"
        >
          {/* Left — headline + CTAs */}
          <div className="flex-1 min-w-0 max-w-lg">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 tracking-wide"
              style={{
                background:  slide.badge_color + '20',
                border:      `1px solid ${slide.badge_color}50`,
                color:       slide.badge_color,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: slide.badge_color }}
              />
              {slide.badge}
            </div>

            {/* Headline */}
            <h1
              className="font-black leading-none mb-2 text-white"
              style={{ fontSize: 'clamp(30px,5.5vw,56px)', letterSpacing: '-2px' }}
            >
              {slide.headline}<br />
              <span style={{ color: slide.accent_color }}>{slide.accent}</span>
            </h1>

            {/* Subheading */}
            <p
              className="mb-6"
              style={{ fontSize: 'clamp(13px,1.6vw,16px)', color: '#8A9E97', lineHeight: 1.6 }}
            >
              {slide.sub}
            </p>

            {/* Trust badges */}
            {slide.trust_badges && (
              <div className="flex flex-wrap gap-2 mb-6">
                {slide.trust_badges.map((badge, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-xs font-medium"
                    style={{ color: '#8A9E97' }}
                  >
                    <span style={{ color: slide.accent_color }}>✓</span>
                    {badge}
                  </div>
                ))}
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex gap-3 flex-wrap">
              <Link
                href={slide.cta_href}
                className="inline-flex items-center px-6 md:px-8 py-3 rounded-xl font-bold text-black transition-all hover:brightness-110 active:scale-95"
                style={{
                  background: slide.accent_color === '#FFD700' ? '#FFD700' : '#00E664',
                  fontSize:   'clamp(13px,1.5vw,15px)',
                  boxShadow:  `0 4px 20px ${slide.accent_color}40`,
                }}
              >
                {slide.cta_text}
              </Link>
              <Link
                href={slide.cta2_href}
                className="inline-flex items-center px-6 md:px-8 py-3 rounded-xl font-semibold text-white border transition-all hover:bg-white/5 active:scale-95"
                style={{ borderColor: '#1E3024', fontSize: 'clamp(13px,1.5vw,15px)' }}
              >
                {slide.cta2_text}
              </Link>
            </div>
          </div>

          {/* Right — Odds Boost card (desktop) */}
          <div className="hidden lg:block flex-shrink-0 w-64">
            <div
              className="rounded-2xl p-5"
              style={{ background: 'rgba(13,25,17,0.9)', border: '1px solid #1E3024', backdropFilter: 'blur(20px)' }}
            >
              {/* Card header */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="text-xs font-black px-2.5 py-1 rounded-full tracking-wide"
                  style={{ background: slide.accent_color + '20', color: slide.accent_color }}
                >
                  📈 {slide.boost_label}
                </span>
              </div>

              {/* Boosted match */}
              <p className="text-white font-bold text-sm mb-4 leading-snug">{slide.boost_team}</p>

              {/* Odds display */}
              {slide.boost_was ? (
                <div className="mb-5">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs line-through" style={{ color: '#4A6B56' }}>
                      WAS {slide.boost_was}
                    </span>
                  </div>
                  <div className="text-xs font-semibold mb-1" style={{ color: '#8A9E97' }}>NOW</div>
                  <div
                    className="font-black leading-none"
                    style={{ fontSize: 40, color: slide.accent_color, fontFamily: 'monospace' }}
                  >
                    {slide.boost_now}
                    <span
                      className="text-lg ml-1"
                      style={{ color: '#00E664' }}
                    >
                      ↑
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="font-black leading-none mb-5"
                  style={{ fontSize: 32, color: slide.accent_color, fontFamily: 'monospace' }}
                >
                  {slide.boost_now}
                </div>
              )}

              {/* CTA */}
              <Link
                href={slide.cta_href}
                className="block w-full text-center py-3 rounded-xl text-sm font-bold text-black transition-all hover:brightness-110"
                style={{ background: slide.accent_color === '#FFD700' ? '#FFD700' : '#00E664' }}
              >
                {slide.boost_was ? 'Boost Now' : slide.cta_text}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Left arrow ────────────────────────────────────────────────────── */}
      <button
        onClick={() => goTo(current - 1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white text-xl border transition-all hover:border-white/30 active:scale-90"
        style={{ zIndex: 10, background: 'rgba(0,0,0,0.5)', borderColor: '#1E3024' }}
        aria-label="Previous slide"
      >
        ‹
      </button>

      {/* ── Right arrow ───────────────────────────────────────────────────── */}
      <button
        onClick={() => goTo(current + 1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white text-xl border transition-all hover:border-white/30 active:scale-90"
        style={{ zIndex: 10, background: 'rgba(0,0,0,0.5)', borderColor: '#1E3024' }}
        aria-label="Next slide"
      >
        ›
      </button>

      {/* ── Slide dots ────────────────────────────────────────────────────── */}
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5"
        style={{ zIndex: 10 }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="h-1.5 rounded-full border-none cursor-pointer transition-all duration-300"
            style={{
              width:      i === current ? 28 : 6,
              background: i === current ? slide.accent_color : 'rgba(255,255,255,0.25)',
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Progress bar ──────────────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ zIndex: 10, background: '#1E3024' }}
      >
        <div
          className="h-full transition-all duration-500"
          style={{
            background: slide.accent_color,
            width:      `${((current + 1) / slides.length) * 100}%`,
          }}
        />
      </div>
    </section>
  );
}
