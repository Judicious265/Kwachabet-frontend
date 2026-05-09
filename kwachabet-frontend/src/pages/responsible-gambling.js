import Head from 'next/head';
import Navbar from '../components/common/Navbar';
import { Footer, PageLayout } from '../components/common';
export default function ResponsiblePage() {
  return (
    <>
      <Head><title>Responsible Gambling — Kwacha Bet</title></Head>
      <div className="min-h-screen bg-dark">
        <Navbar />
        <PageLayout title="Responsible Gambling" subtitle="We care about your wellbeing">
          <div className="max-w-2xl space-y-4">
            <div className="card p-5 border-brand/20 bg-brand/5"><p className="text-white font-semibold mb-2">Gambling should be fun — keep it that way.</p><p className="text-gray-400 text-sm leading-relaxed">Kwacha Bet is committed to responsible gambling. Gamble for entertainment only, within your means, and never chase losses.</p></div>
            <div className="card p-5">
              <h3 className="text-white font-bold mb-3">Signs of Problem Gambling</h3>
              <ul className="space-y-2">{['Spending more than you can afford','Borrowing money to gamble','Chasing losses','Neglecting work or family','Feeling anxious or secretive about gambling','Unable to stop even when you want to'].map((s,i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-400"><span className="text-red-400 mt-0.5">⚠</span>{s}</li>)}</ul>
            </div>
            <div className="card p-5">
              <h3 className="text-white font-bold mb-3">Get Help</h3>
              <a href="https://www.gamblingtherapy.org" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-dark-surface rounded-xl p-3 hover:bg-dark-hover transition-all border border-dark-border">
                <div><p className="text-brand text-sm font-medium">GamblingTherapy.org</p><p className="text-gray-500 text-xs">Free online support and counselling</p></div>
                <span className="text-gray-500">→</span>
              </a>
            </div>
          </div>
        </PageLayout>
        <Footer />
      </div>
    </>
  );
}
