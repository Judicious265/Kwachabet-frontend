import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const FALLBACK_SLIDES = [
  {
    id: 'f1',
    badge:         'TODAY\'S FOOTBALL ⚽',
    badge_color:   '#F5A623',
    headline:      'BET SMART.',
    accent:        'WIN MORE.',
    sub:           'Malawi\'s Most Trusted Sports Betting Platform.',
    bg_image_url:  'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1400&q=80&fit=crop',
    ambassador_url: null,
    cta_text:      'Join Now →',
    cta_href:      '/register',
    cta2_text:     'Explore Matches',
    cta2_href:     '/sports',
    boost_label:   'ODDS BOOST',
    boost_team:    'Nyasa Bullets To Win',
    boost_was:     '1.30',
    boost_now:     '1.80',
    accent_color:  '#00E664',
    trust_badges:  ['Fast Payouts', 'Secure & Trusted', '24/7 Support'],
  },
  {
    id: 'f2',
    badge:         'PREMIER LEAGUE ⚽',
    badge_color:   '#3B82F6',
    headline:      'BEST ODDS.',
    accent:        'GUARANTEED.',
    sub:           'Bet on Premier League, Champions League and more.',
    bg_image_url:  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1400&q=80&fit=crop',
    ambassador_url: null,
    cta_text:      'Bet Now →',
    cta_href:      '/sports',
    cta2_text:     'View Markets',
    cta2_href:     '/sports',
    boost_label:   'ODDS BOOST',
    boost_team:    'Man United To Win',
    boost_was:     '2.10',
    boost_now:     '2.45',
    accent_color:  '#3B82F6',
    trust_badges:  ['Best Odds', 'Instant Payouts', '100% Bonus'],
    isLive:        true,
  },
  {
    id: 'f3',
    badge:         'MEGA JACKPOT 💰',
    badge_color:   '#FFD700',
    headline:      'WIN UP TO',
    accent:        'MWK 50,000,000',
    sub:           'Pick all winners and take home the biggest prize in Malawi.',
    bg_image_url:  'https://images.unsplash.com/photo-1607457561901-e6ec3a6d16cf?w=1400&q=80&fit=crop',
    ambassador_url: null,
    cta_text:      'Enter Jackpot →',
    cta_href:      '/jackpot',
    cta2_text:     'How It Works',
    cta2_href:     '/jackpot',
    boost_label:   'THIS WEEK',
    boost_team:    'Jackpot Prize Pool',
    boost_was:     null,
    boost_now:     'MWK 50M',
    accent_color:  '#FFD700',
    trust_badges:  ['Entry from MWK 200', 'Guaranteed Prize', 'New Every Week'],
  },
  {
    id: 'f4',
    badge:         'WELCOME BONUS 🎁',
    badge_color:   '#00E664',
    headline:      '100% MATCH',
    accent:        'BONUS.',
    sub:           'Up to MWK 50,000 on your first deposit. New customers only.',
    bg_image_url:  'https://images.unsplash.com/photo-1551958219-acbc595b5de6?w=1400&q=80&fit=crop',
    ambassador_url: null,
    cta_text:      'Claim Bonus →',
    cta_href:      '/register',
    cta2_text:     'Terms Apply',
    cta2_href:     '/terms',
    boost_label:   'WELCOME OFFER',
    boost_team:    'First Deposit Bonus',
    boost_was:     null,
    boost_now:     'MWK 50,000',
    accent_color:  '#00E664',
    trust_badges:  ['New customers only', 'Min deposit MWK 500', 'T&Cs apply'],
    isBonus:       true,
  },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// SVG Ambassador placeholder — stylised male figure in KB kit
function AmbassadorSVG({ accentColor }) {
  return (
    <svg
      viewBox="0 0 320 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-auto"
      style={{ filter: `drop-shadow(0 0 40px ${accentColor}40)` }}
      aria-hidden="true"
    >
      {/* Glow base */}
      <ellipse cx="160" cy="490" rx="100" ry="20" fill={accentColor} fillOpacity="0.15" />

      {/* Legs */}
      <rect x="118" y="340" width="34" height="140" rx="16" fill="#1a2e1a" />
      <rect x="168" y="340" width="34" height="140" rx="16" fill="#1a2e1a" />
      {/* Boots */}
      <rect x="112" y="462" width="46" height="22" rx="10" fill="#111" />
      <rect x="162" y="462" width="46" height="22" rx="10" fill="#111" />

      {/* Kit body */}
      <path d="M100 200 Q80 220 75 280 L95 285 Q105 240 120 230 L120 340 H200 L200 230 Q215 240 225 285 L245 280 Q240 220 220 200 Z"
        fill={accentColor} />

      {/* KB logo on chest */}
      <rect x="145" y="235" width="30" height="30" rx="6" fill="#000" fillOpacity="0.4" />
      <text x="160" y="255" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" fontFamily="system-ui">KB</text>

      {/* Arms */}
      <path d="M100 210 Q70 230 65 280 L85 285 Q88 250 110 235 Z" fill={accentColor} />
      <path d="M220 210 Q250 230 255 280 L235 285 Q232 250 210 235 Z" fill={accentColor} />

      {/* Hands */}
      <ellipse cx="72" cy="284" rx="14" ry="12" fill="#8B6914" />
      <ellipse cx="248" cy="284" rx="14" ry="12" fill="#8B6914" />

      {/* Football in right hand */}
      <circle cx="262" cy="284" r="18" fill="white" />
      <path d="M262 266 Q270 272 268 282 Q260 290 252 284 Q250 274 258 268 Z" fill="#222" />
      <path d="M280 278 Q278 288 270 292 Q262 290 260 282 Q268 276 278 278 Z" fill="#222" />

      {/* Neck */}
      <rect x="148" y="155" width="24" height="50" rx="10" fill="#8B6914" />

      {/* Head */}
      <ellipse cx="160" cy="130" rx="44" ry="50" fill="#8B6914" />

      {/* Hair */}
      <path d="M118 115 Q120 75 160 72 Q200 75 202 115 Q190 100 160 98 Q130 100 118 115 Z"
        fill="#1a0a00" />

      {/* Eyes */}
      <ellipse cx="146" cy="125" rx="6" ry="7" fill="#1a0a00" />
      <ellipse cx="174" cy="125" rx="6" ry="7" fill="#1a0a00" />
      <ellipse cx="147" cy="123" rx="2" ry="2" fill="#fff" />
      <ellipse cx="175" cy="123" rx="2" ry="2" fill="#fff" />

      {/* Smile */}
      <path d="M148 145 Q160 157 172 145" stroke="#5a2a00" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Ear */}
      <ellipse cx="116" cy="132" rx="8" ry="10" fill="#7a5a10" />
      <ellipse cx="204" cy="132" rx="8" ry="10" fill="#7a5a10" />

      {/* Confidence sparkles */}
      <circle cx="290" cy="160" r="3" fill={accentColor} />
      <circle cx="50" cy="200" r="2" fill={accentColor} fillOpacity="0.6" />
      <circle cx="280" cy="230" r="4" fill={accentColor} fillOpacity="0.4" />
      <circle cx="40" cy="280" r="3" fill={accentColor} fillOpacity="0.5" />
    </svg>
  );
}

