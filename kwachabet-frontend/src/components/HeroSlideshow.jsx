import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const FALLBACK_SLIDES = [
  {
    id: 'f1',
    badge: "TODAY'S FOOTBALL ⚽",
    badge_color: '#F5A623',
    headline: 'BET SMART.',
    accent: 'WIN MORE.',
    sub: "Malawi's #1 Sports Betting Platform.",
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
    sub: 'Bet on EPL, UCL and more.',
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
    sub: 'Pick all winners. Take home Malawi\'s biggest prize.',
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
    trust_badges: ['Entry from MWK 200', 'Guaranteed Prize', 'Every Week'],
  },
  {
    id: 'f4',
    badge: 'WELCOME BONUS 🎁',
    badge_color: '#00E664',
    headline: '100% MATCH',
    accent: 'BONUS.',
    sub: 'Up to MWK 50,000 on your first deposit.',
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
    trust_badges: ['New customers only', 'Min MWK 500', 'T&Cs apply'],
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
      <style>{`
        @keyframes kb-pulse {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:.5;transform:scale(1.35)}
        }

        /* ── Hero container ─────────────────────────────── */
        .kb-hero {
          position:relative;width:100%;
          overflow:hidden;background:#060D0A;
        }

        /* ── Inner wrapper — flex row ───────────────────── */
        .kb-inner {
          position:absolute;inset:0;
          display:flex;align-items:center;
          max-width:1280px;margin:0 auto;
          padding:0 48px;gap:0;z-index:3;
        }

        /* ── Content ────────────────────────────────────── */
        .kb-content {
          flex:1;min-width:0;
          display:flex;flex-direction:column;
          justify-content:center;
          /* Padding keeps content away from ambassador */
          padding-right:8px;
          position:relative;z-index:2;
        }

        /* ── Ambassador zone ────────────────────────────── */
        .kb-amb {
          position:relative;
          flex-shrink:0;
          /* Desktop */
          width:240px;height:100%;
          overflow:visible;
          z-index:1; /* behind card */
        }
        .kb-amb img {
          position:absolute;
          bottom:-2px;left:50%;
          transform:translateX(-50%);
          height:110%;width:auto;
          max-width:none;
          object-fit:contain;
          object-position:bottom center;
          pointer-events:none;user-select:none;
          filter:drop-shadow(-4px 0 18px rgba(0,0,0,.7));
        }

        /* ── Boost card ─────────────────────────────────── */
        .kb-card {
          flex-shrink:0;
          width:230px;
          z-index:3; /* always above ambassador */
        }
        .kb-card-inner {
          background:rgba(10,22,14,.95);
          border:1px solid #1E3024;
          border-radius:16px;
          padding:18px 16px;
          backdrop-filter:blur(20px);
        }

        /* ── Headline ───────────────────────────────────── */
        .kb-h1 {
          font-weight:900;line-height:1.0;
          letter-spacing:-2px;color:#fff;
          margin:0 0 8px;
          /* Desktop default */
          font-size:52px;
        }

        /* ── Sub ────────────────────────────────────────── */
        .kb-sub {
          color:#8A9E97;line-height:1.6;
          margin:0 0 12px;
          font-size:15px;
        }

        /* ── Trust badges ───────────────────────────────── */
        .kb-trust {
          display:flex;flex-wrap:wrap;
          gap:8px 14px;margin-bottom:20px;
        }
        .kb-trust-item {
          display:flex;align-items:center;
          gap:5px;font-size:12px;
          font-weight:500;color:#8A9E97;
        }

        /* ── Buttons ────────────────────────────────────── */
        .kb-btns{display:flex;gap:10px;flex-wrap:wrap;}
        .kb-btn-p {
          display:inline-flex;align-items:center;
          padding:12px 26px;border-radius:12px;
          font-weight:700;font-size:14px;color:#000;
          border:none;cursor:pointer;
          text-decoration:none;white-space:nowrap;
          transition:filter .15s,transform .1s;
        }
        .kb-btn-p:hover{filter:brightness(1.1);}
        .kb-btn-p:active{transform:scale(.97);}
        .kb-btn-s {
          display:inline-flex;align-items:center;
          padding:12px 20px;border-radius:12px;
          font-weight:600;font-size:14px;color:#fff;
          background:transparent;
          border:1px solid rgba(255,255,255,.2);
          cursor:pointer;text-decoration:none;
          white-space:nowrap;
          transition:background .15s,transform .1s;
        }
        .kb-btn-s:hover{background:rgba(255,255,255,.07);}
        .kb-btn-s:active{transform:scale(.97);}

        /* ── Dots ───────────────────────────────────────── */
        .kb-dots {
          position:absolute;bottom:16px;
          left:50%;transform:translateX(-50%);
          display:flex;gap:5px;z-index:10;
        }
        .kb-dot {
          height:5px;border-radius:3px;
          border:none;cursor:pointer;padding:0;
          transition:all .3s;
        }

        /* ── Arrows ─────────────────────────────────────── */
        .kb-arr {
          position:absolute;top:50%;
          transform:translateY(-50%);
          width:34px;height:34px;
          border-radius:50%;
          display:flex;align-items:center;
          justify-content:center;
          font-size:20px;color:#fff;
          background:rgba(0,0,0,.5);
          border:1px solid #1E3024;
          cursor:pointer;z-index:10;
          transition:border-color .15s,transform .1s;
        }
        .kb-arr:hover{border-color:rgba(255,255,255,.3);}
        .kb-arr:active{transform:translateY(-50%) scale(.92);}

        /* ════════════════════════════════════════════════
           RESPONSIVE BREAKPOINTS
           ════════════════════════════════════════════════ */

        /* 1280px */
        @media(max-width:1280px){
          .kb-inner{padding:0 28px;}
          .kb-h1{font-size:44px;}
          .kb-amb{width:210px;}
          .kb-card{width:210px;}
        }

        /* 1024px — tablet landscape */
        @media(max-width:1024px){
          .kb-inner{padding:0 20px;}
          .kb-h1{font-size:38px;letter-spacing:-1.5px;}
          .kb-sub{font-size:13px;}
          .kb-amb{width:190px;}
          .kb-card{width:195px;}
          .kb-card-inner{padding:14px 12px;}
          .kb-trust-item{font-size:11px;}
        }

        /* 768px — tablet portrait */
        @media(max-width:768px){
          .kb-inner{padding:0 16px;}
          .kb-h1{font-size:32px;letter-spacing:-1px;}
          .kb-sub{font-size:12.5px;margin-bottom:10px;}
          .kb-trust{gap:6px 10px;margin-bottom:14px;}
          .kb-trust-item{font-size:11px;}
          .kb-btns{gap:8px;}
          .kb-btn-p,.kb-btn-s{padding:10px 16px;font-size:13px;border-radius:10px;}
          /* Ambassador smaller on tablet */
          .kb-amb{width:150px;}
          .kb-amb img{height:100%;}
          /* Hide card on tablet portrait */
          .kb-card{display:none;}
        }

        /* 480px — large phone */
        @media(max-width:480px){
          .kb-inner{padding:0 12px;}
          .kb-h1{font-size:26px;letter-spacing:-.8px;margin-bottom:6px;}
          .kb-sub{font-size:12px;margin-bottom:8px;}
          .kb-trust{gap:5px 8px;margin-bottom:12px;}
          .kb-trust-item{font-size:10.5px;}
          .kb-btn-p,.kb-btn-s{padding:9px 14px;font-size:12px;border-radius:9px;}
          .kb-btns{gap:7px;}
          /* Ambassador on right, 40% of width */
          .kb-amb{width:38%;}
          .kb-amb img{height:95%;}
        }

        /* 390px — iPhone 14 */
        @media(max-width:390px){
          .kb-h1{font-size:24px;letter-spacing:-.5px;}
          .kb-sub{font-size:11.5px;}
          .kb-amb{width:36%;}
          .kb-trust-item{font-size:10px;}
          .kb-btn-p,.kb-btn-s{padding:8px 12px;font-size:11.5px;}
        }

        /* 375px — iPhone SE / older */
        @media(max-width:375px){
          .kb-inner{padding:0 10px;}
          .kb-h1{font-size:22px;}
          .kb-sub{font-size:11px;}
          .kb-amb{width:34%;}
          .kb-trust{gap:4px 6px;margin-bottom:10px;}
          .kb-btn-p,.kb-btn-s{padding:8px 11px;font-size:11px;}
        }

        /* 320px — small Android */
        @media(max-width:320px){
          .kb-h1{font-size:20px;letter-spacing:0px;}
          .kb-sub{font-size:10.5px;}
          .kb-amb{width:32%;}
          .kb-btn-p,.kb-btn-s{padding:7px 10px;font-size:10.5px;}
        }

        /* Hero height by breakpoint */
        @media(min-width:1281px)  {.kb-hero{height:520px;}}
        @media(max-width:1280px)  {.kb-hero{height:490px;}}
        @media(max-width:1024px)  {.kb-hero{height:450px;}}
        @media(max-width:768px)   {.kb-hero{height:400px;}}
        @media(max-width:480px)   {.kb-hero{height:360px;}}
        @media(max-width:375px)   {.kb-hero{height:340px;}}
        @media(max-width:320px)   {.kb-hero{height:320px;}}

        /* Arrow size on small screens */
        @media(max-width:480px){
          .kb-arr{width:28px;height:28px;font-size:17px;}
        }
      `}</style>

      <section
        className="kb-hero"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-label="KwachaBet promotions"
      >
        {/* ── Backgrounds ──────────────────────────────────────────── */}
        {slides.map((s, i) => {
          const bonus = !!(s.isBonus || s.id === 'f4');
          return (
            <div key={s.id} style={{
              position:'absolute',inset:0,zIndex:0,
              opacity:i===current?1:0,
              transition:'opacity .7s ease',
            }}>
              {bonus || !s.bg_image_url ? (
                <>
                  <div style={{position:'absolute',inset:0,
                    background:'linear-gradient(135deg,#003d1a 0%,#001f0d 50%,#010f06 100%)'}}/>
                  <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:.05}}>
                    <defs>
                      <pattern id={`g${s.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M40 0L0 0 0 40" fill="none" stroke="#00E664" strokeWidth=".5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#g${s.id})`}/>
                  </svg>
                  <div style={{position:'absolute',inset:0,
                    background:'radial-gradient(ellipse at 80% 50%,rgba(0,230,100,.09) 0%,transparent 60%)'}}/>
                </>
              ) : (
                <>
                  <img src={s.bg_image_url} alt="" style={{
                    position:'absolute',inset:0,width:'100%',height:'100%',
                    objectFit:'cover',objectPosition:'center',
                    filter:'brightness(.55) saturate(1.2)',
                    transform:'scale(1.04)',pointerEvents:'none',
                  }}/>
                  <div style={{position:'absolute',inset:0,
                    background:'linear-gradient(105deg,rgba(6,13,10,.92) 0%,rgba(6,13,10,.62) 46%,rgba(6,13,10,.12) 100%)'}}/>
                </>
              )}
              <div style={{position:'absolute',bottom:0,left:0,right:0,height:80,
                background:'linear-gradient(to top,rgba(6,13,10,1),transparent)'}}/>
              <div style={{position:'absolute',bottom:0,left:0,right:0,height:2,
                background:s.accent_color,opacity:.45}}/>
            </div>
          );
        })}

        {/* ── Flex layout ─────────────────────────────────────────── */}
        <div className="kb-inner">

          {/* 1 — CONTENT LEFT */}
          <div className="kb-content">
            {/* Badge */}
            <div style={{
              display:'inline-flex',alignItems:'center',gap:6,
              padding:'4px 12px',borderRadius:20,
              fontSize:11,fontWeight:700,letterSpacing:'.06em',
              marginBottom:12,
              background:slide.badge_color+'1e',
              border:`1px solid ${slide.badge_color}44`,
              color:slide.badge_color,
              width:'fit-content',
            }}>
              <span style={{
                width:6,height:6,borderRadius:'50%',
                background:slide.badge_color,display:'inline-block',
                animation:'kb-pulse 1.4s ease infinite',flexShrink:0,
              }}/>
              {slide.badge}
            </div>

            {/* Headline */}
            <h1 className="kb-h1">
              {slide.headline}<br/>
              <span style={{color:slide.accent_color}}>{slide.accent}</span>
            </h1>

            {/* Sub */}
            <p className="kb-sub">{slide.sub}</p>

            {/* Trust badges */}
            {slide.trust_badges && (
              <div className="kb-trust">
                {slide.trust_badges.map((b,i) => (
                  <div key={i} className="kb-trust-item">
                    <span style={{color:slide.accent_color,fontWeight:800}}>✓</span>{b}
                  </div>
                ))}
              </div>
            )}

            {/* CTAs */}
            <div className="kb-btns">
              <Link href={slide.cta_href} className="kb-btn-p" style={{
                background:slide.accent_color==='#FFD700'?'#FFD700':'#00E664',
                boxShadow:`0 4px 18px ${slide.accent_color}35`,
              }}>
                {slide.cta_text}
              </Link>
              <Link href={slide.cta2_href} className="kb-btn-s">
                {slide.cta2_text}
              </Link>
            </div>
          </div>

          {/* 2 — AMBASSADOR MIDDLE (all screens, smaller on mobile) */}
          {hasAmbassador && (
            <div className="kb-amb" aria-hidden="true">
              <img src={slide.ambassador_url} alt="KwachaBet Ambassador"/>
            </div>
          )}

          {/* 3 — BOOST CARD RIGHT (desktop + tablet landscape only) */}
          <div className="kb-card">
            <div className="kb-card-inner">
              <div style={{marginBottom:10}}>
                <span style={{
                  fontSize:11,fontWeight:800,padding:'3px 9px',
                  borderRadius:20,letterSpacing:'.05em',
                  background:slide.accent_color+'1e',
                  color:slide.accent_color,
                }}>
                  {isBonus?'🎁':'📈'} {slide.boost_label}
                </span>
              </div>
              <p style={{color:'#fff',fontWeight:700,fontSize:13,marginBottom:12,lineHeight:1.4}}>
                {slide.boost_team}
              </p>
              {slide.boost_was ? (
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:11,color:'#4A6B56',textDecoration:'line-through',marginBottom:2}}>
                    WAS {slide.boost_was}
                  </div>
                  <div style={{fontSize:11,fontWeight:600,color:'#8A9E97',marginBottom:3}}>NOW</div>
                  <div style={{fontSize:40,fontWeight:900,color:slide.accent_color,fontFamily:'monospace',lineHeight:1}}>
                    {slide.boost_now}
                    <span style={{fontSize:17,marginLeft:4,color:'#00E664'}}>↑</span>
                  </div>
                </div>
              ) : (
                <div style={{marginBottom:16}}>
                  {isBonus && <div style={{fontSize:11,fontWeight:600,color:'#8A9E97',marginBottom:3}}>UP TO</div>}
                  <div style={{fontSize:isBonus?22:34,fontWeight:900,color:slide.accent_color,fontFamily:'monospace',lineHeight:1.1}}>
                    {slide.boost_now}
                  </div>
                </div>
              )}
              <Link href={slide.cta_href} style={{
                display:'block',width:'100%',textAlign:'center',
                padding:'10px 0',borderRadius:10,fontSize:13,fontWeight:700,
                color:'#000',textDecoration:'none',
                background:slide.accent_color==='#FFD700'?'#FFD700':'#00E664',
              }}>
                {isBonus?'Claim Bonus →':slide.boost_was?'Boost Now':slide.cta_text}
              </Link>
            </div>
          </div>
        </div>

        {/* ── Arrows ───────────────────────────────────────────────── */}
        <button className="kb-arr" style={{left:8}} onClick={()=>goTo(current-1)} aria-label="Previous">‹</button>
        <button className="kb-arr" style={{right:8}} onClick={()=>goTo(current+1)} aria-label="Next">›</button>

        {/* ── Dots ─────────────────────────────────────────────────── */}
        <div className="kb-dots">
          {slides.map((_,i)=>(
            <button key={i} className="kb-dot"
              style={{width:i===current?26:6,background:i===current?slide.accent_color:'rgba(255,255,255,.28)'}}
              onClick={()=>goTo(i)} aria-label={`Slide ${i+1}`}/>
          ))}
        </div>

        {/* ── Progress bar ─────────────────────────────────────────── */}
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:2,background:'#1E3024',zIndex:10}}>
          <div style={{height:'100%',background:slide.accent_color,transition:'width .5s ease',
            width:`${((current+1)/slides.length)*100}%`}}/>
        </div>
      </section>
    </>
  );
}
