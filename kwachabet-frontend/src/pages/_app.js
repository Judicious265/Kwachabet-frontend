import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (!localStorage.getItem('kb_fp')) {
      try {
        const c = [navigator.userAgent, navigator.language, screen.width + 'x' + screen.height].join('|');
        let h = 0;
        for (let i = 0; i < c.length; i++) { h = ((h << 5) - h) + c.charCodeAt(i); h |= 0; }
        localStorage.setItem('kb_fp', Math.abs(h).toString(36));
      } catch {}
    }
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1C2128', color: '#E6EDF3', border: '1px solid #30363D', borderRadius: '12px', fontSize: '14px' },
          success: { iconTheme: { primary: '#00C853', secondary: '#000' } },
          error:   { iconTheme: { primary: '#F85149', secondary: '#000' } },
          duration: 4000,
        }}
      />
      <Component {...pageProps} />
    </>
  );
}