export default function HeroSlideshow() {
  const [slides, setSlides]   = useState(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused]   = useState(false);
  const timerRef              = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/slides`)
      .then(r => r.json())
      .then(data => { if (data.slides && data.slides.length > 0) setSlides(data.slides); })
      .catch(() => {});
  }, []);

  const goTo = (n) => {
    setCurrent((n + slides.length) % slides.length);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000);
  };

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000);
    return () => clearInterval(timerRef.current);
  }, [slides.length, paused]);

  const slide = slides[current];

  // Each slide has its own background treatment
  const slideStyle = {
    f4: {
      bg: 'linear-gradient(135deg, #003d1a 0%, #00200e 40%, #001208 100%)',
      particles: true,
    },
  };

  const isBonus = slide.isBonus || slide.id === 'f4';

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: 'clamp(380px, 52vw, 520px)', background: '#060D0A' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Backgrounds ─────────────────────────────────────────────────── */}
      {slides.map((s, i) => {
        const isThisBonus = s.isBonus || s.id === 'f4';
        return (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0, zIndex: 0 }}
          >
            {isThisBonus ? (
              // Bonus slide — rich green gradient with pattern
              <>
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, #003d1a 0%, #00200e 40%, #011208 100%)' }}
                />
                {/* Decorative circles */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute rounded-full"
                    style={{ width: 500, height: 500, top: -100, right: -100, background: `radial-gradient(circle, ${s.accent_color}12 0%, transparent 70%)` }} />
                  <div className="absolute rounded-full"
                    style={{ width: 300, height: 300, bottom: -50, left: -50, background: `radial-gradient(circle, ${s.accent_color}10 0%, transparent 70%)` }} />
                  {/* Grid pattern */}
                  <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.04 }}>
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00E664" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                  {/* Floating particles */}
                  {[...Array(8)].map((_, j) => (
                    <div
                      key={j}
                      className="absolute rounded-full animate-pulse"
                      style={{
                        width:     j % 2 === 0 ? 4 : 6,
                        height:    j % 2 === 0 ? 4 : 6,
                        background: s.accent_color,
                        left:      `${10 + j * 11}%`,
                        top:       `${20 + (j % 3) * 25}%`,
                        opacity:   0.3 + (j % 3) * 0.1,
                        animationDuration: `${2 + j * 0.4}s`,
                      }}
                    />
                  ))}
                </div>
                {/* Bonus — dark overlay */}
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.25)' }} />
              </>
            ) : (
              // All other slides — stadium photo
              <>
                <img
                  src={s.bg_image_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  style={{ filter: 'brightness(0.55) saturate(1.2)', transform: 'scale(1.04)' }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(100deg,rgba(6,13,10,0.85) 0%,rgba(6,13,10,0.55) 55%,rgba(6,13,10,0.2) 100%)' }}
                />
              </>
            )}

            {/* Bottom fade — all slides */}
            <div
              className="absolute bottom-0 left-0 right-0 h-20"
              style={{ background: 'linear-gradient(to top, rgba(6,13,10,1), transparent)' }}
            />
            {/* Accent bottom line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: s.accent_color, opacity: 0.5 }}
            />
          </div>
        );
      })}

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center" style={{ zIndex: 2 }}>
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between gap-6">

          {/* Left — headline + CTAs */}
          <div className="flex-1 min-w-0 max-w-lg">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 tracking-wide"
              style={{ background: slide.badge_color + '20', border: `1px solid ${slide.badge_color}50`, color: slide.badge_color }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: slide.badge_color }} />
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

            {/* Sub */}
            <p className="mb-5" style={{ fontSize: 'clamp(13px,1.6vw,16px)', color: '#8A9E97', lineHeight: 1.6 }}>
              {slide.sub}
            </p>

            {/* Trust badges */}
            {slide.trust_badges && (
              <div className="flex flex-wrap gap-3 mb-6">
                {slide.trust_badges.map((badge, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#8A9E97' }}>
                    <span style={{ color: slide.accent_color }}>✓</span>{badge}
                  </div>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-3 flex-wrap">
              <Link
                href={slide.cta_href}
                className="inline-flex items-center px-6 md:px-8 py-3 rounded-xl font-bold text-black transition-all hover:brightness-110 active:scale-95"
                style={{
                  background:  slide.accent_color === '#FFD700' ? '#FFD700' : '#00E664',
                  fontSize:    'clamp(13px,1.5vw,15px)',
                  boxShadow:   `0 4px 20px ${slide.accent_color}40`,
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

          {/* Right — Boost card OR Ambassador + Boost card */}
          <div className="hidden lg:flex items-end gap-4 flex-shrink-0">

            {/* Ambassador figure — shown on bonus slide or when ambassador_url is set */}
            {(isBonus || slide.ambassador_url) && (
              <div
                className="flex-shrink-0 relative"
                style={{ width: 200, height: 340, marginBottom: -40 }}
              >
                {slide.ambassador_url ? (
                  <img
                    src={slide.ambassador_url}
                    alt="KwachaBet Ambassador"
                    className="h-full w-full object-contain object-bottom"
                    style={{ filter: 'drop-shadow(0 0 32px rgba(0,230,100,0.2))' }}
                  />
                ) : (
                  <AmbassadorSVG accentColor={slide.accent_color} />
                )}
                {/* Name badge */}
                <div
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl text-center whitespace-nowrap"
                  style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(0,230,100,0.3)', backdropFilter: 'blur(8px)' }}
                >
                  <p className="text-xs font-bold text-white">KB AMBASSADOR</p>
                  <p className="text-xs" style={{ color: slide.accent_color }}>KwachaBet Official</p>
                </div>
              </div>
            )}

            {/* Boost / promo card */}
            <div
              className="rounded-2xl p-5 flex-shrink-0 w-60"
              style={{ background: 'rgba(13,25,17,0.92)', border: '1px solid #1E3024', backdropFilter: 'blur(20px)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs font-black px-2.5 py-1 rounded-full"
                  style={{ background: slide.accent_color + '20', color: slide.accent_color }}
                >
                  {isBonus ? '🎁' : '📈'} {slide.boost_label}
                </span>
              </div>
              <p className="text-white font-bold text-sm mb-4 leading-snug">{slide.boost_team}</p>

              {slide.boost_was ? (
                <div className="mb-5">
                  <div className="text-xs line-through mb-0.5" style={{ color: '#4A6B56' }}>WAS {slide.boost_was}</div>
                  <div className="text-xs font-semibold mb-1" style={{ color: '#8A9E97' }}>NOW</div>
                  <div className="font-black" style={{ fontSize: 40, color: slide.accent_color, fontFamily: 'monospace', lineHeight: 1 }}>
                    {slide.boost_now}
                    <span className="text-lg ml-1" style={{ color: '#00E664' }}>↑</span>
                  </div>
                </div>
              ) : (
                <div className="mb-5">
                  {isBonus && (
                    <div className="text-xs font-semibold mb-1" style={{ color: '#8A9E97' }}>UP TO</div>
                  )}
                  <div className="font-black" style={{ fontSize: isBonus ? 28 : 36, color: slide.accent_color, fontFamily: 'monospace', lineHeight: 1.1 }}>
                    {slide.boost_now}
                  </div>
                </div>
              )}

              <Link
                href={slide.cta_href}
                className="block w-full text-center py-3 rounded-xl text-sm font-bold text-black transition-all hover:brightness-110"
                style={{ background: slide.accent_color === '#FFD700' ? '#FFD700' : '#00E664' }}
              >
                {isBonus ? 'Claim Bonus →' : slide.boost_was ? 'Boost Now' : slide.cta_text}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button onClick={() => goTo(current - 1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white text-xl border transition-all hover:border-white/30 active:scale-90"
        style={{ zIndex: 10, background: 'rgba(0,0,0,0.5)', borderColor: '#1E3024' }}
        aria-label="Previous">‹</button>
      <button onClick={() => goTo(current + 1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white text-xl border transition-all hover:border-white/30 active:scale-90"
        style={{ zIndex: 10, background: 'rgba(0,0,0,0.5)', borderColor: '#1E3024' }}
        aria-label="Next">›</button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5" style={{ zIndex: 10 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className="h-1.5 rounded-full border-none cursor-pointer transition-all duration-300"
            style={{ width: i === current ? 28 : 6, background: i === current ? slide.accent_color : 'rgba(255,255,255,0.25)' }}
            aria-label={`Slide ${i + 1}`} />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ zIndex: 10, background: '#1E3024' }}>
        <div className="h-full transition-all duration-500"
          style={{ background: slide.accent_color, width: `${((current + 1) / slides.length) * 100}%` }} />
      </div>
    </section>
  );
}
