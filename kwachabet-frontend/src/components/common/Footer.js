/**
 * Footer.js — KwachaBet site footer
 * Logo, nav links, payment icons, 18+, responsible gambling
 */
import Link from 'next/link';

const FOOTER_LINKS = {
  Company: [
    { label: 'About Us',      href: '/about' },
    { label: 'Careers',       href: '/careers' },
    { label: 'News',          href: '/news' },
    { label: 'Press',         href: '/press' },
  ],
  Help: [
    { label: 'Contact Us',    href: '/contact' },
    { label: 'FAQ',           href: '/faq' },
    { label: 'Live Chat',     href: '/support' },
    { label: 'How to Bet',    href: '/how-to-bet' },
  ],
  Legal: [
    { label: 'Terms & Conditions',    href: '/terms' },
    { label: 'Privacy Policy',        href: '/privacy' },
    { label: 'Responsible Gambling',  href: '/responsible-gambling' },
    { label: 'Cookie Policy',         href: '/cookies' },
  ],
  Sports: [
    { label: 'Football',      href: '/sports/football' },
    { label: 'Basketball',    href: '/sports/basketball' },
    { label: 'Tennis',        href: '/sports/tennis' },
    { label: 'All Sports',    href: '/sports' },
  ],
};

const SOCIAL = [
  { label: 'Facebook',  href: 'https://facebook.com/kwachabet',  icon: 'f' },
  { label: 'Twitter/X', href: 'https://twitter.com/kwachabet',   icon: '𝕏' },
  { label: 'Instagram', href: 'https://instagram.com/kwachabet', icon: '📸' },
  { label: 'WhatsApp',  href: 'https://wa.me/265998337818',      icon: '💬' },
];

export default function Footer() {
  return (
    <footer style={{ background: '#050C08', borderTop: '1px solid #1E3024', marginBottom: 60 }} className="lg:mb-0">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-6">

        {/* Top row: logo + link columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-black"
                style={{ background: '#00E664', fontSize: 16 }}
              >
                KB
              </div>
              <div>
                <p className="font-black text-white leading-none">
                  Kwacha<span style={{ color: '#00E664' }}>Bet</span>
                </p>
                <p className="text-xs" style={{ color: '#4A6B56' }}>Bet Smart. Win More.</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed mb-4" style={{ color: '#4A6B56' }}>
              Malawi&apos;s most trusted sports betting platform. Licensed and regulated.
            </p>

            {/* Social icons */}
            <div className="flex gap-2">
              {SOCIAL.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm border transition-all hover:border-white/30"
                  style={{ borderColor: '#1E3024', color: '#8A9E97' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="text-xs font-bold text-white mb-3 tracking-wide uppercase">{section}</p>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs transition-all hover:text-white"
                      style={{ color: '#4A6B56' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div
          className="flex flex-wrap items-center gap-4 py-5 border-t border-b mb-6"
          style={{ borderColor: '#1E3024' }}
        >
          <span className="text-xs font-bold text-white mr-2">Payments</span>

          {/* Airtel Money */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: '#1a0a00', border: '1px solid #3d1a00', color: '#FF6600' }}
          >
            📱 Airtel Money
          </div>

          {/* TNM Mpamba */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: '#001a1a', border: '1px solid #003d3d', color: '#00CCCC' }}
          >
            📱 TNM Mpamba
          </div>

          {/* Visa */}
          <div
            className="flex items-center justify-center px-4 py-1.5 rounded-lg text-sm font-black italic"
            style={{ background: '#1a1a3d', border: '1px solid #333380', color: '#fff', letterSpacing: '-0.5px' }}
          >
            VISA
          </div>

          {/* Mastercard */}
          <div
            className="flex items-center gap-0.5 px-3 py-1.5 rounded-lg"
            style={{ background: '#1a0a00', border: '1px solid #3d1a00' }}
          >
            <div className="w-5 h-5 rounded-full" style={{ background: '#EB001B', opacity: 0.9 }} />
            <div className="w-5 h-5 rounded-full -ml-2" style={{ background: '#F79E1B', opacity: 0.9 }} />
            <span className="text-xs font-bold text-white ml-1.5">Mastercard</span>
          </div>
        </div>

        {/* Responsible gambling + 18+ */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full font-black text-sm border-2 flex-shrink-0"
            style={{ borderColor: '#EF4444', color: '#EF4444' }}
          >
            18+
          </div>
          <p className="text-xs flex-1" style={{ color: '#4A6B56', minWidth: 200 }}>
            Gambling is for entertainment only. Please gamble responsibly. KwachaBet supports responsible
            gambling. If you feel you have a problem, please{' '}
            <Link href="/responsible-gambling" style={{ color: '#00E664' }}>
              seek help
            </Link>
            .
          </p>
          <Link
            href="/responsible-gambling"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all hover:bg-red-900/20"
            style={{ borderColor: '#3d1010', color: '#EF4444' }}
          >
            🛡️ Responsible Gambling
          </Link>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-2 pt-4 border-t"
          style={{ borderColor: '#1E3024' }}
        >
          <p className="text-xs" style={{ color: '#2A4030' }}>
            © {new Date().getFullYear()} KwachaBet. All rights reserved. Licensed by the Gaming Board of Malawi.
          </p>
          <div className="flex gap-4">
            {['Terms', 'Privacy', 'Cookies'].map(l => (
              <Link
                key={l}
                href={`/${l.toLowerCase()}`}
                className="text-xs transition-all hover:text-white"
                style={{ color: '#2A4030' }}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
