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
    ambassador_url: '/ambassador.png',
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
    ambassador_url: '/ambassador.png',
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

export default function HeroSlideshow() {
  const [slides, setSlides]   = useState(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused]   = useState(false);
  const timerRef              = useRef(null);

  // Fetch slides from API
  useEffect(() => {
    fetch(`${API_BASE}/slides`)
      .then(r => r.json())
      .then(data => {
        if (data.slides && data.slides.length > 0) setSlides(data.slides);
      })
      .catch(() => {});
  }, []);

  // Auto-advance
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
  const isBonus = slide.isBonus || slide.id === 'f4';
  const hasAmbassador = !!slide.ambassador_url;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: 'clamp(400px, 54vw, 540px)', background: '#060D0A' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Backgrounds ──────────────────────────────────────────────────── */}
      {slides.map((s, i) => {
        const thisIsBonus = s.isBonus || s.id === 'f4';
        return (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0, zIndex: 0 }}
          >
            {thisIsBonus ? (
              <>
                {/* Rich green gradient for bonus slide */}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg,#003d1a 0%,#00200e 40%,#011208 100%)' }} />
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.05 }}>
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00E664" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                  {/* Glow circles */}
                  <div className="absolute rounded-full pointer-events-none"
                    style={{ width:500,height:500,top:-100,right:-100,
                      background:`radial-gradient(circle,${s.accent_color}15 0%,transparent 70%)` }} />
                  <div className="absolute rounded-full pointer-events-none"
                    style={{ width:300,height:300,bottom:-50,left:-50,
                      background:`radial-gradient(circle,${s.accent_color}10 0%,transparent 70%)` }} />
                  {/* Particles */}
                  {[...Array(8)].map((_,j) => (
                    <div key={j} className="absolute rounded-full animate-pulse"
                      style={{ width:j%2===0?4:6, height:j%2===0?4:6,
                        background:s.accent_color, left:`${10+j*11}%`,
                        top:`${20+(j%3)*25}%`, opacity:0.25+(j%3)*0.1,
                        animationDuration:`${2+j*0.4}s` }} />
                  ))}
                </div>
                <div className="absolute inset-0" style={{ background:'rgba(0,0,0,0.2)' }} />
              </>
            ) : (
              <>
                {/* Stadium photo */}
                <img src={s.bg_image_url} alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  style={{ filter:'brightness(0.55) saturate(1.2)', transform:'scale(1.04)' }} />
                {/* Gradient overlay */}
                <div className="absolute inset-0"
                  style={{ background:'linear-gradient(100deg,rgba(6,13,10,0.88) 0%,rgba(6,13,10,0.58) 52%,rgba(6,13,10,0.18) 100%)' }} />
              </>
            )}
            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-20"
              style={{ background:'linear-gradient(to top,rgba(6,13,10,1),transparent)' }} />
            {/* Accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background:s.accent_color, opacity:0.5 }} />
          </div>
        );
      })}

      {/* ── Ambassador image (full bleed, right side) ─────────────────────── */}
      {hasAmbassador && (
        <div
          className="absolute hidden lg:block pointer-events-none"
          style={{ zIndex: 1, right: '260px', bottom: 0, top: 0, width: '280px' }}
        >
          <img
            src={slide.ambassador_url}
            alt="KwachaBet Ambassador"
            style={{
              position:       'absolute',
              bottom:         0,
              left:           '50%',
              transform:      'translateX(-50%)',
              height:         '105%',
              width:          'auto',
              objectFit:      'contain',
              objectPosition: 'bottom center',
              filter:         'drop-shadow(-8px 0 24px rgba(0,0,0,0.6))',
            }}
          />
        </div>
      )}

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center" style={{ zIndex: 2 }}>
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between gap-4">

          {/* Left — headline + CTAs */}
          <div className="flex-1 min-w-0" style={{ maxWidth: hasAmbassador ? 480 : 560 }}>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
              style={{ background:slide.badge_color+'20', border:`1px solid ${slide.badge_color}50`, color:slide.badge_color }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:slide.badge_color }} />
              {slide.badge}
            </div>

            {/* Headline */}
            <h1 className="font-black leading-none mb-2 text-white"
              style={{ fontSize:'clamp(28px,5.2vw,54px)', letterSpacing:'-2px' }}>
              {slide.headline}<br />
              <span style={{ color:slide.accent_color }}>{slide.accent}</span>
            </h1>

            {/* Sub */}
            <p className="mb-5" style={{ fontSize:'clamp(13px,1.5vw,16px)', color:'#8A9E97', lineHeight:1.6 }}>
              {slide.sub}
            </p>

            {/* Trust badges */}
            {slide.trust_badges && (
              <div className="flex flex-wrap gap-3 mb-6">
                {slide.trust_badges.map((b,i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs font-medium" style={{ color:'#8A9E97' }}>
                    <span style={{ color:slide.accent_color }}>✓</span>{b}
                  </div>
                ))}
              </div>
            )}

            {/* CTAs */}
            <div className="flex gap-3 flex-wrap">
              <Link href={slide.cta_href}
                className="inline-flex items-center px-6 md:px-8 py-3 rounded-xl font-bold text-black transition-all hover:brightness-110 active:scale-95"
                style={{ background:slide.accent_color==='#FFD700'?'#FFD700':'#00E664',
                  fontSize:'clamp(13px,1.4vw,15px)', boxShadow:`0 4px 20px ${slide.accent_color}40` }}>
                {slide.cta_text}
              </Link>
              <Link href={slide.cta2_href}
                className="inline-flex items-center px-6 md:px-8 py-3 rounded-xl font-semibold text-white border transition-all hover:bg-white/5 active:scale-95"
                style={{ borderColor:'#1E3024', fontSize:'clamp(13px,1.4vw,15px)' }}>
                {slide.cta2_text}
              </Link>
            </div>
          </div>

          {/* Right — boost / promo card */}
          <div className="hidden lg:block flex-shrink-0" style={{ width: 240 }}>
            <div className="rounded-2xl p-5"
              style={{ background:'rgba(13,25,17,0.92)', border:'1px solid #1E3024', backdropFilter:'blur(20px)' }}>

              {/* Card label */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-black px-2.5 py-1 rounded-full"
                  style={{ background:slide.accent_color+'20', color:slide.accent_color }}>
                  {isBonus ? '🎁' : '📈'} {slide.boost_label}
                </span>
              </div>

              <p className="text-white font-bold text-sm mb-4 leading-snug">{slide.boost_team}</p>

              {/* Odds / amount display */}
              {slide.boost_was ? (
                <div className="mb-5">
                  <div className="text-xs line-through mb-0.5" style={{ color:'#4A6B56' }}>WAS {slide.boost_was}</div>
                  <div className="text-xs font-semibold mb-1" style={{ color:'#8A9E97' }}>NOW</div>
                  <div className="font-black" style={{ fontSize:40, color:slide.accent_color, fontFamily:'monospace', lineHeight:1 }}>
                    {slide.boost_now}
                    <span className="text-lg ml-1" style={{ color:'#00E664' }}>↑</span>
                  </div>
                </div>
              ) : (
                <div className="mb-5">
                  {isBonus && <div className="text-xs font-semibold mb-1" style={{ color:'#8A9E97' }}>UP TO</div>}
                  <div className="font-black" style={{ fontSize:isBonus?26:36, color:slide.accent_color, fontFamily:'monospace', lineHeight:1.1 }}>
                    {slide.boost_now}
                  </div>
                </div>
              )}

              {/* CTA button */}
              <Link href={slide.cta_href}
                className="block w-full text-center py-3 rounded-xl text-sm font-bold text-black transition-all hover:brightness-110"
                style={{ background:slide.accent_color==='#FFD700'?'#FFD700':'#00E664' }}>
                {isBonus ? 'Claim Bonus →' : slide.boost_was ? 'Boost Now' : slide.cta_text}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Left arrow ────────────────────────────────────────────────────── */}
      <button onClick={() => goTo(current - 1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white text-xl border transition-all hover:border-white/30 active:scale-90"
        style={{ zIndex:10, background:'rgba(0,0,0,0.5)', borderColor:'#1E3024' }}
        aria-label="Previous">‹</button>

      {/* ── Right arrow ───────────────────────────────────────────────────── */}
      <button onClick={() => goTo(current + 1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white text-xl border transition-all hover:border-white/30 active:scale-90"
        style={{ zIndex:10, background:'rgba(0,0,0,0.5)', borderColor:'#1E3024' }}
        aria-label="Next">›</button>

      {/* ── Dots ──────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5" style={{ zIndex:10 }}>
        {slides.map((_,i) => (
          <button key={i} onClick={() => goTo(i)}
            className="h-1.5 rounded-full border-none cursor-pointer transition-all duration-300"
            style={{ width:i===current?28:6, background:i===current?slide.accent_color:'rgba(255,255,255,0.25)' }}
            aria-label={`Slide ${i+1}`} />
        ))}
      </div>

      {/* ── Progress bar ──────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ zIndex:10, background:'#1E3024' }}>
        <div className="h-full transition-all duration-500"
          style={{ background:slide.accent_color, width:`${((current+1)/slides.length)*100}%` }} />
      </div>
    </section>
  );
}
