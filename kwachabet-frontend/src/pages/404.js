import Head from 'next/head';
import Link from 'next/link';
export default function NotFound() {
  return (
    <>
      <Head><title>404 — Kwacha Bet</title></Head>
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4 text-center">
        <p className="text-8xl font-black text-brand mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <div className="flex gap-3">
          <Link href="/" className="btn-primary px-6 py-3">Go Home</Link>
          <Link href="/tickets" className="btn-ghost px-6 py-3">My Tickets</Link>
        </div>
      </div>
    </>
  );
}
