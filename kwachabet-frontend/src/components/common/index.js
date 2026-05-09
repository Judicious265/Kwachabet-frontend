import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-dark-surface border-t border-dark-border mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center">
                <span className="text-black font-black text-xs">K</span>
              </div>
              <span className="text-white font-black">Kwacha<span className="text-brand">Bet</span></span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">Malawi&apos;s premier online sports betting platform.</p>
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-3">Sports</p>
            {['Football','Basketball','Tennis','Ice Hockey','Baseball','Rugby'].map(s => (
              <Link key={s} href={`/?sport=${s.toLowerCase()}`} className="block text-gray-500 text-xs hover:text-gray-300 mb-1.5">{s}</Link>
            ))}
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-3">Account</p>
            {[{h:'/register',l:'Register'},{h:'/login',l:'Login'},{h:'/wallet',l:'My Wallet'},{h:'/tickets',l:'My Tickets'},{h:'/referral',l:'Refer & Earn'}].map(i => (
              <Link key={i.h} href={i.h} className="block text-gray-500 text-xs hover:text-gray-300 mb-1.5">{i.l}</Link>
            ))}
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-3">Help</p>
            {[{h:'/help',l:'Help Centre'},{h:'/terms',l:'Terms & Conditions'},{h:'/privacy',l:'Privacy Policy'},{h:'/responsible-gambling',l:'Responsible Gambling'},{h:'/contact',l:'Contact Us'}].map(i => (
              <Link key={i.h} href={i.h} className="block text-gray-500 text-xs hover:text-gray-300 mb-1.5">{i.l}</Link>
            ))}
          </div>
        </div>
        <div className="border-t border-dark-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs text-gray-600">© 2024 Kwacha Bet. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Payments:</span>
            {['Airtel Money','TNM Mpamba','Bank'].map(m => (
              <span key={m} className="text-xs bg-dark-card border border-dark-border px-2 py-0.5 rounded text-gray-400">{m}</span>
            ))}
          </div>
        </div>
        <p className="text-center text-xs text-gray-700 mt-4">18+ only. Gamble responsibly. GamblingTherapy.org</p>
      </div>
    </footer>
  );
}

export function LiveTicker({ events = [] }) {
  const live = events.filter(e => e.status === 'live');
  if (!live.length) return null;
  return (
    <div className="bg-dark-card border-b border-dark-border overflow-hidden h-8 flex items-center">
      <div className="flex-shrink-0 bg-red-600 text-white text-xs font-bold px-3 h-full flex items-center">LIVE</div>
      <div className="overflow-hidden flex-1">
        <div className="flex gap-10 animate-ticker whitespace-nowrap">
          {[...live, ...live].map((e, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs text-gray-300">
              <span className="text-white font-medium">{e.home_team}</span>
              <span className="text-brand font-bold">{e.home_score ?? 0} – {e.away_score ?? 0}</span>
              <span className="text-white font-medium">{e.away_team}</span>
              <span className="text-dark-border mx-2">|</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Spinner({ size = 'md', className = '' }) {
  const sz = { sm: 'w-4 h-4 border-2', md: 'w-6 h-6 border-2', lg: 'w-10 h-10 border-2' }[size];
  return <div className={`${sz} border-dark-border border-t-brand rounded-full animate-spin ${className}`} />;
}

export function EmptyState({ icon = '📭', title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="text-5xl mb-4">{icon}</div>
      <p className="text-white font-semibold text-lg mb-2">{title}</p>
      {subtitle && <p className="text-gray-500 text-sm mb-6 max-w-xs">{subtitle}</p>}
      {action}
    </div>
  );
}

export function PageLayout({ children, title, subtitle, action }) {
  return (
    <div className="page-container">
      {(title || action) && (
        <div className="flex items-center justify-between mb-6">
          <div>
            {title && <h1 className="text-2xl font-black text-white">{title}</h1>}
            {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    won:       'badge badge-won',
    lost:      'badge badge-lost',
    pending:   'badge badge-pending',
    active:    'badge bg-green-900/40 text-green-400 border border-green-800',
    suspended: 'badge bg-red-900/40 text-red-400 border border-red-800',
    completed: 'badge bg-blue-900/40 text-blue-400 border border-blue-800',
    processing:'badge bg-yellow-900/40 text-yellow-400 border border-yellow-800',
    flagged:   'badge bg-red-900/40 text-red-400 border border-red-800',
    cancelled: 'badge bg-gray-800 text-gray-400 border border-gray-700',
  };
  return <span className={map[status] || 'badge bg-gray-800 text-gray-400'}>{status}</span>;
}
