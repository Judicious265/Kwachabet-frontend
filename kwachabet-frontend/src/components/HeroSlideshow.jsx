import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const FALLBACK_SLIDES = [
  {
    id: 'f1',
    badge: "TODAY'S FOOTBALL ⚽",
    badge_color: '#F5A623',
    headline: 'BET SMART.',
    accent: 'WIN MORE.',
    sub: "Malawi's Most Trusted Sports Betting Platform.",
    bg_image_url: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1400&q=80&fit=crop',
    ambassador_url: '/ambassador.png',
    cta_text: 'Join Now →',
    cta_href: '/register',
    cta2_text: 'Explore Matches',
    cta2_href: '/sports',
    boost_label: 'ODDS BOOST',
    boost_team: 'Nyasa Bullets To Win',
    boost_was: '1.30',
    boost_now: '1.80',
    accent_color: '#00E664',
    trust_badges: ['Fast Payouts', 'Secure & Trusted', '24/7 Support'],
  },
  {
    id: 'f2',
    badge: 'PREMIER LEAGUE ⚽',
    badge_color: '#3B82F6',
    headline: 'BEST ODDS.',
    accent: 'GUARANTEED.',
    sub: 'Bet on Premier League, Champions League and more.',
    bg_image_url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1400&q=80&fit=crop',
    ambassador_url: null,
    cta_text: 'Bet Now →',
    cta_href: '/sports',
    cta2_text: 'View Markets',
    cta2_href: '/sports',
    boost_label: 'ODDS BOOST',
    boost_team: 'Man United To Win',
    boost_was: '2.10',
    boost_now: '2.45',
    accent_color: '#3B82F6',
    trust_badges: ['Best Odds', 'Instant Payouts', '100% Bonus'],
  },
  {
    id: 'f3',
    badge: 'MEGA JACKPOT 💰',
    badge_color: '#FFD700',
    headline: 'WIN UP TO',
    accent: 'MWK 50,000,000',
    sub: 'Pick all winners and take home the biggest prize in Malawi.',
    bg_image_url: 'https://images.unsplash.com/photo-1607457561901-e6ec3a6d16cf?w=1400&q=80&fit=crop',
    ambassador_url: null,
    cta_text: 'Enter Jackpot →',
    cta_href: '/jackpot',
    cta2_text: 'How It Works',
    cta2_href: '/jackpot',
    boost_label: 'THIS WEEK',
    boost_team: 'Jackpot Prize Pool',
    boost_was: null,
    boost_now: 'MWK 50M',
    accent_color: '#FFD700',
    trust_badges: ['Entry from MWK 200', 'Guaranteed Prize', 'New Every Week'],
  },
  {
    id: 'f4',
    badge: 'WELCOME BONUS 🎁',
    badge_color: '#00E664',
    headline: '100% MATCH',
    accent: 'BONUS.',
    sub: 'Up to MWK 50,000 on your first deposit. New customers only.',
    bg_image_url: null,
    ambassador_url: '/ambassador.png',
    cta_text: 'Claim Bonus →',
    cta_href: '/register',
    cta2_text: 'Terms Apply',
    cta2_href: '/terms',
    boost_label: 'WELCOME OFFER',
    boost_team: 'First Deposit Bonus',
    boost_was: null,
    boost_now: 'MWK 50,000',
    accent_color: '#00E664',
    trust_badges: ['New customers only', 'Min deposit MWK 500', 'T&Cs apply'],
    isBonus: true,
  },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function HeroSlideshow() {
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

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
  const isBonus = !!(slide.isBonus || slide.id === 'f4');
  const hasAmbassador = !!slide.ambassador_url;

  return (
    <>
      {/* Responsive styles injected once */}
      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: #060D0A;
          height: 520px;
        }
        /* Tablet */
        @media (max-width: 1024px) { .hero-section { height: 460px; } }
        /* Large mobile */
        @media (max-width: 768px)  { .hero-section { height: 420px; } }
        /* Small mobile */
        @media (max-width: 430px)  { .hero-section { height: 380px; } }
        @media (max-width: 375px)  { .hero-section { height: 360px; } }
        @media (max-width: 320px)  { .hero-section { height: 340px; } }

        /* Layout grid */
        .hero-grid {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: 1fr 280px 260px;
          grid-template-rows: 1fr;
          align-items: center;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 48px;
          gap: 0;
          z-index: 3;
        }
        @media (max-width: 1280px) {
          .hero-grid { padding: 0 32px; grid-template-columns: 1fr 240px 240px; }
        }
        @media (max-width: 1024px) {
          /* Hide ambassador on tablet, keep content + card */
          .hero-grid { grid-template-columns: 1fr 220px; padding: 0 24px; }
          .hero-ambassador-col { display: none; }
        }
        @media (max-width: 768px) {
          /* Mobile: content only, no card, no ambassador */
          .hero-grid { grid-template-columns: 1fr; padding: 0 16px; }
          .hero-ambassador-col { display: none; }
          .hero-card-col { display: none; }
        }

        /* Content column */
        .hero-content-col {
          grid-column: 1;
          padding-right: 24px;
          z-index: 3;
        }
        @media (max-width: 768px) { .hero-content-col { padding-right: 0; } }

        /* Ambassador column — middle */
        .hero-ambassador-col {
          grid-column: 2;
          position: relative;
          height: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          z-index: 4;
          overflow: visible;
        }
        .hero-ambassador-col img {
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          height: 110%;
          width: auto;
          max-width: none;
          object-fit: contain;
          object-position: bottom center;
          filter: drop-shadow(-6px 0 20px rgba(0,0,0,0.7));
          pointer-events: none;
          user-select: none;
        }
        @media (max-width: 1280px) { .hero-ambassador-col img { height: 105%; } }

        /* Card column — rightmost */
        .hero-card-col {
          grid-column: 3;
          z-index: 3;
        }
        @media (max-width: 1024px) { .hero-card-col { grid-column: 2; } }

        /* When no ambassador — card takes col 2 */
        .hero-grid.no-ambassador {
          grid-template-columns: 1fr 260px;
        }
        @media (max-width: 768px) { .hero-grid.no-ambassador { grid-template-columns: 1fr; } }
        .hero-grid.no-ambassador .hero-card-col { grid-column: 2; }
        @media (max-width: 768px) { .hero-grid.no-ambassador .hero-card-col { display: none; } }

        /* Typography responsive */
        .hero-headline {
          font-weight: 900;
          line-height: 1;
          letter-spacing: -2px;
          color: #fff;
          font-size: 54px;
          margin-bottom: 8px;
        }
        @media (max-width: 1280px) { .hero-headline { font-size: 46px; } }
        @media (max-width: 1024px) { .hero-headline { font-size: 40px; } }
        @media (max-width: 768px)  { .hero-headline { font-size: 34px; letter-spacing: -1px; } }
        @media (max-width: 430px)  { .hero-headline { font-size: 30px; } }
        @media (max-width: 375px)  { .hero-headline { font-size: 27px; } }
        @media (max-width: 320px)  { .hero-headline { font-size: 24px; } }

        .hero-sub {
          color: #8A9E97;
          line-height: 1.6;
          margin-bottom: 16px;
          font-size: 15px;
        }
        @media (max-width: 768px)  { .hero-sub { font-size: 13px; margin-bottom: 12px; } }
        @media (max-width: 375px)  { .hero-sub { font-size: 12px; } }

        .hero-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 24px;
        }
        @media (max-width: 768px)  { .hero-badges { gap: 8px; margin-bottom: 18px; } }
        @media (max-width: 375px)  { .hero-badges { gap: 6px; margin-bottom: 14px; } }

        .hero-badge-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 500;
          color: #8A9E97;
        }
        @media (max-width: 375px)  { .hero-badge-item { font-size: 11px; } }

        .hero-cta-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        @media (max-width: 375px)  { .hero-cta-row { gap: 8px; } }

        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          padding: 12px 28px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 15px;
          color: #000;
          border: none;
          cursor: pointer;
          transition: filter 0.15s, transform 0.1s;
          white-space: nowrap;
          text-decoration: none;
        }
        .hero-btn-primary:hover { filter: brightness(1.1); }
        .hero-btn-primary:active { transform: scale(0.97); }
        @media (max-width: 768px)  { .hero-btn-primary { padding: 11px 22px; font-size: 14px; } }
        @media (max-width: 375px)  { .hero-btn-primary { padding: 10px 18px; font-size: 13px; border-radius: 10px; } }

        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          color: #fff;
          background: transparent;
          border: 1px solid #1E3024;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          white-space: nowrap;
          text-decoration: none;
        }
        .hero-btn-secondary:hover { background: rgba(255,255,255,0.06); }
        .hero-btn-secondary:active { transform: scale(0.97); }
        @media (max-width: 768px)  { .hero-btn-secondary { padding: 11px 18px; font-size: 14px; } }
        @media (max-width: 375px)  { .hero-btn-secondary { padding: 10px 14px; font-size: 13px; border-radius: 10px; } }

        /* Mobile odds strip — only on mobile */
        .hero-mobile-odds {
          display: none;
          gap: 8px;
          margin-bottom: 16px;
        }
        @media (max-width: 768px) { .hero-mobile-odds { display: flex; } }

        .hero-mobile-odd {
          flex: 1;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 8px 4px;
          text-align: center;
        }

        /* Dots */
        .hero-dots {
          position: absolute;
          bottom: 18px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 10;
        }
        .hero-dot {
          height: 5px;
          border-radius: 3px;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          background: rgba(255,255,255,0.25);
          width: 6px;
          padding: 0;
        }
        .hero-dot.active {
          width: 26px;
        }

        /* Arrow buttons */
        .hero-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #fff;
          background: rgba(0,0,0,0.5);
          border: 1px solid #1E3024;
          cursor: pointer;
          z-index: 10;
          transition: border-color 0.15s, transform 0.1s;
        }
        .hero-arrow:hover { border-color: rgba(255,255,255,0.3); }
        .hero-arrow:active { transform: translateY(-50%) scale(0.92); }
        .hero-arrow.left  { left: 12px; }
        .hero-arrow.right { right: 12px; }
        @media (max-width: 375px) { .hero-arrow { width: 30px; height: 30px; font-size: 17px; } }

        /* Progress bar */
        .hero-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #1E3024;
          z-index: 10;
        }
        .hero-progress-fill {
          height: 100%;
          transition: width 0.5s ease;
        }
      `}</style>

      <section
        className="hero-section"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-label="KwachaBet promotions"
      >
        {/* ── Backgrounds ──────────────────────────────────────────────── */}
        {slides.map((s, i) => {
          const thisBonus = !!(s.isBonus || s.id === 'f4');
          return (
            <div
              key={s.id}
              style={{
                position: 'absolute', inset: 0, zIndex: 0,
                opacity: i === current ? 1 : 0,
                transition: 'opacity 0.7s ease',
              }}
            >
              {thisBonus || !s.bg_image_url ? (
                <>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#003d1a 0%,#001f0d 50%,#010f06 100%)' }} />
                  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.05 }}>
                    <defs>
                      <pattern id={`grid-${s.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00E664" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#grid-${s.id})`} />
                  </svg>
                  <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 70% 50%, rgba(0,230,100,0.08) 0%, transparent 60%)' }} />
                </>
              ) : (
                <>
                  <img src={s.bg_image_url} alt=""
                    style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', filter:'brightness(0.55) saturate(1.2)', transform:'scale(1.04)', pointerEvents:'none' }} />
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(105deg,rgba(6,13,10,0.92) 0%,rgba(6,13,10,0.65) 48%,rgba(6,13,10,0.15) 100%)' }} />
                </>
              )}
              {/* Bottom fade */}
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:80, background:'linear-gradient(to top,rgba(6,13,10,1),transparent)' }} />
              {/* Accent line */}
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:s.accent_color, opacity:0.5 }} />
            </div>
          );
        })}

        {/* ── Main grid ────────────────────────────────────────────────── */}
        <div className={`hero-grid${hasAmbassador ? '' : ' no-ambassador'}`}>

          {/* LEFT — content */}
          <div className="hero-content-col">
            {/* Badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:700, letterSpacing:'0.06em', marginBottom:14, background:slide.badge_color+'20', border:`1px solid ${slide.badge_color}45`, color:slide.badge_color }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:slide.badge_color, display:'inline-block', animation:'pulse 1.4s ease infinite' }} />
              {slide.badge}
            </div>

            {/* Headline */}
            <h1 className="hero-headline">
              {slide.headline}<br />
              <span style={{ color: slide.accent_color }}>{slide.accent}</span>
            </h1>

            {/* Sub */}
            <p className="hero-sub">{slide.sub}</p>

            {/* Trust badges */}
            {slide.trust_badges && (
              <div className="hero-badges">
                {slide.trust_badges.map((b, i) => (
                  <div key={i} className="hero-badge-item">
                    <span style={{ color: slide.accent_color, fontWeight: 700 }}>✓</span>
                    {b}
                  </div>
                ))}
              </div>
            )}

            {/* Mobile odds strip */}
            {slide.boost_was && (
              <div className="hero-mobile-odds">
                <div className="hero-mobile-odd">
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', marginBottom:2 }}>WAS</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.5)', textDecoration:'line-through' }}>{slide.boost_was}</div>
                </div>
                <div className="hero-mobile-odd" style={{ background:`${slide.accent_color}18`, borderColor:`${slide.accent_color}40` }}>
                  <div style={{ fontSize:10, color:slide.accent_color, marginBottom:2 }}>NOW</div>
                  <div style={{ fontSize:18, fontWeight:900, color:slide.accent_color, fontFamily:'monospace' }}>{slide.boost_now}</div>
                </div>
                <div className="hero-mobile-odd" style={{ background:'rgba(0,230,100,0.06)' }}>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', marginBottom:2 }}>BOOST</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#00E664' }}>↑ ACTIVE</div>
                </div>
              </div>
            )}

            {/* CTA buttons */}
            <div className="hero-cta-row">
              <Link href={slide.cta_href} className="hero-btn-primary"
                style={{ background: slide.accent_color === '#FFD700' ? '#FFD700' : '#00E664', boxShadow:`0 4px 20px ${slide.accent_color}40` }}>
                {slide.cta_text}
              </Link>
              <Link href={slide.cta2_href} className="hero-btn-secondary">
                {slide.cta2_text}
              </Link>
            </div>
          </div>

          {/* MIDDLE — ambassador (desktop only) */}
          {hasAmbassador && (
            <div className="hero-ambassador-col" aria-hidden="true">
              <img src={slide.ambassador_url} alt="KwachaBet Ambassador" />
            </div>
          )}

          {/* RIGHT — boost/promo card */}
          <div className={hasAmbassador ? 'hero-card-col' : 'hero-card-col'}>
            <div style={{ background:'rgba(13,25,17,0.93)', border:'1px solid #1E3024', borderRadius:16, padding:'20px', backdropFilter:'blur(20px)' }}>
              {/* Label */}
              <div style={{ marginBottom:12 }}>
                <span style={{ fontSize:11, fontWeight:800, padding:'4px 10px', borderRadius:20, background:slide.accent_color+'20', color:slide.accent_color, letterSpacing:'0.05em' }}>
                  {isBonus ? '🎁' : '📈'} {slide.boost_label}
                </span>
              </div>
              {/* Match / offer */}
              <p style={{ color:'#fff', fontWeight:700, fontSize:14, marginBottom:16, lineHeight:1.4 }}>
                {slide.boost_team}
              </p>
              {/* Odds / amount */}
              {slide.boost_was ? (
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:11, color:'#4A6B56', textDecoration:'line-through', marginBottom:2 }}>WAS {slide.boost_was}</div>
                  <div style={{ fontSize:11, fontWeight:600, color:'#8A9E97', marginBottom:4 }}>NOW</div>
                  <div style={{ fontSize:42, fontWeight:900, color:slide.accent_color, fontFamily:'monospace', lineHeight:1 }}>
                    {slide.boost_now}
                    <span style={{ fontSize:18, marginLeft:4, color:'#00E664' }}>↑</span>
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom:20 }}>
                  {isBonus && <div style={{ fontSize:11, fontWeight:600, color:'#8A9E97', marginBottom:4 }}>UP TO</div>}
                  <div style={{ fontSize:isBonus?26:38, fontWeight:900, color:slide.accent_color, fontFamily:'monospace', lineHeight:1.1 }}>
                    {slide.boost_now}
                  </div>
                </div>
              )}
              {/* Card CTA */}
              <Link href={slide.cta_href}
                style={{ display:'block', width:'100%', textAlign:'center', padding:'12px 0', borderRadius:12, fontSize:14, fontWeight:700, color:'#000', background:slide.accent_color==='#FFD700'?'#FFD700':'#00E664', textDecoration:'none' }}>
                {isBonus ? 'Claim Bonus →' : slide.boost_was ? 'Boost Now' : slide.cta_text}
              </Link>
            </div>
          </div>
        </div>

        {/* ── Arrows ───────────────────────────────────────────────────── */}
        <button className="hero-arrow left" onClick={() => goTo(current - 1)} aria-label="Previous slide">‹</button>
        <button className="hero-arrow right" onClick={() => goTo(current + 1)} aria-label="Next slide">›</button>

        {/* ── Dots ─────────────────────────────────────────────────────── */}
        <div className="hero-dots" role="tablist" aria-label="Slides">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot${i === current ? ' active' : ''}`}
              style={{ background: i === current ? slide.accent_color : 'rgba(255,255,255,0.25)' }}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === current}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* ── Progress bar ─────────────────────────────────────────────── */}
        <div className="hero-progress">
          <div className="hero-progress-fill"
            style={{ width:`${((current+1)/slides.length)*100}%`, background:slide.accent_color }} />
        </div>
      </section>
    </>
  );
}
